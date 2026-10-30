import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <section className="py-20 bg-[#FAF8F5] border-b border-[#E5E0D8] relative overflow-hidden text-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Treatment */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight font-heading">
            Explore by Vehicle Category
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 font-body">
            Every category features verified homologation specifications, ARAI test metrics, and certified Indian road pricing.
          </p>
        </div>

        {/* 4 Luxury Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/vehicles?category=${cat.id}`)}
                className="luxury-card overflow-hidden group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#171717]">
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/85 via-[#171717]/25 to-transparent" />
                    
                    {/* Top Pill Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#171717]/90 backdrop-blur-md text-[#B9975B] border border-[#B9975B]/40 font-heading">
                        {cat.badge}
                      </span>
                    </div>

                    {/* Category Icon */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 font-heading">
                      <div className="w-8 h-8 rounded-full bg-[#B9975B] text-[#171717] flex items-center justify-center shadow-md">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white drop-shadow-sm tabular-numbers">
                        {cat.stats}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#B9975B] transition-colors font-heading">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-body">
                      {cat.description}
                    </p>
                    <div className="pt-1 text-[11px] font-semibold text-stone-500 font-body">
                      <span className="text-[#171717] font-bold">Popular: </span>
                      {cat.models}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0">
                  <div className="w-full py-2.5 px-4 rounded-full bg-[#FAF8F5] group-hover:bg-[#B9975B]/15 border border-[#E5E0D8] group-hover:border-[#B9975B] text-[#171717] group-hover:text-[#B9975B] text-xs font-semibold transition-all flex items-center justify-between font-heading">
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#171717] hover:text-[#B9975B] bg-white hover:bg-[#FAF8F5] px-6 py-3 rounded-full border border-[#E5E0D8] hover:border-[#B9975B] transition-all cursor-pointer shadow-xs font-heading"
          >
            <ShieldCheck className="w-4 h-4 text-[#B9975B]" />
            <span>Browse All 18+ Homologated Models Across India</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
