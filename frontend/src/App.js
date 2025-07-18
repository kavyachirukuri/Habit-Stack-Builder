import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import RoutineSelector from "./components/RoutineSelector";
import HabitChain from "./components/HabitChain";
import SavedStacks from "./components/SavedStacks";
import { 
  predefinedRoutines, 
  mockStorage, 
  createNewHabit, 
  createHabitStack 
} from "./data/mockData";
import { ArrowLeft, Home, Bookmark } from "lucide-react";

const VIEWS = {
  HOME: 'home',
  EDITOR: 'editor',
  SAVED: 'saved'
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const [currentStack, setCurrentStack] = useState(null);
  const [savedStacks, setSavedStacks] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved stacks from localStorage
    const stacks = mockStorage.getHabitStacks();
    setSavedStacks(stacks);
  }, []);

  const handleSelectRoutine = (routine) => {
    const newStack = createHabitStack(`${routine.name} Stack`, routine);
    setCurrentStack(newStack);
    setCurrentView(VIEWS.EDITOR);
  };

  const handleCreateCustom = (name) => {
    const newStack = createHabitStack(name);
    setCurrentStack(newStack);
    setCurrentView(VIEWS.EDITOR);
  };

  const handleUpdateHabits = (habits) => {
    setCurrentStack(prev => ({
      ...prev,
      habits,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleAddHabit = (habitName) => {
    const newHabit = createNewHabit(habitName);
    newHabit.order = currentStack.habits.length;
    
    setCurrentStack(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
      updatedAt: new Date().toISOString()
    }));
    
    toast({
      title: "Habit Added",
      description: `"${habitName}" has been added to your stack.`
    });
  };

  const handleEditHabit = (habitId, newName) => {
    setCurrentStack(prev => ({
      ...prev,
      habits: prev.habits.map(habit => 
        habit.id === habitId ? { ...habit, name: newName } : habit
      ),
      updatedAt: new Date().toISOString()
    }));
    
    toast({
      title: "Habit Updated",
      description: `Habit has been updated to "${newName}".`
    });
  };

  const handleDeleteHabit = (habitId) => {
    setCurrentStack(prev => ({
      ...prev,
      habits: prev.habits.filter(habit => habit.id !== habitId),
      updatedAt: new Date().toISOString()
    }));
    
    toast({
      title: "Habit Deleted",
      description: "Habit has been removed from your stack."
    });
  };

  const handleSaveStack = () => {
    mockStorage.saveHabitStack(currentStack);
    setSavedStacks(mockStorage.getHabitStacks());
    
    toast({
      title: "Stack Saved",
      description: `"${currentStack.name}" has been saved successfully.`
    });
  };

  const handleLoadStack = (stack) => {
    setCurrentStack(stack);
    setCurrentView(VIEWS.EDITOR);
  };

  const handleDeleteStack = (stackId) => {
    mockStorage.deleteHabitStack(stackId);
    setSavedStacks(mockStorage.getHabitStacks());
    
    toast({
      title: "Stack Deleted",
      description: "Habit stack has been deleted."
    });
  };

  const handleGoHome = () => {
    setCurrentView(VIEWS.HOME);
    setCurrentStack(null);
  };

  const handleGoToSaved = () => {
    setCurrentView(VIEWS.SAVED);
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <BrowserRouter>
        <div className="min-h-screen">
          {/* Navigation */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-4">
                  {currentView !== VIEWS.HOME && (
                    <Button
                      variant="ghost"
                      onClick={handleGoHome}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                  )}
                  <h1 className="text-lg font-semibold text-gray-800">
                    Habit Stack Builder
                  </h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={currentView === VIEWS.HOME ? "default" : "ghost"}
                    onClick={handleGoHome}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                  <Button
                    variant={currentView === VIEWS.SAVED ? "default" : "ghost"}
                    onClick={handleGoToSaved}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" />
                    Saved ({savedStacks.length})
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="py-8">
            {currentView === VIEWS.HOME && (
              <RoutineSelector
                routines={predefinedRoutines}
                onSelectRoutine={handleSelectRoutine}
                onCreateCustom={handleCreateCustom}
              />
            )}
            
            {currentView === VIEWS.EDITOR && currentStack && (
              <HabitChain
                habitStack={currentStack}
                onUpdateHabits={handleUpdateHabits}
                onSaveStack={handleSaveStack}
                onAddHabit={handleAddHabit}
                onEditHabit={handleEditHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            )}
            
            {currentView === VIEWS.SAVED && (
              <SavedStacks
                stacks={savedStacks}
                onLoadStack={handleLoadStack}
                onDeleteStack={handleDeleteStack}
                onEditStack={handleLoadStack}
              />
            )}
          </main>
        </div>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
