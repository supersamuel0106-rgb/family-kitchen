import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { PlayCircle, LayoutGrid } from 'lucide-react';

export const MainPage: React.FC = () => {
  const { setCurrentPage, reservations, roles } = useApp();

  // Simple calendar logic for Oct 2023 (as per image)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 0; // Sunday

  const getReservationsForDay = (day: number) => {
    const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
    return reservations.filter(r => r.reservationDate === dateStr);
  };

  return (
    <div className="min-h-screen bg-surface">
      <TopBar 
        title="廚房行程表" 
        showUserSwitch 
        showAdd 
        onAdd={() => setCurrentPage('reservation')} 
      />

      <main className="pt-24 pb-40 px-4 max-w-lg mx-auto flex flex-col items-center">
        <div className="text-center mb-8">
          <p className="text-secondary font-bold tracking-widest text-sm uppercase opacity-70">2026年 3月</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">廚房行程表</h2>
        </div>

        <div className="w-full bg-surface-container-low rounded-[2.5rem] p-4 shadow-sm border border-white/40">
          <div className="grid grid-cols-7 mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map((d, i) => (
              <div key={d} className={`text-center py-2 text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-error' : 'text-on-surface-variant'}`}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day) => {
              const dayRes = getReservationsForDay(day);
              const morning = dayRes.find(r => r.timeSlot === 'morning');
              const afternoon = dayRes.find(r => r.timeSlot === 'afternoon');

              return (
                <div key={day} className="aspect-square bg-white rounded-xl border border-surface-container overflow-hidden flex flex-col relative">
                  <span className="absolute top-1 left-1.5 text-[9px] font-bold text-on-surface/40">{day}</span>
                  
                  <div className={`flex-1 flex items-center justify-center ${morning ? 'bg-primary/10' : ''}`}>
                    {morning && (
                      <span className="text-[7px] font-bold text-primary">
                        {roles.find(r => r.id === morning.roleId)?.roleName}
                      </span>
                    )}
                  </div>
                  
                  <div className={`flex-1 flex items-center justify-center border-t border-surface-container/30 ${afternoon ? 'bg-secondary/10' : ''}`}>
                    {afternoon && (
                      <span className="text-[7px] font-bold text-secondary">
                        {roles.find(r => r.id === afternoon.roleId)?.roleName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 left-0 w-full px-6 flex justify-between items-end max-w-lg mx-auto pointer-events-none z-50">
        <button 
          onClick={() => setCurrentPage('start_usage')}
          className="pointer-events-auto bg-white/90 backdrop-blur text-on-surface px-6 py-4 rounded-full font-bold shadow-xl flex items-center gap-3 active:scale-95 transition-all border border-surface-container"
        >
          <PlayCircle className="text-primary" size={24} />
          開始使用
        </button>
        <button 
          onClick={() => setCurrentPage('usage_status')}
          className="pointer-events-auto bg-white/90 backdrop-blur text-on-surface px-6 py-4 rounded-full font-bold shadow-xl flex items-center gap-3 active:scale-95 transition-all border border-surface-container"
        >
          <LayoutGrid className="text-secondary" size={24} />
          查看動態
        </button>
      </div>
    </div>
  );
};
