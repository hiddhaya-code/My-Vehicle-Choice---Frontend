import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Car, Trash2, GitCompare, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VehicleSummary } from '../types';
import { formatPriceINR } from '../utils/formatters';

export const SavedVehiclesPage: React.FC = () => {
  const { isAuthenticated, wishlistVehicleIds, toggleWishlist } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [wishlistRes, comparisonsRes] = await Promise.all([
          api.getWishlist(),
          api.getSavedComparisons().catch(() => []),
        ]);
        setVehicles(wishlistRes);
        setSavedComparisons(comparisonsRes);
      } catch (err) {
        console.error('Failed to load saved items:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, wishlistVehicleIds.length]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-transparent py-20 px-4 text-center text-slate-900 relative overflow-hidden">
        <div className="max-w-md mx-auto glass-card p-8 rounded-3xl border border-pink-200/80 shadow-xl bg-white relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 mx-auto flex items-center justify-center mb-6">
            <Bookmark className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Save Your Favourite Vehicles</h1>
          <p className="text-slate-600 text-xs mb-8 leading-relaxed">
            Sign in or create a free account to shortlist cars, bikes, compare variants, and track price changes across verified dealerships.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl btn-galaxy-primary text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
            >
              Sign In to View Saved
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-white border border-pink-200 text-slate-700 hover:border-rose-400 font-bold text-xs transition-all shadow-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-pink-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Saved Garage</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Bookmark className="w-7 h-7 text-rose-500" />
              <span>Your Saved Vehicles & Shortlists</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage your shortlisted vehicles, check on-road price updates, and trigger instant comparisons.
            </p>
          </div>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-rose-600 text-xs font-bold shadow-sm self-start md:self-auto transition-all"
          >
            <Compass className="w-4 h-4 text-rose-500" />
            <span>Browse More Vehicles</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-slate-500 text-sm">Loading your saved shortlist from MySQL...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="glass-card rounded-3xl border border-pink-200/80 p-12 text-center max-w-xl mx-auto shadow-xl bg-white">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">No Vehicles Shortlisted Yet</h2>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed">
              Explore our verified catalogue or run the "Find My Vehicle" questionnaire to discover cars and bikes that match your exact budget.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/find-my-vehicle"
                className="px-5 py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                Start Recommendation Wizard
              </Link>
              <Link
                to="/vehicles"
                className="px-5 py-2.5 rounded-xl bg-white border border-pink-200 text-slate-700 hover:border-rose-400 font-bold text-xs transition-all shadow-sm"
              >
                Explore Catalogue
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="group flex flex-col rounded-2xl glass-card border border-pink-200/80 overflow-hidden hover:border-rose-400 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={v.heroImageUrl}
                    alt={v.modelName}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                  <button
                    onClick={() => toggleWishlist(v.id)}
                    title="Remove from saved"
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white text-rose-500 hover:bg-rose-50 shadow-md transition-colors cursor-pointer border border-pink-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur border border-pink-200 text-rose-600 text-[10px] font-bold tracking-wide shadow-sm">
                    {v.brandName}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-rose-600 transition-colors">
                      {v.modelName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                      {v.headline || `${v.brandName} ${v.modelName} with ${v.variantCount} variants`}
                    </p>

                    <div className="flex items-baseline justify-between py-3 border-y border-pink-100 mb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                          Est. On-Road
                        </span>
                        <span className="text-base font-extrabold text-rose-600">
                          {formatPriceINR(v.startingOnRoadPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                          Ex-Showroom
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {formatPriceINR(v.startingExShowroomPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to={`/vehicles/${v.id}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl btn-galaxy-primary text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <span>View Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/compare?v1=${v.id}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 text-xs font-semibold shadow-sm transition-all"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-rose-500" />
                      <span>Compare</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
