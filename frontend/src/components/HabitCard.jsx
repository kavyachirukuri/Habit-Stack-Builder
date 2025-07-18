import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GripVertical, X, Edit2 } from 'lucide-react';

const HabitCard = ({ habit, index, onEdit, onDelete, isDragging = false }) => {
  return (
    <Draggable draggableId={habit.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-3 transition-all duration-200 ${
            snapshot.isDragging ? 'rotate-2 scale-105' : ''
          }`}
        >
          <Card className={`p-4 bg-white border-2 border-gray-100 hover:border-blue-300 transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-lg bg-blue-50' : 'hover:shadow-md'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div
                {...provided.dragHandleProps}
                className="flex items-center gap-3 flex-1 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-sm leading-relaxed">
                    {habit.name}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(habit)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(habit.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default HabitCard;