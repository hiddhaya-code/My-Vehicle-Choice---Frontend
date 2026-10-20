import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Compass, 
  GitCompare, 
  MapPin, 
  Bookmark, 
  Menu, 
  X, 
  ShieldCheck,
  Calculator,
  Sparkles,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout, wishlistVehicleIds } = useAuth();

  const navLinks = [
    { label: 'Find My Vehicle', path: '/find-my-vehicle', icon: Sparkles, highlight: true },
    { label: 'Explore Catalogue', path: '/vehicles', icon: Compass },
    { label: 'Compare', path: '/compare', icon: GitCompare },
    { label: 'Calculators', path: '/calculators', icon: Calculator },
    { label: 'Where to Buy', path: '/where-to-buy', icon: MapPin },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Circular Modern Logo with Custom GT Sports Car Silhouette */}
          <Link to="/" className="cursor-pointer">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation with Glassmorphism */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-rose-50 border border-rose-300 text-rose-600 shadow-sm'
                      : link.highlight
                      ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 border border-rose-200'
                      : 'text-slate-700 hover:text-rose-600 hover:bg-rose-50/50'
                  }`}
                >
                  {Icon && (
                    <Icon className={`w-3.5 h-3.5 ${active || link.highlight ? 'text-rose-500' : 'text-slate-400'}`} />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wishlist button */}
            <Link
              to="/saved"
              className="relative p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
              title="Saved Vehicles & Comparisons"
            >
              <Bookmark className="w-4 h-4" />
              {wishlistVehicleIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                  {wishlistVehicleIds.length}
                </span>
              )}
            </Link>

            {/* Admin Badge link if admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-xs font-medium text-slate-800 hover:border-rose-400 transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-extrabold text-[11px]">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.fullName.split(' ')[0]}</span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl border border-pink-200 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-pink-100">
                      <p className="text-[10px] text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-medium">
                        {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Buyer'}
                      </span>
                    </div>

                    <Link
                      to="/saved"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span>Saved Vehicles ({wishlistVehicleIds.length})</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        <span>Operations Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-pink-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/find-my-vehicle"
                  className="btn-galaxy-primary px-4 py-1.5 text-xs rounded-xl shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-rose-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-pink-100 bg-white/95 backdrop-blur-2xl rounded-b-2xl shadow-xl px-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive(link.path)
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <link.icon className="w-4 h-4 text-rose-500" />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-pink-100 flex items-center justify-between px-2">
              <Link
                to="/saved"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4 text-rose-500" />
                <span>Saved Vehicles ({wishlistVehicleIds.length})</span>
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-rose-600"
                >
                  Sign In →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
