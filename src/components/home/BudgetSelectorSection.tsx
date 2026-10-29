import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowRight, IndianRupee, Sparkles, Sliders } from 'lucide-react';
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
    <section id="budget-selector" className="py-20 bg-white border-b border-slate-200/80 text-slate-900 relative overflow-hidden">
      {/* Mednix Light Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-slate-100/70 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mednix-card p-6 sm:p-12 shadow-sm relative overflow-hidden">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sliders className="w-3.5 h-3.5 text-rose-600" />
              <span>Financial Comfort Bounds</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
              Define Your Targeted Vehicle Budget
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-body">
              Filter vehicles matching your realistic comfort level, whether buying outright or planning a monthly car loan EMI.
            </p>
          </div>

          {/* Budget Type Toggle */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Budget Mode:
            </span>
            <div className="inline-flex rounded-full bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setBudgetType('PURCHASE')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  budgetType === 'PURCHASE'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Total On-Road Purchase Budget
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('EMI')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  budgetType === 'EMI'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Loan EMI Perspective
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>
                {budgetType === 'PURCHASE'
                  ? 'Includes representative state road tax, registration & insurance'
                  : 'Assumes 5-year loan tenure at standard ~9.5% interest rate with 20% down payment'}
              </span>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="mt-8">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
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
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Sliders / Value Inputs */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Minimum Budget</span>
                <span className="text-sm font-extrabold text-slate-900">
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
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹50,000</span>
                <span>₹50 Lakh</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Maximum Ceiling</span>
                <span className="text-sm font-extrabold text-rose-600">
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
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹1 Lakh</span>
                <span>₹75 Lakh</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Selected Range: <strong className="text-slate-900">{formatIndianPrice(minBudget)}</strong> to <strong className="text-slate-900">{formatIndianPrice(maxBudget)}</strong>
            </div>

            <button
              onClick={handleSearchWithBudget}
              className="btn-pill-primary text-xs w-full sm:w-auto"
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
