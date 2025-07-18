// Mock data for the Habit Stack Builder app

export const predefinedRoutines = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Start your day with purpose',
    habits: [
      { id: 'wake-up', name: 'Wake up at 6 AM', order: 0 },
      { id: 'drink-water', name: 'Drink a glass of water', order: 1 },
      { id: 'brush-teeth', name: 'Brush teeth', order: 2 }
    ]
  },
  {
    id: 'workout-routine',
    name: 'Workout Routine',
    description: 'Build physical strength',
    habits: [
      { id: 'warm-up', name: 'Warm up for 5 minutes', order: 0 },
      { id: 'cardio', name: 'Cardio for 20 minutes', order: 1 },
      { id: 'strength', name: 'Strength training', order: 2 }
    ]
  },
  {
    id: 'evening-routine',
    name: 'Evening Routine',
    description: 'Wind down and prepare for tomorrow',
    habits: [
      { id: 'dinner', name: 'Eat dinner', order: 0 },
      { id: 'plan-tomorrow', name: 'Plan tomorrow', order: 1 },
      { id: 'read', name: 'Read for 30 minutes', order: 2 }
    ]
  },
  {
    id: 'study-routine',
    name: 'Study Routine',
    description: 'Focus on learning and growth',
    habits: [
      { id: 'review-notes', name: 'Review previous notes', order: 0 },
      { id: 'new-material', name: 'Study new material', order: 1 },
      { id: 'practice', name: 'Practice problems', order: 2 }
    ]
  }
];

export const availableHabits = [
  { id: 'meditate', name: 'Meditate for 10 minutes' },
  { id: 'journal', name: 'Write in journal' },
  { id: 'exercise', name: 'Exercise' },
  { id: 'read-book', name: 'Read a book' },
  { id: 'call-family', name: 'Call family/friends' },
  { id: 'clean-room', name: 'Clean room' },
  { id: 'prep-meals', name: 'Prepare healthy meals' },
  { id: 'stretch', name: 'Stretch for 15 minutes' },
  { id: 'walk', name: 'Take a walk' },
  { id: 'gratitude', name: 'Practice gratitude' },
  { id: 'learn-skill', name: 'Learn new skill' },
  { id: 'organize', name: 'Organize workspace' },
  { id: 'vitamins', name: 'Take vitamins' },
  { id: 'skincare', name: 'Skincare routine' },
  { id: 'water-plants', name: 'Water plants' },
  { id: 'listen-podcast', name: 'Listen to podcast' },
  { id: 'review-goals', name: 'Review daily goals' },
  { id: 'deep-work', name: 'Deep work session' },
  { id: 'social-media-break', name: 'Social media break' },
  { id: 'healthy-snack', name: 'Eat healthy snack' }
];

// Mock functions for localStorage operations
export const mockStorage = {
  getHabitStacks: () => {
    const stored = localStorage.getItem('habitStacks');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveHabitStack: (stack) => {
    const existing = mockStorage.getHabitStacks();
    const updated = existing.filter(s => s.id !== stack.id);
    updated.push(stack);
    localStorage.setItem('habitStacks', JSON.stringify(updated));
  },
  
  deleteHabitStack: (stackId) => {
    const existing = mockStorage.getHabitStacks();
    const updated = existing.filter(s => s.id !== stackId);
    localStorage.setItem('habitStacks', JSON.stringify(updated));
  }
};

export const createNewHabit = (name) => ({
  id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  order: 0
});

export const createHabitStack = (name, baseRoutine = null) => ({
  id: `stack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  habits: baseRoutine ? [...baseRoutine.habits] : [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});