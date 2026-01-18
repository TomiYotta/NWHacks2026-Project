import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { DailyStat } from '../types';

interface SleepChartProps {
  data: DailyStat[];
  currentDebt: number;
  onToggle: () => void;
}

const SleepChart: React.FC<SleepChartProps> = ({ data, currentDebt, onToggle }) => {
  // Determine color based on debt threshold
  const isDangerZone = currentDebt >= 6;
  const lineColor = isDangerZone ? '#C92500' : '#6366f1'; // Danger Red vs Accent Indigo

  return (
    <div className="w-full h-64 bg-slate-800 rounded-2xl p-4 shadow-inner border border-slate-700 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          Weekly Overview
        </h3>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 hover:bg-slate-700 rounded"
          aria-label="Toggle to debt chart"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="dayName" 
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
            domain={[0, 12]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => [`${value.toFixed(1)} hrs`, 'Hours Slept']}
          />
          <ReferenceLine 
            y={8} 
            stroke="#10b981" 
            strokeDasharray="3 3" 
            label={{ value: 'Goal', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} 
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke={lineColor}
            strokeWidth={3}
            dot={{ fill: lineColor, r: 4 }}
            activeDot={{ r: 6, stroke: '#fff' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
      {isDangerZone && (
        <div className="text-center mt-2 text-red-500 text-xs font-bold animate-pulse">
          Critical Debt Level!
        </div>
      )}
    </div>
  );
};

export default SleepChart;