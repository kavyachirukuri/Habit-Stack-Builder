import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// API service for Habit Stack Builder
export const apiService = {
  // Predefined routines
  getPredefinedRoutines: async () => {
    try {
      const response = await axios.get(`${API}/predefined-routines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching predefined routines:', error);
      throw error;
    }
  },

  // Habit stacks
  getHabitStacks: async () => {
    try {
      const response = await axios.get(`${API}/habit-stacks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching habit stacks:', error);
      throw error;
    }
  },

  createHabitStack: async (stackData) => {
    try {
      const response = await axios.post(`${API}/habit-stacks`, stackData);
      return response.data;
    } catch (error) {
      console.error('Error creating habit stack:', error);
      throw error;
    }
  },

  getHabitStack: async (stackId) => {
    try {
      const response = await axios.get(`${API}/habit-stacks/${stackId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching habit stack:', error);
      throw error;
    }
  },

  updateHabitStack: async (stackId, updateData) => {
    try {
      const response = await axios.put(`${API}/habit-stacks/${stackId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating habit stack:', error);
      throw error;
    }
  },

  deleteHabitStack: async (stackId) => {
    try {
      const response = await axios.delete(`${API}/habit-stacks/${stackId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting habit stack:', error);
      throw error;
    }
  },

  // Habit operations
  addHabitToStack: async (stackId, habitData) => {
    try {
      const response = await axios.post(`${API}/habit-stacks/${stackId}/habits`, habitData);
      return response.data;
    } catch (error) {
      console.error('Error adding habit to stack:', error);
      throw error;
    }
  },

  removeHabitFromStack: async (stackId, habitId) => {
    try {
      const response = await axios.delete(`${API}/habit-stacks/${stackId}/habits/${habitId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing habit from stack:', error);
      throw error;
    }
  }
};

export default apiService;