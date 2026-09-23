import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      tasks: [],
      eyeCare: {
        enabled: true,
        intervalMinutes: 20,
        lastRun: Date.now()
      },
      gamification: {
        xp: 0,
        level: 1,
        streak: 0,
      },
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateEyeCare: (updates) => set((state) => ({
        eyeCare: { ...state.eyeCare, ...updates }
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      addXP: (amount) => set((state) => {
        let newXP = state.gamification.xp + amount;
        let newLevel = state.gamification.level;
        if (newXP >= newLevel * 100) {
          newXP -= newLevel * 100;
          newLevel += 1;
        }
        return {
          gamification: {
            ...state.gamification,
            xp: newXP,
            level: newLevel,
          }
        };
      })
    }),
    {
      name: 'zenith-storage', // unique name
    }
  )
);

export default useStore;
