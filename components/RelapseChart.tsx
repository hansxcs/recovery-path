import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RelapseLog } from '../types';

interface Props {
  relapses: RelapseLog[];
  filter: 'week' | 'month' | 'year';
}

export const RelapseChart: React.FC<Props> = ({ relapses, filter }) => {
  const data = useMemo(() => {
    const now = new Date();
    let groupedData: Record<string, number> = {};
    const filteredRelapses = relapses.filter(r => {
      const d = new Date(r.date);
      if (filter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return d >= oneWeekAgo;
      }
      if (filter === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return d >= oneMonthAgo;
      }
      if (filter === 'year') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return d >= oneYearAgo;
      }
      return true;
    });

    filteredRelapses.forEach(r => {
      const date = new Date(r.date);
      let key = '';
      if (filter === 'week' || filter === 'month') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
      groupedData[key] = (groupedData[key] || 0) + 1;
    });

    return Object.entries(groupedData).map(([name, count]) => ({ name, count }));
  }, [relapses, filter]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
        No relapse data for this period. Stay strong!
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{fill: '#334155'}}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#f87171" />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};