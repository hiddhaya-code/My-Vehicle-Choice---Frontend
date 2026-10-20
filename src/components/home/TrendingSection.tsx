import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { VehicleSummary } from '../../types';
import { CategoryBadge, FuelBadge } from '../common/Badge';
import { formatIndianPrice } from '../../utils/formatters';
import { GitCompare, MapPin, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';

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
    <section className="py-20 bg-gradient-to-b from-[#fff5f8] via-white to-[#fff0f4] border-b border-pink-100 relative overflow-hidden text-slate-900">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[400px] bg-pink-200/25 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Database-Backed Popular Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Trending Vehicles in India
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Curated cars, motorcycles, and EVs with authenticated on-road pricing, real-world Indian road tests, and certified safety metrics.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white border border-pink-200 shadow-sm">
            {(['ALL', 'CAR', 'MOTORCYCLE', 'EV'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50/60'
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
            <Loader2 className="w-9 h-9 animate-spin text-rose-500 mb-3" />
            <p className="text-sm font-medium">Fetching verified vehicle catalogue from MySQL...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-semibold">Unable to load catalogue records</p>
              <p className="text-xs text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group flex flex-col rounded-2xl glass-card border border-pink-200/80 overflow-hidden hover:border-rose-400 hover:shadow-[0_12px_40px_rgba(244,63,94,0.12)] transition-all duration-300 bg-white"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={vehicle.heroImageUrl}
                    alt={`${vehicle.brandName} ${vehicle.modelName}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <CategoryBadge category={vehicle.category} />
                  </div>
                  {vehicle.primaryKeySpec && (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-pink-200 text-rose-600 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide shadow-sm">
                      {vehicle.primaryKeySpec}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-bold text-rose-600 tracking-wider uppercase text-[11px]">{vehicle.brandName}</span>
                      <span className="text-slate-500 font-medium">{vehicle.variantCount} {vehicle.variantCount === 1 ? 'Variant' : 'Variants'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      <Link to={`/vehicles/${vehicle.id}`}>
                        {vehicle.brandName} {vehicle.modelName}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {vehicle.headline || `${vehicle.bodyStyle || ''} offering premium Indian road dynamics.`}
                    </p>

                    {/* Fuels */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {vehicle.availableFuelTypes.map((fuel) => (
                        <FuelBadge key={fuel} fuel={fuel} />
                      ))}
                    </div>
                  </div>

                  {/* Pricing info */}
                  <div className="mt-5 pt-4 border-t border-pink-100">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Est. On-Road Price (Delhi)
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-extrabold text-rose-600">
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

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="text-center py-2.5 px-3 rounded-xl btn-galaxy-primary text-white text-xs font-bold shadow-sm transition-all"
                      >
                        View Specs
                      </Link>

                      <Link
                        to={`/compare?vehicle1=${vehicle.id}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all shadow-sm"
                      >
                        <GitCompare className="w-3.5 h-3.5 text-rose-500" />
                        <span>Compare</span>
                      </Link>
                    </div>

                    <Link
                      to={`/where-to-buy?vehicleId=${vehicle.id}`}
                      className="mt-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-rose-600 py-1 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>Find Authorized Dealers & Quotes</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card border border-pink-300 hover:border-rose-400 text-rose-600 hover:text-rose-700 font-bold text-xs shadow-md hover:shadow-lg transition-all group bg-white"
          >
            <span>Explore All 18+ Indian Vehicles in Catalogue</span>
            <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
