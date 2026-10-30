import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

interface BudgetPreset {
  label: string;
  min: number;
  max: number;
}

const PURCHASE_PRESETS: BudgetPreset[] = [
  { label: 'Under ₹2 Lakh (2W)', min: 50000, max: 200000 },
  { label: 'Under ₹5 Lakh', min: 100000, max: 500000 },
  { label: '₹5–8 Lakh', min: 500000, max: 800000 },
  { label: '₹8–12 Lakh', min: 800000, max: 1200000 },
  { label: '₹12–20 Lakh', min: 1200000, max: 2000000 },
  { label: '₹20 Lakh & Above', min: 2000000, max: 7500000 },
];

export const BudgetSelectorSection: React.FC = () => {
  const navigate = useNavigate();
  const [budgetType, setBudgetType] = useState<'PURCHASE' | 'EMI'>('PURCHASE');
  const [maxBudget, setMaxBudget] = useState<number>(1200000);
  const [minBudget, setMinBudget] = useState<number>(500000);

  const handleApplyPreset = (preset: BudgetPreset) => {
    setMinBudget(preset.min);
    setMaxBudget(preset.max);
  };

  const handleSearchWithBudget = () => {
    if (minBudget > maxBudget) {
      alert('Minimum budget cannot exceed maximum budget.');
      return;
    }
    navigate(`/vehicles?minPrice=${minBudget}&maxPrice=${maxBudget}`);
  };

  return (
    <section id="budget-selector" className="py-20 bg-[#F4F0E8] border-b border-[#E5E0D8] text-[#171717] relative overflow-hidden font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="luxury-card p-6 sm:p-12 shadow-sm relative overflow-hidden bg-white">
          
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight font-heading">
              Define Your Targeted Vehicle Budget
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 font-body">
              Filter vehicles matching your realistic comfort level, whether buying outright or planning a monthly car loan EMI.
            </p>
          </div>

          {/* Budget Type Toggle */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider font-heading">
              Budget Perspective:
            </span>
            <div className="inline-flex rounded-full bg-[#FAF8F5] p-1 border border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setBudgetType('PURCHASE')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer font-heading ${
                  budgetType === 'PURCHASE'
                    ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-[#171717]'
                }`}
              >
                Total On-Road Purchase Budget
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('EMI')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer font-heading ${
                  budgetType === 'EMI'
                    ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-[#171717]'
                }`}
              >
                Monthly Loan EMI Perspective
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-body">
              <HelpCircle className="w-3.5 h-3.5 text-[#B9975B]" />
              <span>
                {budgetType === 'PURCHASE'
                  ? 'Includes representative state road tax, registration & insurance'
                  : 'Assumes 5-year loan tenure at standard ~9.5% interest rate with 20% down payment'}
              </span>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="mt-8">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-3 font-heading">
              Common Indian Price Segments
            </label>
            <div className="flex flex-wrap gap-2">
              {PURCHASE_PRESETS.map((preset) => {
                const isActive = minBudget === preset.min && maxBudget === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer font-heading ${
                      isActive
                        ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B] shadow-xs'
                        : 'bg-[#FAF8F5] border border-[#E5E0D8] text-stone-700 hover:border-[#B9975B] hover:text-[#171717]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Sliders / Value Inputs (Tabular Numerals) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F5] p-6 rounded-2xl border border-[#E5E0D8]">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-2 font-heading">
                <span>Minimum Budget</span>
                <span className="text-sm font-extrabold text-[#171717] tabular-numbers">
                  {formatIndianPrice(minBudget)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                className="w-full accent-[#B9975B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-semibold tabular-numbers">
                <span>₹50,000</span>
                <span>₹50 Lakh</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-2 font-heading">
                <span>Maximum Ceiling</span>
                <span className="text-sm font-extrabold text-[#B9975B] tabular-numbers">
                  {formatIndianPrice(maxBudget)}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="7500000"
                step="50000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-[#B9975B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-semibold tabular-numbers">
                <span>₹1 Lakh</span>
                <span>₹75 Lakh</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E0D8]">
            <div className="text-xs text-stone-500 font-body">
              Selected Range: <strong className="text-[#171717] tabular-numbers">{formatIndianPrice(minBudget)}</strong> to <strong className="text-[#171717] tabular-numbers">{formatIndianPrice(maxBudget)}</strong>
            </div>

            <button
              onClick={handleSearchWithBudget}
              className="btn-gold text-xs w-full sm:w-auto"
            >
              <span>Explore Matching Vehicles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
