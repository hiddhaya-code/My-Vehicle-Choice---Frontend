import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandCarIcon } from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden text-slate-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-pink-200/80 shadow-xl bg-white/95 relative z-10 text-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 p-[2px] shadow-[0_0_20px_rgba(244,63,94,0.35)] mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-white via-pink-50/60 to-white flex items-center justify-center text-rose-600">
              <BrandCarIcon className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to MyVehicle<span className="text-rose-600">Choice</span>
          </h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Access your saved comparisons, personalised recommendations, and dealer quotes
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-pink-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-pink-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials for Testing */}
        <div className="pt-4 border-t border-pink-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mb-2.5">
            <KeyRound className="w-3.5 h-3.5 text-rose-500" />
            <span>Quick Demo Credentials (Click to fill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul@example.com', 'Customer@123')}
              className="p-2.5 rounded-xl bg-pink-50/50 hover:bg-pink-100/60 border border-pink-200 text-left transition-all cursor-pointer shadow-sm"
            >
              <div className="text-xs font-bold text-slate-900">Customer</div>
              <div className="text-[10px] text-rose-600 truncate">rahul@example.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@myvehiclechoice.in', 'Admin@123')}
              className="p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200 text-left transition-all cursor-pointer shadow-sm"
            >
              <div className="text-xs font-bold text-amber-900">Administrator</div>
              <div className="text-[10px] text-amber-700 truncate">admin@myvehiclechoice.in</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-rose-600 hover:underline font-bold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
