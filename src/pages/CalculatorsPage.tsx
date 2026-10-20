import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  Zap, 
  TrendingDown, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  Info,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { 
  EmiCalculationResult, 
  RunningCostResult, 
  OwnershipCostResult 
} from '../types';
import { formatPriceINR } from '../utils/formatters';

export const CalculatorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EMI' | 'SAVINGS' | 'TCO'>('EMI');

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Automotive Financial Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Vehicle Ownership & Financial Calculators
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Calculate accurate monthly loan EMIs, simulate real-world EV vs Petrol savings, and uncover the true 5-year Total Cost of Ownership before signing any papers.
          </p>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl glass-card p-1.5 border border-pink-200/80 bg-white/95 max-w-md mx-auto mt-6 shadow-sm">
            <button
              onClick={() => setActiveTab('EMI')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'EMI'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Loan EMI
            </button>
            <button
              onClick={() => setActiveTab('SAVINGS')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'SAVINGS'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Petrol vs EV Savings
            </button>
            <button
              onClick={() => setActiveTab('TCO')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'TCO'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5-Year TCO Analysis
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'EMI' && <EmiCalculatorTab />}
        {activeTab === 'SAVINGS' && <SavingsCalculatorTab />}
        {activeTab === 'TCO' && <TcoCalculatorTab />}
      </div>
    </div>
  );
};

// ==========================================
// TAB 1: REDUCING-BALANCE LOAN EMI CALCULATOR
// ==========================================
const EmiCalculatorTab: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState(1200000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [result, setResult] = useState<EmiCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPercent) / 100);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.calculateEmi({
        vehiclePrice,
        downPayment: downPaymentAmount,
        annualInterestRate: interestRate,
        tenureMonths,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [vehiclePrice, downPaymentPercent, interestRate, tenureMonths]);

  const principalRatio = result ? Math.round((result.loanPrincipal / result.totalRepayment) * 100) : 80;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-card border border-pink-200/80 bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-900">
      {/* Left Form */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-rose-500" />
            Auto Loan EMI Estimator
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Calculated using standard Indian banking reducing balance amortization (P × r × (1 + r)^n / ((1 + r)^n - 1)).
          </p>
        </div>

        {/* Vehicle Price Slider */}
        <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">On-Road Vehicle Price</label>
            <span className="text-base font-bold text-rose-600">{formatPriceINR(vehiclePrice)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={5000000}
            step={25000}
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>₹1 Lakh (Bike)</span>
            <span>₹15 Lakh (Mid SUV)</span>
            <span>₹50 Lakh (Luxury)</span>
          </div>
        </div>

        {/* Down payment */}
        <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Down Payment ({downPaymentPercent}%)</label>
            <span className="text-base font-bold text-slate-900">{formatPriceINR(downPaymentAmount)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0% (100% On-Road Funding)</span>
            <span>20% (Recommended)</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest Rate & Tenure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              Interest Rate (% p.a.)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="6"
                max="20"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
              />
              <span className="text-slate-500 text-xs font-bold">%</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">SBI/HDFC rates typically 8.75% - 10.5%</span>
          </div>

          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              Loan Tenure (Months)
            </label>
            <select
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm cursor-pointer"
            >
              <option value={12}>12 Months (1 Year)</option>
              <option value={24}>24 Months (2 Years)</option>
              <option value={36}>36 Months (3 Years)</option>
              <option value={48}>48 Months (4 Years)</option>
              <option value={60}>60 Months (5 Years)</option>
              <option value={72}>72 Months (6 Years)</option>
              <option value={84}>84 Months (7 Years)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Result Card */}
      <div className="lg:col-span-5 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 rounded-2xl border border-pink-200 p-6 flex flex-col justify-between shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-rose-600 font-bold block mb-1">
            Estimated Monthly Payment
          </span>
          <div className="text-4xl font-extrabold text-slate-900">
            {result ? formatPriceINR(result.monthlyEmi) : '...'}
            <span className="text-sm text-slate-500 font-normal"> / month</span>
          </div>

          <div className="mt-6 pt-6 border-t border-pink-100 space-y-3.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Loan Principal Funded</span>
              <strong className="text-slate-900 font-bold">
                {result ? formatPriceINR(result.loanPrincipal) : '...'}
              </strong>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Total Interest Payable</span>
              <strong className="text-amber-600 font-bold">
                {result ? formatPriceINR(result.totalInterest) : '...'}
              </strong>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Total Repayment Over Tenure</span>
              <strong className="text-rose-600 font-bold">
                {result ? formatPriceINR(result.totalRepayment) : '...'}
              </strong>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-[10px] text-slate-600 mb-1.5 font-medium">
              <span>Principal: {principalRatio}%</span>
              <span>Interest: {100 - principalRatio}%</span>
            </div>
            <div className="w-full bg-amber-400/80 h-3 rounded-full overflow-hidden flex">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${principalRatio}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-pink-100">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            * Note: Actual EMI may vary based on exact bank processing charges, credit score (CIBIL), and fixed vs floating terms.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TAB 2: PETROL VS EV SAVINGS CALCULATOR
// ==========================================
const SavingsCalculatorTab: React.FC = () => {
  const [monthlyKm, setMonthlyKm] = useState(1200);
  const [petrolPrice, setPetrolPrice] = useState(96.72);
  const [petrolKmpl, setPetrolKmpl] = useState(16.5);
  const [electricityTariff, setElectricityTariff] = useState(8.5);
  const [evRangeKm, setEvRangeKm] = useState(450);
  const [evBatteryKwh, setEvBatteryKwh] = useState(45);

  const [result, setResult] = useState<RunningCostResult | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.calculateRunningCost({
          monthlyDistanceKm: monthlyKm,
          fuelPricePerUnit: petrolPrice,
          vehicleEfficiency: petrolKmpl,
          isElectric: false,
          electricityCostPerKwh: electricityTariff,
          evBatteryCapacityKwh: evBatteryKwh,
          evCertifiedRangeKm: evRangeKm,
        });
        setResult(res);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [monthlyKm, petrolPrice, petrolKmpl, electricityTariff, evRangeKm, evBatteryKwh]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-card border border-pink-200/80 bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-900">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Electric vs Petrol Fuel Savings Simulator
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Compare real monthly and cumulative running expenses based on current fuel rates and domestic power tariffs.
          </p>
        </div>

        {/* Monthly Km */}
        <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Monthly Driving Distance</label>
            <span className="text-base font-bold text-rose-600">{monthlyKm.toLocaleString()} km / month</span>
          </div>
          <input
            type="range"
            min={400}
            max={4000}
            step={50}
            value={monthlyKm}
            onChange={(e) => setMonthlyKm(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>400 km (Low City)</span>
            <span>1,200 km (Avg Commute)</span>
            <span>4,000 km (Heavy Fleet)</span>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              Petrol Price (₹ / Litre)
            </label>
            <input
              type="number"
              step="0.5"
              value={petrolPrice}
              onChange={(e) => setPetrolPrice(Number(e.target.value))}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
            />
          </div>

          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              Petrol Car Mileage (km/l)
            </label>
            <input
              type="number"
              step="0.5"
              value={petrolKmpl}
              onChange={(e) => setPetrolKmpl(Number(e.target.value))}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
            />
          </div>

          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              Home Electricity (₹ / Unit)
            </label>
            <input
              type="number"
              step="0.5"
              value={electricityTariff}
              onChange={(e) => setElectricityTariff(Number(e.target.value))}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
            />
          </div>

          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              EV Certified Range (km)
            </label>
            <input
              type="number"
              step="10"
              value={evRangeKm}
              onChange={(e) => setEvRangeKm(Number(e.target.value))}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Right Savings Result */}
      <div className="lg:col-span-5 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 rounded-2xl border border-pink-200 p-6 flex flex-col justify-between shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-rose-600 font-bold block mb-1">
            Projected Annual Cash Savings with EV
          </span>
          <div className="text-4xl font-extrabold text-rose-600">
            {result ? formatPriceINR(result.projectedAnnualSavings) : '...'}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Enough to cover multiple annual comprehensive insurance renewals!
          </p>

          <div className="mt-6 pt-6 border-t border-pink-100 space-y-4">
            <div className="p-3 rounded-xl bg-white border border-pink-100 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Monthly Petrol Cost</span>
                <span className="text-sm font-bold text-red-500">
                  {result ? formatPriceINR(result.monthlyCost) : '...'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-medium">Running Cost</span>
                <span className="text-xs font-bold text-slate-700">
                  ₹{result ? result.costPerKm.toFixed(2) : '...'} / km
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-xs text-emerald-800 block font-medium">Monthly Electric Equivalent</span>
                <span className="text-sm font-bold text-emerald-700">
                  {result ? formatPriceINR(result.monthlyCost.valueOf() - (result.projectedAnnualSavings.valueOf() / 12)) : '...'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-800 block font-medium">Running Cost</span>
                <span className="text-xs font-bold text-emerald-600">~₹0.85 / km</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-100/60 to-pink-100/60 border border-rose-200 text-center">
              <span className="text-xs text-slate-700 uppercase font-bold block mb-0.5">
                5-Year Cumulative Fuel Savings
              </span>
              <span className="text-2xl font-black text-rose-600">
                {result ? formatPriceINR(result.projectedAnnualSavings.valueOf() * 5) : '...'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-pink-100">
          <p className="text-[10px] text-slate-500">
            * Assumptions: Home charging efficiency ~85%, domestic tariff slab ~₹8.50/unit, petrol base Delhi ₹96.72/L.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TAB 3: 5-YEAR TOTAL COST OF OWNERSHIP (TCO)
// ==========================================
const TcoCalculatorTab: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState(1400000);
  const [years, setYears] = useState(5);
  const [annualKm, setAnnualKm] = useState(12000);
  const [isElectric, setIsElectric] = useState(false);
  const [mileage, setMileage] = useState(17.0);

  const [tco, setTco] = useState<OwnershipCostResult | null>(null);

  useEffect(() => {
    const fetchTco = async () => {
      try {
        const res = await api.calculateOwnershipCost({
          purchasePrice,
          years,
          annualKm,
          isElectric,
          mileage,
        });
        setTco(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTco();
  }, [purchasePrice, years, annualKm, isElectric, mileage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-card border border-pink-200/80 bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-900">
      <div className="lg:col-span-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-500" />
            True Cost of Ownership (TCO) Analyzer
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Accounts for vehicle on-road price, fuel/energy, periodic maintenance, comprehensive insurance, and market resale value.
          </p>
        </div>

        <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">On-Road Purchase Price</label>
            <span className="text-base font-bold text-rose-600">{formatPriceINR(purchasePrice)}</span>
          </div>
          <input
            type="range"
            min={150000}
            max={4000000}
            step={25000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              Holding Tenure
            </label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm cursor-pointer"
            >
              <option value={3}>3 Years</option>
              <option value={5}>5 Years (Standard)</option>
            </select>
          </div>

          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
            <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
              Powertrain Type
            </label>
            <select
              value={isElectric ? 'EV' : 'ICE'}
              onChange={(e) => setIsElectric(e.target.value === 'EV')}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm cursor-pointer"
            >
              <option value="ICE">Petrol / Diesel Engine</option>
              <option value="EV">Pure Electric (EV)</option>
            </select>
          </div>
        </div>

        <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Annual Distance (km)</label>
            <span className="text-sm font-bold text-slate-900">{annualKm.toLocaleString()} km / yr</span>
          </div>
          <input
            type="range"
            min={5000}
            max={30000}
            step={1000}
            value={annualKm}
            onChange={(e) => setAnnualKm(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Right TCO Breakdown */}
      <div className="lg:col-span-6 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 rounded-2xl border border-pink-200 p-6 flex flex-col justify-between shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-rose-600 font-bold block mb-1">
            Net {years}-Year Total Cost of Ownership
          </span>
          <div className="text-4xl font-extrabold text-slate-900">
            {tco ? formatPriceINR(tco.netTotalCostOfOwnership) : '...'}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Effective True Cost:{' '}
            <strong className="text-rose-600 font-bold">
              {tco ? formatPriceINR(tco.effectiveMonthlyOwnershipCost) : '...'} / month
            </strong>
          </p>

          {/* Breakdown items */}
          <div className="mt-6 pt-6 border-t border-pink-100 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">+ On-Road Purchase Cost</span>
              <strong className="text-slate-900">{tco ? formatPriceINR(tco.purchasePrice) : '...'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">+ Total Fuel / Energy Expense</span>
              <strong className="text-slate-900">{tco ? formatPriceINR(tco.totalFuelEnergyCost) : '...'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">+ Scheduled Servicing & Wear</span>
              <strong className="text-slate-900">{tco ? formatPriceINR(tco.totalMaintenanceCost) : '...'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">+ Comprehensive Insurance ({years} Yrs)</span>
              <strong className="text-slate-900">{tco ? formatPriceINR(tco.totalInsuranceCost) : '...'}</strong>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold pt-2 border-t border-pink-100">
              <span>- Estimated Resale Value at End of Tenure</span>
              <span>{tco ? formatPriceINR(tco.estimatedResaleValue) : '...'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-pink-100">
          <p className="text-[10px] text-slate-500">
            * Resale value derived from average Indian used car depreciation curve (~50% retention after 5 years for Japanese/Indian brands).
          </p>
        </div>
      </div>
    </div>
  );
};
