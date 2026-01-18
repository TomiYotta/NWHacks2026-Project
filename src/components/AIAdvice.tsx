import React, { useState, useEffect } from 'react';
import { getSleepAdvice } from '../services/geminiService';
import { SleepDebtLevel } from '../types';

interface AIAdviceProps {
  debt: number;
  streak: number;
  level: SleepDebtLevel;
}

const AIAdvice: React.FC<AIAdviceProps> = ({ debt, streak, level }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Debounce or just load once per critical change to save tokens
    const fetchAdvice = async () => {
        setLoading(true);
        const result = await getSleepAdvice(debt, streak, level);
        setAdvice(result);
        setLoading(false);
    };

    if (debt > 0 || streak > 0) {
        fetchAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]); // Only re-fetch if level changes to avoid spamming API on small hour adjustments

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v5.59l3.71 3.7a1 1 0 0 0 1.41-1.41L13 11.41V7a1 1 0 0 0-1-1z"/>
        </svg>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-wider">AI Sleep Coach</h3>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-indigo-800/50 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-800/50 rounded w-full"></div>
            <div className="h-4 bg-indigo-800/50 rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-indigo-50 text-sm leading-relaxed font-light">
            {advice || "Start logging your sleep to get personalized advice!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default AIAdvice;
