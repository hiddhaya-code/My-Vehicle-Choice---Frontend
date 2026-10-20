import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  GitCompare, 
  Bookmark, 
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Info,
  ShieldCheck,
  Wallet,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RecommendationResponse, RecommendationResult } from '../types';
import { formatPriceINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const RecommendationResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useAuth();

  const [data, setData] = useState<{
    response: RecommendationResponse;
    answers: any;
    guestName?: string;
  } | null>(null);

  useEffect(() => {
    if (location.state && (location.state as any).response) {
      setData(location.state as any);
    } else {
      const cached = sessionStorage.getItem('mvc_recommendation_results');
      if (cached) {
        try {
          setData(JSON.parse(cached));
        } catch (e) {
          navigate('/find-my-vehicle');
        }
      } else {
        navigate('/find-my-vehicle');
      }
    }
  }, [location.state, navigate]);

  if (!data) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const { response, answers, guestName } = data;
  const matches = response.matchedResults || [];
  const nearMatches = response.nearMatchResults || [];

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-pink-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Category Recommendation Engine • Verified Audit Quality</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {guestName ? `Recommended Vehicles for ${guestName}` : 'Your Personalized Vehicle Recommendations'}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Every match includes deterministic scoring, category-tailored specifications, transparent trade-offs, and 5-year ownership affordability math.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {matches.length >= 2 && (
              <Link
                to={`/compare?v1=${matches[0].vehicle.id}&v2=${matches[1].vehicle.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Top 2 Matches</span>
              </Link>
            )}
            <Link
              to="/find-my-vehicle"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-pink-300 hover:border-rose-400 text-rose-600 text-xs font-bold shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adjust Criteria</span>
            </Link>
          </div>
        </div>

        {/* User Search Profile Pill */}
        <div className="p-4 rounded-2xl glass-card border border-pink-200/80 bg-white/95 flex flex-wrap items-center justify-between gap-4 text-xs shadow-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-rose-600">Your Search Profile:</span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              Budget: {formatPriceINR(answers.budgetAmount)} ({answers.budgetType === 'EMI' ? 'Monthly EMI' : 'Total On-Road'})
            </span>
            {answers.isStrictBudget && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                Strict Budget Ceiling
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-pink-200 font-medium">
              {answers.category?.replace(/_/g, ' ')} {answers.bodyStyle ? `• ${answers.bodyStyle}` : ''}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-pink-200 font-medium">
              City: {answers.city || 'New Delhi'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-pink-200 font-medium">
              {answers.dailyDistanceKm} km/day commute
            </span>
          </div>
          <div className="text-slate-600 font-medium">
            Found <strong className="text-rose-600 font-bold">{matches.length}</strong> qualified top {matches.length === 1 ? 'match' : 'matches'}
          </div>
        </div>

        {/* Unmatched Constraint Notes if any */}
        {response.unmatchedConstraintNotes && response.unmatchedConstraintNotes.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-900 text-xs space-y-1.5 shadow-sm">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Deterministic Filtering Notes:</span>
            </div>
            {response.unmatchedConstraintNotes.map((note, idx) => (
              <p key={idx} className="text-slate-700 pl-5 leading-relaxed">• {note}</p>
            ))}
          </div>
        )}

        {/* Matched Vehicles List */}
        {matches.length === 0 ? (
          <div className="py-16 text-center glass-card rounded-2xl border border-pink-200/80 bg-white p-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Vehicles Satisfied All Hard Constraints</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Your strict budget or powertrain non-negotiables filtered all available catalogue records. Consider unchecking strict mode or slightly adjusting the budget.
            </p>
            <Link
              to="/find-my-vehicle"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
            >
              <span>Modify Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((item, idx) => (
              <RecommendationCard
                key={item.recommendedVariant?.id || idx}
                item={item}
                rank={idx + 1}
                isWishlisted={isWishlisted(item.vehicle.id)}
                onToggleWishlist={() => toggleWishlist(item.vehicle.id)}
              />
            ))}
          </div>
        )}

        {/* Near Matches Section */}
        {nearMatches.length > 0 && !answers.isStrictBudget && (
          <div className="pt-8 border-t border-pink-200">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                <span>Worth Considering (Near Matches within +15% Budget)</span>
              </h2>
              <p className="text-xs text-slate-500">
                These vehicles scored exceptionally high on your safety, ergonomics, and efficiency requirements, but slightly exceed your target budget.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearMatches.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl border border-pink-200/80 bg-white p-5 flex flex-col justify-between hover:border-rose-400 shadow-sm transition-all"
                >
                  <div>
                    <div className="flex gap-4 mb-3">
                      <img
                        src={item.vehicle.heroImageUrl}
                        alt={item.vehicle.modelName}
                        className="w-24 h-20 rounded-xl object-cover bg-slate-100 border border-pink-200 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
                          {item.matchBadge || 'Near Match'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">
                          {item.vehicle.brandName} {item.vehicle.modelName}
                        </h3>
                        <p className="text-xs text-slate-500">{item.recommendedVariant.variantName}</p>
                        <p className="text-sm font-extrabold text-rose-600 mt-1">
                          {formatPriceINR(item.recommendedVariant.estimatedOnRoadPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4 text-xs text-slate-600">
                      {item.reasons.slice(0, 2).map((r, rIdx) => (
                        <p key={rIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-pink-100">
                    <Link
                      to={`/vehicles/${item.vehicle.id}`}
                      className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-center text-xs font-semibold text-rose-700 transition-colors"
                    >
                      View Specs
                    </Link>
                    <Link
                      to={`/where-to-buy?vehicleId=${item.vehicle.id}&variantId=${item.recommendedVariant.id}&brandId=${item.vehicle.brandId}&category=${item.vehicle.category}&model=${encodeURIComponent(item.vehicle.modelName)}`}
                      className="py-2 px-3 rounded-xl border border-pink-200 hover:border-rose-300 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Where to Buy</span>
                    </Link>
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

interface RecommendationCardProps {
  item: RecommendationResult;
  rank: number;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  rank,
  isWishlisted,
  onToggleWishlist,
}) => {
  const { 
    vehicle, 
    recommendedVariant, 
    overallScore, 
    scoreBreakdown, 
    matchBadge, 
    reasons, 
    tradeOffs, 
    dataConfidenceScore, 
    dataConfidenceLevel,
    categorySpecs,
    affordability,
    relativePositionExplanation
  } = item;

  const [showAffordability, setShowAffordability] = useState(false);

  return (
    <div className="glass-card rounded-2xl border border-pink-200/80 bg-white overflow-hidden shadow-lg hover:border-rose-400 hover:shadow-xl transition-all flex flex-col lg:flex-row">
      {/* Left: Image & Key Identifiers */}
      <div className="lg:w-80 relative bg-rose-50/40 flex flex-col justify-between p-5 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-pink-100">
        <div>
          <div className="relative aspect-[16/10] lg:aspect-auto lg:h-44 rounded-xl overflow-hidden mb-3 border border-pink-200">
            <img
              src={vehicle.heroImageUrl}
              alt={vehicle.modelName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur border border-rose-300 text-rose-600 font-extrabold text-xs shadow-sm">
              #{rank} {rank === 1 ? 'TOP MATCH' : 'MATCH'}
            </div>
            <button
              onClick={onToggleWishlist}
              className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur transition-all ${
                isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:text-white hover:bg-rose-600'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>

          <div>
            <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
              {vehicle.brandName} • {vehicle.category?.replace(/_/g, ' ')}
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {vehicle.modelName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Variant: {recommendedVariant.variantName} ({recommendedVariant.modelYear})
            </p>

            {/* Pricing Box */}
            <div className="mt-3 pt-3 border-t border-pink-100 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                  Est. On-Road ({recommendedVariant.cityPriceRef || 'New Delhi'})
                </span>
                <span className="text-lg font-extrabold text-rose-600">
                  {formatPriceINR(recommendedVariant.estimatedOnRoadPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                  Ex-Showroom
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {formatPriceINR(recommendedVariant.exShowroomPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Affordability Snapshot Button */}
        {affordability && (
          <div className="mt-4 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={() => setShowAffordability(!showAffordability)}
              className="w-full py-2 px-3 rounded-xl bg-pink-50/70 hover:bg-pink-100 border border-pink-200 text-rose-700 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-rose-500" />
                <span>EMI: {formatPriceINR(affordability.monthlyEmi)}/mo</span>
              </div>
              {showAffordability ? (
                <ChevronUp className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-rose-500" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right: Scores, Explanations, Category Specs, Trade-offs & Affordability */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
        <div>
          {/* Header Badges: Match Score + Data Confidence Score */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {matchBadge && (
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-300 text-xs font-bold shadow-sm">
                  {matchBadge}
                </span>
              )}
              {/* Separate Data Confidence Badge */}
              {dataConfidenceScore !== undefined && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                  dataConfidenceScore >= 85 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : dataConfidenceScore >= 70
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Data Confidence: {dataConfidenceScore}% {dataConfidenceLevel === 'HIGH_VERIFIED' ? '(Verified)' : ''}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Match Score</span>
              <div className="px-3 py-1 rounded-xl btn-galaxy-primary text-white font-extrabold text-sm shadow-sm">
                {Math.round(overallScore)}%
              </div>
            </div>
          </div>

          {/* Relative Position Explanation */}
          {relativePositionExplanation && (
            <p className="text-xs font-medium text-slate-600 mb-3 bg-pink-50/40 p-2.5 rounded-lg border border-pink-100">
              {relativePositionExplanation}
            </p>
          )}

          {/* 3 Personalized Reasons */}
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
              Why this vehicle matches your lifestyle:
            </h4>
            <div className="space-y-1.5">
              {reasons.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category-Tailored Verified Specifications */}
          {categorySpecs && Object.keys(categorySpecs).length > 0 && (
            <div className="mb-4 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider block mb-2">
                Category-Tailored Key Specifications
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {Object.entries(categorySpecs).map(([label, val]) => (
                  <div key={label} className="bg-white p-2 rounded-lg border border-pink-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-tight">{label}</span>
                    <span className="text-slate-800 font-bold text-xs">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Honest Trade-Offs */}
          {tradeOffs && tradeOffs.length > 0 && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-amber-900">
              <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Honest Trade-Offs & Practical Considerations</span>
              </span>
              <div className="space-y-1 text-xs text-slate-700">
                {tradeOffs.map((t, idx) => (
                  <p key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{t}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility Breakdown Bars */}
          {scoreBreakdown && Object.keys(scoreBreakdown).length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50/30 border border-pink-200 mb-4">
              <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider block mb-2">
                Compatibility Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(scoreBreakdown).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-600 uppercase font-medium">{key}</span>
                      <span className="text-rose-600 font-bold">{Math.round(val)}%</span>
                    </div>
                    <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-pink-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ownership Affordability Details (Expandable) */}
          {affordability && showAffordability && (
            <div className="mb-4 p-4 rounded-xl bg-pink-50/50 border border-pink-200 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-pink-200 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-rose-500" />
                  Ownership Affordability & TCO Breakdown
                </span>
                <span className="text-[10px] text-slate-500">Based on your daily commute</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-2.5 rounded-lg border border-pink-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">20% Down Payment</span>
                  <span className="text-slate-800 font-bold text-sm">{formatPriceINR(affordability.downPayment)}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-pink-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">60-Mo Loan EMI</span>
                  <span className="text-rose-600 font-bold text-sm">{formatPriceINR(affordability.monthlyEmi)}/mo</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-pink-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Monthly Fuel / Power</span>
                  <span className="text-slate-800 font-bold text-sm">{formatPriceINR(affordability.monthlyFuelOrEnergyCost)}/mo</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-pink-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">5-Yr Total Cost (TCO)</span>
                  <span className="text-slate-800 font-bold text-sm">{formatPriceINR(affordability.fiveYearTotalCostOfOwnership)}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                {affordability.calculationAssumptions}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-pink-100">
          <Link
            to={`/compare?v1=${vehicle.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 text-xs font-semibold shadow-sm transition-all"
          >
            <GitCompare className="w-3.5 h-3.5 text-rose-500" />
            <span>Compare with Alternatives</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={`/where-to-buy?vehicleId=${vehicle.id}&variantId=${recommendedVariant.id}&brandId=${vehicle.brandId}&category=${vehicle.category}&model=${encodeURIComponent(vehicle.modelName)}`}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors shadow-2xs"
            >
              Where to Buy & Test Drive
            </Link>
            <Link
              to={`/vehicles/${vehicle.id}`}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl btn-galaxy-primary text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>View Full Specs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
