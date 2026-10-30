import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { VehicleSummary } from '../../types';
import { CategoryBadge, FuelBadge } from '../common/Badge';
import { formatIndianPrice } from '../../utils/formatters';
import { GitCompare, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

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
    <section className="py-20 bg-white border-b border-[#E5E0D8] relative overflow-hidden text-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight font-heading">
              Trending Vehicles in India
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl font-body">
              Curated cars, motorcycles, and EVs with authenticated on-road pricing, real-world Indian road tests, and certified safety metrics.
            </p>
          </div>

          {/* Luxury Filter Tabs */}
          <div className="flex items-center p-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] shadow-xs self-start md:self-auto font-heading">
            {(['ALL', 'CAR', 'MOTORCYCLE', 'EV'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-[#171717] hover:bg-white'
                }`}
              >
                {tab === 'ALL' ? 'All Popular' : tab === 'CAR' ? 'Cars' : tab === 'MOTORCYCLE' ? 'Motorcycles' : 'Electric EVs'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500 font-body">
            <Loader2 className="w-8 h-8 animate-spin text-[#B9975B] mb-3" />
            <p className="text-sm font-medium">Fetching verified vehicle catalogue from database...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3 font-body">
            <AlertCircle className="w-6 h-6 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold font-heading">Unable to load catalogue records</p>
              <p className="text-xs text-amber-700">{error}</p>
            </div>
          </div>
        )}

        {/* Vehicle Cards Grid in Luxury Styling */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="luxury-card overflow-hidden group flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div>
                  <div className="relative aspect-[16/10] bg-[#171717] overflow-hidden">
                    <img
                      src={vehicle.heroImageUrl}
                      alt={`${vehicle.brandName} ${vehicle.modelName}`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-transparent to-black/20 pointer-events-none" />
                    
                    {/* Top Category Badge */}
                    <div className="absolute top-3 left-3 z-10 font-heading">
                      <CategoryBadge category={vehicle.category} />
                    </div>

                    {vehicle.primaryKeySpec && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-[#E5E0D8] text-[#171717] px-2.5 py-1 rounded-xl text-xs font-bold tracking-wide shadow-sm z-10 font-heading">
                        {vehicle.primaryKeySpec}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-extrabold text-[#B9975B] tracking-wider uppercase text-[11px] font-heading">
                        {vehicle.brandName}
                      </span>
                      <span className="text-stone-500 font-semibold text-[11px] font-body">
                        {vehicle.variantCount} {vehicle.variantCount === 1 ? 'Variant' : 'Variants'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#B9975B] transition-colors font-heading">
                      <Link to={`/vehicles/${vehicle.id}`}>
                        {vehicle.brandName} {vehicle.modelName}
                      </Link>
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-body">
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
                  <div className="pt-4 border-t border-[#E5E0D8]">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider font-heading">
                          Est. On-Road (Delhi)
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-extrabold text-[#171717] tabular-numbers font-heading">
                            {formatIndianPrice(vehicle.startingOnRoadPrice)}
                          </span>
                          {vehicle.maxOnRoadPrice && vehicle.maxOnRoadPrice > vehicle.startingOnRoadPrice && (
                            <span className="text-xs text-stone-500 font-medium tabular-numbers font-body">
                              – {formatIndianPrice(vehicle.maxOnRoadPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Grid */}
                    <div className="grid grid-cols-2 gap-2 font-body">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="btn-gold text-xs py-2 px-3 text-center"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/compare?vehicle1=${vehicle.id}`}
                        className="btn-outline-gold text-xs py-2 px-3"
                      >
                        <GitCompare className="w-3.5 h-3.5 text-[#B9975B]" />
                        <span>Compare</span>
                      </Link>
                    </div>

                    <Link
                      to={`/where-to-buy?vehicleId=${vehicle.id}`}
                      className="mt-3 block text-center text-[11px] font-semibold text-stone-600 hover:text-[#B9975B] py-1 transition-colors font-body"
                    >
                      Find Authorized Dealerships
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
            className="btn-charcoal text-xs px-8 py-3.5 group inline-flex"
          >
            <span>Explore All 18+ Indian Vehicles in Catalogue</span>
            <ArrowRight className="w-4 h-4 text-[#B9975B] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
