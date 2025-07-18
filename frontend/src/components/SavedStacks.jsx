import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Trash2, Edit, Calendar } from 'lucide-react';

const SavedStacks = ({ stacks, onLoadStack, onDeleteStack, onEditStack }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (stacks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Saved Stacks Yet
          </h2>
          <p className="text-gray-600">
            Create your first habit stack to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your Habit Stacks
        </h2>
        <p className="text-gray-600">
          Manage and continue working on your saved habit chains
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stacks.map((stack) => (
          <Card 
            key={stack.id} 
            className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-gray-100 hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {stack.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {stack.habits.length} habits
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(stack.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {stack.habits.slice(0, 3).map((habit, index) => (
                <div key={habit.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="truncate">{habit.name}</span>
                </div>
              ))}
              {stack.habits.length > 3 && (
                <div className="text-xs text-gray-500 ml-4">
                  +{stack.habits.length - 3} more habits
                </div>
              )}
              {stack.habits.length === 0 && (
                <div className="text-xs text-gray-500 italic">
                  No habits added yet
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <Button 
                size="sm" 
                onClick={() => onLoadStack(stack)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDeleteStack(stack.id)}
                className="text-red-600 hover:bg-red-50 border-red-300"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedStacks;