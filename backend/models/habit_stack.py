from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Habit(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    order: int = 0

class HabitCreate(BaseModel):
    name: str
    order: int = 0

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    order: Optional[int] = None

class HabitStack(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    habits: List[Habit] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class HabitStackCreate(BaseModel):
    name: str
    habits: List[HabitCreate] = []

class HabitStackUpdate(BaseModel):
    name: Optional[str] = None
    habits: Optional[List[Habit]] = None

class PredefinedRoutine(BaseModel):
    id: str
    name: str
    description: str
    habits: List[Habit]