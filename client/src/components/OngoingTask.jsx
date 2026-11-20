import React from 'react';
import ProgressRing from './ProgressRing';
import AvatarGroup from './AvatarGroup';
import { CalendarDays } from 'lucide-react';

export default function OngoingTask() {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Service Task</div>
          <div className="text-xs text-slate-400">Sparky Home Services</div>
        </div>
        <ProgressRing value={88} />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <div className="text-xs text-slate-500">Assigned Team</div>
          <AvatarGroup />
        </div>
        <div className="text-xs">
          <div className="text-slate-500">Scheduled Date</div>
          <div className="flex items-center gap-1"><CalendarDays size={14}/> <span>Today</span></div>
        </div>
      </div>
    </div>
  );
}

