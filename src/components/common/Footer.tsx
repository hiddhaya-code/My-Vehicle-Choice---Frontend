import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  GitCompare, 
  Calculator, 
  Car, 
  Bike, 
  Zap 
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#171717] text-stone-400 mt-20 pt-16 pb-12 rounded-t-[36px] sm:rounded-t-[48px] border-t border-[#2E2E2E] overflow-hidden shadow-2xl font-body">
      {/* Subtle Warm Champagne Ambient Lighting */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-[#B9975B]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Feature Bar inside Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-[#2E2E2E]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#B9975B]/10 border border-[#B9975B]/30 text-[#B9975B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm font-heading">SIAM & ARAI Verified</h5>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Homologated Indian market vehicle specifications, ARAI tested mileage, and certified battery outputs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#B9975B]/10 border border-[#B9975B]/30 text-[#B9975B] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm font-heading">100% Unbiased Intelligence</h5>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Zero sponsored vehicle rankings or paid showroom promotions. Pure mathematical fit scoring.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#B9975B]/10 border border-[#B9975B]/30 text-[#B9975B] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm font-heading">Official OEM Authorized Dealers</h5>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Direct connections to certified manufacturer showrooms across Delhi, Mumbai, Bengaluru, and Chennai.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#2E2E2E]">
          {/* Brand Info (2 columns on md) - Uses exact approved BrandLogo */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo size="md" variant="dark" />
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              India's premier independent luxury automotive decision platform. Compare passenger cars, motorcycles, family scooters, and electric vehicles with transparent on-road pricing and 5-year ownership analytics.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-[11px] font-bold text-stone-300 font-heading">Brand Authorization:</span>
              <span className="text-[10px] font-semibold text-[#B9975B] bg-[#B9975B]/10 border border-[#B9975B]/30 px-2.5 py-1 rounded-full font-heading">
                Active & Certified
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 font-heading">
              Vehicle Catalogue
            </h4>
            <ul className="space-y-2.5 text-xs font-body">
              <li>
                <Link to="/vehicles?category=CAR" className="hover:text-[#B9975B] transition-colors flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>Cars & SUVs</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=MOTORCYCLE" className="hover:text-[#B9975B] transition-colors flex items-center gap-2">
                  <Bike className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>Motorcycles</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=SCOOTER" className="hover:text-[#B9975B] transition-colors flex items-center gap-2">
                  <Bike className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>Family Scooters</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_CAR" className="hover:text-[#B9975B] transition-colors flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>Electric Cars</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_TWO_WHEELER" className="hover:text-[#B9975B] transition-colors flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>Electric 2-Wheelers</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Decision Tools */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 font-heading">
              Decision Tools
            </h4>
            <ul className="space-y-2.5 text-xs font-body">
              <li>
                <Link to="/find-my-vehicle" className="text-[#B9975B] hover:text-[#C9AB75] font-semibold transition-colors flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Find My Vehicle Wizard</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#B9975B] transition-colors flex items-center gap-2">
                  <GitCompare className="w-3.5 h-3.5 text-stone-500" />
                  <span>Side-by-Side Compare</span>
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="hover:text-[#B9975B] transition-colors flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5 text-stone-500" />
                  <span>Loan EMI & TCO Calc</span>
                </Link>
              </li>
              <li>
                <Link to="/where-to-buy" className="hover:text-[#B9975B] transition-colors flex items-center">
                  <span>Verified Dealer Locator</span>
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-[#B9975B] transition-colors flex items-center">
                  <span>Saved Comparisons</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Pricing & Transparency Notice */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 font-heading">
              Pricing & Compliance
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mb-3 font-body">
              *All vehicle prices are shown in Indian Rupees (₹). Estimated on-road prices are calculated based on representative Delhi RTO tax slabs, mandatory third-party liability insurance, and registration charges.
            </p>
            <p className="text-[11px] text-stone-400 leading-relaxed font-body">
              Dealer quotes and test drive bookings are fulfilled exclusively by authorized OEM dealerships verified against official manufacturer locators.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-body">
          <p>© {new Date().getFullYear()} MyVehicleChoice. All rights reserved. Luxury Indian Automotive Decision Platform.</p>
          <div className="flex items-center space-x-6">
            <Link to="/vehicles" className="hover:text-stone-300 transition-colors">
              Vehicle Catalogue
            </Link>
            <Link to="/find-my-vehicle" className="hover:text-stone-300 transition-colors">
              Recommendation Engine
            </Link>
            <Link to="/where-to-buy" className="hover:text-stone-300 transition-colors">
              Dealer Network
            </Link>
            <span className="text-stone-700">|</span>
            <span className="text-stone-400">
              Made with precision for Indian car & bike buyers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
