import { useState, useEffect, useRef } from 'react';
import './index.css';

const WORK_TIME = 5; // 5 seconds for testing (normally 20 * 60)
const BREAK_TIME = 5; // 5 seconds for testing (normally 20)

function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const audioRef = useRef(new Audio('/beep.wav'));

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      // Phase finished
      audioRef.current.play();
      
      if (!isBreak) {
        // Switch to break
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Time for a break!', { body: 'Look 20 feet away for 20 seconds.' });
        }
        
        // Trigger screen blink effect
        const electron = window['require'] ? window['require']('electron') : null;
        if (electron && electron.ipcRenderer) {
          electron.ipcRenderer.send('trigger-blink');
        }

        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
      } else {
        // Switch to work
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Break over', { body: 'Back to work!' });
        }
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTotal = isBreak ? BREAK_TIME : WORK_TIME;
  const progressPercent = ((currentTotal - timeLeft) / currentTotal) * 100;

  return (
    <div className="app-container">
      <h1>20-20-20</h1>
      <p className="subtitle">Eye Care Companion</p>
      
      <div 
        className={`timer-circle ${isBreak ? 'break-mode' : ''}`}
        style={{ '--progress': `${progressPercent}%` }}
      >
        <div className="timer-inner">
          <div className="time-display">{formatTime(timeLeft)}</div>
          <div className="status-text">{isBreak ? 'Break Time' : 'Work Time'}</div>
        </div>
      </div>

      <div className="controls">
        <button 
          className={`primary ${isRunning ? 'active' : ''}`}
          onClick={toggleTimer}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;
