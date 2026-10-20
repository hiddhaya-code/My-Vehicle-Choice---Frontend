import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  IndianRupee, 
  Car, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Sliders,
  MapPin,
  Bike,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { QuestionnaireAnswers, VehicleCategory } from '../types';
import { formatPriceINR } from '../utils/formatters';

export const QuestionnairePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State with rich defaults
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    budgetAmount: 1200000,
    budgetType: 'PURCHASE',
    isStrictBudget: false,
    city: user?.city || 'New Delhi',
    state: 'Delhi NCR',
    category: 'CAR',
    bodyStyle: 'SUV',
    preferredFuels: ['PETROL', 'ELECTRIC'],
    preferredTransmission: 'ANY',
    dailyDistanceKm: 35,
    cityDrivingPercent: 75,
    evHomeChargingAvailable: true,
    evChargingAccess: 'HOME_CHARGING',
    performancePriority: 'BALANCED',
    minSeatingCapacity: 5,
    highGroundClearanceNeeded: true,
    ridingErgonomics: 'UPRIGHT_COMMUTER',
    topPriorities: ['SAFETY', 'MILEAGE', 'COMFORT'],
    nonNegotiables: [],
    allowNearMatches: true,
  });

  // Guest details if not authenticated
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const isTwoWheeler = answers.category === 'MOTORCYCLE' || 
                       answers.category === 'SCOOTER' || 
                       answers.category === 'ELECTRIC_TWO_WHEELER';

  const isEV = answers.category === 'ELECTRIC_CAR' || 
               answers.category === 'ELECTRIC_TWO_WHEELER' || 
               answers.preferredFuels?.includes('ELECTRIC');

  const updateAnswers = (updates: Partial<QuestionnaireAnswers>) => {
    setAnswers(prev => ({ ...prev, ...updates }));
  };

  const handleCategorySelect = (category: VehicleCategory) => {
    if (category === 'MOTORCYCLE') {
      updateAnswers({
        category,
        bodyStyle: undefined,
        budgetAmount: answers.budgetAmount > 500000 ? 180000 : answers.budgetAmount,
        preferredFuels: ['PETROL'],
        ridingErgonomics: 'UPRIGHT_COMMUTER'
      });
    } else if (category === 'SCOOTER') {
      updateAnswers({
        category,
        bodyStyle: undefined,
        budgetAmount: answers.budgetAmount > 300000 ? 110000 : answers.budgetAmount,
        preferredFuels: ['PETROL'],
        ridingErgonomics: 'EASY_SCOOTER'
      });
    } else if (category === 'ELECTRIC_TWO_WHEELER') {
      updateAnswers({
        category,
        bodyStyle: undefined,
        budgetAmount: answers.budgetAmount > 300000 ? 140000 : answers.budgetAmount,
        preferredFuels: ['ELECTRIC'],
        evChargingAccess: 'HOME_CHARGING',
        ridingErgonomics: 'EASY_SCOOTER'
      });
    } else if (category === 'ELECTRIC_CAR') {
      updateAnswers({
        category,
        bodyStyle: 'SUV',
        budgetAmount: answers.budgetAmount < 800000 ? 1400000 : answers.budgetAmount,
        preferredFuels: ['ELECTRIC'],
        evChargingAccess: 'HOME_CHARGING',
        minSeatingCapacity: 5
      });
    } else {
      updateAnswers({
        category,
        bodyStyle: 'SUV',
        budgetAmount: answers.budgetAmount < 400000 ? 1200000 : answers.budgetAmount,
        preferredFuels: ['PETROL'],
        minSeatingCapacity: 5
      });
    }
  };

  const handleNext = () => {
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleArrayItem = (key: 'preferredFuels' | 'topPriorities' | 'nonNegotiables', item: string) => {
    const list = answers[key] || [];
    if (list.includes(item)) {
      updateAnswers({ [key]: list.filter(i => i !== item) });
    } else {
      updateAnswers({ [key]: [...list, item] });
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload: QuestionnaireAnswers = {
        ...answers,
        // Sync allowNearMatches with isStrictBudget
        allowNearMatches: !answers.isStrictBudget && answers.allowNearMatches !== false,
      };

      const response = await api.evaluateRecommendations(payload);
      // Store in sessionStorage for fast recovery on page refresh
      sessionStorage.setItem('mvc_recommendation_results', JSON.stringify({
        response,
        answers: payload,
        guestName: user?.fullName || guestName,
      }));
      navigate('/recommendations', {
        state: {
          response,
          answers: payload,
          guestName: user?.fullName || guestName,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate recommendations. Please review your answers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Wizard Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Category Automotive Recommendation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Find Your Ideal Vehicle
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Accurate, category-tailored vehicle matching evaluating real on-road costs, safety ratings, ergonomic suitability, and verifiable manufacturer specs.
          </p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-semibold">
              <span>Step {step} of {totalSteps}</span>
              <span className="text-rose-600 font-bold">{Math.round((step / totalSteps) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden border border-pink-200">
              <div 
                className="bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 h-2 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="glass-card rounded-2xl border border-pink-200/80 p-6 sm:p-8 shadow-xl bg-white text-slate-900">
          
          {/* STEP 1: Budget, Strictness & Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-rose-500" />
                  What is your target budget and location?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We use location-specific RTO taxes and insurance to calculate real on-road costs rather than misleading base ex-showroom quotes.
                </p>
              </div>

              {/* Purchase vs EMI toggle */}
              <div className="flex rounded-xl bg-rose-50/50 p-1 border border-pink-200">
                <button
                  type="button"
                  onClick={() => updateAnswers({ budgetType: 'PURCHASE' })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    answers.budgetType === 'PURCHASE'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Total On-Road Budget
                </button>
                <button
                  type="button"
                  onClick={() => updateAnswers({ budgetType: 'EMI' })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    answers.budgetType === 'EMI'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly Loan EMI Budget
                </button>
              </div>

              {/* Budget Display & Slider */}
              <div className="bg-pink-50/40 p-5 rounded-xl border border-pink-100 text-center">
                <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                  Selected {answers.budgetType === 'PURCHASE' ? 'Purchase Budget' : 'Monthly Loan EMI'}
                </span>
                <span className="text-3xl font-extrabold text-rose-600">
                  {formatPriceINR(answers.budgetAmount)}
                </span>
                {answers.budgetType === 'EMI' ? (
                  <span className="text-xs text-slate-500 block mt-1">
                    (Supports approx. ₹{Math.round(answers.budgetAmount * 59.41).toLocaleString('en-IN')} on-road vehicle value at 60 months @ 9.5% APR)
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 block mt-1">
                    All taxes, registration & insurance included
                  </span>
                )}

                <input
                  type="range"
                  min={answers.budgetType === 'PURCHASE' ? 80000 : 3000}
                  max={answers.budgetType === 'PURCHASE' ? 3500000 : 65000}
                  step={answers.budgetType === 'PURCHASE' ? (answers.budgetAmount < 500000 ? 10000 : 25000) : 1000}
                  value={answers.budgetAmount}
                  onChange={(e) => updateAnswers({ budgetAmount: Number(e.target.value) })}
                  className="w-full mt-6 accent-rose-500 cursor-pointer"
                />

                {/* Presets */}
                {answers.budgetType === 'PURCHASE' && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {[
                      { label: '₹1 - 1.5 Lakh (Scooter/125cc)', val: 120000 },
                      { label: '₹1.5 - 2.5 Lakh (200cc+ / EV 2W)', val: 200000 },
                      { label: '₹7 - 10 Lakh (Hatch / EV)', val: 850000 },
                      { label: '₹11 - 15 Lakh (Compact SUV)', val: 1300000 },
                      { label: '₹16 - 25 Lakh (Sedan / EV SUV)', val: 2000000 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => updateAnswers({ budgetAmount: preset.val })}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          answers.budgetAmount === preset.val
                            ? 'bg-rose-50 border-rose-500 text-rose-600 font-bold shadow-sm'
                            : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Strict Budget Enforcement Toggle */}
              <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/30 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Enforce Strict Budget Ceiling?</span>
                    {answers.isStrictBudget && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">Strict</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {answers.isStrictBudget 
                      ? 'Zero tolerance: No vehicle above your stated amount will be shown.'
                      : 'Flexible: Allows showing highly compelling matches up to +15% over budget in a separate section.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateAnswers({ isStrictBudget: !answers.isStrictBudget })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    answers.isStrictBudget
                      ? 'btn-galaxy-primary text-white font-bold shadow-sm'
                      : 'bg-white text-slate-700 border border-pink-200 hover:border-pink-300'
                  }`}
                >
                  {answers.isStrictBudget ? 'Strict (Zero Over)' : 'Flexible (+15% Near)'}
                </button>
              </div>

              {/* City & State Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Registration Location (For Accurate State RTO Taxes & Local Dealer Search)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { city: 'New Delhi', state: 'Delhi NCR' },
                    { city: 'Bengaluru', state: 'Karnataka' },
                    { city: 'Mumbai', state: 'Maharashtra' },
                    { city: 'Chennai', state: 'Tamil Nadu' },
                    { city: 'Pune', state: 'Maharashtra' },
                    { city: 'Hyderabad', state: 'Telangana' },
                  ].map((loc) => (
                    <button
                      key={loc.city}
                      type="button"
                      onClick={() => updateAnswers({ city: loc.city, state: loc.state })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-colors cursor-pointer ${
                        answers.city === loc.city
                          ? 'bg-rose-50 border-rose-500 text-rose-600 font-bold shadow-sm'
                          : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.city}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{loc.state}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Category & Body Style / Riding Type */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-rose-500" />
                  Select your vehicle category
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Each vehicle category evaluates category-specific parameters (e.g. seat height & ABS for bikes, NCAP stars & boot space for cars).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'CAR', icon: Car, title: 'Passenger Car (ICE)', desc: 'Hatchbacks, Compact SUVs, Sedans, MPVs' },
                  { id: 'ELECTRIC_CAR', icon: Zap, title: 'Electric Car (EV)', desc: 'Zero emissions, instant torque, lowest running cost' },
                  { id: 'MOTORCYCLE', icon: Bike, title: 'Motorcycle / Bike', desc: 'Commuter, sporty roadster, cruiser or tourer' },
                  { id: 'ELECTRIC_TWO_WHEELER', icon: Zap, title: 'Electric 2-Wheeler', desc: 'Smart electric scooter with fast charging' },
                  { id: 'SCOOTER', icon: Bike, title: 'ICE Scooter', desc: 'Convenient gearless urban daily runabout' },
                ].map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id as VehicleCategory)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        answers.category === cat.id
                          ? 'bg-rose-50/80 border-rose-500 text-slate-900 shadow-md ring-1 ring-rose-400'
                          : 'bg-white border-pink-200 text-slate-800 hover:border-pink-300 hover:bg-pink-50/30'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-rose-500" />
                          {cat.title}
                        </span>
                        {answers.category === cat.id && (
                          <CheckCircle2 className="w-4 h-4 text-rose-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 pl-6">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Body Style if Car / EV Car */}
              {(answers.category === 'CAR' || answers.category === 'ELECTRIC_CAR') && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Preferred Body Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['SUV', 'HATCHBACK', 'SEDAN'].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => updateAnswers({ bodyStyle: style })}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                          answers.bodyStyle === style
                            ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                            : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditional Riding Style if Motorcycle */}
              {answers.category === 'MOTORCYCLE' && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Riding Stance & Motorcycle Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'UPRIGHT_COMMUTER', label: 'Commuter / Daily', sub: 'Easy posture, plush suspension' },
                      { id: 'SPORTY_AGGRESSIVE', label: 'Sporty / Roadster', sub: 'Punchy performance, sharp cornering' },
                      { id: 'RELAXED_CRUISER', label: 'Cruiser / Retro', sub: 'Low seat, relaxed highway cruising' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => updateAnswers({ ridingErgonomics: m.id })}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          answers.ridingErgonomics === m.id
                            ? 'bg-rose-50 border-rose-500 text-rose-600 font-bold shadow-sm'
                            : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                        }`}
                      >
                        <div className="text-xs font-bold">{m.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{m.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Powertrain & Transmission */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-rose-500" />
                  Fuel & Powertrain Preferences
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Select acceptable propulsion types and transmission preference.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Acceptable Fuel Types (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(isTwoWheeler 
                    ? ['PETROL', 'ELECTRIC'] 
                    : ['PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID']
                  ).map((fuel) => {
                    const isSelected = answers.preferredFuels?.includes(fuel);
                    return (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => toggleArrayItem('preferredFuels', fuel)}
                        className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                            : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                        }`}
                      >
                        <span>{fuel}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Transmission Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'MANUAL', label: isTwoWheeler ? 'Geared (Foot Shift)' : 'Manual Gearbox' },
                    { id: 'AUTOMATIC', label: isTwoWheeler ? 'Automatic / Gearless' : 'Automatic / DCT / EV' },
                    { id: 'ANY', label: 'Either / Any' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateAnswers({ preferredTransmission: t.id })}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        answers.preferredTransmission === t.id
                          ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                          : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Commute Profile & Conditional EV Charging */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-rose-500" />
                  Your Commute & Daily Usage
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Daily running directly dictates whether Petrol, Diesel, or an EV yields maximum 5-year savings.
                </p>
              </div>

              {/* Commute Distance Slider */}
              <div className="bg-pink-50/40 p-5 rounded-xl border border-pink-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-600">
                    Average Daily Commute
                  </span>
                  <span className="text-lg font-bold text-rose-600">
                    {answers.dailyDistanceKm} km / day
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={answers.dailyDistanceKm}
                  onChange={(e) => updateAnswers({ dailyDistanceKm: Number(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>5 km (Weekend / Short)</span>
                  <span>35 km (Standard Commute)</span>
                  <span>120 km (High Mileage Highway)</span>
                </div>
              </div>

              {/* City vs Highway split */}
              <div className="bg-pink-50/40 p-5 rounded-xl border border-pink-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-600">
                    City vs Highway Traffic Split
                  </span>
                  <span className="text-sm font-bold text-rose-600">
                    {answers.cityDrivingPercent}% City / {100 - (answers.cityDrivingPercent || 70)}% Highway
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={90}
                  step={5}
                  value={answers.cityDrivingPercent}
                  onChange={(e) => updateAnswers({ cityDrivingPercent: Number(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Conditional EV Charging Availability - Only when EV is relevant */}
              {isEV ? (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      EV Charging Access Setup
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Home charging at ₹6.50/kWh yields ~₹1.10/km cost. Public DC fast charging is more expensive (~₹20-25/kWh).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'HOME_CHARGING', label: 'Dedicated Home Wallbox / 15A Socket', sub: 'Best convenience & lowest ₹/km' },
                      { id: 'OFFICE_ONLY', label: 'Office / Workplace Charging', sub: 'Regular parking access during hours' },
                      { id: 'PUBLIC_FAST_CHARGING', label: 'Rely on Public Fast Chargers', sub: 'Nearby commercial charging hubs' },
                      { id: 'NO_DEDICATED_CHARGING', label: 'No Dedicated Charging Access', sub: 'Caution: EV ownership may be inconvenient' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateAnswers({ 
                          evChargingAccess: opt.id,
                          evHomeChargingAvailable: opt.id === 'HOME_CHARGING'
                        })}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          answers.evChargingAccess === opt.id
                            ? 'bg-white border-emerald-500 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-400'
                            : 'bg-white/80 border-pink-200 text-slate-700 hover:border-emerald-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>EV charging questions skipped since internal combustion (Petrol/Diesel) is currently selected.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Category-Adaptive Practicality & Ergonomics */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-rose-500" />
                  {isTwoWheeler ? 'Ergonomics & Two-Wheeler Practicality' : 'Driving Dynamics & Cabin Practicality'}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  {isTwoWheeler 
                    ? 'Tune riding ergonomics, accessible seat height, and braking equipment for daily safety.'
                    : 'Tune engine dynamics, ground clearance for monsoon roads, and seating capacity.'}
                </p>
              </div>

              {/* Driving / Riding Dynamics */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  {isTwoWheeler ? 'Riding Dynamics & Engine Response' : 'Driving Dynamics & Temperament'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'RELAXED', label: 'Comfort & Plush', sub: 'Smooth, relaxed & soft ride' },
                    { id: 'BALANCED', label: 'Balanced Daily', sub: 'Peppy acceleration & daily efficiency' },
                    { id: 'SPORTY', label: 'Sporty & Spirited', sub: 'Punchy torque, aggressive throttle response' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateAnswers({ performancePriority: p.id })}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        answers.performancePriority === p.id
                          ? 'bg-rose-50 border-rose-500 text-rose-600 font-bold shadow-sm'
                          : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                      }`}
                    >
                      <div className="font-bold text-xs">{p.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category-Specific Practicality Section */}
              {!isTwoWheeler ? (
                <>
                  {/* High Ground Clearance toggle */}
                  <div className="p-4 rounded-xl border border-pink-100 bg-pink-50/40 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Need High Ground Clearance (&gt;180mm)?
                      </div>
                      <p className="text-xs text-slate-600">
                        Essential for flooded monsoon roads, steep speed breakers, and unpaved rural tracks.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateAnswers({ highGroundClearanceNeeded: !answers.highGroundClearanceNeeded })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        answers.highGroundClearanceNeeded
                          ? 'btn-galaxy-primary text-white font-bold shadow-sm'
                          : 'bg-white text-slate-600 border border-pink-200'
                      }`}
                    >
                      {answers.highGroundClearanceNeeded ? 'Yes, Required' : 'Not Crucial'}
                    </button>
                  </div>

                  {/* Seating */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      Minimum Passenger Seating Capacity
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: 5, label: '5 Seater (Standard)' },
                        { val: 7, label: '6/7 Seater (Large Family / MPV)' },
                      ].map((seat) => (
                        <button
                          key={seat.val}
                          type="button"
                          onClick={() => updateAnswers({ minSeatingCapacity: seat.val })}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                            answers.minSeatingCapacity === seat.val
                              ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                              : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                          }`}
                        >
                          {seat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Two-Wheeler Ergonomics & Seat Height Info */}
                  <div className="p-4 rounded-xl border border-pink-100 bg-pink-50/40 space-y-3">
                    <div className="text-sm font-bold text-slate-900">
                      Rider Ergonomics & Flat-foot Accessibility
                    </div>
                    <p className="text-xs text-slate-600">
                      Standard Indian seat height of 780–805 mm allows easy flat-footing for riders 5&apos;4&quot; and above.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'UPRIGHT_COMMUTER', label: 'Upright & Comfortable', sub: 'Relaxed shoulders, low fatigue' },
                        { id: 'SPORTY_AGGRESSIVE', label: 'Aggressive Clip-ons', sub: 'Tucked-in sporty stance' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => updateAnswers({ ridingErgonomics: r.id })}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-colors cursor-pointer ${
                            answers.ridingErgonomics === r.id
                              ? 'bg-white border-rose-500 text-rose-600 shadow-sm'
                              : 'bg-white/80 border-pink-200 text-slate-700 hover:border-pink-300'
                          }`}
                        >
                          <div>{r.label}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{r.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 6: Decision Factors & Strict Non-Negotiables */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500" />
                  Priorities & Strict Non-Negotiables
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Our algorithm will weigh your top priorities in normalized scoring and strictly discard any vehicle that violates your non-negotiables.
                </p>
              </div>

              {/* Top Priorities */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Select Your Top Decision Factors
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'SAFETY', label: isTwoWheeler ? 'Dual-Channel ABS Safety' : 'Safety & NCAP Rating' },
                    { id: 'MILEAGE', label: isEV ? 'Certified Range & Efficiency' : 'High Fuel Efficiency' },
                    { id: 'MAINTENANCE', label: 'Low Maintenance & Resale' },
                    { id: 'COMFORT', label: isTwoWheeler ? 'Ergonomic Stance & Suspension' : 'Ride Comfort & Space' },
                    { id: 'PERFORMANCE', label: 'Power & Acceleration' },
                  ].map((p) => {
                    const isSelected = answers.topPriorities?.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleArrayItem('topPriorities', p.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                            : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{p.label}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Non-Negotiables */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Strict Non-Negotiables (Zero Compromise Hard Filters)
                </label>
                <div className="space-y-2">
                  {[
                    ...(isTwoWheeler ? [
                      { id: 'DUAL_CHANNEL_ABS', label: 'Must have Dual-Channel ABS braking (Critical wet road safety)' },
                    ] : [
                      { id: 'SAFETY_5_STAR', label: 'Must have verified 5-Star Bharat NCAP / Global NCAP crash rating' },
                    ]),
                    { id: 'AUTOMATIC_ONLY', label: isTwoWheeler ? 'Must be gearless / automatic transmission' : 'Must be an Automatic transmission' },
                    { id: 'STRICT_BUDGET', label: 'Must strictly stay within budget (Do not show near-matches)' },
                  ].map((item) => {
                    const isChecked = answers.nonNegotiables?.includes(item.id) || 
                                      (item.id === 'STRICT_BUDGET' && answers.isStrictBudget);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          toggleArrayItem('nonNegotiables', item.id);
                          if (item.id === 'STRICT_BUDGET') {
                            updateAnswers({ isStrictBudget: !isChecked });
                          }
                        }}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold shadow-sm'
                            : 'bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:bg-pink-50/30'
                        }`}
                      >
                        <span className="text-xs font-medium">{item.label}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-rose-500 border-rose-500 text-white font-bold' : 'border-slate-300'
                        }`}>
                          {isChecked && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest identification if not logged in */}
              {!isAuthenticated && (
                <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/40 pt-3">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Enter your name and email to view your personalized match report:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-pink-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
                    />
                    <input
                      type="email"
                      placeholder="Your Email Address"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-pink-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-pink-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-semibold text-slate-600 transition-colors ${
                step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-rose-50 hover:text-slate-900 cursor-pointer shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-galaxy-primary text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <span>Evaluating Vehicles...</span>
              ) : step === totalSteps ? (
                <>
                  <span>Generate Recommendations</span>
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
