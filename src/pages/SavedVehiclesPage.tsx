import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Car, Trash2, GitCompare, ArrowRight, Compass } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F4F0E8] py-20 px-4 text-center text-[#171717] relative overflow-hidden">
        <div className="max-w-md mx-auto luxury-card p-8 rounded-3xl relative z-10 font-body">
          <div className="w-16 h-16 rounded-2xl bg-[#B9975B]/15 border border-[#B9975B]/30 text-[#8C6F37] mx-auto flex items-center justify-center mb-6">
            <Bookmark className="w-8 h-8 text-[#B9975B]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#171717] mb-2 font-heading">Save Your Favourite Vehicles</h1>
          <p className="text-neutral-600 text-xs mb-8 leading-relaxed">
            Sign in or create a free account to shortlist cars, bikes, compare variants, and track price changes across verified dealerships.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl btn-gold text-xs font-bold shadow-md transition-all font-heading"
            >
              Sign In to View Saved
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl btn-outline-gold font-bold text-xs transition-all shadow-sm font-heading"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0E8] py-10 px-4 sm:px-6 lg:px-8 text-[#171717] relative overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#171717]/10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] flex items-center gap-3 font-heading">
              <Bookmark className="w-8 h-8 text-[#B9975B]" />
              <span>Your Saved Vehicles & Shortlists</span>
            </h1>
            <p className="text-neutral-600 text-sm mt-1 font-body">
              Manage your shortlisted vehicles, check on-road price updates, and trigger instant comparisons.
            </p>
          </div>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-outline-gold text-xs font-bold shadow-sm self-start md:self-auto transition-all font-body"
          >
            <Compass className="w-4 h-4 text-[#B9975B]" />
            <span>Browse More Vehicles</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center font-body">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B9975B] mx-auto mb-4"></div>
            <p className="text-neutral-500 text-sm font-medium">Loading your saved shortlist from MySQL...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="luxury-card rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xl font-body">
            <div className="w-16 h-16 rounded-2xl bg-[#B9975B]/15 border border-[#B9975B]/30 text-[#8C6F37] mx-auto flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-[#B9975B]" />
            </div>
            <h2 className="text-lg font-bold text-[#171717] mb-2 font-heading">No Vehicles Shortlisted Yet</h2>
            <p className="text-neutral-500 text-xs mb-6 leading-relaxed">
              Explore our verified catalogue or run the "Find My Vehicle" questionnaire to discover cars and bikes that match your exact budget.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/find-my-vehicle"
                className="px-5 py-2.5 rounded-xl btn-gold text-xs font-bold shadow-md transition-all font-heading"
              >
                Start Recommendation Wizard
              </Link>
              <Link
                to="/vehicles"
                className="px-5 py-2.5 rounded-xl btn-outline-gold font-bold text-xs transition-all shadow-sm font-heading"
              >
                Explore Catalogue
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="group flex flex-col rounded-2xl luxury-card overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                  <img
                    src={v.heroImageUrl}
                    alt={v.modelName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                  <button
                    onClick={() => toggleWishlist(v.id)}
                    title="Remove from saved"
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white text-neutral-600 hover:text-red-600 shadow-md transition-colors cursor-pointer border border-[#171717]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#171717] text-[#B9975B] border border-[#B9975B]/30 text-[10px] font-bold tracking-wide shadow-sm font-heading">
                    {v.brandName}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#171717] mb-1 group-hover:text-[#8C6F37] transition-colors font-heading">
                      {v.modelName}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-1 mb-3">
                      {v.headline || `${v.brandName} ${v.modelName} with ${v.variantCount} variants`}
                    </p>

                    <div className="flex items-baseline justify-between py-3 border-y border-[#171717]/10 mb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block font-heading">
                          Est. On-Road
                        </span>
                        <span className="text-base font-extrabold text-[#171717] tabular-nums font-heading">
                          {formatPriceINR(v.startingOnRoadPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block font-heading">
                          Ex-Showroom
                        </span>
                        <span className="text-xs text-neutral-600 font-medium tabular-nums">
                          {formatPriceINR(v.startingExShowroomPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to={`/vehicles/${v.id}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl btn-gold text-xs font-bold shadow-sm transition-all"
                    >
                      <span>View Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/compare?v1=${v.id}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl btn-outline-gold text-xs font-semibold shadow-sm transition-all"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-[#B9975B]" />
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
