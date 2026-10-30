import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

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
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 sm:px-6 lg:px-8 bg-[#F4F0E8] relative overflow-hidden text-[#171717]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full space-y-8 luxury-card p-8 rounded-3xl relative z-10 text-[#171717]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <BrandLogo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#171717] tracking-tight font-heading">
            Sign In to Account
          </h2>
          <p className="mt-2 text-xs text-neutral-600 leading-relaxed font-body">
            Access your saved comparisons, personalised recommendations, and dealer quotes
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-900 text-xs font-body">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5 font-body" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 font-heading">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#171717]/15 text-[#171717] placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B9975B] transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-heading">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#171717]/15 text-[#171717] placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B9975B] transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl btn-gold font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
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
        <div className="pt-4 border-t border-[#171717]/10 font-body">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold mb-2.5">
            <KeyRound className="w-3.5 h-3.5 text-[#B9975B]" />
            <span>Quick Demo Credentials (Click to fill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul@example.com', 'Customer@123')}
              className="p-2.5 rounded-xl bg-[#F4F0E8] hover:bg-[#B9975B]/15 border border-[#171717]/10 text-left transition-all cursor-pointer shadow-sm"
            >
              <div className="text-xs font-bold text-[#171717] font-heading">Customer</div>
              <div className="text-[10px] text-[#8C6F37] truncate">rahul@example.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@myvehiclechoice.in', 'Admin@123')}
              className="p-2.5 rounded-xl bg-[#171717] text-white hover:bg-neutral-800 border border-neutral-700 text-left transition-all cursor-pointer shadow-sm"
            >
              <div className="text-xs font-bold text-[#B9975B] font-heading">Administrator</div>
              <div className="text-[10px] text-neutral-300 truncate">admin@myvehiclechoice.in</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-neutral-600 pt-2 font-body">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#8C6F37] hover:text-[#171717] hover:underline font-bold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
