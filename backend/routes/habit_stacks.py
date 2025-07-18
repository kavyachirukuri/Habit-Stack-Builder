from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

from models.habit_stack import (
    HabitStack, 
    HabitStackCreate, 
    HabitStackUpdate, 
    PredefinedRoutine,
    Habit,
    HabitCreate
)

router = APIRouter()

# Database will be initialized by the main server
db = None

def initialize_db(database):
    global db
    db = database

# Predefined routines data
PREDEFINED_ROUTINES = [
    PredefinedRoutine(
        id="morning-routine",
        name="Morning Routine",
        description="Start your day with purpose",
        habits=[
            Habit(id="wake-up", name="Wake up at 6 AM", order=0),
            Habit(id="drink-water", name="Drink a glass of water", order=1),
            Habit(id="brush-teeth", name="Brush teeth", order=2)
        ]
    ),
    PredefinedRoutine(
        id="workout-routine",
        name="Workout Routine",
        description="Build physical strength",
        habits=[
            Habit(id="warm-up", name="Warm up for 5 minutes", order=0),
            Habit(id="cardio", name="Cardio for 20 minutes", order=1),
            Habit(id="strength", name="Strength training", order=2)
        ]
    ),
    PredefinedRoutine(
        id="evening-routine",
        name="Evening Routine",
        description="Wind down and prepare for tomorrow",
        habits=[
            Habit(id="dinner", name="Eat dinner", order=0),
            Habit(id="plan-tomorrow", name="Plan tomorrow", order=1),
            Habit(id="read", name="Read for 30 minutes", order=2)
        ]
    ),
    PredefinedRoutine(
        id="study-routine",
        name="Study Routine",
        description="Focus on learning and growth",
        habits=[
            Habit(id="review-notes", name="Review previous notes", order=0),
            Habit(id="new-material", name="Study new material", order=1),
            Habit(id="practice", name="Practice problems", order=2)
        ]
    )
]

@router.get("/predefined-routines", response_model=List[PredefinedRoutine])
async def get_predefined_routines():
    """Get all predefined routines"""
    return PREDEFINED_ROUTINES

@router.get("/habit-stacks", response_model=List[HabitStack])
async def get_habit_stacks():
    """Get all saved habit stacks"""
    try:
        cursor = db.habit_stacks.find()
        habit_stacks = []
        async for doc in cursor:
            # Convert MongoDB ObjectId to string and ensure proper format
            doc['_id'] = str(doc['_id'])
            habit_stack = HabitStack(**doc)
            habit_stacks.append(habit_stack)
        return habit_stacks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching habit stacks: {str(e)}")

@router.post("/habit-stacks", response_model=HabitStack)
async def create_habit_stack(habit_stack_data: HabitStackCreate):
    """Create a new habit stack"""
    try:
        # Create the habit stack object
        habit_stack = HabitStack(
            name=habit_stack_data.name,
            habits=[Habit(**habit.dict()) for habit in habit_stack_data.habits]
        )
        
        # Insert into database
        result = await db.habit_stacks.insert_one(habit_stack.dict())
        
        if result.inserted_id:
            return habit_stack
        else:
            raise HTTPException(status_code=500, detail="Failed to create habit stack")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating habit stack: {str(e)}")

@router.get("/habit-stacks/{stack_id}", response_model=HabitStack)
async def get_habit_stack(stack_id: str):
    """Get a specific habit stack by ID"""
    try:
        doc = await db.habit_stacks.find_one({"id": stack_id})
        if doc:
            doc['_id'] = str(doc['_id'])
            return HabitStack(**doc)
        else:
            raise HTTPException(status_code=404, detail="Habit stack not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching habit stack: {str(e)}")

@router.put("/habit-stacks/{stack_id}", response_model=HabitStack)
async def update_habit_stack(stack_id: str, update_data: HabitStackUpdate):
    """Update an existing habit stack"""
    try:
        # Find the existing stack
        existing_stack = await db.habit_stacks.find_one({"id": stack_id})
        if not existing_stack:
            raise HTTPException(status_code=404, detail="Habit stack not found")
        
        # Prepare update data
        update_dict = {}
        if update_data.name is not None:
            update_dict["name"] = update_data.name
        if update_data.habits is not None:
            update_dict["habits"] = [habit.dict() for habit in update_data.habits]
        
        update_dict["updated_at"] = datetime.utcnow()
        
        # Update in database
        result = await db.habit_stacks.update_one(
            {"id": stack_id},
            {"$set": update_dict}
        )
        
        if result.modified_count > 0:
            # Return updated stack
            updated_doc = await db.habit_stacks.find_one({"id": stack_id})
            updated_doc['_id'] = str(updated_doc['_id'])
            return HabitStack(**updated_doc)
        else:
            raise HTTPException(status_code=500, detail="Failed to update habit stack")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating habit stack: {str(e)}")

@router.delete("/habit-stacks/{stack_id}")
async def delete_habit_stack(stack_id: str):
    """Delete a habit stack"""
    try:
        result = await db.habit_stacks.delete_one({"id": stack_id})
        if result.deleted_count > 0:
            return {"message": "Habit stack deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Habit stack not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting habit stack: {str(e)}")

@router.post("/habit-stacks/{stack_id}/habits", response_model=HabitStack)
async def add_habit_to_stack(stack_id: str, habit_data: HabitCreate):
    """Add a new habit to an existing stack"""
    try:
        # Find the existing stack
        existing_stack = await db.habit_stacks.find_one({"id": stack_id})
        if not existing_stack:
            raise HTTPException(status_code=404, detail="Habit stack not found")
        
        # Create new habit
        new_habit = Habit(**habit_data.dict())
        
        # Add to existing habits
        existing_habits = existing_stack.get("habits", [])
        existing_habits.append(new_habit.dict())
        
        # Update in database
        result = await db.habit_stacks.update_one(
            {"id": stack_id},
            {"$set": {"habits": existing_habits, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            # Return updated stack
            updated_doc = await db.habit_stacks.find_one({"id": stack_id})
            updated_doc['_id'] = str(updated_doc['_id'])
            return HabitStack(**updated_doc)
        else:
            raise HTTPException(status_code=500, detail="Failed to add habit to stack")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding habit to stack: {str(e)}")

@router.delete("/habit-stacks/{stack_id}/habits/{habit_id}")
async def remove_habit_from_stack(stack_id: str, habit_id: str):
    """Remove a habit from a stack"""
    try:
        # Find the existing stack
        existing_stack = await db.habit_stacks.find_one({"id": stack_id})
        if not existing_stack:
            raise HTTPException(status_code=404, detail="Habit stack not found")
        
        # Filter out the habit to remove
        existing_habits = existing_stack.get("habits", [])
        updated_habits = [habit for habit in existing_habits if habit.get("id") != habit_id]
        
        # Update in database
        result = await db.habit_stacks.update_one(
            {"id": stack_id},
            {"$set": {"habits": updated_habits, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            return {"message": "Habit removed successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to remove habit from stack")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing habit from stack: {str(e)}")