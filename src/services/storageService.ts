import { SleepLog, UserProfile } from '../types';

/**
 * MOCK FIREBASE IMPLEMENTATION
 * 
 * In a real production app, you would import `initializeApp` from 'firebase/app',
 * `getFirestore` from 'firebase/firestore', and `getAuth` from 'firebase/auth'.
 * 
 * For this demo to work immediately without API keys, we use LocalStorage 
 * but simulate the async nature of Firebase.
 */

const STORAGE_KEY_LOGS = 'slumbersync_logs';
const STORAGE_KEY_USER = 'slumbersync_user';
const STORAGE_KEY_TARGET = 'slumbersync_target';

export const storageService = {
  // --- Auth Simulation ---
  async login(email: string): Promise<UserProfile> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = { uid: 'user_123', email, displayName: email.split('@')[0] };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  getUser(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
  },

  // --- Data Simulation ---
  async getSleepLogs(): Promise<SleepLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const data = localStorage.getItem(STORAGE_KEY_LOGS);
    return data ? JSON.parse(data) : [];
  },

  async addSleepLog(log: Omit<SleepLog, 'id' | 'timestamp'>): Promise<SleepLog> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const logs = await this.getSleepLogs();
    
    // Check if entry already exists for date to prevent duplicates
    const existingIndex = logs.findIndex(l => l.date === log.date);
    
    const newLog: SleepLog = {
      ...log,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      logs[existingIndex] = { ...logs[existingIndex], hours: log.hours };
    } else {
      logs.push(newLog);
    }
    
    // Sort by date ascending
    logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    return newLog;
  },

  async addBatchSleepLogs(logsToAdd: Omit<SleepLog, 'id' | 'timestamp'>[]): Promise<void> {
     await new Promise(resolve => setTimeout(resolve, 500));
     const currentLogs = await this.getSleepLogs();
     
     logsToAdd.forEach(log => {
        const newLog: SleepLog = {
            ...log,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
        };
        
        const existingIndex = currentLogs.findIndex(l => l.date === log.date);
        if (existingIndex >= 0) {
            currentLogs[existingIndex] = { ...currentLogs[existingIndex], hours: log.hours };
        } else {
            currentLogs.push(newLog);
        }
     });

     currentLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
     localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(currentLogs));
  },

  async setTargetSleepHours(hours: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.setItem(STORAGE_KEY_TARGET, hours.toString());
  },

  async getTargetSleepHours(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const data = localStorage.getItem(STORAGE_KEY_TARGET);
    return data ? parseFloat(data) : 8; // Default to 8 if not set
  }
};