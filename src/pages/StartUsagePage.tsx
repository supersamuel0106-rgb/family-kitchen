import React from 'react';
import { useApp } from '../context/AppContext';
import { PlayCircle, Home } from 'lucide-react';

export const StartUsagePage: React.FC = () => {
  const { setCurrentPage, startSession } = useApp();

  const handleStart = async () => {
    await startSession();
    setCurrentPage('timer');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
      <main className="w-full max-w-md flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-extrabold tracking-tight text-on-surface">
            準備好了<span className="text-primary">嗎？</span>
          </h2>
          <p className="text-on-surface-variant font-medium text-lg">
            點擊開始計時
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-8 bg-primary-container/30 rounded-full blur-3xl group-hover:bg-primary-container/50 transition-all duration-700 animate-pulse"></div>
          <button 
            onClick={handleStart}
            className="relative w-72 h-72 rounded-full bg-gradient-to-br from-primary via-primary to-primary-dim flex flex-col items-center justify-center text-white shadow-2xl active:scale-95 transition-all duration-500"
          >
            <PlayCircle size={96} className="mb-4" />
            <span className="font-bold text-2xl tracking-[0.2em]">開始使用</span>
            
            <div className="absolute -bottom-4 -right-2 bg-tertiary-container text-on-tertiary-container px-6 py-2 rounded-full font-bold text-sm shadow-xl transform rotate-12 border-2 border-surface">
              廚房模式
            </div>
          </button>
        </div>

        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => setCurrentPage('main')}
            className="flex flex-col items-center justify-center space-y-2 group transition-all duration-300 active:scale-95"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shadow-lg group-hover:bg-surface-container-high group-hover:text-primary transition-colors">
              <Home size={32} />
            </div>
            <span className="text-on-surface-variant font-bold text-sm tracking-widest">回到主頁</span>
          </button>
        </div>
      </main>
    </div>
  );
};
