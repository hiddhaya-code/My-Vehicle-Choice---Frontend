import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#fff0f4] text-slate-600 border-t border-pink-200 mt-auto text-sm relative overflow-hidden">
      {/* Radiant very light pink ambient glow */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[200px] bg-pink-300/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <BrandLogo size="sm" showText={true} />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find the right vehicle. Compare confidently. Buy wisely. Dedicated automotive comparison and intelligent recommendation platform for India.
            </p>
            <div className="flex items-center space-x-2 text-xs text-rose-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>SIAM & Official Manufacturer Data Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-3">Explore Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/vehicles?category=CAR" className="hover:text-rose-600 transition-colors">
                  Cars & Compact SUVs
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=MOTORCYCLE" className="hover:text-rose-600 transition-colors">
                  Motorcycles & Streetfighters
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_CAR" className="hover:text-rose-600 transition-colors">
                  Electric Cars & Long-Range EVs
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_TWO_WHEELER" className="hover:text-rose-600 transition-colors">
                  Electric Scooters & 2-Wheelers
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-3">Decision Tools</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/find-my-vehicle" className="hover:text-rose-700 transition-colors text-rose-600 font-bold">
                  Find My Vehicle Wizard
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-rose-600 transition-colors">
                  Direct Vehicle Comparison
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="hover:text-rose-600 transition-colors">
                  Loan EMI & TCO Calculators
                </Link>
              </li>
              <li>
                <Link to="/where-to-buy" className="hover:text-rose-600 transition-colors">
                  Authorized Dealer Locator
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-rose-600 transition-colors">
                  Budget-Based Vehicle Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Disclaimer */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-3">Pricing & Verification</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              *All vehicle prices are shown in INR (₹). Estimated on-road prices are calculated based on representative Delhi RTO tax slabs, mandatory third-party insurance, and baseline registration fees.
            </p>
            <div className="mt-3 text-[11px] text-slate-500">
              API Documentation:{' '}
              <a
                href="http://localhost:8080/swagger-ui.html"
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 font-bold"
              >
                Swagger OpenAPI <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-pink-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MyVehicleChoice. Made with precision for Indian automobile buyers.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Data Sources</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
