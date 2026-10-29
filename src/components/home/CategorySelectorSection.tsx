import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { VehicleCategory } from '../../types';

interface CategoryCardItem {
  id: VehicleCategory;
  title: string;
  badge: string;
  description: string;
  models: string;
  stats: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: 'CAR',
    title: 'Cars & Compact SUVs',
    badge: 'Hatchbacks, Sedans & SUVs',
    description: 'From 5-star crash-tested compact SUVs to high-performance executive sedans and family haulers.',
    models: 'Nexon, Creta, XUV700, Brezza, BMW 330Li',
    stats: 'Starting at ₹7.99 Lakh',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    icon: Car,
  },
  {
    id: 'MOTORCYCLE',
    title: 'Motorcycles',
    badge: 'Street, Sport & Cruisers',
    description: 'Track-bred supersport machines, neo-retro roadsters, and daily fuel-efficient commuter bikes.',
    models: 'Yamaha R15, RE Hunter 350, KTM Duke 200',
    stats: 'Up to 51.4 km/l mileage',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    icon: Bike,
  },
  {
    id: 'SCOOTER',
    title: 'Family Scooters',
    badge: 'Automatic City CVTs',
    description: 'Reliable, comfortable step-through commuters with generous under-seat storage and telescopic suspension.',
    models: 'Honda Activa 6G, TVS Jupiter 125, Access',
    stats: 'Starting at ₹76,000',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    icon: Bike,
  },
  {
    id: 'ELECTRIC_CAR',
    title: 'Electric Vehicles (EVs)',
    badge: 'Zero Emission Mobility',
    description: 'Next-generation electric cars and connected smart scooters with fast charging and ultra-low running costs.',
    models: 'Tata Nexon.ev, Ola S1 Pro Gen 2',
    stats: '₹0.85/km running cost • 465 km Range',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    icon: Zap,
  },
];

export const CategorySelectorSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
      {/* Mednix Subtle Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-slate-100/60 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Treatment (Mednix Pre-title + Title + Subtitle) */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Automotive Taxonomy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
            Explore by Vehicle Category
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 font-body">
            Every category features verified homologation specifications, ARAI test metrics, and certified Indian road pricing.
          </p>
        </div>

        {/* 4 Mednix-style Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/vehicles?category=${cat.id}`)}
                className="mednix-card overflow-hidden group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Top Pill Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 backdrop-blur-md text-slate-900 shadow-sm">
                        {cat.badge}
                      </span>
                    </div>

                    {/* Category Icon */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white drop-shadow-sm">
                        {cat.stats}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors font-heading">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-body">
                      {cat.description}
                    </p>
                    <div className="pt-1 text-[11px] font-semibold text-slate-400">
                      <span className="text-slate-600 font-bold">Popular: </span>
                      {cat.models}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0">
                  <div className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-rose-50 border border-slate-200/80 group-hover:border-rose-200 text-slate-800 group-hover:text-rose-600 text-xs font-bold transition-all flex items-center justify-between">
                    <span>Explore {cat.title.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Catalogue Link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/vehicles')}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 px-5 py-2.5 rounded-full border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Browse All 18+ Homologated Models Across India</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
