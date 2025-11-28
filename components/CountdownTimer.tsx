import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  startDate: string;
}

export const CountdownTimer: React.FC<Props> = ({ startDate }) => {
  const [elapsed, setElapsed] = useState<{days: number, hours: number, minutes: number, seconds: number}>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      if (diff < 0) {
        setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsed({ days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 flex flex-col items-center justify-center animate-fade-in">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <Clock className="w-5 h-5" />
        <span className="uppercase tracking-widest text-xs font-bold">Current Clean Streak</span>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        {[
          { label: 'Days', value: elapsed.days },
          { label: 'Hours', value: elapsed.hours },
          { label: 'Mins', value: elapsed.minutes },
          { label: 'Secs', value: elapsed.seconds },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-3xl md:text-5xl font-mono font-bold text-white tabular-nums">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 uppercase mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};