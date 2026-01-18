import React, { useState, useEffect, useMemo } from 'react';
import Auth from './components/Auth';
import SleepChart from './components/SleepChart';
import DebtChart from './components/DebtChart';
import Mascot from './components/Mascot';
import AIAdvice from './components/AIAdvice';
import CalendarView from './components/CalendarView';
import { storageService } from './services/storageService';
import { UserProfile, SleepLog, SleepDebtLevel, DailyStat } from './types';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Input State
  const [todayHours, setTodayHours] = useState<string>('');
  
  // Missed Days State
  const [missingDates, setMissingDates] = useState<string[]>([]);
  const [missedInputs, setMissedInputs] = useState<{[date: string]: string}>({});

  // Chart Toggle State (instead of carousel)
  const [showDebtChart, setShowDebtChart] = useState<boolean>(false);

  useEffect(() => {
    // Check for existing session
    const currentUser = storageService.getUser();
    if (currentUser) {
      setUser(currentUser);
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await storageService.getSleepLogs();
    setLogs(data);
    calculateMissingDays(data);
    setLoading(false);
  };

  const calculateMissingDays = (currentLogs: SleepLog[]) => {
    if (currentLogs.length === 0) return;

    // Sort logs descending to find the last entry
    const sorted = [...currentLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastEntryDate = new Date(sorted[0].date);
    
    // Normalize today to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Normalize last entry
    lastEntryDate.setHours(0,0,0,0);

    const missing: string[] = [];
    // Iterate from day after last entry until yesterday (today is handled by main input)
    let pointer = new Date(lastEntryDate);
    pointer.setDate(pointer.getDate() + 1);

    while (pointer.getTime() < today.getTime()) {
      const dateStr = pointer.toISOString().split('T')[0];
      missing.push(dateStr);
      pointer.setDate(pointer.getDate() + 1);
    }

    setMissingDates(missing);
  };

  const handleLogin = (u: UserProfile) => {
    setUser(u);
    fetchLogs();
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setLogs([]);
  };

  // --- Calculations ---

  const { totalDebt, streak, debtLevel, weeklyStats } = useMemo(() => {
    let runningDebt = 0;
    let currentStreak = 0;
    const debtHistory = new Map<string, number>();
    
    // Sort chronological for calculation
    const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate Debt (Cumulative History)
    sortedLogs.forEach(log => {
      const dailyDeficit = 8 - log.hours;
      runningDebt += dailyDeficit;
      if (runningDebt < 0) runningDebt = 0;
      
      // Store the debt level at the end of this specific day
      debtHistory.set(log.date, runningDebt);
    });

    // Calculate Streak (Backwards from latest)
    for (let i = sortedLogs.length - 1; i >= 0; i--) {
      if (sortedLogs[i].hours >= 8) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Debt Level (based on final current debt)
    let level = SleepDebtLevel.Minimal;
    if (runningDebt >= 12) level = SleepDebtLevel.Severe;
    else if (runningDebt >= 6) level = SleepDebtLevel.High;
    else if (runningDebt >= 2) level = SleepDebtLevel.Moderate;
    else level = SleepDebtLevel.Low;

    // Weekly Stats for Charts (Last 7 days relative to today)
    const stats: DailyStat[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const log = logs.find(l => l.date === dStr);
        
        // Find historical debt for this day
        let historicalDebt = 0;
        if (debtHistory.has(dStr)) {
            historicalDebt = debtHistory.get(dStr)!;
        } else {
            // If we don't have a log for this day, assume debt hasn't changed from the last known log
            // This prevents the chart from dipping to 0 if today/yesterday isn't filled yet
            const prevLog = sortedLogs.filter(l => l.date < dStr).pop();
            if (prevLog) {
                historicalDebt = debtHistory.get(prevLog.date)!;
            }
        }
        
        stats.push({
            date: dStr,
            dayName,
            hours: log ? log.hours : 0,
            debt: historicalDebt
        });
    }

    return { totalDebt: runningDebt, streak: currentStreak, debtLevel: level, weeklyStats: stats };
  }, [logs]);

  // --- Handlers ---

  const handleTodaySubmit = async () => {
    if (!todayHours) return;
    const hours = parseFloat(todayHours);
    if (isNaN(hours)) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newLog = await storageService.addSleepLog({
        date: todayStr,
        hours
    });
    
    setLogs(prev => [...prev.filter(l => l.date !== todayStr), newLog]);
    setTodayHours('');
  };

  const handleMissedSubmit = async () => {
    // Check if all filled
    const allFilled = missingDates.every(date => missedInputs[date] && !isNaN(parseFloat(missedInputs[date])));
    if (!allFilled) {
        alert("Please fill in all missing days first.");
        return;
    }

    const newLogs = missingDates.map(date => ({
        date,
        hours: parseFloat(missedInputs[date])
    }));

    await storageService.addBatchSleepLogs(newLogs);
    setMissingDates([]);
    setMissedInputs({});
    fetchLogs(); // Refresh fully
  };

  // --- Render ---

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (loading) {
     return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading data...</div>;
  }

  const isTodayLogged = logs.some(l => l.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header / Streak */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div>
           <h1 className="text-xl font-bold text-white">SlumberSync</h1>
           <p className="text-xs text-slate-400">Welcome back, {user.displayName}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <span className="text-orange-400">🔥</span>
            <span className="text-white font-bold">{streak}</span>
            <span className="text-xs text-slate-400 uppercase">Streak</span>
        </div>
        <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-white underline">Logout</button>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        
        {/* Missed Days Modal/Blocker */}
        {missingDates.length > 0 && (
            <div className="bg-orange-500/10 border border-orange-500 rounded-2xl p-6 animate-fade-in">
                <h2 className="text-orange-500 font-bold text-lg mb-2">Wait! Missing Data</h2>
                <p className="text-slate-300 text-sm mb-4">You can't log today's sleep until you fill in the gaps.</p>
                <div className="space-y-3">
                    {missingDates.map(date => (
                        <div key={date} className="flex items-center justify-between">
                            <span className="text-white text-sm">{date}</span>
                            <input 
                                type="number" 
                                min="0" max="24"
                                placeholder="Hours"
                                className="w-20 bg-slate-800 border border-slate-600 rounded p-2 text-white text-right"
                                value={missedInputs[date] || ''}
                                onChange={(e) => setMissedInputs({...missedInputs, [date]: e.target.value})}
                            />
                        </div>
                    ))}
                    <button 
                        onClick={handleMissedSubmit}
                        className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Update History
                    </button>
                </div>
            </div>
        )}

        {/* Mascot & Debt Status */}
        <section className="text-center">
            <Mascot level={debtLevel} />
            <div className="mt-4">
                <h2 className="text-3xl font-bold text-white">{totalDebt.toFixed(1)}h</h2>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Current Sleep Debt</p>
                {debtLevel !== SleepDebtLevel.Low && (
                    <p className="text-xs text-indigo-400 mt-2">Goal: 8h / night</p>
                )}
            </div>
        </section>

        {/* AI Advice */}
        <AIAdvice debt={totalDebt} streak={streak} level={debtLevel} />

        {/* Sleep Input (Only if caught up) */}
        {missingDates.length === 0 && (
            <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
                <h3 className="text-white font-bold mb-4">
                    {isTodayLogged ? "Edit Today's Sleep" : "Log Last Night's Sleep"}
                </h3>
                <div className="flex gap-4">
                    <input 
                        type="number"
                        min="0" max="24" step="0.5"
                        value={todayHours}
                        onChange={(e) => setTodayHours(e.target.value)}
                        placeholder="Ex: 7.5"
                        className="flex-1 bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-3 text-lg outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button 
                        onClick={handleTodaySubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {isTodayLogged ? 'Update' : 'Save'}
                    </button>
                </div>
            </section>
        )}

        {/* Charts with Arrow Toggle */}
        <div className="relative">
            {showDebtChart ? (
                <DebtChart 
                  data={weeklyStats} 
                  onToggle={() => setShowDebtChart(false)} 
                />
            ) : (
                <SleepChart 
                  data={weeklyStats} 
                  currentDebt={totalDebt} 
                  onToggle={() => setShowDebtChart(true)}
                />
            )}
        </div>

        {/* Calendar */}
        <CalendarView logs={logs} />
      </main>
    </div>
  );
}

export default App;