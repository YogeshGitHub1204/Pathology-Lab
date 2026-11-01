import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { AdminUser } from '../../types/index.js';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser, token: string) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('yogeshlonare186@gmail.com');
  const [password, setPassword] = useState('JeevanAdmin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        onLoginSuccess(data.user, data.token);
      } else {
        setErrorMessage(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setErrorMessage('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <button
          onClick={onBackToSite}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jeevan Pathology Lab Website</span>
        </button>

        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">JeevanChat Admin</span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Admin Portal Login
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Access leads, customer chat histories, and follow-up templates
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700">
          
          {errorMessage && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Enter Admin Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Preset Credentials Hint Box */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Configured Admin Credentials:</div>
            <div className="font-mono text-[11px] text-teal-300">
              Email: yogeshlonare186@gmail.com
            </div>
            <div className="font-mono text-[11px] text-teal-300">
              Password: JeevanAdmin@2026
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              (You can change this password at any time in Dashboard Settings)
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
