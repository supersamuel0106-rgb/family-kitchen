import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReservationPage: React.FC = () => {
  const { setCurrentPage, addReservation } = useApp();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Month Selection
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2); // 0-indexed, 2 is March

  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const daysInMonth = useMemo(() => {
    const date = new Date(currentYear, currentMonth + 1, 0);
    return Array.from({ length: date.getDate() }, (_, i) => i + 1);
  }, [currentYear, currentMonth]);

  const handleConfirm = async () => {
    if (!selectedDay) {
      setError('請選擇日期');
      return;
    }
    if (!selectedSlot) {
      setError('請選擇預約時段');
      return;
    }

    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    
    try {
      await addReservation(dateStr, selectedSlot);
      setCurrentPage('reservation_success');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar title="預約廚房" showBack onBack={() => setCurrentPage('main')} />

      <main className="flex-grow pb-32 px-6 max-w-lg mx-auto w-full flex flex-col gap-12 pt-20">
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">選擇日期</h3>
            
            {/* Month Selector */}
            <div className="relative inline-block">
              <select 
                value={currentMonth}
                onChange={(e) => {
                  setCurrentMonth(parseInt(e.target.value));
                  setSelectedDay(null);
                  setError(null);
                }}
                className="appearance-none bg-surface-container-low pl-4 pr-10 py-2 rounded-full text-sm font-bold text-primary focus:ring-2 focus:ring-primary border-none cursor-pointer"
              >
                {months.map((name, index) => (
                  <option key={name} value={index}>{currentYear}年 {name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar scroll-smooth">
            {daysInMonth.map((day) => {
              const date = new Date(currentYear, currentMonth, day);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
              const isActive = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setError(null);
                  }}
                  className={`flex-shrink-0 w-20 h-28 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary-container/30 scale-105' 
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className={`text-[10px] font-bold mb-1 tracking-wider ${isActive ? 'opacity-80' : 'text-outline'}`}>{dayName}</span>
                  <span className="text-2xl font-black">{day}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">預約時段</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSelectedSlot('morning');
                setError(null);
              }}
              className={`group relative overflow-hidden p-6 rounded-xl flex flex-col gap-4 text-left transition-all duration-300 ${
                selectedSlot === 'morning'
                  ? 'bg-surface-container-lowest ring-2 ring-primary shadow-md'
                  : 'bg-surface-container-lowest hover:bg-surface-container-high'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedSlot === 'morning' ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-highest text-outline'}`}>
                <Sun size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-on-surface">上午</p>
                <p className="text-xs text-outline">Morning Session</p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedSlot('afternoon');
                setError(null);
              }}
              className={`group relative overflow-hidden p-6 rounded-xl flex flex-col gap-4 text-left transition-all duration-300 ${
                selectedSlot === 'afternoon'
                  ? 'bg-surface-container-lowest ring-2 ring-primary shadow-md'
                  : 'bg-surface-container-lowest hover:bg-surface-container-high'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${selectedSlot === 'afternoon' ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-highest text-outline'}`}>
                <Moon size={24} />
              </div>
              <div>
                <p className="font-bold text-lg text-on-surface">下午</p>
                <p className="text-xs text-outline">Afternoon Session</p>
              </div>
            </button>
          </div>
        </section>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-error-container/10 text-error p-4 rounded-xl text-center font-medium border border-error/20"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 pb-8 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          <Button fullWidth size="xl" onClick={handleConfirm}>
            確認預約
          </Button>
        </div>
      </footer>
    </div>
  );
};
