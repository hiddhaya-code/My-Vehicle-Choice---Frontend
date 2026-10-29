import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CompareSearchResult } from '../../types';
import { formatIndianPrice } from '../../utils/formatters';
import { GitCompare, Search, X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <section className="py-20 bg-white text-slate-900 border-b border-slate-200/80 relative overflow-hidden">
      {/* Mednix Subtle Light Ambience */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-slate-100/60 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-rose-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-3">
            <GitCompare className="w-3.5 h-3.5 text-rose-600" />
            <span>Side-by-Side Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
            Already Have Two Vehicles in Mind?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-body">
            Compare verified engineering specifications, real Indian road mileage, safety crash stars, and true on-road prices.
          </p>

          {/* Quick Preset Matchups */}
          <div className="mt-5 flex flex-wrap justify-center items-center gap-2 text-xs">
            <span className="text-slate-500 text-xs font-semibold">Popular Indian Matchups:</span>
            <button
              onClick={() => handleQuickPreset('KTM 200', 'Yamaha R15')}
              className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 font-bold transition-all text-[11px] cursor-pointer"
            >
              KTM Duke 200 vs Yamaha R15 V4
            </button>
            <button
              onClick={() => handleQuickPreset('Nexon', 'Creta')}
              className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 font-bold transition-all text-[11px] cursor-pointer"
            >
              Tata Nexon vs Hyundai Creta
            </button>
            <button
              onClick={() => handleQuickPreset('Hunter 350', 'Classic 350')}
              className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 font-bold transition-all text-[11px] cursor-pointer"
            >
              Hunter 350 vs Classic 350
            </button>
          </div>
        </div>

        {/* Comparison Selection Box (Mednix Card) */}
        <div className="mednix-card p-6 sm:p-10 max-w-4xl mx-auto shadow-sm relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
            {/* Slot 1 */}
            <div className="relative">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                First Vehicle / Variant
              </label>

              {slot1 ? (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={slot1.heroImageUrl}
                      alt={slot1.fullName}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight font-heading">
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
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-rose-100/60 transition-colors cursor-pointer"
                    aria-label="Remove vehicle"
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
                      placeholder='Search first vehicle, e.g. "Nexon" or "R15"'
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>

                  {/* Autocomplete Dropdown Slot 1 */}
                  {showDropdown1 && (results1.length > 0 || loading1) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto">
                      {loading1 && (
                        <p className="p-3 text-xs text-slate-400 text-center">Searching variants in database...</p>
                      )}
                      {!loading1 && results1.map((item) => (
                        <button
                          key={item.variantId}
                          type="button"
                          onClick={() => {
                            setSlot1(item);
                            setShowDropdown1(false);
                          }}
                          className="w-full text-left p-3 hover:bg-rose-50 flex items-center justify-between border-b border-slate-100 last:border-0 transition-colors cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {item.brandName} {item.modelName} — {item.variantName}
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
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Second Vehicle / Variant
              </label>

              {slot2 ? (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={slot2.heroImageUrl}
                      alt={slot2.fullName}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight font-heading">
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
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-rose-100/60 transition-colors cursor-pointer"
                    aria-label="Remove vehicle"
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
                      placeholder='Search second vehicle, e.g. "Creta" or "Duke 200"'
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>

                  {/* Autocomplete Dropdown Slot 2 */}
                  {showDropdown2 && (results2.length > 0 || loading2) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto">
                      {loading2 && (
                        <p className="p-3 text-xs text-slate-400 text-center">Searching variants in database...</p>
                      )}
                      {!loading2 && results2.map((item) => (
                        <button
                          key={item.variantId}
                          type="button"
                          onClick={() => {
                            setSlot2(item);
                            setShowDropdown2(false);
                          }}
                          className="w-full text-left p-3 hover:bg-rose-50 flex items-center justify-between border-b border-slate-100 last:border-0 transition-colors cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {item.brandName} {item.modelName} — {item.variantName}
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
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              {slot1 && slot2 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ready to compare exact engineering variants side-by-side.
                </span>
              ) : (
                <span>Select models or variants in both slots to launch side-by-side spec comparison.</span>
              )}
            </p>

            <button
              onClick={handleCompareNow}
              disabled={!slot1 || !slot2}
              className={`btn-pill-primary text-xs ${
                !slot1 || !slot2 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Launch Side-by-Side Compare</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
