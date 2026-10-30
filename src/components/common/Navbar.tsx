import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Bike,
  GitCompare, 
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
    { label: 'Where to Buy', path: '/where-to-buy' },
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
      {/* Luxury Charcoal Pre-Header Trust Bar */}
      <div className="bg-[#171717] text-stone-300 text-[11px] py-1.5 px-4 border-b border-[#2E2E2E] hidden sm:block font-body">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-stone-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B9975B]" />
              <span>SIAM & ARAI Homologation Verified</span>
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">Authentic Delhi RTO On-Road Estimates</span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">Official OEM Authorized Dealerships</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[#B9975B] font-semibold tracking-wider uppercase text-[10px] bg-[#B9975B]/10 border border-[#B9975B]/30 px-2.5 py-0.5 rounded-full">
              100% Dealer Bias-Free
            </span>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Approved Geometric M and Road Brand Logo */}
            <Link to="/" className="cursor-pointer shrink-0 py-2">
              <BrandLogo size="md" variant="light" />
            </Link>

            {/* Desktop Navigation Links (Manrope weight 600) */}
            <nav className="hidden xl:flex items-center space-x-1 font-heading">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path, link.exact);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B] font-bold shadow-xs'
                        : link.highlight
                        ? 'text-[#B9975B] bg-[#B9975B]/10 hover:bg-[#B9975B]/20 border border-[#B9975B]/40'
                        : 'text-[#171717] hover:text-[#B9975B] hover:bg-[#F4F0E8]'
                    }`}
                  >
                    {Icon && (
                      <Icon className={`w-3.5 h-3.5 ${active || link.highlight ? 'text-[#B9975B]' : 'text-stone-400'}`} />
                    )}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Compact Desktop Navigation for Medium/Large screens */}
            <nav className="hidden lg:flex xl:hidden items-center space-x-1 font-heading">
              <Link
                to="/find-my-vehicle"
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                  isActive('/find-my-vehicle') ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B]' : 'text-[#B9975B] hover:bg-[#F4F0E8]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B9975B]" />
                <span>Find</span>
              </Link>
              <Link
                to="/compare"
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                  isActive('/compare') ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B]' : 'text-[#171717] hover:bg-[#F4F0E8]'
                }`}
              >
                Compare
              </Link>
              <Link
                to="/vehicles?category=CAR"
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                  isActive('/vehicles?category=CAR') ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B]' : 'text-[#171717] hover:bg-[#F4F0E8]'
                }`}
              >
                Cars
              </Link>
              <Link
                to="/vehicles?category=MOTORCYCLE"
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                  isActive('/vehicles?category=MOTORCYCLE') ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B]' : 'text-[#171717] hover:bg-[#F4F0E8]'
                }`}
              >
                Bikes
              </Link>
              <Link
                to="/where-to-buy"
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                  isActive('/where-to-buy') ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B]' : 'text-[#171717] hover:bg-[#F4F0E8]'
                }`}
              >
                Where to Buy
              </Link>
              <Link
                to="/calculators"
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                  isActive('/calculators') ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B]' : 'text-[#171717] hover:bg-[#F4F0E8]'
                }`}
              >
                Calculators
              </Link>
            </nav>

            {/* Right Action CTAs & Auth */}
            <div className="hidden md:flex items-center space-x-2.5 font-body">
              {/* Wishlist button */}
              <Link
                to="/saved"
                className="relative p-2.5 rounded-full text-[#171717] hover:text-[#B9975B] hover:bg-[#F4F0E8] border border-[#E5E0D8] transition-all duration-200"
                title="Saved Vehicles & Comparisons"
              >
                <Bookmark className="w-4 h-4" />
                {wishlistVehicleIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B9975B] text-[#171717] text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {wishlistVehicleIds.length}
                  </span>
                )}
              </Link>

              {/* Admin Badge link if admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171717] border border-[#B9975B] text-[#B9975B] text-xs font-semibold hover:bg-[#262626] transition-colors shadow-2xs font-heading"
                  title="Open Admin Operations Dashboard"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>Admin</span>
                </Link>
              )}

              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E0D8] text-xs font-medium text-[#171717] hover:border-[#B9975B] transition-all shadow-2xs cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#B9975B] text-[#171717] flex items-center justify-center font-extrabold text-[11px]">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[110px] truncate">{user.fullName.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-stone-400" />
                    </button>

                    {userDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E0D8] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-2.5 border-b border-[#E5E0D8]">
                          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-heading">Signed in as</p>
                          <p className="text-xs font-bold text-[#171717] truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            user.role === 'ROLE_ADMIN' 
                              ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B]' 
                              : 'bg-[#B9975B]/15 text-[#9F7F45] border border-[#B9975B]/30'
                          }`}>
                            {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Buyer'}
                          </span>
                        </div>

                        <Link
                          to="/saved"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 text-xs text-[#171717] hover:bg-[#F4F0E8] hover:text-[#B9975B] transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-stone-400" />
                          <span>Saved Vehicles ({wishlistVehicleIds.length})</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center space-x-2 px-4 py-2.5 text-xs text-[#B9975B] hover:bg-[#F4F0E8] font-semibold"
                          >
                            <ShieldAlert className="w-4 h-4 text-[#B9975B]" />
                            <span>Admin Operations Dashboard</span>
                          </Link>
                        )}

                        <div className="pt-1 border-t border-[#E5E0D8] mt-1">
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
                    className="p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-[#F4F0E8] border border-transparent hover:border-[#E5E0D8] transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold rounded-full text-[#171717] hover:text-[#B9975B] hover:bg-[#F4F0E8] transition-all cursor-pointer"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/find-my-vehicle"
                    className="btn-gold text-xs py-2 px-4 shadow-sm"
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
                className="p-2 rounded-xl text-[#171717] hover:bg-[#F4F0E8] focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-[#E5E0D8] bg-white rounded-b-3xl shadow-xl px-3 space-y-1.5 animate-in slide-in-from-top duration-200 font-body">
              <div className="px-2 pb-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider font-heading">
                Automotive Navigation
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive(link.path, link.exact)
                      ? 'bg-[#B9975B]/15 text-[#171717] border border-[#B9975B] font-bold'
                      : 'text-[#171717] hover:bg-[#F4F0E8] hover:text-[#B9975B]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {link.icon && <link.icon className="w-4 h-4 text-[#B9975B]" />}
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                </Link>
              ))}

              <Link
                to="/saved"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#171717] hover:bg-[#F4F0E8]"
              >
                <div className="flex items-center space-x-2.5">
                  <Bookmark className="w-4 h-4 text-[#B9975B]" />
                  <span>Saved Vehicles ({wishlistVehicleIds.length})</span>
                </div>
                <span className="text-xs font-extrabold text-[#171717] bg-[#B9975B] px-2 py-0.5 rounded-full">
                  {wishlistVehicleIds.length}
                </span>
              </Link>

              {isAuthenticated && user ? (
                <div className="pt-3 border-t border-[#E5E0D8] space-y-2">
                  <div className="flex items-center justify-between text-xs px-2 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#B9975B] text-[#171717] flex items-center justify-center font-bold text-[10px]">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-[#171717] truncate max-w-[150px]">{user.fullName}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      user.role === 'ROLE_ADMIN' ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B]' : 'bg-[#B9975B]/15 text-[#9F7F45]'
                    }`}>
                      {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Buyer'}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-2 text-xs font-bold text-[#B9975B] bg-[#171717] rounded-xl px-3 border border-[#B9975B]"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#B9975B]" />
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
                <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-semibold rounded-full border border-[#E5E0D8] text-[#171717] hover:bg-[#F4F0E8]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold btn-gold"
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
