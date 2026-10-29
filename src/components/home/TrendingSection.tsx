import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { VehicleSummary } from '../../types';
import { CategoryBadge, FuelBadge } from '../common/Badge';
import { formatIndianPrice } from '../../utils/formatters';
import { GitCompare, MapPin, ArrowRight, Loader2, AlertCircle, Sparkles, Award, ShieldCheck } from 'lucide-react';

export const TrendingSection: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CAR' | 'MOTORCYCLE' | 'EV'>('ALL');

  useEffect(() => {
    let isMounted = true;
    api.getTrendingVehicles()
      .then((data) => {
        if (isMounted) {
          setVehicles(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load trending vehicles');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CAR') return v.category === 'CAR';
    if (activeTab === 'MOTORCYCLE') return v.category === 'MOTORCYCLE';
    if (activeTab === 'EV') return v.category === 'ELECTRIC_CAR' || v.category === 'ELECTRIC_TWO_WHEELER';
    return true;
  });

  return (
    <section className="py-20 bg-[#fafbfc] border-b border-slate-200/80 relative overflow-hidden text-slate-900">
      {/* Mednix-style Subtle Background Ambience */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-rose-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Database-Backed Picks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
              Trending Vehicles in India
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl font-body">
              Curated cars, motorcycles, and EVs with authenticated on-road pricing, real-world Indian road tests, and certified safety metrics.
            </p>
          </div>

          {/* Mednix Filter Tabs */}
          <div className="flex items-center p-1 rounded-full bg-white border border-slate-200/90 shadow-2xs self-start md:self-auto">
            {(['ALL', 'CAR', 'MOTORCYCLE', 'EV'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab === 'ALL' ? 'All Popular' : tab === 'CAR' ? 'Cars' : tab === 'MOTORCYCLE' ? 'Motorcycles' : 'Electric EVs'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-9 h-9 animate-spin text-rose-600 mb-3" />
            <p className="text-sm font-medium">Fetching verified vehicle catalogue from database...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-semibold">Unable to load catalogue records</p>
              <p className="text-xs text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Vehicle Cards Grid (Mednix Card Pattern) */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="mednix-card overflow-hidden group flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div>
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <img
                      src={vehicle.heroImageUrl}
                      alt={`${vehicle.brandName} ${vehicle.modelName}`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />
                    
                    {/* Top Pill Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      <CategoryBadge category={vehicle.category} />
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-2xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {vehicle.primaryKeySpec && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 px-2.5 py-1 rounded-xl text-xs font-bold tracking-wide shadow-sm z-10">
                        {vehicle.primaryKeySpec}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-extrabold text-rose-600 tracking-wider uppercase text-[11px] font-heading">
                        {vehicle.brandName}
                      </span>
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {vehicle.variantCount} {vehicle.variantCount === 1 ? 'Variant' : 'Variants'}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-950 group-hover:text-rose-600 transition-colors font-heading">
                      <Link to={`/vehicles/${vehicle.id}`}>
                        {vehicle.brandName} {vehicle.modelName}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-body">
                      {vehicle.headline || `${vehicle.bodyStyle || ''} offering premium Indian road dynamics.`}
                    </p>

                    {/* Fuel Pills */}
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {vehicle.availableFuelTypes.map((fuel) => (
                        <FuelBadge key={fuel} fuel={fuel} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Pricing & Action Buttons */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Est. On-Road (Delhi)
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-extrabold text-slate-950">
                            {formatIndianPrice(vehicle.startingOnRoadPrice)}
                          </span>
                          {vehicle.maxOnRoadPrice && vehicle.maxOnRoadPrice > vehicle.startingOnRoadPrice && (
                            <span className="text-xs text-slate-500 font-medium">
                              – {formatIndianPrice(vehicle.maxOnRoadPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="btn-pill-primary text-xs py-2 px-3 text-center"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/compare?vehicle1=${vehicle.id}`}
                        className="btn-pill-outline text-xs py-2 px-3"
                      >
                        <GitCompare className="w-3.5 h-3.5 text-slate-400" />
                        <span>Compare</span>
                      </Link>
                    </div>

                    <Link
                      to={`/where-to-buy?vehicleId=${vehicle.id}`}
                      className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-rose-600 py-1 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>Find Authorized Dealerships</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/vehicles"
            className="btn-pill-dark text-xs px-8 py-3.5 group inline-flex"
          >
            <span>Explore All 18+ Indian Vehicles in Catalogue</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
