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
  { label: '₹20 Lakh & Above', min: 2000000, max: 5000000 },
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
    <section id="budget-selector" className="py-16 bg-gradient-to-b from-[#fff5f8] via-white to-[#fff0f4] border-b border-pink-100 text-slate-900 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-pink-200/25 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-rose-200/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-200/80 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-rose-600 text-xs font-bold uppercase tracking-wider block mb-1">
              Step 1 • Budget Definition
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              What is your targeted vehicle budget?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select your realistic ceiling to filter vehicles matching your financial comfort.
            </p>
          </div>

          {/* Budget Type Toggle */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-slate-600">Budget Perspective:</span>
            <div className="inline-flex rounded-xl bg-white p-1 border border-pink-200 shadow-sm">
              <button
                type="button"
                onClick={() => setBudgetType('PURCHASE')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  budgetType === 'PURCHASE'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Total On-Road Purchase Budget
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('EMI')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  budgetType === 'EMI'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Maximum Monthly EMI Limit
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>
                {budgetType === 'PURCHASE'
                  ? 'Includes road tax, registration & mandatory insurance'
                  : 'Calculated assuming 5-year tenure at standard ~9.5% interest rate'}
              </span>
            </div>
          </div>

          {/* Preset Chips */}
          <div className="mt-6">
            <label className="text-xs font-semibold text-slate-600 block mb-2">
              Quick Budget Presets:
            </label>
            <div className="flex flex-wrap gap-2">
              {PURCHASE_PRESETS.map((preset) => {
                const isSelected = minBudget === preset.min && maxBudget === preset.max;
                return (
                  <button
                    key={preset.label}
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 text-rose-600 border border-rose-400 font-bold shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-rose-50/60 border border-pink-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Range Slider & Editable Inputs */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6 border-t border-pink-100">
            <div>
              <div className="flex justify-between items-center text-sm font-semibold mb-2">
                <span className="text-slate-700">Target Upper Ceiling:</span>
                <span className="text-rose-600 text-lg font-bold">
                  {formatIndianPrice(maxBudget)}
                </span>
              </div>
              <input
                type="range"
                min={75000}
                max={4000000}
                step={25000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                <span>₹75,000 (Commuter 2W)</span>
                <span>₹40 Lakh (Premium SUV)</span>
              </div>
            </div>

            {/* Manual Numeric Inputs & Submit */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-1/2">
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Min Budget (₹)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    step={25000}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-pink-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Max Budget (₹)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    step={25000}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-pink-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => navigate('/find-my-vehicle')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs border border-pink-300 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Launch 6-Step Dynamic Questionnaire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSearchWithBudget}
              className="flex items-center gap-2 px-6 py-3 rounded-xl btn-galaxy-primary text-white font-extrabold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Explore Vehicles in {formatIndianPrice(minBudget)} – {formatIndianPrice(maxBudget)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
