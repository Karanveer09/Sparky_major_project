import React from 'react';
import { addDays, format } from 'date-fns';

export default function DateScroller({ selectedDate, onSelectDate }) {
  const start = selectedDate || new Date();
  const days = Array.from({ length: 5 }).map((_, i) => addDays(start, i));

  return (
    <div className="px-4 mt-4">
      <div className="text-sm text-slate-500 mb-2">Select date</div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map((d, i) => {
          const isSelected = i === 0;
          return (
            <button
              key={i}
              onClick={() => onSelectDate?.(d)}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 w-14 h-16 shrink-0 ${
                isSelected ? 'bg-[#C2306B] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <div className="text-xs">{format(d, 'EEE')}</div>
              <div className="text-lg font-semibold">{format(d, 'd')}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

