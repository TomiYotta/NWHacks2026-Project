import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const user = await storageService.login(email);
      onLogin(user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">SlumberSync</h1>
        <p className="text-slate-400">Master your sleep debt.</p>
      </div>

      <div className="w-full max-w-sm bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-left text-sm font-medium text-slate-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entering Dreamland...' : 'Start Tracking'}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500">
            For this demo, enter any email. No password required.
        </p>
      </div>
    </div>
  );
};

export default Auth;
