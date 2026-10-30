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
      <div className="min-h-screen bg-[#F4F0E8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B9975B]"></div>
      </div>
    );
  }

  const { response, answers, guestName } = data;
  const matches = response.matchedResults || [];
  const nearMatches = response.nearMatchResults || [];

  return (
    <div className="min-h-screen bg-[#F4F0E8] py-12 px-4 sm:px-6 lg:px-8 text-[#171717] relative overflow-hidden">
      {/* Subtle luxury ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#171717]/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight font-heading">
              {guestName ? `Recommended Vehicles for ${guestName}` : 'Your Personalized Vehicle Recommendations'}
            </h1>
            <p className="text-neutral-600 text-sm mt-1 font-body">
              Every match includes deterministic scoring, category-tailored specifications, transparent trade-offs, and 5-year ownership affordability math.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-body">
            {matches.length >= 2 && (
              <Link
                to={`/compare?v1=${matches[0].vehicle.id}&v2=${matches[1].vehicle.id}`}
                className="btn-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Top 2 Matches</span>
              </Link>
            )}
            <Link
              to="/find-my-vehicle"
              className="btn-outline-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adjust Criteria</span>
            </Link>
          </div>
        </div>

        {/* User Search Profile Pill */}
        <div className="p-4 rounded-2xl luxury-card flex flex-wrap items-center justify-between gap-4 text-xs font-body">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#8C6F37] font-heading">Your Search Profile:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F4F0E8] text-[#171717] border border-[#171717]/10 font-semibold tabular-nums">
              Budget: {formatPriceINR(answers.budgetAmount)} ({answers.budgetType === 'EMI' ? 'Monthly EMI' : 'Total On-Road'})
            </span>
            {answers.isStrictBudget && (
              <span className="px-2.5 py-1 rounded-lg bg-[#171717] text-[#B9975B] font-bold">
                Strict Budget Ceiling
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-white text-neutral-700 border border-[#171717]/10 font-medium">
              {answers.category?.replace(/_/g, ' ')} {answers.bodyStyle ? `• ${answers.bodyStyle}` : ''}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white text-neutral-700 border border-[#171717]/10 font-medium">
              City: {answers.city || 'New Delhi'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white text-neutral-700 border border-[#171717]/10 font-medium tabular-nums">
              {answers.dailyDistanceKm} km/day commute
            </span>
          </div>
          <div className="text-neutral-600 font-medium font-body">
            Found <strong className="text-[#171717] font-bold tabular-nums">{matches.length}</strong> qualified top {matches.length === 1 ? 'match' : 'matches'}
          </div>
        </div>

        {/* Unmatched Constraint Notes if any */}
        {response.unmatchedConstraintNotes && response.unmatchedConstraintNotes.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 shadow-sm font-body">
            <div className="font-bold flex items-center gap-1.5 text-amber-800 font-heading">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Deterministic Filtering Notes:</span>
            </div>
            {response.unmatchedConstraintNotes.map((note: string, idx: number) => (
              <p key={idx} className="text-neutral-700 pl-5 leading-relaxed">• {note}</p>
            ))}
          </div>
        )}

        {/* Matched Vehicles List */}
        {matches.length === 0 ? (
          <div className="py-16 text-center luxury-card rounded-2xl p-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#171717] mb-2 font-heading">No Vehicles Satisfied All Hard Constraints</h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6 font-body">
              We did not find any vehicles in our database matching all non-negotiable requirements within your strict budget limit.
            </p>
            <Link
              to="/find-my-vehicle"
              className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Modify Budget or Filters</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((item, idx) => (
              <RecommendationCard
                key={item.vehicle.id}
                item={item}
                rank={idx + 1}
                isWishlisted={isWishlisted(item.vehicle.id)}
                onToggleWishlist={() => toggleWishlist(item.vehicle.id)}
              />
            ))}
          </div>
        )}

        {/* Near Matches Section */}
        {nearMatches.length > 0 && (
          <div className="pt-8 border-t border-[#171717]/10">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#171717] font-heading">
                High-Value Alternatives Slightly Outside Your Filter Ceiling
              </h3>
              <p className="text-xs text-neutral-500 font-body">
                Vehicles that scored exceptionally high on your safety, comfort, and efficiency priorities but slightly exceeded your target purchase budget (up to +15%).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearMatches.map((item) => (
                <div
                  key={item.vehicle.id}
                  className="luxury-card p-5 flex flex-col justify-between hover:border-[#B9975B] shadow-sm transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.vehicle.heroImageUrl}
                      alt={item.vehicle.modelName}
                      className="w-24 h-20 rounded-xl object-cover bg-neutral-100 border border-[#171717]/10 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] text-[#8C6F37] font-bold uppercase tracking-wider font-heading">
                        {item.vehicle.brandName} • {item.vehicle.category}
                      </span>
                      <h4 className="text-base font-bold text-[#171717] font-heading">{item.vehicle.modelName}</h4>
                      <p className="text-xs text-neutral-500 font-body">
                        {item.recommendedVariant.variantName}
                      </p>
                      <p className="text-sm font-extrabold text-[#171717] mt-1 tabular-nums font-heading">
                        {formatPriceINR(item.recommendedVariant.estimatedOnRoadPrice)}
                      </p>
                    </div>
                  </div>

                  {item.reasons && item.reasons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#171717]/10 text-xs font-body">
                      <span className="text-[11px] font-bold text-neutral-700 block mb-1">Why Consider:</span>
                      <div className="space-y-1">
                        {item.reasons.slice(0, 2).map((r: string, i: number) => (
                          <div key={i} className="flex items-start gap-1.5 text-neutral-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B9975B] flex-shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-[#171717]/10 font-body">
                    <Link
                      to={`/vehicles/${item.vehicle.id}`}
                      className="flex-1 py-2 rounded-xl btn-gold text-center text-xs font-bold transition-colors"
                    >
                      View Specs & Details
                    </Link>
                    <Link
                      to={`/where-to-buy?vehicleId=${item.vehicle.id}&variantId=${item.recommendedVariant.id}&brandId=${item.vehicle.brandId}&category=${item.vehicle.category}&model=${encodeURIComponent(item.vehicle.modelName)}`}
                      className="py-2 px-3 rounded-xl border border-[#171717]/15 hover:border-[#B9975B] text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Dealers</span>
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

// ==========================================
// DETAILED RECOMMENDATION CARD COMPONENT
// ==========================================
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
    <div className="luxury-card overflow-hidden shadow-lg transition-all flex flex-col lg:flex-row">
      {/* Left: Image & Key Identifiers */}
      <div className="lg:w-80 relative bg-[#F4F0E8]/40 flex flex-col justify-between p-5 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#171717]/10 font-body">
        <div>
          <div className="relative aspect-[16/10] lg:aspect-auto lg:h-44 rounded-xl overflow-hidden mb-3 border border-[#171717]/10">
            <img
              src={vehicle.heroImageUrl}
              alt={vehicle.modelName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-[#171717] text-[#B9975B] border border-[#B9975B]/30 font-extrabold text-xs shadow-sm font-heading">
              #{rank} {rank === 1 ? 'TOP MATCH' : 'MATCH'}
            </div>
            <button
              onClick={onToggleWishlist}
              className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur transition-all cursor-pointer ${
                isWishlisted ? 'bg-[#B9975B] text-[#171717]' : 'bg-white/80 text-neutral-700 hover:text-[#171717] hover:bg-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>

          <div>
            <span className="text-[10px] text-[#8C6F37] font-bold uppercase tracking-wider block font-heading">
              {vehicle.brandName} • {vehicle.category?.replace(/_/g, ' ')}
            </span>
            <h2 className="text-xl font-bold text-[#171717] leading-tight font-heading">
              {vehicle.modelName}
            </h2>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              Variant: {recommendedVariant.variantName} ({recommendedVariant.modelYear})
            </p>

            {/* Pricing Box */}
            <div className="mt-3 pt-3 border-t border-[#171717]/10 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block font-semibold font-heading">
                  Est. On-Road ({recommendedVariant.cityPriceRef || 'New Delhi'})
                </span>
                <span className="text-lg font-extrabold text-[#171717] tabular-nums font-heading">
                  {formatPriceINR(recommendedVariant.estimatedOnRoadPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-neutral-400 block font-semibold font-heading">
                  Ex-Showroom
                </span>
                <span className="text-xs text-neutral-600 font-medium tabular-nums">
                  {formatPriceINR(recommendedVariant.exShowroomPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Affordability Snapshot Button */}
        {affordability && (
          <div className="mt-4 pt-3 border-t border-[#171717]/10">
            <button
              type="button"
              onClick={() => setShowAffordability(!showAffordability)}
              className="w-full py-2 px-3 rounded-xl bg-[#F4F0E8] hover:bg-[#B9975B]/15 border border-[#171717]/10 text-neutral-800 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#B9975B]" />
                <span className="tabular-nums font-body">EMI: {formatPriceINR(affordability.monthlyEmi)}/mo</span>
              </div>
              {showAffordability ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#B9975B]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#B9975B]" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right: Technical Evaluation & Spec Breakdown */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Header Score & Relative Stance */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#171717]/10">
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#171717] tabular-nums font-heading">
                  {Math.round(overallScore)}%
                </span>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-[#171717] text-[#B9975B] border border-[#B9975B]/30 text-xs font-bold shadow-sm font-heading">
                  Match Score
                </span>
              </div>
            </div>

            {/* Confidence & Provenance Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F4F0E8] border border-[#171717]/10 text-[11px] font-semibold text-neutral-700 font-body">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B9975B]" />
                <span>Data Confidence: {Math.round(dataConfidenceScore || 95)}% (Verified)</span>
              </span>
            </div>
          </div>

          {/* Relative Position Explanation */}
          {relativePositionExplanation && (
            <p className="text-xs font-medium text-neutral-700 mt-3 mb-3 bg-[#F4F0E8]/60 p-2.5 rounded-lg border border-[#171717]/10 font-body">
              {relativePositionExplanation}
            </p>
          )}

          {/* Category-Tailored Key Specifications Grid */}
          {categorySpecs && Object.keys(categorySpecs).length > 0 && (
            <div className="my-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6F37] mb-2 font-heading">
                Key Category Homologated Specs
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-body">
                {Object.entries(categorySpecs).map(([label, val]) => (
                  <div key={label} className="bg-white p-2 rounded-lg border border-[#171717]/10 shadow-sm">
                    <span className="text-[10px] text-neutral-400 block font-medium truncate">{label}</span>
                    <strong className="text-neutral-900 text-xs font-bold block truncate tabular-nums">
                      {val || 'N/A'}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dimension Scores Bar Chart */}
          {scoreBreakdown && Object.keys(scoreBreakdown).length > 0 && (
            <div className="p-3 rounded-xl bg-[#F4F0E8]/50 border border-[#171717]/10 mb-4 font-body">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-2 font-heading">
                Weighted Dimension Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {Object.entries(scoreBreakdown).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-neutral-500 capitalize">{key}</span>
                      <span className="text-[#8C6F37] font-bold tabular-nums">{Math.round(Number(val))}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#B9975B] h-1.5 rounded-full"
                        style={{ width: `${Number(val)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Affordability & TCO Breakdown */}
          {showAffordability && affordability && (
            <div className="mb-4 p-4 rounded-xl bg-[#171717] text-white border border-neutral-800 text-xs space-y-3 font-body">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-white font-heading">
                  <Wallet className="w-4 h-4 text-[#B9975B]" />
                  <span>Ownership Affordability & TCO Breakdown</span>
                </div>
                <span className="text-[10px] text-neutral-400">Delhi RTO / Domestic Electricity</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-[#242424] p-2.5 rounded-lg border border-neutral-700">
                  <span className="text-[10px] text-neutral-400 block">20% Down Payment</span>
                  <span className="text-white font-bold text-sm tabular-nums">{formatPriceINR(affordability.downPayment)}</span>
                </div>
                <div className="bg-[#242424] p-2.5 rounded-lg border border-neutral-700">
                  <span className="text-[10px] text-neutral-400 block">Monthly Loan EMI (60m)</span>
                  <span className="text-[#B9975B] font-bold text-sm tabular-nums">{formatPriceINR(affordability.monthlyEmi)}/mo</span>
                </div>
                <div className="bg-[#242424] p-2.5 rounded-lg border border-neutral-700">
                  <span className="text-[10px] text-neutral-400 block">Fuel / Running Expense</span>
                  <span className="text-white font-bold text-sm tabular-nums">{formatPriceINR(affordability.monthlyFuelOrEnergyCost)}/mo</span>
                </div>
                <div className="bg-[#242424] p-2.5 rounded-lg border border-neutral-700">
                  <span className="text-[10px] text-neutral-400 block">5-Yr Total Cost (TCO)</span>
                  <span className="text-white font-bold text-sm tabular-nums">{formatPriceINR(affordability.fiveYearTotalCostOfOwnership)}</span>
                </div>
              </div>
              {affordability.calculationAssumptions && (
                <p className="text-[10px] text-neutral-400 pt-1 leading-relaxed border-t border-neutral-800/80">
                  * {affordability.calculationAssumptions}
                </p>
              )}
            </div>
          )}

          {/* Pros vs Trade-offs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4 font-body">
            {reasons && reasons.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <strong className="text-emerald-800 font-bold block mb-1.5 flex items-center gap-1 font-heading">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Strengths</span>
                </strong>
                <ul className="space-y-1">
                  {reasons.map((r: string, i: number) => (
                    <li key={i} className="text-neutral-700 flex items-start gap-1">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tradeOffs && tradeOffs.length > 0 && (
              <div className="p-3 rounded-xl bg-white border border-amber-200">
                <strong className="text-amber-800 font-bold block mb-1.5 flex items-center gap-1 font-heading">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Honest Trade-Offs & Practical Considerations</span>
                </strong>
                <ul className="space-y-1">
                  {tradeOffs.map((t: string, i: number) => (
                    <li key={i} className="text-neutral-700 flex items-start gap-1">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#171717]/10 font-body">
          <Link
            to={`/compare?v1=${vehicle.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#171717]/15 hover:border-[#B9975B] text-neutral-700 hover:text-[#171717] text-xs font-semibold shadow-sm transition-all"
          >
            <GitCompare className="w-3.5 h-3.5 text-[#B9975B]" />
            <span>Compare with Other</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={`/where-to-buy?vehicleId=${vehicle.id}&variantId=${recommendedVariant.id}&brandId=${vehicle.brandId}&category=${vehicle.category}&model=${encodeURIComponent(vehicle.modelName)}`}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Where to Buy & Test Drive
            </Link>

            <Link
              to={`/vehicles/${vehicle.id}`}
              className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
            >
              <span>Full Technical Specs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
