import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Bike,
  GitCompare, 
  MapPin, 
  Bookmark, 
  Menu, 
  X, 
  ShieldCheck,
  Calculator,
  Sparkles,
  LogOut,
  ShieldAlert,
  ChevronDown,
  ArrowRight
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
    { label: 'Home', path: '/', exact: true },
    { label: 'Find My Vehicle', path: '/find-my-vehicle', icon: Sparkles, highlight: true },
    { label: 'Compare Vehicles', path: '/compare', icon: GitCompare },
    { label: 'Cars', path: '/vehicles?category=CAR', icon: Car },
    { label: 'Bikes', path: '/vehicles?category=MOTORCYCLE', icon: Bike },
    { label: 'Where to Buy', path: '/where-to-buy', icon: MapPin },
    { label: 'Calculators', path: '/calculators', icon: Calculator },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact || path === '/') {
      return location.pathname === '/' && location.search === '';
    }
    if (path.includes('?')) {
      const [base, query] = path.split('?');
      return location.pathname === base && location.search.includes(query);
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Mednix Inspired Pre-Header Trust Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SIAM & ARAI Homologation Verified</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Authentic Delhi RTO On-Road Estimates</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Official OEM Authorized Dealerships</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="text-emerald-400 font-bold tracking-wider uppercase text-[10px] bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              100% Dealer Bias-Free
            </span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navbar */}
      <div className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo and Tagline */}
            <Link to="/" className="cursor-pointer shrink-0 py-2">
              <BrandLogo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path, link.exact);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                        : link.highlight
                        ? 'text-rose-600 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/70'
                        : 'text-slate-700 hover:text-rose-600 hover:bg-slate-100/70'
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

            {/* Compact Desktop Navigation for Medium/Large screens (hidden on xl) */}
            <nav className="hidden lg:flex xl:hidden items-center space-x-1">
              <Link
                to="/find-my-vehicle"
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold ${
                  isActive('/find-my-vehicle') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Find</span>
              </Link>
              <Link
                to="/compare"
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${
                  isActive('/compare') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Compare
              </Link>
              <Link
                to="/vehicles?category=CAR"
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${
                  isActive('/vehicles?category=CAR') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cars
              </Link>
              <Link
                to="/vehicles?category=MOTORCYCLE"
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${
                  isActive('/vehicles?category=MOTORCYCLE') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Bikes
              </Link>
              <Link
                to="/where-to-buy"
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${
                  isActive('/where-to-buy') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Where to Buy
              </Link>
              <Link
                to="/calculators"
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold ${
                  isActive('/calculators') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Calculators
              </Link>
            </nav>

            {/* Right Action CTAs & Auth */}
            <div className="hidden md:flex items-center space-x-2.5">
              {/* Wishlist button */}
              <Link
                to="/saved"
                className="relative p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all duration-200"
                title="Saved Vehicles & Comparisons"
              >
                <Bookmark className="w-4 h-4" />
                {wishlistVehicleIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-600 to-pink-500 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    {wishlistVehicleIds.length}
                  </span>
                )}
              </Link>

              {/* Admin Badge link if admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
                  title="Open Admin Operations Dashboard"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin</span>
                </Link>
              )}

              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800 hover:border-rose-400 transition-all shadow-2xs cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center font-extrabold text-[11px]">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[110px] truncate">{user.fullName.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {userDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                          <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            user.role === 'ROLE_ADMIN' 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}>
                            {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Buyer'}
                          </span>
                        </div>

                        <Link
                          to="/saved"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          <span>Saved Vehicles ({wishlistVehicleIds.length})</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center space-x-2 px-4 py-2.5 text-xs text-amber-800 hover:bg-amber-50 font-medium"
                          >
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            <span>Admin Operations Dashboard</span>
                          </Link>
                        )}

                        <div className="pt-1 border-t border-slate-100 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer font-semibold"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-bold rounded-full text-slate-700 hover:text-rose-600 hover:bg-slate-100/70 transition-all cursor-pointer"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/find-my-vehicle"
                    className="btn-pill-primary text-xs py-2 px-4 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Find My Vehicle</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl rounded-b-3xl shadow-xl px-3 space-y-1.5 animate-in slide-in-from-top duration-200">
              <div className="px-2 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Automotive Navigation
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                    isActive(link.path, link.exact)
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-rose-600'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {link.icon && <link.icon className="w-4 h-4 text-rose-500" />}
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}

              <Link
                to="/saved"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center space-x-2.5">
                  <Bookmark className="w-4 h-4 text-rose-500" />
                  <span>Saved Vehicles ({wishlistVehicleIds.length})</span>
                </div>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  {wishlistVehicleIds.length}
                </span>
              </Link>

              {isAuthenticated && user ? (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs px-2 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center font-bold text-[10px]">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{user.fullName}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      user.role === 'ROLE_ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Verified Buyer'}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-2 text-xs font-bold text-amber-800 bg-amber-50 rounded-xl px-3 border border-amber-200"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Admin Operations Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold btn-pill-primary"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
