import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckSquare } from 'lucide-react';
import useStore from './store/useStore';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import './index.css';

const { ipcRenderer } = window.require('electron');

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Background Engine
  useEffect(() => {
    const interval = setInterval(() => {
      const state = useStore.getState();
      const now = Date.now();

      // Handle Task Notifications
      state.tasks.forEach(task => {
        if (!task.completed && task.reminderTime && !task.notified) {
          const reminderTimeMs = new Date(task.reminderTime).getTime();
          if (now >= reminderTimeMs) {
            ipcRenderer.send('trigger-alert', { 
              title: 'Task Reminder', 
              body: task.title,
              type: task.alertType || 'notification',
              duration: task.alertDuration || 20
            });
            state.updateTask(task.id, { notified: true });
          }
        }
      });
      
      // Eye Care Monitor
      if (state.eyeCare?.enabled) {
        const lastRun = state.eyeCare.lastRun || now;
        const intervalMs = (state.eyeCare.intervalMinutes || 20) * 60 * 1000;
        if (now - lastRun >= intervalMs) {
          ipcRenderer.send('trigger-20-20');
          state.updateEyeCare({ lastRun: now });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <TaskManager />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden font-['Outfit']">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8">
            Zenith OS
          </h1>
          <nav className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Animated background subtle glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.05)_0%,transparent_40%)] mix-blend-screen" />
        </div>
        
        <div className="max-w-4xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
