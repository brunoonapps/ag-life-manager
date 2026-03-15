import { create } from 'zustand';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline: string | null;
  category?: { id: string; name: string };
  tags?: Array<{ id: string; name: string }>;
}
interface Category { id: string; name: string; }
interface Stats { total: number; completedToday: number; overdue: number; }
interface TaskState { tasks: Task[]; categories: Category[]; stats: Stats;  loading: boolean;
  fetchTasks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createTask: (task: any) => Promise<void>;
  updateTask: (id: string, task: any) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  categories: [],
  stats: { total: 0, completedToday: 0, overdue: 0 },
  loading: false,
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:3001/api/tasks');
      set({ tasks: response.data.data });
    } finally {
      set({ loading: false });
    }
  },
  fetchCategories: async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/categories');
      set({ categories: response.data.data });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
  fetchStats: async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tasks/stats');
      set({ stats: response.data.data });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  },
  updateTask: async (id, taskData) => {
    try {
      await axios.patch(`http://localhost:3001/api/tasks/${id}`, { ...taskData, userId: 'test-user-id' });
      await Promise.all([get().fetchTasks(), get().fetchStats()]);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },
  toggleTaskStatus: async (id) => {
    try {
      await axios.patch(`http://localhost:3001/api/tasks/${id}/toggle`);
      await Promise.all([get().fetchTasks(), get().fetchStats()]);
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  },
  createTask: async (taskData) => {
    try {
      await axios.post('http://localhost:3001/api/tasks', taskData);
      await Promise.all([get().fetchTasks(), get().fetchStats()]);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  deleteTask: async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`);
      await Promise.all([get().fetchTasks(), get().fetchStats()]);
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
}));
