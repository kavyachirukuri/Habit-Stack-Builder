import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Plus, ArrowRight, Clock } from 'lucide-react';

const RoutineSelector = ({ routines, onSelectRoutine, onCreateCustom }) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');

  const handleCreateCustom = () => {
    if (customName.trim()) {
      onCreateCustom(customName.trim());
      setCustomName('');
      setShowCustomForm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Habit Stack Builder
        </h1>
        <p className="text-gray-600">
          Start with a predefined routine or create your own habit stack
        </p>
      </div>

      {/* Predefined Routines */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Choose a Starting Routine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <Card 
              key={routine.id} 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-gray-100 hover:border-blue-300"
              onClick={() => onSelectRoutine(routine)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {routine.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {routine.description}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {routine.habits.length} habits
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                {routine.habits.slice(0, 3).map((habit, index) => (
                  <div key={habit.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{habit.name}</span>
                  </div>
                ))}
                {routine.habits.length > 3 && (
                  <div className="text-xs text-gray-500 ml-4">
                    +{routine.habits.length - 3} more habits
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Quick start</span>
                </div>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoutine(routine);
                  }}
                >
                  Start <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Routine */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Or Create Your Own
        </h2>
        
        {!showCustomForm ? (
          <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <div className="text-center">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-800 mb-2">
                Create Custom Routine
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Start from scratch and build your personalized habit stack
              </p>
              <Button 
                onClick={() => setShowCustomForm(true)}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 mb-4">
              Create Custom Routine
            </h3>
            <div className="flex gap-3">
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter routine name..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCustom()}
              />
              <Button 
                onClick={handleCreateCustom}
                disabled={!customName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create
              </Button>
              <Button 
                onClick={() => {
                  setShowCustomForm(false);
                  setCustomName('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoutineSelector;