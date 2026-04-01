import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { PlayCircle, LayoutGrid, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

export const MainPage: React.FC = () => {
  const { setCurrentPage, reservations, roles, refreshData, isLoading } = useApp();

  // 預設顯示當前年月
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  // 進入頁面時主動刷新，確保預約完成後資料是最新的
  useEffect(() => {
    refreshData();
  }, []);

  // 計算當月日曆格資訊
  const calendarData = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 星期幾 (0=日)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDayOfWeek, daysInMonth };
  }, [year, month]);

  /**
   * 查詢某日的預約（上午/下午）
   * 以 YYYY-MM-DD 格式比對後端回傳的 reservationDate
   */
  const getReservationsForDay = (day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return reservations.filter(r => r.reservationDate === dateStr && r.status === 'active');
  };

  const goToPrevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  // 用 roleId 找對應角色的顏色 class；若未找到用預設色
  const getRoleColor = (roleId: string, slot: 'morning' | 'afternoon') => {
    const role = roles.find(r => r.id === roleId);
    // NOTE: 角色的 color 欄位為 CSS 顏色字串，直接套用為背景色
    return role?.color ?? (slot === 'morning' ? '#6750A4' : '#7B5EA7');
  };

  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-surface">
      <TopBar
        title="廚房行程表"
        showUserSwitch
        showAdd
        onAdd={() => setCurrentPage('reservation')}
      />

      <main className="pt-24 pb-40 px-4 max-w-lg mx-auto flex flex-col items-center">

        {/* ── 月份標頭與切換 ── */}
        <div className="w-full flex items-center justify-between mb-6 px-2">
          <button
            onClick={goToPrevMonth}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center
                       hover:bg-primary/10 active:scale-90 transition-all shadow-sm border border-white/30"
            aria-label="上一個月"
          >
            <ChevronLeft size={20} className="text-on-surface-variant" />
          </button>

          <div className="text-center">
            <p className="text-secondary font-bold tracking-widest text-[11px] uppercase opacity-70">
              {year} 年
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
              {MONTH_NAMES[month]}
            </h2>
          </div>

          <button
            onClick={goToNextMonth}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center
                       hover:bg-primary/10 active:scale-90 transition-all shadow-sm border border-white/30"
            aria-label="下一個月"
          >
            <ChevronRight size={20} className="text-on-surface-variant" />
          </button>
        </div>

        {/* ── 圖例 ── */}
        <div className="w-full flex gap-4 justify-end mb-3 px-1">
          <span className="flex items-center gap-1 text-[10px] text-on-surface-variant font-semibold">
            <Sun size={11} className="text-amber-500" /> 上午
          </span>
          <span className="flex items-center gap-1 text-[10px] text-on-surface-variant font-semibold">
            <Moon size={11} className="text-indigo-400" /> 下午
          </span>
        </div>

        {/* ── 行事曆格 ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-surface-container-low rounded-[2.5rem] p-4 shadow-sm border border-white/40"
          >
            {/* 星期標題列 */}
            <div className="grid grid-cols-7 mb-3">
              {WEEKDAY_LABELS.map((d, i) => (
                <div
                  key={d}
                  className={`text-center py-2 text-[10px] font-black uppercase tracking-widest
                    ${i === 0 ? 'text-error' : 'text-on-surface-variant'}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* 日期格 */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* 月初空白偏移 */}
              {Array.from({ length: calendarData.firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* 每日格 */}
              {Array.from({ length: calendarData.daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayRes = getReservationsForDay(day);
                const morning = dayRes.find(r => r.timeSlot === 'morning');
                const afternoon = dayRes.find(r => r.timeSlot === 'afternoon');
                const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const isToday = dateStr === todayStr;

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-xl border overflow-hidden flex flex-col relative
                      ${isToday
                        ? 'border-primary/50 bg-primary/5 shadow-sm'
                        : 'bg-white border-surface-container'
                      }`}
                  >
                    {/* 日期數字 */}
                    <span
                      className={`absolute top-1 left-1.5 text-[9px] font-bold
                        ${isToday ? 'text-primary font-black' : 'text-on-surface/40'}`}
                    >
                      {day}
                    </span>

                    {/* 上午時段 */}
                    <div
                      className="flex-1 flex items-center justify-center"
                      style={morning ? { backgroundColor: `${getRoleColor(morning.roleId, 'morning')}18` } : {}}
                    >
                      {morning && (
                        <div className="flex flex-col items-center gap-0.5">
                          <Sun size={7} style={{ color: getRoleColor(morning.roleId, 'morning') }} />
                          <span
                            className="text-[6.5px] font-bold leading-tight text-center px-0.5"
                            style={{ color: getRoleColor(morning.roleId, 'morning') }}
                          >
                            {roles.find(r => r.id === morning.roleId)?.roleName ?? morning.roleId}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 下午時段 */}
                    <div
                      className="flex-1 flex items-center justify-center border-t border-surface-container/30"
                      style={afternoon ? { backgroundColor: `${getRoleColor(afternoon.roleId, 'afternoon')}18` } : {}}
                    >
                      {afternoon && (
                        <div className="flex flex-col items-center gap-0.5">
                          <Moon size={7} style={{ color: getRoleColor(afternoon.roleId, 'afternoon') }} />
                          <span
                            className="text-[6.5px] font-bold leading-tight text-center px-0.5"
                            style={{ color: getRoleColor(afternoon.roleId, 'afternoon') }}
                          >
                            {roles.find(r => r.id === afternoon.roleId)?.roleName ?? afternoon.roleId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── 載入中提示 ── */}
        {isLoading && (
          <p className="mt-4 text-xs text-on-surface-variant opacity-60 animate-pulse">
            正在同步預約資料…
          </p>
        )}

        {/* ── 本月預約摘要 ── */}
        <ReservationSummary
          year={year}
          month={month}
          reservations={reservations.filter(r => {
            const prefix = `${year}-${(month + 1).toString().padStart(2, '0')}`;
            return r.reservationDate.startsWith(prefix) && r.status === 'active';
          })}
          roles={roles}
        />
      </main>

      {/* ── 底部快捷按鈕 ── */}
      <div className="fixed bottom-10 left-0 w-full px-6 flex justify-between items-end max-w-lg mx-auto pointer-events-none z-50">
        <button
          onClick={() => setCurrentPage('start_usage')}
          className="pointer-events-auto bg-white/90 backdrop-blur text-on-surface px-6 py-4 rounded-full
                     font-bold shadow-xl flex items-center gap-3 active:scale-95 transition-all border border-surface-container"
        >
          <PlayCircle className="text-primary" size={24} />
          開始使用
        </button>
        <button
          onClick={() => setCurrentPage('usage_status')}
          className="pointer-events-auto bg-white/90 backdrop-blur text-on-surface px-6 py-4 rounded-full
                     font-bold shadow-xl flex items-center gap-3 active:scale-95 transition-all border border-surface-container"
        >
          <LayoutGrid className="text-secondary" size={24} />
          查看動態
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   本月預約摘要子元件
───────────────────────────────────────────── */
interface ReservationSummaryProps {
  year: number;
  month: number;
  reservations: import('../types').Reservation[];
  roles: import('../types').FamilyRole[];
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ year, month, reservations, roles }) => {
  if (reservations.length === 0) return null;

  // 依日期排序
  const sorted = [...reservations].sort((a, b) =>
    a.reservationDate.localeCompare(b.reservationDate)
  );

  return (
    <div className="w-full mt-6">
      <h3 className="text-xs font-black uppercase tracking-widest text-secondary opacity-70 mb-3 px-1">
        本月預約清單
      </h3>
      <div className="flex flex-col gap-2">
        {sorted.map(r => {
          const role = roles.find(ro => ro.id === r.roleId);
          const dayNum = parseInt(r.reservationDate.split('-')[2], 10);
          const dateObj = new Date(year, month, dayNum);
          const weekday = dateObj.toLocaleDateString('zh-TW', { weekday: 'short' });

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3
                         border border-white/40 shadow-sm"
            >
              {/* 色條 */}
              <div
                className="w-1.5 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: role?.color ?? '#6750A4' }}
              />
              {/* 日期 */}
              <div className="flex flex-col items-center w-10 flex-shrink-0">
                <span className="text-xl font-black text-on-surface leading-none">{dayNum}</span>
                <span className="text-[10px] text-on-surface-variant">{weekday}</span>
              </div>
              {/* 分隔 */}
              <div className="w-px h-8 bg-surface-container-highest/50 flex-shrink-0" />
              {/* 資訊 */}
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-on-surface truncate">
                  {role?.roleName ?? r.roleId}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  {r.timeSlot === 'morning' ? '☀️ 上午時段' : '🌙 下午時段'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
