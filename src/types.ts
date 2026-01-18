// types.ts

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  hours: number;
}

export enum SleepDebtLevel {
  Low = 'low',           // 0-2 hours debt (good sleep!)
  Moderate = 'moderate', // 2-6 hours debt
  High = 'high',        // 6-12 hours debt
  Severe = 'severe',    // 12+ hours debt
  Minimal = 'minimal'    // Alias for Low (backward compatibility)
}

export interface DailyStat {
  date: string;
  dayName: string;
  hours: number;
  debt: number;
}