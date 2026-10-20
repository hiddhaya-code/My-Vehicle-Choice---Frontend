import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Zap, Compass, ChevronRight } from 'lucide-react';
import { VehicleCategory } from '../../types';

interface CategoryCard {
  id: VehicleCategory | 'ANY';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  count: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'CAR',
    title: 'Cars & Compact SUVs',
    subtitle: 'Nexon, Creta, XUV700, Thar, Brezza & Sedans',
    icon: Car,
    tag: 'Turbo & Hybrid',
    count: '9+ Models',
  },
  {
    id: 'MOTORCYCLE',
    title: 'Motorcycles',
    subtitle: 'Hunter 350, R15 V4, Duke 200, Classic 350 & Apache',
    icon: Bike,
    tag: '150cc – 350cc',
    count: '6+ Models',
  },
  {
    id: 'SCOOTER',
    title: 'Family Scooters',
    subtitle: 'Activa 6G, Jupiter & Convenient automatic CVTs',
    icon: Bike,
    tag: '110cc – 125cc',
    count: '2+ Models',
  },
  {
    id: 'ELECTRIC_CAR',
    title: 'Electric Cars',
    subtitle: 'Tata Nexon.ev & High efficiency zero-emission SUVs',
    icon: Zap,
    tag: '465 km Long Range',
    count: 'Fast DC Charging',
  },
  {
    id: 'ELECTRIC_TWO_WHEELER',
    title: 'Electric 2-Wheelers',
    subtitle: 'Ola S1 Pro Gen 2 & High-torque smart EV scooters',
    icon: Zap,
    tag: '195 km Range',
    count: '120 km/h Top Speed',
  },
  {
    id: 'ANY',
    title: 'All Vehicle Classes',
    subtitle: 'Full verified Indian garage across all segments',
    icon: Compass,
    tag: 'Unified Index',
    count: '18+ Verified Models',
  },
];

export const CategorySelectorSection: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (cat: VehicleCategory | 'ANY') => {
    if (cat === 'ANY') {
      navigate('/vehicles');
    } else {
      navigate(`/vehicles?category=${cat}`);
    }
  };

  return (
    <section className="py-16 bg-white border-b border-pink-100 relative overflow-hidden text-slate-900">
      {/* Radiant very light pink ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-pink-200/20 blur-[130px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            Vehicle Taxonomy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Choose Your Vehicle Category
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every category features verified specifications, real-world Indian road mileage, and authenticated pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group p-5 rounded-2xl glass-card border border-pink-200/80 hover:border-rose-400 hover:shadow-[0_12px_35px_rgba(244,63,94,0.12)] transition-all duration-300 text-left flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden bg-white/95"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 group-hover:border-rose-400 text-rose-600 flex items-center justify-center transition-all group-hover:scale-110">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {cat.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-rose-600 transition-colors">
                  <span>{cat.count}</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
