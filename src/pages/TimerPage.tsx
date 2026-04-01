import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StopCircle } from 'lucide-react';

export const TimerPage: React.FC = () => {
  const { endSession, setCurrentPage } = useApp();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return {
      hrs: hrs.toString().padStart(2, '0'),
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0'),
      full: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    };
  };

  const time = formatTime(seconds);

  const handleEnd = async () => {
    await endSession(seconds);
    setCurrentPage('photo_capture');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[5%] -right-[5%] w-[30%] h-[30%] bg-secondary-container/20 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-md px-8 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-surface-container-highest px-6 py-2 rounded-full shadow-sm">
            <p className="text-on-surface-variant font-label text-xs font-bold tracking-[0.15em] uppercase">
              Kitchen Session
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <h2 className="text-on-surface font-medium tracking-tight">正在記錄使用時間...</h2>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 scale-150 bg-surface-container-low rounded-full opacity-50 blur-3xl"></div>
            <h1 className="relative text-[5.5rem] font-extrabold tracking-tighter text-on-surface leading-none">
              {time.full}
            </h1>
          </div>
          
          <div className="mt-8 flex gap-3">
            <div className="bg-surface-container-low px-4 py-2 rounded-xl">
              <span className="text-on-surface-variant text-xs font-bold tracking-widest block mb-1">HOURS</span>
              <span className="text-on-surface font-semibold">{time.hrs}</span>
            </div>
            <div className="text-outline-variant font-light text-2xl mt-1">:</div>
            <div className="bg-surface-container-low px-4 py-2 rounded-xl">
              <span className="text-on-surface-variant text-xs font-bold tracking-widest block mb-1">MINS</span>
              <span className="text-on-surface font-semibold">{time.mins}</span>
            </div>
            <div className="text-outline-variant font-light text-2xl mt-1">:</div>
            <div className="bg-surface-container-low px-4 py-2 rounded-xl">
              <span className="text-on-surface-variant text-xs font-bold tracking-widest block mb-1">SECS</span>
              <span className="text-on-surface font-semibold">{time.secs}</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <button 
            onClick={handleEnd}
            className="w-full py-6 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <StopCircle size={24} />
            結束使用
          </button>
        </div>
      </main>
    </div>
  );
};
