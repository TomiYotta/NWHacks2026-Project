import React from 'react';
import { SleepLog } from '../types';

interface CalendarViewProps {
  logs: SleepLog[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ logs }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Get current month details
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const getLogForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return logs.find(l => l.date === dateStr);
  };

  const renderDays = () => {
    const calendarDays = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const log = getLogForDay(d);
      let bgColor = 'bg-slate-700'; // Default no data
      let textColor = 'text-slate-400';

      if (log) {
        if (log.hours >= 8) {
          bgColor = 'bg-green-500';
          textColor = 'text-white';
        } else if (log.hours < 6) {
          bgColor = 'bg-red-500';
          textColor = 'text-white';
        } else {
            bgColor = 'bg-yellow-500'; // OK sleep
            textColor = 'text-white';
        }
      }

      calendarDays.push(
        <div 
          key={d} 
          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${bgColor} ${textColor} transition-all hover:opacity-80`}
          title={log ? `${log.hours} hours` : 'No Data'}
        >
          {d}
        </div>
      );
    }
    return calendarDays;
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
       <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider">
        {today.toLocaleString('default', { month: 'long' })} Progress
       </h3>
       
       <div className="grid grid-cols-7 gap-1 mb-2">
         {days.map(d => (
           <div key={d} className="h-6 w-8 flex items-center justify-center text-slate-500 text-xs font-bold">
             {d}
           </div>
         ))}
       </div>

       <div className="grid grid-cols-7 gap-1 gap-y-2">
         {renderDays()}
       </div>
    </div>
  );
};

export default CalendarView;
