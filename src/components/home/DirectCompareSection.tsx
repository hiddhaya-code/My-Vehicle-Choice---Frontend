import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CompareSearchResult } from '../../types';
import { formatIndianPrice } from '../../utils/formatters';
import { GitCompare, Search, X, ArrowRight, Sparkles } from 'lucide-react';

export const DirectCompareSection: React.FC = () => {
  const navigate = useNavigate();

  // Selected vehicle slots for comparison (slot 1 and slot 2)
  const [slot1, setSlot1] = useState<CompareSearchResult | null>(null);
  const [slot2, setSlot2] = useState<CompareSearchResult | null>(null);

  // Search queries and dropdown results
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [results1, setResults1] = useState<CompareSearchResult[]>([]);
  const [results2, setResults2] = useState<CompareSearchResult[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  // Search debounce slot 1
  useEffect(() => {
    if (query1.trim().length < 2) {
      setResults1([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading1(true);
      api.searchVariantsForCompare(query1)
        .then((data) => {
          setResults1(data);
          setShowDropdown1(true);
        })
        .finally(() => setLoading1(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query1]);

  // Search debounce slot 2
  useEffect(() => {
    if (query2.trim().length < 2) {
      setResults2([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading2(true);
      api.searchVariantsForCompare(query2)
        .then((data) => {
          setResults2(data);
          setShowDropdown2(true);
        })
        .finally(() => setLoading2(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query2]);

  const handleCompareNow = () => {
    if (!slot1 || !slot2) {
      alert('Please select two vehicles to compare side-by-side.');
      return;
    }
    if (slot1.variantId === slot2.variantId) {
      alert('You have selected the identical variant in both slots. Please select different models or variants to compare.');
      return;
    }
    navigate(`/compare?variant1=${slot1.variantId}&variant2=${slot2.variantId}&vehicle1=${slot1.vehicleId}&vehicle2=${slot2.vehicleId}`);
  };

  const handleQuickPreset = (name1: string, name2: string) => {
    setQuery1(name1);
    setQuery2(name2);
  };

  return (
    <section className="py-20 bg-white text-slate-900 border-b border-pink-100 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Journey B • Direct Vehicle Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Already Have Two Vehicles in Mind?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Search for your preferred cars or motorcycles and compare verified engineering specs, real road mileage, and on-road prices.
          </p>

          {/* Quick presets shortcut */}
          <div className="mt-5 flex flex-wrap justify-center items-center gap-2 text-xs">
            <span className="text-slate-500 text-xs">Popular match-ups:</span>
            <button
              onClick={() => handleQuickPreset('KTM 200', 'Yamaha R15')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:border-rose-400 text-rose-700 font-semibold transition-all text-[11px] cursor-pointer"
            >
              KTM Duke 200 vs Yamaha R15 V4
            </button>
            <button
              onClick={() => handleQuickPreset('Nexon', 'Creta')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:border-rose-400 text-rose-700 font-semibold transition-all text-[11px] cursor-pointer"
            >
              Tata Nexon vs Hyundai Creta
            </button>
            <button
              onClick={() => handleQuickPreset('XUV700', 'Thar')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:border-rose-400 text-rose-700 font-semibold transition-all text-[11px] cursor-pointer"
            >
              Mahindra XUV700 vs Thar 4x4
            </button>
            <button
              onClick={() => handleQuickPreset('Classic 350', 'Hunter 350')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:border-rose-400 text-rose-700 font-semibold transition-all text-[11px] cursor-pointer"
            >
              Classic 350 vs Hunter 350
            </button>
          </div>
        </div>

        {/* Comparison Selection Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl border border-pink-200/80 bg-white/95 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Slot 1 */}
            <div className="relative">
              <label className="block text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                First Vehicle / Variant
              </label>

              {slot1 ? (
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-300 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={slot1.heroImageUrl}
                      alt={slot1.fullName}
                      className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-pink-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {slot1.brandName} {slot1.modelName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{slot1.variantName}</p>
                      <span className="text-xs font-bold text-rose-600">
                        {formatIndianPrice(slot1.estimatedOnRoadPrice)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSlot1(null); setQuery1(''); }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-rose-100/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={query1}
                      onChange={(e) => setQuery1(e.target.value)}
                      onFocus={() => setShowDropdown1(true)}
                      placeholder='Search first vehicle, e.g. "KTM 200" or "Nexon"'
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-pink-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>

                  {/* Autocomplete Dropdown Slot 1 */}
                  {showDropdown1 && (results1.length > 0 || loading1) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-pink-200 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto">
                      {loading1 && (
                        <p className="p-3 text-xs text-slate-400 text-center">Searching variants in MySQL...</p>
                      )}
                      {!loading1 && results1.map((item) => (
                        <button
                          key={item.variantId}
                          type="button"
                          onClick={() => {
                            setSlot1(item);
                            setShowDropdown1(false);
                          }}
                          className="w-full text-left p-3 hover:bg-rose-50 flex items-center justify-between border-b border-pink-100 last:border-0 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {item.brandName} {item.modelName} - {item.variantName}
                            </p>
                            <span className="text-[11px] text-slate-500">
                              {item.category} • {item.fuelType}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-rose-600">
                            {formatIndianPrice(item.estimatedOnRoadPrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Slot 2 */}
            <div className="relative">
              <label className="block text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                Second Vehicle / Variant
              </label>

              {slot2 ? (
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-300 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={slot2.heroImageUrl}
                      alt={slot2.fullName}
                      className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-pink-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {slot2.brandName} {slot2.modelName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{slot2.variantName}</p>
                      <span className="text-xs font-bold text-rose-600">
                        {formatIndianPrice(slot2.estimatedOnRoadPrice)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSlot2(null); setQuery2(''); }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-rose-100/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={query2}
                      onChange={(e) => setQuery2(e.target.value)}
                      onFocus={() => setShowDropdown2(true)}
                      placeholder='Search second vehicle, e.g. "Yamaha R15" or "Creta"'
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-pink-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>

                  {/* Autocomplete Dropdown Slot 2 */}
                  {showDropdown2 && (results2.length > 0 || loading2) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-pink-200 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto">
                      {loading2 && (
                        <p className="p-3 text-xs text-slate-400 text-center">Searching variants in MySQL...</p>
                      )}
                      {!loading2 && results2.map((item) => (
                        <button
                          key={item.variantId}
                          type="button"
                          onClick={() => {
                            setSlot2(item);
                            setShowDropdown2(false);
                          }}
                          className="w-full text-left p-3 hover:bg-rose-50 flex items-center justify-between border-b border-pink-100 last:border-0 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {item.brandName} {item.modelName} - {item.variantName}
                            </p>
                            <span className="text-[11px] text-slate-500">
                              {item.category} • {item.fuelType}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-rose-600">
                            {formatIndianPrice(item.estimatedOnRoadPrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Compare Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-pink-100">
            <p className="text-xs text-slate-600">
              {slot1 && slot2 ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ready to compare verified engineering specifications side by side.
                </span>
              ) : (
                <span>Select models or variants in both slots to launch side-by-side spec comparison.</span>
              )}
            </p>

            <button
              onClick={handleCompareNow}
              disabled={!slot1 || !slot2}
              className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                slot1 && slot2
                  ? 'btn-galaxy-primary text-white shadow-md cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
