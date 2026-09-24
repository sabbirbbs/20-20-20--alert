import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Plus, Trash2, Circle, CheckCircle2, AlertTriangle, Star, Clock, RepeatIcon } from 'lucide-react';

export default function TaskManager() {
  const { tasks, addTask, updateTask, deleteTask, addXP } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [repeat, setRepeat] = useState('none');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    addTask({
      id: crypto.randomUUID(),
      title: newTaskTitle,
      urgent: isUrgent,
      important: isImportant,
      reminderTime: reminderTime || null,
      repeat,
      completed: false,
      notified: false,
      createdAt: new Date().toISOString()
    });
    setNewTaskTitle('');
    setReminderTime('');
    setRepeat('none');
  };

  const toggleTask = (id, currentStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    updateTask(id, { completed: !currentStatus });
    
    // If completing the task, check for repeating logic and award XP
    if (!currentStatus) {
      addXP(10);
      
      if (task.repeat !== 'none' && task.reminderTime) {
        // Generate next occurrence
        const originalReminder = new Date(task.reminderTime);
        const now = new Date();
        
        let nextReminder = new Date(originalReminder);
        
        // Base the next occurrence on today if it's overdue, preserving the original time
        if (nextReminder < now) {
          nextReminder.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
          
          // If the scheduled time has already passed today, bump it to the next interval
          if (nextReminder < now) {
            if (task.repeat === 'daily') {
              nextReminder.setDate(nextReminder.getDate() + 1);
            } else if (task.repeat === 'weekly') {
              nextReminder.setDate(nextReminder.getDate() + 7);
            }
          }
        } else {
          // If it's not overdue, just add the normal interval
          if (task.repeat === 'daily') {
            nextReminder.setDate(nextReminder.getDate() + 1);
          } else if (task.repeat === 'weekly') {
            nextReminder.setDate(nextReminder.getDate() + 7);
          }
        }
        
        // Ensure local time string format for datetime-local (YYYY-MM-DDThh:mm)
        const offset = nextReminder.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(nextReminder.getTime() - offset)).toISOString().slice(0, 16);
        
        addTask({
          id: crypto.randomUUID(),
          title: task.title,
          urgent: task.urgent,
          important: task.important,
          reminderTime: localISOTime,
          repeat: task.repeat,
          completed: false,
          notified: false,
          createdAt: new Date().toISOString()
        });
      }
    }
  };

  // Group tasks by Eisenhower Matrix quadrant
  const importantUrgent = tasks.filter(t => t.important && t.urgent);
  const importantNotUrgent = tasks.filter(t => t.important && !t.urgent);
  const urgentNotImportant = tasks.filter(t => !t.important && t.urgent);
  const neither = tasks.filter(t => !t.important && !t.urgent);

  const TaskList = ({ items, title, colorClass, emptyMessage }) => (
    <div className={`flex flex-col h-full bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 overflow-hidden ${colorClass}`}>
      <h3 className="font-semibold text-slate-200 mb-3 flex items-center justify-between">
        {title}
        <span className="bg-slate-800 text-xs px-2 py-1 rounded-md text-slate-400">{items.length}</span>
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {items.length === 0 ? (
          <div className="text-center text-slate-500 py-4 text-sm">{emptyMessage}</div>
        ) : (
          items.map(task => {
            const isOverdue = task.reminderTime && !task.completed && new Date(task.reminderTime).getTime() < Date.now();
            return (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                  task.completed 
                    ? 'bg-slate-800/30 border-slate-700/30 opacity-50' 
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 shadow-sm'
                }`}
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0 pr-3 cursor-pointer" onClick={() => toggleTask(task.id, task.completed)}>
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                    ) : (
                      <Circle className="text-slate-400 hover:text-blue-400 shrink-0" size={18} />
                    )}
                    <span className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  
                  {(!task.completed && (task.reminderTime || task.repeat !== 'none')) && (
                    <div className="flex items-center gap-3 pl-8 text-xs text-slate-400">
                      {task.reminderTime && (
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-400' : ''}`}>
                          <Clock size={12} />
                          <span>{new Date(task.reminderTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                      )}
                      {task.repeat !== 'none' && (
                        <div className="flex items-center gap-1 text-blue-400">
                          <RepeatIcon size={12} />
                          <span className="capitalize">{task.repeat}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold text-slate-100">Tasks & Matrix</h2>
        <p className="text-slate-400 mt-1">Manage your priorities with the Eisenhower Matrix.</p>
      </header>

      <form onSubmit={handleAddTask} className="flex flex-col gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent text-slate-100 px-2 py-2 focus:outline-none placeholder-slate-500 text-lg"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-700/50">
          <button
            type="button"
            onClick={() => setIsImportant(!isImportant)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              isImportant 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Star size={16} className={isImportant ? 'fill-amber-400' : ''} />
            Important
          </button>
          
          <button
            type="button"
            onClick={() => setIsUrgent(!isUrgent)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              isUrgent 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle size={16} />
            Urgent
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1"></div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:border-blue-500 transition-colors text-sm">
            <Clock size={16} className="text-slate-400" />
            <input 
              type="datetime-local" 
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none [color-scheme:dark]"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:border-blue-500 transition-colors text-sm">
            <RepeatIcon size={16} className="text-slate-400" />
            <select 
              value={repeat} 
              onChange={(e) => setRepeat(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none appearance-none pr-4"
            >
              <option value="none" className="bg-slate-800">Does not repeat</option>
              <option value="daily" className="bg-slate-800">Daily</option>
              <option value="weekly" className="bg-slate-800">Weekly</option>
            </select>
          </div>
          
          <div className="flex-1"></div>

          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center justify-center transition-colors shadow-lg shadow-blue-500/20"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 min-h-0">
        <TaskList 
          title="Do First (Urgent & Important)" 
          items={importantUrgent} 
          colorClass="border-t-rose-500/50" 
          emptyMessage="Clear! Good job." 
        />
        <TaskList 
          title="Schedule (Important, Not Urgent)" 
          items={importantNotUrgent} 
          colorClass="border-t-amber-500/50" 
          emptyMessage="Nothing planned." 
        />
        <TaskList 
          title="Delegate (Urgent, Not Important)" 
          items={urgentNotImportant} 
          colorClass="border-t-blue-500/50" 
          emptyMessage="No busywork." 
        />
        <TaskList 
          title="Eliminate (Not Urgent, Not Important)" 
          items={neither} 
          colorClass="border-t-slate-500/50" 
          emptyMessage="No time wasters." 
        />
      </div>
    </div>
  );
}
