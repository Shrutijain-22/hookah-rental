import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, Check } from 'lucide-react';

const CustomLuxuryCalendar = ({ selectedDate, onSelectDate }) => {
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      }
    }
    return new Date();
  });

  const getTodayString = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getTodayString();
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar matrix calculations
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    // Do not go to months before current month/year
    const now = new Date();
    if (currentYear === now.getFullYear() && currentMonth <= now.getMonth()) {
      return;
    }
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const daysGrid = [];
  // Empty slots before 1st of month
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const monthFormatted = String(currentMonth + 1).padStart(2, '0');
    const dayFormatted = String(d).padStart(2, '0');
    const dateStr = `${currentYear}-${monthFormatted}-${dayFormatted}`;
    
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    const isSelected = selectedDate === dateStr;

    daysGrid.push({
      dayNum: d,
      dateStr,
      isPast,
      isToday,
      isSelected,
    });
  }

  const handleDayClick = (dayObj) => {
    if (!dayObj || dayObj.isPast) return;
    onSelectDate(dayObj.dateStr);
  };

  // Quick date pill setters
  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const str = `${y}-${m}-${day}`;
    setViewDate(new Date(y, d.getMonth(), 1));
    onSelectDate(str);
  };

  const isPrevDisabled = () => {
    const now = new Date();
    return currentYear < now.getFullYear() || (currentYear === now.getFullYear() && currentMonth <= now.getMonth());
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#d4af37]/30 space-y-5 bg-[#0f1118]/90">
      {/* Top Header: Quick Select Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4" /> Quick Schedule Options
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setQuickDate(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDate === todayStr
                ? 'bg-[#d4af37] text-[#07080b] shadow-md shadow-[#d4af37]/30'
                : 'bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 text-gray-300'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(1)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 text-gray-300 transition-all"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(2)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 text-gray-300 transition-all"
          >
            In 2 Days
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(3)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 text-gray-300 transition-all"
          >
            This Weekend
          </button>
        </div>
      </div>

      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="gold-gradient-text">
            {monthNames[currentMonth]} {currentYear}
          </span>
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isPrevDisabled()}
            onClick={prevMonth}
            className={`p-2 rounded-xl border border-white/10 text-gray-300 transition-all ${
              isPrevDisabled() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#d4af37] hover:text-[#07080b]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl border border-white/10 text-gray-300 hover:bg-[#d4af37] hover:text-[#07080b] transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-[#d4af37]">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Interactive Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {daysGrid.map((item, idx) => {
          if (!item) {
            return <div key={`empty-${idx}`} className="h-11" />;
          }

          const { dayNum, isPast, isToday, isSelected } = item;

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={isPast}
              onClick={() => handleDayClick(item)}
              className={`h-11 rounded-2xl flex flex-col items-center justify-center font-bold relative transition-all ${
                isSelected
                  ? 'amber-gradient-btn text-[#07080b] scale-105 shadow-lg shadow-[#d4af37]/30 ring-2 ring-[#d4af37]'
                  : isPast
                  ? 'text-gray-600 bg-white/[0.02] cursor-not-allowed opacity-30 line-through'
                  : isToday
                  ? 'border-2 border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20'
                  : 'bg-white/5 border border-white/10 text-gray-200 hover:border-[#d4af37] hover:bg-[#d4af37]/20'
              }`}
            >
              <span>{dayNum}</span>

              {isToday && !isSelected && (
                <span className="text-[8px] font-black uppercase text-[#d4af37]">TODAY</span>
              )}

              {isSelected && (
                <Check className="w-3 h-3 stroke-[3]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Indicator Banner */}
      <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
        <span className="text-gray-400">Selected Event Date:</span>
        <span className="font-extrabold text-[#d4af37] text-sm font-mono">
          {selectedDate
            ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'None selected'}
        </span>
      </div>
    </div>
  );
};

export default CustomLuxuryCalendar;
