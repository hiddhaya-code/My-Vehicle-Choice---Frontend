import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Brand, PageResponse, VehicleCategory, VehicleSummary } from '../types';
import { CategoryBadge, FuelBadge } from '../components/common/Badge';
import { formatIndianPrice } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  GitCompare, 
  Loader2, 
  AlertCircle, 
  RotateCcw,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isWishlisted, toggleWishlist } = useAuth();

  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state initialized from URL params
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState<VehicleCategory | ''>(
    (searchParams.get('category') as VehicleCategory) || ''
  );
  const [brandId, setBrandId] = useState<string>(searchParams.get('brandId') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');

  // Load brands list for filter
  useEffect(() => {
    api.getBrands().then(setBrands).catch(console.error);
  }, []);

  // Fetch vehicles whenever searchParams change
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {
      query: searchParams.get('query') || undefined,
      category: (searchParams.get('category') as VehicleCategory) || undefined,
      brandId: searchParams.get('brandId') ? Number(searchParams.get('brandId')) : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      page: 0,
      size: 30,
    };

    api.getVehicles(params)
      .then((data: PageResponse<VehicleSummary>) => {
        setVehicles(data.content);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || 'Error fetching vehicle catalogue');
        setLoading(false);
      });
  }, [searchParams]);

  const applyFilters = () => {
    const nextParams = new URLSearchParams();
    if (query.trim()) nextParams.set('query', query.trim());
    if (category) nextParams.set('category', category);
    if (brandId) nextParams.set('brandId', brandId);
    if (maxPrice) nextParams.set('maxPrice', maxPrice);
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setBrandId('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-transparent py-10 relative overflow-hidden text-slate-900">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center text-xs text-slate-500 gap-2 mb-2">
            <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-rose-600 font-semibold">Explore Vehicles</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Indian Garage</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Indian Vehicle Catalogue
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Browse verified cars, motorcycles, scooters, and electric vehicles with official road test specs and Delhi on-road price estimates.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-card rounded-2xl p-5 shadow-lg mb-8 border border-pink-200/80 bg-white/95">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Search Model</label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="e.g. Nexon, Hunter, XUV700..."
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VehicleCategory | '')}
                className="w-full px-3 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 transition-all"
              >
                <option value="">All Categories</option>
                <option value="CAR">Car / SUV</option>
                <option value="MOTORCYCLE">Motorcycle</option>
                <option value="SCOOTER">Scooter</option>
                <option value="ELECTRIC_CAR">Electric Car</option>
                <option value="ELECTRIC_TWO_WHEELER">Electric 2-Wheeler</option>
              </select>
            </div>

            {/* Brand Select */}
            <div>
              <label className="block text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Manufacturer</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 transition-all"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id.toString()}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Max Budget (₹)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 1500000"
                step={50000}
                className="w-full px-3 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 py-2.5 px-4 rounded-xl btn-galaxy-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Apply Filter</span>
              </button>
              <button
                onClick={resetFilters}
                title="Reset Filters"
                className="p-2.5 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-9 h-9 animate-spin text-rose-500 mb-3" />
            <p className="text-sm font-medium">Filtering catalogue records from MySQL...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-semibold">Unable to fetch vehicles</p>
              <p className="text-xs text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl p-8 border border-pink-200/80 bg-white">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center mb-3 border border-pink-200">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching vehicles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              We couldn't find any vehicle matching your current filter criteria. Try expanding your price limit or clearing specific brand filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-5 py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        {!loading && !error && vehicles.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6 text-xs text-slate-500 font-medium">
              <span>Showing <strong className="text-rose-600 font-bold">{vehicles.length}</strong> verified Indian vehicles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="group flex flex-col rounded-2xl glass-card border border-pink-200/80 overflow-hidden hover:border-rose-400 hover:shadow-[0_12px_40px_rgba(244,63,94,0.12)] transition-all duration-300 bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={vehicle.heroImageUrl}
                      alt={`${vehicle.brandName} ${vehicle.modelName}`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <CategoryBadge category={vehicle.category} />
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(vehicle.id);
                      }}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all z-10 cursor-pointer ${
                        isWishlisted(vehicle.id)
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white/80 text-slate-700 hover:text-white hover:bg-rose-600 border border-pink-200'
                      }`}
                      title={isWishlisted(vehicle.id) ? 'Remove from Saved' : 'Save to Shortlist'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isWishlisted(vehicle.id) ? 'fill-current' : ''}`} />
                    </button>
                    {vehicle.primaryKeySpec && (
                      <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md border border-pink-200 text-rose-600 px-2 py-0.5 rounded-lg text-[11px] font-bold shadow-sm">
                        {vehicle.primaryKeySpec}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mb-1">
                        {vehicle.brandName}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                        <Link to={`/vehicles/${vehicle.id}`}>
                          {vehicle.modelName}
                        </Link>
                      </h3>

                      {/* Fuel Types */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {vehicle.availableFuelTypes.map((fuel: string) => (
                          <FuelBadge key={fuel} fuel={fuel} />
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mt-4 pt-3 border-t border-pink-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Est. On-Road (Delhi)
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-extrabold text-rose-600">
                          {formatIndianPrice(vehicle.startingOnRoadPrice)}
                        </span>
                        {vehicle.maxOnRoadPrice && vehicle.maxOnRoadPrice > vehicle.startingOnRoadPrice && (
                          <span className="text-xs text-slate-500">
                            – {formatIndianPrice(vehicle.maxOnRoadPrice)}
                          </span>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-pink-100">
                        <Link
                          to={`/vehicles/${vehicle.id}`}
                          className="text-center py-2 px-3 rounded-xl btn-galaxy-primary text-white text-xs font-bold shadow-sm transition-all"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/compare?vehicle1=${vehicle.id}`}
                          className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all shadow-sm"
                        >
                          <GitCompare className="w-3 h-3 text-rose-500" />
                          <span>Compare</span>
                        </Link>
                      </div>

                      <Link
                        to={`/where-to-buy?vehicleId=${vehicle.id}&brandId=${vehicle.brandId}&category=${vehicle.category}`}
                        className="mt-2.5 text-center text-[11px] font-semibold text-slate-600 hover:text-rose-600 py-0.5 block transition-colors"
                      >
                        Where to Buy & Dealers →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
