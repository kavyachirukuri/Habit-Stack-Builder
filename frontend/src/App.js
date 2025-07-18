import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import RoutineSelector from "./components/RoutineSelector";
import HabitChain from "./components/HabitChain";
import SavedStacks from "./components/SavedStacks";
import { apiService } from "./services/api";
import { ArrowLeft, Home, Bookmark, Loader2 } from "lucide-react";

const VIEWS = {
  HOME: 'home',
  EDITOR: 'editor',
  SAVED: 'saved'
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const [currentStack, setCurrentStack] = useState(null);
  const [savedStacks, setSavedStacks] = useState([]);
  const [predefinedRoutines, setPredefinedRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [routines, stacks] = await Promise.all([
        apiService.getPredefinedRoutines(),
        apiService.getHabitStacks()
      ]);
      setPredefinedRoutines(routines);
      setSavedStacks(stacks);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoutine = async (routine) => {
    try {
      // Create a new stack based on the selected routine
      const stackData = {
        name: `${routine.name} Stack`,
        habits: routine.habits.map(habit => ({
          name: habit.name,
          order: habit.order
        }))
      };
      
      const newStack = await apiService.createHabitStack(stackData);
      setCurrentStack(newStack);
      setCurrentView(VIEWS.EDITOR);
      
      // Refresh saved stacks
      const updatedStacks = await apiService.getHabitStacks();
      setSavedStacks(updatedStacks);
      
      toast({
        title: "Stack Created",
        description: `Created "${newStack.name}" from ${routine.name}.`
      });
    } catch (error) {
      console.error('Error creating stack from routine:', error);
      toast({
        title: "Error",
        description: "Failed to create habit stack. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateCustom = async (name) => {
    try {
      const stackData = {
        name: name,
        habits: []
      };
      
      const newStack = await apiService.createHabitStack(stackData);
      setCurrentStack(newStack);
      setCurrentView(VIEWS.EDITOR);
      
      // Refresh saved stacks
      const updatedStacks = await apiService.getHabitStacks();
      setSavedStacks(updatedStacks);
      
      toast({
        title: "Custom Stack Created",
        description: `Created "${name}" stack.`
      });
    } catch (error) {
      console.error('Error creating custom stack:', error);
      toast({
        title: "Error",
        description: "Failed to create custom stack. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateHabits = async (habits) => {
    try {
      const updatedStack = await apiService.updateHabitStack(currentStack.id, {
        habits: habits
      });
      setCurrentStack(updatedStack);
    } catch (error) {
      console.error('Error updating habits:', error);
      toast({
        title: "Error",
        description: "Failed to update habits. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddHabit = async (habitName) => {
    try {
      const updatedStack = await apiService.addHabitToStack(currentStack.id, {
        name: habitName,
        order: currentStack.habits.length
      });
      setCurrentStack(updatedStack);
      
      toast({
        title: "Habit Added",
        description: `"${habitName}" has been added to your stack.`
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditHabit = async (habitId, newName) => {
    try {
      // Update the habit in the current stack
      const updatedHabits = currentStack.habits.map(habit => 
        habit.id === habitId ? { ...habit, name: newName } : habit
      );
      
      const updatedStack = await apiService.updateHabitStack(currentStack.id, {
        habits: updatedHabits
      });
      setCurrentStack(updatedStack);
      
      toast({
        title: "Habit Updated",
        description: `Habit has been updated to "${newName}".`
      });
    } catch (error) {
      console.error('Error editing habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await apiService.removeHabitFromStack(currentStack.id, habitId);
      
      // Refresh the current stack
      const updatedStack = await apiService.getHabitStack(currentStack.id);
      setCurrentStack(updatedStack);
      
      toast({
        title: "Habit Deleted",
        description: "Habit has been removed from your stack."
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveStack = async () => {
    try {
      // Stack is already saved in the database, just refresh the saved stacks list
      const updatedStacks = await apiService.getHabitStacks();
      setSavedStacks(updatedStacks);
      
      toast({
        title: "Stack Saved",
        description: `"${currentStack.name}" has been saved successfully.`
      });
    } catch (error) {
      console.error('Error saving stack:', error);
      toast({
        title: "Error",
        description: "Failed to save stack. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLoadStack = async (stack) => {
    try {
      // Fetch the latest version of the stack
      const latestStack = await apiService.getHabitStack(stack.id);
      setCurrentStack(latestStack);
      setCurrentView(VIEWS.EDITOR);
    } catch (error) {
      console.error('Error loading stack:', error);
      toast({
        title: "Error",
        description: "Failed to load stack. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStack = async (stackId) => {
    try {
      await apiService.deleteHabitStack(stackId);
      
      // Refresh saved stacks
      const updatedStacks = await apiService.getHabitStacks();
      setSavedStacks(updatedStacks);
      
      toast({
        title: "Stack Deleted",
        description: "Habit stack has been deleted."
      });
    } catch (error) {
      console.error('Error deleting stack:', error);
      toast({
        title: "Error",
        description: "Failed to delete stack. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGoHome = () => {
    setCurrentView(VIEWS.HOME);
    setCurrentStack(null);
  };

  const handleGoToSaved = () => {
    setCurrentView(VIEWS.SAVED);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading Habit Stack Builder...</p>
        </div>
      </div>
    );
  }

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
