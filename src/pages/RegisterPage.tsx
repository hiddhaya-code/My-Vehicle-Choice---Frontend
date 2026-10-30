import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        fullName,
        email,
        password,
        phone: phone.trim() ? phone : undefined,
        city,
      });
      navigate('/find-my-vehicle');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
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
            Create your Free Account
          </h2>
          <p className="mt-2 text-xs text-neutral-600 leading-relaxed font-body">
            Join smart vehicle buyers making data-driven decisions across India
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-900 text-xs font-body">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4 font-body" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-heading">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#171717]/15 text-[#171717] placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B9975B] transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-heading">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#171717]/15 text-[#171717] placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B9975B] transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-heading">
              Password (min 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#171717]/15 text-[#171717] placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B9975B] transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-heading">
                Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-white border border-[#171717]/15 text-[#171717] placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B9975B] transition-all shadow-sm tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-heading">
                City *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-white border border-[#171717]/15 text-[#171717] text-xs focus:outline-none focus:border-[#B9975B] transition-all shadow-sm cursor-pointer"
                >
                  <option value="New Delhi">New Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl btn-gold font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-[#F4F0E8] border border-[#171717]/10 flex items-center gap-2.5 text-xs text-neutral-600 font-body">
          <ShieldCheck className="w-4 h-4 text-[#B9975B] flex-shrink-0" />
          <span>Your data is strictly confidential. Zero unsolicited sales spam.</span>
        </div>

        <div className="text-center text-xs text-neutral-600 pt-1 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8C6F37] hover:text-[#171717] hover:underline font-bold">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
