export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}

export interface SleepLog {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  timestamp: number;
}

export enum SleepDebtLevel {
  Minimal = 'Minimal', // 0-2 hours
  Moderate = 'Moderate', // 2-6 hours
  High = 'High', // 6-12 hours
  Severe = 'Severe' // > 12 hours
}

export interface DailyStat {
  date: string;
  dayName: string;
  hours: number;
  debt: number;
}
