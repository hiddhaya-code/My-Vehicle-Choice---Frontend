import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Compass, 
  GitCompare, 
  Calculator, 
  MapPin,
  Car,
  Bike,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0b132b] text-slate-400 mt-20 pt-16 pb-12 rounded-t-[36px] sm:rounded-t-[48px] border-t border-slate-800 overflow-hidden shadow-2xl">
      {/* Mednix-style Ambient Glow in Dark Curved Footer */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-rose-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[500px] h-[250px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Feature Bar inside Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">SIAM & ARAI Verified</h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Homologated Indian market vehicle specifications, ARAI tested mileage, and certified battery outputs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">100% Unbiased Intelligence</h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Zero sponsored vehicle rankings or paid showroom promotions. Pure mathematical fit scoring.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">Official OEM Authorized Dealers</h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Direct connections to certified manufacturer showrooms across Delhi, Mumbai, Bengaluru, and Chennai.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info (2 columns on md) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none font-heading">
                    MyVehicle<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">Choice</span>
                  </span>
                  <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold mt-1">
                    Make Every Vehicle Decision Count
                  </p>
                </div>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier independent automotive decision platform. Compare passenger cars, motorcycles, family scooters, and electric vehicles with transparent on-road pricing and 5-year ownership analytics.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-300">Brand Authorization:</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                Active & Certified
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 font-heading">
              Vehicle Catalogue
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/vehicles?category=CAR" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cars & SUVs</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=MOTORCYCLE" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-rose-500" />
                  <span>Motorcycles</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=SCOOTER" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-rose-500" />
                  <span>Family Scooters</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_CAR" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Electric Cars</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_TWO_WHEELER" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Electric 2-Wheelers</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Decision Tools */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 font-heading">
              Decision Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/find-my-vehicle" className="text-rose-400 hover:text-rose-300 font-bold transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Find My Vehicle Wizard</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <GitCompare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Side-by-Side Compare</span>
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-slate-500" />
                  <span>Loan EMI & TCO Calc</span>
                </Link>
              </li>
              <li>
                <Link to="/where-to-buy" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Verified Dealer Locator</span>
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <span>Saved Comparisons</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Pricing & Transparency Notice */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 font-heading">
              Pricing & Compliance
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              *All vehicle prices are shown in Indian Rupees (₹). Estimated on-road prices are calculated based on representative Delhi RTO tax slabs, mandatory third-party liability insurance, and registration charges.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dealer quotes and test drive bookings are fulfilled exclusively by authorized OEM dealerships verified against official manufacturer locators.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MyVehicleChoice. All rights reserved. Indian Automotive Decision Engine.</p>
          <div className="flex items-center space-x-6">
            <Link to="/vehicles" className="hover:text-slate-300 transition-colors">
              Vehicle Catalogue
            </Link>
            <Link to="/find-my-vehicle" className="hover:text-slate-300 transition-colors">
              Recommendation Engine
            </Link>
            <Link to="/where-to-buy" className="hover:text-slate-300 transition-colors">
              Dealer Network
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Made with precision for Indian car & bike buyers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
