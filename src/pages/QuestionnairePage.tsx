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
    if (step < totalSteps) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleArrayItem = (key: keyof QuestionnaireAnswers, value: string) => {
    const current = (answers[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateAnswers({ [key]: next });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const submissionAnswers: QuestionnaireAnswers = {
      ...answers,
      isStrictBudget: answers.nonNegotiables?.includes('STRICT_BUDGET') || answers.isStrictBudget,
      allowNearMatches: !answers.nonNegotiables?.includes('STRICT_BUDGET') && !answers.isStrictBudget,
    };

    try {
      const result = await api.evaluateRecommendations(submissionAnswers);

      const navState = {
        response: result,
        answers: submissionAnswers,
        guestName: guestName.trim() || undefined,
      };

      sessionStorage.setItem('mvc_recommendation_results', JSON.stringify(navState));
      navigate('/recommendations', { state: navState });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Recommendation generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] py-12 px-4 sm:px-6 lg:px-8 text-[#171717] relative overflow-hidden">
      {/* Subtle luxury ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Wizard Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B9975B]/15 border border-[#B9975B]/30 text-[#8C6F37] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm font-heading">
            <Sparkles className="w-3.5 h-3.5 text-[#B9975B]" />
            <span>Multi-Category Automotive Recommendation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] font-heading">
            Find Your Ideal Vehicle
          </h1>
          <p className="mt-2 text-sm text-neutral-600 max-w-xl mx-auto font-body">
            Accurate, category-tailored vehicle matching evaluating real on-road costs, safety ratings, ergonomic suitability, and verifiable manufacturer specs.
          </p>

          {/* Progress Bar */}
          <div className="mt-6 font-body">
            <div className="flex justify-between text-xs text-neutral-500 mb-2 font-semibold">
              <span>Step {step} of {totalSteps}</span>
              <span className="text-[#8C6F37] font-bold tabular-nums">{Math.round((step / totalSteps) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden border border-[#171717]/10">
              <div 
                className="bg-[#B9975B] h-2 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3 shadow-sm font-body">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="luxury-card rounded-2xl p-6 sm:p-8 text-[#171717]">
          
          {/* STEP 1: Budget, Strictness & Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
                  <IndianRupee className="w-5 h-5 text-[#B9975B]" />
                  What is your target budget and location?
                </h2>
                <p className="text-xs text-neutral-500 mt-1 font-body">
                  We use location-specific RTO taxes and insurance to calculate real on-road costs rather than misleading base ex-showroom quotes.
                </p>
              </div>

              {/* Purchase vs EMI toggle */}
              <div className="flex rounded-xl bg-[#F4F0E8] p-1 border border-[#171717]/10 font-heading">
                <button
                  type="button"
                  onClick={() => updateAnswers({ budgetType: 'PURCHASE' })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    answers.budgetType === 'PURCHASE'
                      ? 'bg-[#171717] text-[#B9975B] shadow-sm'
                      : 'text-neutral-600 hover:text-[#171717]'
                  }`}
                >
                  Total On-Road Budget
                </button>
                <button
                  type="button"
                  onClick={() => updateAnswers({ budgetType: 'EMI' })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    answers.budgetType === 'EMI'
                      ? 'bg-[#171717] text-[#B9975B] shadow-sm'
                      : 'text-neutral-600 hover:text-[#171717]'
                  }`}
                >
                  Monthly Loan EMI Budget
                </button>
              </div>

              {/* Budget Display & Slider */}
              <div className="bg-[#F4F0E8]/60 p-5 rounded-xl border border-[#171717]/10 text-center font-body">
                <span className="text-xs uppercase tracking-wider text-neutral-600 font-semibold block mb-1 font-heading">
                  Selected {answers.budgetType === 'PURCHASE' ? 'Purchase Budget' : 'Monthly Loan EMI'}
                </span>
                <span className="text-3xl font-extrabold text-[#171717] tabular-nums font-heading">
                  {formatPriceINR(answers.budgetAmount)}
                </span>
                {answers.budgetType === 'EMI' ? (
                  <span className="text-xs text-neutral-500 block mt-1 tabular-nums">
                    (Supports approx. ₹{Math.round(answers.budgetAmount * 59.41).toLocaleString('en-IN')} on-road vehicle value at 60 months @ 9.5% APR)
                  </span>
                ) : (
                  <span className="text-xs text-neutral-500 block mt-1">
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
                  className="w-full mt-6 accent-[#B9975B] cursor-pointer"
                />

                {/* Presets */}
                {answers.budgetType === 'PURCHASE' && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4 font-body">
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
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer tabular-nums ${
                          answers.budgetAmount === preset.val
                            ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] font-bold shadow-sm'
                            : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Strict Budget Enforcement Toggle */}
              <div className="p-4 rounded-xl border border-[#171717]/10 bg-[#F4F0E8]/40 flex items-center justify-between font-body">
                <div>
                  <div className="text-sm font-bold text-[#171717] flex items-center gap-1.5 font-heading">
                    <span>Enforce Strict Budget Ceiling?</span>
                    {answers.isStrictBudget && (
                      <span className="text-[10px] bg-[#B9975B]/20 text-[#8C6F37] px-2 py-0.5 rounded font-bold">Strict</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {answers.isStrictBudget 
                      ? 'Zero tolerance: No vehicle above your stated amount will be shown.'
                      : 'Flexible: Allows showing highly compelling matches up to +15% over budget in a separate section.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateAnswers({ isStrictBudget: !answers.isStrictBudget })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer font-heading ${
                    answers.isStrictBudget
                      ? 'btn-charcoal text-[#B9975B]'
                      : 'bg-white text-neutral-700 border border-[#171717]/15 hover:border-[#B9975B]'
                  }`}
                >
                  {answers.isStrictBudget ? 'Strict (Zero Over)' : 'Flexible (+15% Near)'}
                </button>
              </div>

              {/* City & State Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
                  Registration Location (For Accurate State RTO Taxes & Local Dealer Search)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-body">
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
                          ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] font-bold shadow-sm'
                          : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                      }`}
                    >
                      <span className="font-semibold">{loc.city}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{loc.state}</span>
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
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
                  <Car className="w-5 h-5 text-[#B9975B]" />
                  Select your vehicle category
                </h2>
                <p className="text-xs text-neutral-600 mt-1 font-body">
                  Each vehicle category evaluates category-specific parameters (e.g. seat height & ABS for bikes, NCAP stars & boot space for cars).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body">
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
                          ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#171717] shadow-sm ring-1 ring-[#B9975B]'
                          : 'bg-white border-[#171717]/10 text-neutral-800 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center justify-between font-heading">
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#B9975B]" />
                          {cat.title}
                        </span>
                        {answers.category === cat.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#B9975B]" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 pl-6">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Body Style if Car / EV Car */}
              {(answers.category === 'CAR' || answers.category === 'ELECTRIC_CAR') && (
                <div className="pt-2 font-body">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
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
                            ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] shadow-sm'
                            : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
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
                <div className="pt-2 font-body">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
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
                            ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] font-bold shadow-sm'
                            : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                        }`}
                      >
                        <div className="text-xs font-bold font-heading">{m.label}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{m.sub}</div>
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
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
                  <Fuel className="w-5 h-5 text-[#B9975B]" />
                  Fuel & Powertrain Preferences
                </h2>
                <p className="text-xs text-neutral-600 mt-1 font-body">
                  Select acceptable propulsion types and transmission preference.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
                  Acceptable Fuel Types (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-body">
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
                            ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] shadow-sm'
                            : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                        }`}
                      >
                        <span>{fuel}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#B9975B]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
                  Transmission Preference
                </label>
                <div className="grid grid-cols-3 gap-2 font-body">
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
                          ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] shadow-sm'
                          : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
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
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
                  <Gauge className="w-5 h-5 text-[#B9975B]" />
                  Your Commute & Daily Usage
                </h2>
                <p className="text-xs text-neutral-600 mt-1 font-body">
                  Daily running directly dictates whether Petrol, Diesel, or an EV yields maximum 5-year savings.
                </p>
              </div>

              {/* Commute Distance Slider */}
              <div className="bg-[#F4F0E8]/60 p-5 rounded-xl border border-[#171717]/10 font-body">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-neutral-600 font-heading">
                    Average Daily Commute
                  </span>
                  <span className="text-lg font-bold text-[#171717] tabular-nums font-heading">
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
                  className="w-full accent-[#B9975B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                  <span>5 km (Weekend / Short)</span>
                  <span>35 km (Standard Commute)</span>
                  <span>120 km (High Mileage Highway)</span>
                </div>
              </div>

              {/* City vs Highway split */}
              <div className="bg-[#F4F0E8]/60 p-5 rounded-xl border border-[#171717]/10 font-body">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase text-neutral-600 font-heading">
                    City vs Highway Traffic Split
                  </span>
                  <span className="text-sm font-bold text-[#171717] tabular-nums font-heading">
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
                  className="w-full accent-[#B9975B] cursor-pointer"
                />
              </div>

              {/* Conditional EV Charging Availability */}
              {isEV ? (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3 font-body">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading">
                      EV Charging Access Setup
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
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
                            : 'bg-white/80 border-[#171717]/10 text-neutral-700 hover:border-emerald-300'
                        }`}
                      >
                        <div className="text-xs font-bold font-heading">{opt.label}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-white border border-[#171717]/10 text-xs text-neutral-500 flex items-center gap-2 font-body">
                  <Info className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <span>EV charging questions skipped since internal combustion (Petrol/Diesel) is currently selected.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Category-Adaptive Practicality & Ergonomics */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
                  <Sliders className="w-5 h-5 text-[#B9975B]" />
                  {isTwoWheeler ? 'Ergonomics & Two-Wheeler Practicality' : 'Driving Dynamics & Cabin Practicality'}
                </h2>
                <p className="text-xs text-neutral-600 mt-1 font-body">
                  {isTwoWheeler 
                    ? 'Tune riding ergonomics, accessible seat height, and braking equipment for daily safety.'
                    : 'Tune engine dynamics, ground clearance for monsoon roads, and seating capacity.'}
                </p>
              </div>

              {/* Driving / Riding Dynamics */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
                  {isTwoWheeler ? 'Riding Dynamics & Engine Response' : 'Driving Dynamics & Temperament'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-body">
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
                          ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] font-bold shadow-sm'
                          : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                      }`}
                    >
                      <div className="font-bold text-xs font-heading">{p.label}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category-Specific Practicality Section */}
              {!isTwoWheeler ? (
                <>
                  {/* High Ground Clearance toggle */}
                  <div className="p-4 rounded-xl border border-[#171717]/10 bg-[#F4F0E8]/40 flex items-center justify-between font-body">
                    <div>
                      <div className="text-sm font-bold text-[#171717] font-heading">
                        Need High Ground Clearance (&gt;180mm)?
                      </div>
                      <p className="text-xs text-neutral-600">
                        Essential for flooded monsoon roads, steep speed breakers, and unpaved rural tracks.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateAnswers({ highGroundClearanceNeeded: !answers.highGroundClearanceNeeded })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer font-heading ${
                        answers.highGroundClearanceNeeded
                          ? 'btn-charcoal text-[#B9975B]'
                          : 'bg-white text-neutral-600 border border-[#171717]/15'
                      }`}
                    >
                      {answers.highGroundClearanceNeeded ? 'Yes, Required' : 'Not Crucial'}
                    </button>
                  </div>

                  {/* Seating */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
                      Minimum Passenger Seating Capacity
                    </label>
                    <div className="grid grid-cols-2 gap-2 font-body">
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
                              ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] shadow-sm'
                              : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
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
                  <div className="p-4 rounded-xl border border-[#171717]/10 bg-[#F4F0E8]/40 space-y-3 font-body">
                    <div className="text-sm font-bold text-[#171717] font-heading">
                      Rider Ergonomics & Flat-foot Accessibility
                    </div>
                    <p className="text-xs text-neutral-600">
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
                              ? 'bg-white border-[#B9975B] text-[#8C6F37] shadow-sm ring-1 ring-[#B9975B]'
                              : 'bg-white/80 border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50'
                          }`}
                        >
                          <div className="font-heading">{r.label}</div>
                          <div className="text-[10px] text-neutral-500 font-normal">{r.sub}</div>
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
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2 font-heading">
                  <ShieldCheck className="w-5 h-5 text-[#B9975B]" />
                  Priorities & Strict Non-Negotiables
                </h2>
                <p className="text-xs text-neutral-600 mt-1 font-body">
                  Our algorithm will weigh your top priorities in normalized scoring and strictly discard any vehicle that violates your non-negotiables.
                </p>
              </div>

              {/* Top Priorities */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
                  Select Your Top Decision Factors
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-body">
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
                            ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37] shadow-sm'
                            : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{p.label}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#B9975B]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Non-Negotiables */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2 font-heading">
                  Strict Non-Negotiables (Zero Compromise Hard Filters)
                </label>
                <div className="space-y-2 font-body">
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
                            ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#171717] font-semibold shadow-sm'
                            : 'bg-white border-[#171717]/10 text-neutral-700 hover:border-[#B9975B]/50 hover:bg-[#B9975B]/5'
                        }`}
                      >
                        <span className="text-xs font-medium">{item.label}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                          isChecked ? 'bg-[#171717] border-[#171717] text-[#B9975B] font-bold' : 'border-neutral-300'
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
                <div className="p-4 rounded-xl border border-[#171717]/10 bg-[#F4F0E8]/40 pt-3 font-body">
                  <p className="text-xs font-semibold text-neutral-700 mb-2 font-heading">
                    Enter your name and email to view your personalized match report:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-[#171717]/15 text-[#171717] text-xs placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] shadow-sm"
                    />
                    <input
                      type="email"
                      placeholder="Your Email Address"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-[#171717]/15 text-[#171717] text-xs placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#171717]/10 font-body">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#171717]/15 text-xs font-semibold text-neutral-700 transition-colors ${
                step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#B9975B]/10 hover:text-[#171717] cursor-pointer shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
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
