import { create } from 'zustand';
import axios from 'axios';

interface Task { id: string; title: string; description: string; priority: string; status: string; deadline: string | null; }
interface Stats { total: number; completedToday: number; overdue: number; }
interface TaskState { tasks: Task[]; stats: Stats; loading: boolean; fetchTasks: () => Promise<void>; fetchStats: () => Promise<void>; }

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [], stats: { total: 0, completedToday: 0, overdue: 0 }, loading: false,
  fetchTasks: async () => {
    set({ loading: true });
    try { const res = await axios.get('http://localhost:3001/api/tasks'); set({ tasks: res.data.data }); }
    finally { set({ loading: false }); }
  },
  fetchStats: async () => {
    try { const res = await axios.get('http://localhost:3001/api/tasks/stats'); set({ stats: res.data.data }); }
    catch (e) { console.error(e); }
  },
}));
