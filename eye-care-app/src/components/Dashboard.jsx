import React from 'react';
import useStore from '../store/useStore';
import { Trophy, CheckCircle2, Flame, Clock } from 'lucide-react';

export default function Dashboard() {
  const { tasks, gamification, eyeCare, updateEyeCare } = useStore();
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-100">Welcome Back</h2>
        <p className="text-slate-400 mt-1">Here is your productivity overview for today.</p>
      </header>

      {/* 20-20-20 Rule Toggle */}
      <div className="bg-slate-800/40 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-blue-500/10">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${eyeCare?.enabled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'}`}>
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">20-20-20 Eye Care Rule</h3>
            <p className="text-sm text-slate-400">Every 20 mins, look 20 ft away for 20 secs.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={eyeCare?.enabled ?? true}
            onChange={(e) => updateEyeCare({ enabled: e.target.checked, lastRun: Date.now() })}
          />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gamification Stats */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Current Level</p>
              <p className="text-2xl font-bold text-slate-100">{gamification.level}</p>
            </div>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-amber-400 h-full transition-all duration-1000"
              style={{ width: `${(gamification.xp / (gamification.level * 100)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">{gamification.xp} / {gamification.level * 100} XP</p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Tasks Done</p>
              <p className="text-2xl font-bold text-slate-100">{completedTasks} <span className="text-base font-normal text-slate-500">/ {totalTasks}</span></p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Day Streak</p>
              <p className="text-2xl font-bold text-slate-100">{gamification.streak} <span className="text-base font-normal text-slate-500">days</span></p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Focus Time</p>
              <p className="text-2xl font-bold text-slate-100">0 <span className="text-base font-normal text-slate-500">mins</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
          <h3 className="text-xl font-semibold mb-6">Today's Focus</h3>
          {/* Placeholder for timeline or heatmap */}
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
            Activity Timeline (Coming Soon)
          </div>
        </div>
        
        <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
          <h3 className="text-xl font-semibold mb-6">Up Next</h3>
          <div className="space-y-4">
            {tasks.filter(t => !t.completed).slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center space-x-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className={`w-3 h-3 rounded-full ${task.urgency === 'high' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                <span className="truncate">{task.title}</span>
              </div>
            ))}
            {tasks.filter(t => !t.completed).length === 0 && (
              <p className="text-slate-500 text-sm text-center">All caught up!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
