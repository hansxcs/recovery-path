import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DailyCheckIn } from '../types';

interface Props {
  checkIns: DailyCheckIn[];
}

export const UrgeChart: React.FC<Props> = ({ checkIns }) => {
  const data = [...checkIns]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(c => ({
      date: new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      urge: c.urgeIntensity,
      mood: c.mood,
      notes: c.notes
    }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
        No daily logs yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            minTickGap={30}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            cursor={{ stroke: '#64748b' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line 
            type="monotone" 
            dataKey="urge" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} 
            activeDot={{ r: 6, stroke: '#ecfdf5', strokeWidth: 2 }}
            name="Urge Intensity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
