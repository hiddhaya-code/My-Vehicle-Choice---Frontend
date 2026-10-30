import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calculator, 
  IndianRupee, 
  Zap, 
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { 
  EmiCalculationResult, 
  RunningCostResult, 
  OwnershipCostResult 
} from '../types';
import { formatPriceINR } from '../utils/formatters';

export const CalculatorsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab')?.toUpperCase();
  const initialTab = (tabParam === 'SAVINGS' || tabParam === 'TCO') ? tabParam : 'EMI';
  const [activeTab, setActiveTab] = useState<'EMI' | 'SAVINGS' | 'TCO'>(initialTab);

  useEffect(() => {
    if (tabParam === 'SAVINGS' || tabParam === 'TCO' || tabParam === 'EMI') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="min-h-screen bg-[#F4F0E8] py-10 px-4 sm:px-6 lg:px-8 text-[#171717] relative overflow-hidden">
      {/* Subtle luxury ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight font-heading">
            Vehicle Ownership & Financial Calculators
          </h1>
          <p className="text-neutral-600 text-sm mt-2 font-body max-w-2xl mx-auto">
            Calculate accurate monthly loan EMIs, simulate real-world EV vs Petrol savings, and uncover the true 5-year Total Cost of Ownership before signing any papers.
          </p>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl luxury-card p-1.5 max-w-md mx-auto mt-6 shadow-sm border-[#171717]/10">
            <button
              onClick={() => setActiveTab('EMI')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer font-heading ${
                activeTab === 'EMI'
                  ? 'bg-[#171717] text-[#B9975B] shadow-sm'
                  : 'text-neutral-600 hover:text-[#171717]'
              }`}
            >
              Loan EMI
            </button>
            <button
              onClick={() => setActiveTab('SAVINGS')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer font-heading ${
                activeTab === 'SAVINGS'
                  ? 'bg-[#171717] text-[#B9975B] shadow-sm'
                  : 'text-neutral-600 hover:text-[#171717]'
              }`}
            >
              Petrol vs EV
            </button>
            <button
              onClick={() => setActiveTab('TCO')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer font-heading ${
                activeTab === 'TCO'
                  ? 'bg-[#171717] text-[#B9975B] shadow-sm'
                  : 'text-neutral-600 hover:text-[#171717]'
              }`}
            >
              5-Year TCO
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

  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPercent) / 100);

  const calculate = async () => {
    try {
      const res = await api.calculateEmi({
        vehiclePrice,
        downPayment: downPaymentAmount,
        annualInterestRate: interestRate,
        tenureMonths,
      });
      setResult(res);
    } catch (err) {
      console.warn('Backend API offline or sleeping, using client-side mathematical formula:', err);
      const principal = vehiclePrice - downPaymentAmount;
      const monthlyRate = interestRate / (12 * 100);
      const emi = monthlyRate === 0 
        ? principal / tenureMonths
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      const totalRepay = emi * tenureMonths;
      setResult({
        loanPrincipal: principal,
        monthlyEmi: Math.round(emi),
        totalRepayment: Math.round(totalRepay),
        totalInterest: Math.round(totalRepay - principal),
        annualInterestRate: interestRate,
        tenureMonths: tenureMonths,
        assumptions: `Calculated using standard reducing-balance method with ${interestRate}% p.a. interest over ${tenureMonths} months.`,
      });
    }
  };

  useEffect(() => {
    calculate();
  }, [vehiclePrice, downPaymentPercent, interestRate, tenureMonths]);

  const principalRatio = result ? Math.round((result.loanPrincipal / result.totalRepayment) * 100) : 80;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 luxury-card rounded-3xl p-6 sm:p-8">
      {/* Left Form */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
            <IndianRupee className="w-5 h-5 text-[#B9975B]" />
            Auto Loan EMI Estimator
          </h2>
          <p className="text-xs text-neutral-600 mt-1 font-body">
            Calculated using standard Indian banking reducing balance amortization (P × r × (1 + r)^n / ((1 + r)^n - 1)).
          </p>
        </div>

        {/* Vehicle Price Slider */}
        <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-neutral-700 uppercase font-heading">On-Road Vehicle Price</label>
            <span className="text-base font-bold text-[#171717] tabular-nums font-heading">{formatPriceINR(vehiclePrice)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={5000000}
            step={25000}
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(Number(e.target.value))}
            className="w-full accent-[#B9975B] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-body">
            <span>₹1 Lakh (Bike)</span>
            <span>₹15 Lakh (Mid SUV)</span>
            <span>₹50 Lakh (Luxury)</span>
          </div>
        </div>

        {/* Down payment */}
        <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-neutral-700 uppercase font-heading">Down Payment ({downPaymentPercent}%)</label>
            <span className="text-base font-bold text-[#171717] tabular-nums font-heading">{formatPriceINR(downPaymentAmount)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-[#B9975B] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-body">
            <span>0% (100% On-Road Funding)</span>
            <span>20% (Recommended)</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest Rate & Tenure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body">
          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
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
                className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-sm font-bold focus:outline-none focus:border-[#B9975B] shadow-sm tabular-nums"
              />
              <span className="text-neutral-500 text-xs font-bold">%</span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">SBI/HDFC rates typically 8.75% - 10.5%</span>
          </div>

          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
              Loan Tenure (Months)
            </label>
            <select
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-sm font-bold focus:outline-none focus:border-[#B9975B] shadow-sm cursor-pointer"
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
      <div className="lg:col-span-5 bg-[#171717] text-white rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#B9975B] font-bold block mb-1 font-heading">
            Estimated Monthly Payment
          </span>
          <div className="text-4xl font-extrabold text-[#B9975B] tabular-nums font-heading">
            {result ? formatPriceINR(result.monthlyEmi) : '...'}
            <span className="text-sm text-neutral-400 font-normal font-body"> / month</span>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-800 space-y-3.5 font-body">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Loan Principal Funded</span>
              <strong className="text-white font-bold tabular-nums">
                {result ? formatPriceINR(result.loanPrincipal) : '...'}
              </strong>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Total Interest Payable</span>
              <strong className="text-neutral-200 font-bold tabular-nums">
                {result ? formatPriceINR(result.totalInterest) : '...'}
              </strong>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Total Repayment Over Tenure</span>
              <strong className="text-[#B9975B] font-bold tabular-nums">
                {result ? formatPriceINR(result.totalRepayment) : '...'}
              </strong>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-[10px] text-neutral-400 mb-1.5 font-medium font-body">
              <span>Principal: {principalRatio}%</span>
              <span>Interest: {100 - principalRatio}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden flex border border-neutral-700">
              <div
                className="bg-[#B9975B] h-full transition-all duration-300"
                style={{ width: `${principalRatio}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-800">
          <p className="text-[10px] text-neutral-400 leading-relaxed font-body">
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
        console.warn('Backend API offline or sleeping, using client-side mathematical formula:', e);
        const petrolLitres = monthlyKm / (petrolKmpl > 0 ? petrolKmpl : 16.5);
        const petrolMonthly = petrolLitres * petrolPrice;
        const evEnergyPerKm = evRangeKm > 0 ? evBatteryKwh / evRangeKm : 0.1;
        const evCostPerKm = evEnergyPerKm * electricityTariff;
        const evMonthly = monthlyKm * evCostPerKm;
        setResult({
          costPerKm: Math.round((petrolPrice / (petrolKmpl > 0 ? petrolKmpl : 16.5)) * 100) / 100,
          monthlyCost: Math.round(petrolMonthly),
          annualCost: Math.round(petrolMonthly * 12),
          equivalentPetrolCostMonthly: Math.round(petrolMonthly),
          projectedAnnualSavings: Math.max(0, Math.round((petrolMonthly - evMonthly) * 12)),
          powertrainType: 'INTERNAL_COMBUSTION',
          formulaExplanation: `Fuel consumed: ${petrolLitres.toFixed(1)} L/mo at ${petrolKmpl} km/l vs ₹${electricityTariff}/kWh power tariff.`,
        });
      }
    };
    run();
  }, [monthlyKm, petrolPrice, petrolKmpl, electricityTariff, evRangeKm, evBatteryKwh]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 luxury-card rounded-3xl p-6 sm:p-8">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
            <Zap className="w-5 h-5 text-[#B9975B]" />
            Electric vs Petrol Fuel Savings Simulator
          </h2>
          <p className="text-xs text-neutral-600 mt-1 font-body">
            Compare real monthly and cumulative running expenses based on current fuel rates and domestic power tariffs.
          </p>
        </div>

        {/* Monthly Km */}
        <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-neutral-700 uppercase font-heading">Monthly Driving Distance</label>
            <span className="text-base font-bold text-[#171717] tabular-nums font-heading">{monthlyKm.toLocaleString()} km / month</span>
          </div>
          <input
            type="range"
            min={400}
            max={4000}
            step={50}
            value={monthlyKm}
            onChange={(e) => setMonthlyKm(Number(e.target.value))}
            className="w-full accent-[#B9975B] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-body">
            <span>400 km (Low City)</span>
            <span>1,200 km (Avg Commute)</span>
            <span>4,000 km (Heavy Fleet)</span>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-4 font-body">
          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
              Petrol Price (₹ / Litre)
            </label>
            <input
              type="number"
              step="0.5"
              value={petrolPrice}
              onChange={(e) => setPetrolPrice(Number(e.target.value))}
              className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-sm font-bold focus:outline-none focus:border-[#B9975B] shadow-sm tabular-nums"
            />
          </div>

          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
              Petrol Car Mileage (km/l)
            </label>
            <input
              type="number"
              step="0.5"
              value={petrolKmpl}
              onChange={(e) => setPetrolKmpl(Number(e.target.value))}
              className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-sm font-bold focus:outline-none focus:border-[#B9975B] shadow-sm tabular-nums"
            />
          </div>

          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
              Home Electricity (₹ / Unit)
            </label>
            <input
              type="number"
              step="0.5"
              value={electricityTariff}
              onChange={(e) => setElectricityTariff(Number(e.target.value))}
              className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-sm font-bold focus:outline-none focus:border-[#B9975B] shadow-sm tabular-nums"
            />
          </div>

          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
              EV Certified Range (km)
            </label>
            <input
              type="number"
              step="10"
              value={evRangeKm}
              onChange={(e) => setEvRangeKm(Number(e.target.value))}
              className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-sm font-bold focus:outline-none focus:border-[#B9975B] shadow-sm tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Right Savings Result */}
      <div className="lg:col-span-5 bg-[#171717] text-white rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#B9975B] font-bold block mb-1 font-heading">
            Projected Annual Cash Savings with EV
          </span>
          <div className="text-4xl font-extrabold text-[#B9975B] tabular-nums font-heading">
            {result ? formatPriceINR(result.projectedAnnualSavings) : '...'}
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-body">
            Enough to cover multiple annual comprehensive insurance renewals!
          </p>

          <div className="mt-6 pt-6 border-t border-neutral-800 space-y-4 font-body">
            <div className="p-3.5 rounded-xl bg-[#242424] border border-neutral-700 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Monthly Petrol Cost</span>
                <span className="text-sm font-bold text-neutral-200 tabular-nums">
                  {result ? formatPriceINR(result.monthlyCost) : '...'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block font-medium">Running Cost</span>
                <span className="text-xs font-bold text-neutral-300 tabular-nums">
                  ₹{result ? result.costPerKm.toFixed(2) : '...'} / km
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1c2e22] border border-emerald-800/60 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-xs text-emerald-400 block font-medium">Monthly Electric Equivalent</span>
                <span className="text-sm font-bold text-emerald-300 tabular-nums">
                  {result ? formatPriceINR(result.monthlyCost.valueOf() - (result.projectedAnnualSavings.valueOf() / 12)) : '...'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 block font-medium">Running Cost</span>
                <span className="text-xs font-bold text-emerald-300 tabular-nums">~₹0.85 / km</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#242424] border border-[#B9975B]/30 text-center">
              <span className="text-xs text-neutral-300 uppercase font-bold block mb-0.5 font-heading">
                5-Year Cumulative Fuel Savings
              </span>
              <span className="text-2xl font-black text-[#B9975B] tabular-nums font-heading">
                {result ? formatPriceINR(result.projectedAnnualSavings.valueOf() * 5) : '...'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-800">
          <p className="text-[10px] text-neutral-400 font-body">
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
  const [mileage] = useState(17.0);

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
        console.warn('Backend API offline or sleeping, using client-side mathematical formula:', e);
        const fuelCostAnnual = isElectric ? (annualKm * 0.12 * 8.5) : ((annualKm / (mileage || 16.5)) * 96.72);
        const totalFuel = fuelCostAnnual * years;
        const totalMaint = (isElectric ? 8000 : 15000) * years;
        const totalIns = (purchasePrice * 0.03) * years;
        const resale = purchasePrice * Math.pow(0.85, years);
        const interest = (purchasePrice * 0.8) * 0.095 * (years > 5 ? 5 : years) * 0.6;
        const netTco = purchasePrice + interest + totalFuel + totalMaint + totalIns - resale;
        setTco({
          tenureYears: years,
          purchasePrice,
          financingInterest: Math.round(interest),
          totalFuelEnergyCost: Math.round(totalFuel),
          totalMaintenanceCost: Math.round(totalMaint),
          totalInsuranceCost: Math.round(totalIns),
          estimatedResaleValue: Math.round(resale),
          netTotalCostOfOwnership: Math.round(netTco),
          effectiveMonthlyOwnershipCost: Math.round(netTco / (years * 12)),
          costBreakdown: {
            'Depreciation & Net Capital': Math.round(purchasePrice - resale),
            'Financing Interest': Math.round(interest),
            'Fuel / Electricity': Math.round(totalFuel),
            'Scheduled Maintenance': Math.round(totalMaint),
            'Insurance': Math.round(totalIns),
          },
          disclaimer: 'Calculated using standard automotive industry 5-year ownership depreciation models.',
        });
      }
    };
    fetchTco();
  }, [purchasePrice, years, annualKm, isElectric, mileage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 luxury-card rounded-3xl p-6 sm:p-8">
      <div className="lg:col-span-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
            <Layers className="w-5 h-5 text-[#B9975B]" />
            True Cost of Ownership (TCO) Analyzer
          </h2>
          <p className="text-xs text-neutral-600 mt-1 font-body">
            Accounts for vehicle on-road price, fuel/energy, periodic maintenance, comprehensive insurance, and market resale value.
          </p>
        </div>

        <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-neutral-700 uppercase font-heading">On-Road Purchase Price</label>
            <span className="text-base font-bold text-[#171717] tabular-nums font-heading">{formatPriceINR(purchasePrice)}</span>
          </div>
          <input
            type="range"
            min={150000}
            max={4000000}
            step={25000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-[#B9975B] cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 font-body">
          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
              Holding Tenure
            </label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs font-bold focus:outline-none focus:border-[#B9975B] shadow-sm cursor-pointer"
            >
              <option value={3}>3 Years</option>
              <option value={5}>5 Years (Standard)</option>
            </select>
          </div>

          <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
            <label className="text-xs font-semibold text-neutral-700 uppercase block mb-1 font-heading">
              Powertrain Type
            </label>
            <select
              value={isElectric ? 'EV' : 'ICE'}
              onChange={(e) => setIsElectric(e.target.value === 'EV')}
              className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs font-bold focus:outline-none focus:border-[#B9975B] shadow-sm cursor-pointer"
            >
              <option value="ICE">Petrol / Diesel Engine</option>
              <option value="EV">Pure Electric (EV)</option>
            </select>
          </div>
        </div>

        <div className="bg-[#F4F0E8]/60 p-4 rounded-2xl border border-[#171717]/10">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-neutral-700 uppercase font-heading">Annual Distance (km)</label>
            <span className="text-sm font-bold text-[#171717] tabular-nums font-heading">{annualKm.toLocaleString()} km / yr</span>
          </div>
          <input
            type="range"
            min={5000}
            max={30000}
            step={1000}
            value={annualKm}
            onChange={(e) => setAnnualKm(Number(e.target.value))}
            className="w-full accent-[#B9975B] cursor-pointer"
          />
        </div>
      </div>

      {/* Right TCO Breakdown */}
      <div className="lg:col-span-6 bg-[#171717] text-white rounded-2xl border border-neutral-800 p-6 flex flex-col justify-between shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#B9975B] font-bold block mb-1 font-heading">
            Net {years}-Year Total Cost of Ownership
          </span>
          <div className="text-4xl font-extrabold text-[#B9975B] tabular-nums font-heading">
            {tco ? formatPriceINR(tco.netTotalCostOfOwnership) : '...'}
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-body">
            Effective True Cost:{' '}
            <strong className="text-white font-bold tabular-nums">
              {tco ? formatPriceINR(tco.effectiveMonthlyOwnershipCost) : '...'} / month
            </strong>
          </p>

          {/* Breakdown items */}
          <div className="mt-6 pt-6 border-t border-neutral-800 space-y-2.5 text-xs font-body">
            <div className="flex justify-between">
              <span className="text-neutral-400">+ On-Road Purchase Cost</span>
              <strong className="text-white tabular-nums">{tco ? formatPriceINR(tco.purchasePrice) : '...'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">+ Total Fuel / Energy Expense</span>
              <strong className="text-white tabular-nums">{tco ? formatPriceINR(tco.totalFuelEnergyCost) : '...'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">+ Scheduled Servicing & Wear</span>
              <strong className="text-white tabular-nums">{tco ? formatPriceINR(tco.totalMaintenanceCost) : '...'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">+ Comprehensive Insurance ({years} Yrs)</span>
              <strong className="text-white tabular-nums">{tco ? formatPriceINR(tco.totalInsuranceCost) : '...'}</strong>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-neutral-800">
              <span>- Estimated Resale Value at End of Tenure</span>
              <span className="tabular-nums">{tco ? formatPriceINR(tco.estimatedResaleValue) : '...'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-800">
          <p className="text-[10px] text-neutral-400 font-body">
            * Resale value derived from average Indian used car depreciation curve (~50% retention after 5 years for Japanese/Indian brands).
          </p>
        </div>
      </div>
    </div>
  );
};
