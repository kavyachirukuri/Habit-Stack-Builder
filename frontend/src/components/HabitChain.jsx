import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import HabitCard from './HabitCard';
import { Plus, ArrowDown, Save, ChevronRight } from 'lucide-react';

const HabitChain = ({ 
  habitStack, 
  onUpdateHabits, 
  onSaveStack, 
  onAddHabit, 
  onEditHabit, 
  onDeleteHabit 
}) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [editName, setEditName] = useState('');

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(habitStack.habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onUpdateHabits(updatedItems);
  };

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setEditName(habit.name);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onEditHabit(editingHabit.id, editName.trim());
      setEditingHabit(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingHabit(null);
    setEditName('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {habitStack.name}
          </h2>
          <Badge variant="outline" className="text-sm">
            {habitStack.habits.length} habits
          </Badge>
        </div>
        <p className="text-gray-600 text-sm">
          Create your habit chain by dragging and dropping habits to reorder them.
        </p>
      </div>

      {/* Habit Chain */}
      <div className="mb-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="habit-chain" isDropDisabled={false}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
                  snapshot.isDraggingOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {habitStack.habits.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm mb-4">
                      No habits in your chain yet
                    </p>
                    <p className="text-gray-400 text-xs">
                      Add your first habit below to get started
                    </p>
                  </div>
                ) : (
                  <>
                    {habitStack.habits.map((habit, index) => (
                      <div key={habit.id} className="relative">
                        <HabitCard
                          habit={habit}
                          index={index}
                          onEdit={handleEditHabit}
                          onDelete={onDeleteHabit}
                        />
                        {index < habitStack.habits.length - 1 && (
                          <div className="flex justify-center mb-2">
                            <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Add New Habit */}
      <Card className="p-4 mb-6">
        <div className="flex gap-3">
          <Input
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Enter new habit name..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <Button 
            onClick={handleAddHabit}
            disabled={!newHabitName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>
      </Card>

      {/* Edit Habit Modal */}
      {editingHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Habit</h3>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Habit name"
              className="mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit}
                disabled={!editName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onSaveStack}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Habit Stack
        </Button>
      </div>
    </div>
  );
};

export default HabitChain;