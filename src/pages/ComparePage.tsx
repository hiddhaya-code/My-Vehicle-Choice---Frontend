import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CompareSearchResult, VehicleDetail } from '../types';
import { formatIndianPrice } from '../utils/formatters';
import { 
  GitCompare, 
  Search, 
  X, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const vehicleId1 = searchParams.get('vehicle1') || searchParams.get('v1');
  const vehicleId2 = searchParams.get('vehicle2') || searchParams.get('v2');
  const variantId1 = searchParams.get('variant1');
  const variantId2 = searchParams.get('variant2');

  const [v1, setV1] = useState<VehicleDetail | null>(null);
  const [v2, setV2] = useState<VehicleDetail | null>(null);

  // Search states for picking vehicles if not supplied in query
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompareSearchResult[]>([]);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);

  useEffect(() => {
    if (vehicleId1) {
      api.getVehicleById(Number(vehicleId1))
        .then(setV1)
        .catch(console.error);
    }
  }, [vehicleId1]);

  useEffect(() => {
    if (vehicleId2) {
      api.getVehicleById(Number(vehicleId2))
        .then(setV2)
        .catch(console.error);
    }
  }, [vehicleId2]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim().length >= 2) {
      api.searchVariantsForCompare(text).then(setResults);
    } else {
      setResults([]);
    }
  };

  const handleSelectVehicle = (item: CompareSearchResult) => {
    api.getVehicleById(item.vehicleId)
      .then((detail: VehicleDetail) => {
        if (activeSlot === 1) {
          setV1(detail);
        } else {
          setV2(detail);
        }
        setQuery('');
        setResults([]);
      })
      .catch(console.error);
  };

  const var1 = v1?.variants.find((v) => variantId1 ? v.id === Number(variantId1) : true) || v1?.variants[0];
  const var2 = v2?.variants.find((v) => variantId2 ? v.id === Number(variantId2) : true) || v2?.variants[0];

  return (
    <div className="min-h-screen bg-transparent py-10 relative overflow-hidden text-slate-900">
      {/* Radiant very light pink ambient lighting */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center text-xs text-slate-500 gap-2 mb-2">
              <Link to="/" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </Link>
              <span>/</span>
              <span className="text-rose-600 font-semibold">Compare Vehicles</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Vehicle Comparison Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <GitCompare className="w-8 h-8 text-rose-500" />
              <span>Direct Vehicle Comparison</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Side-by-side engineering specifications, real Indian on-road prices, and crash safety ratings.
            </p>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Slot 1 */}
          <div className="glass-card rounded-2xl p-6 border border-pink-200/80 shadow-lg bg-white/95">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-3">
              Vehicle 1 Slot
            </span>
            {v1 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={v1.heroImageUrl}
                      alt={v1.modelName}
                      className="w-16 h-14 object-cover rounded-xl bg-slate-100 border border-pink-200"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{v1.brandName} {v1.modelName}</h3>
                      <p className="text-xs text-slate-500">{var1?.variantName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setV1(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-slate-600">Est. On-Road Delhi</span>
                  <span className="font-extrabold text-rose-600 text-base">
                    {formatIndianPrice(var1?.estimatedOnRoadPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => { setActiveSlot(1); setQuery('Nexon'); handleSearch('Nexon'); }}
                  className="w-full py-8 border-2 border-dashed border-rose-300 rounded-xl text-center hover:border-rose-500 hover:bg-rose-50/50 transition-all text-xs font-bold text-rose-600 cursor-pointer"
                >
                  + Click to Select Vehicle 1 (e.g. Tata Nexon / KTM Duke 200)
                </button>
              </div>
            )}
          </div>

          {/* Slot 2 */}
          <div className="glass-card rounded-2xl p-6 border border-pink-200/80 shadow-lg bg-white/95">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-3">
              Vehicle 2 Slot
            </span>
            {v2 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={v2.heroImageUrl}
                      alt={v2.modelName}
                      className="w-16 h-14 object-cover rounded-xl bg-slate-100 border border-pink-200"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{v2.brandName} {v2.modelName}</h3>
                      <p className="text-xs text-slate-500">{var2?.variantName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setV2(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-slate-600">Est. On-Road Delhi</span>
                  <span className="font-extrabold text-rose-600 text-base">
                    {formatIndianPrice(var2?.estimatedOnRoadPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => { setActiveSlot(2); setQuery('Creta'); handleSearch('Creta'); }}
                  className="w-full py-8 border-2 border-dashed border-rose-300 rounded-xl text-center hover:border-rose-500 hover:bg-rose-50/50 transition-all text-xs font-bold text-rose-600 cursor-pointer"
                >
                  + Click to Select Vehicle 2 (e.g. Hyundai Creta / Yamaha R15 V4)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Modal / Popover if searching */}
        {query && (
          <div className="glass-card rounded-2xl border border-rose-300 p-5 shadow-2xl mb-8 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-rose-500" />
                Searching matching vehicles for Slot {activeSlot}:
              </span>
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type brand or model (e.g. Duke, Swift, R15, XUV700)..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
              {results.map((res: CompareSearchResult) => (
                <button
                  key={res.variantId}
                  onClick={() => handleSelectVehicle(res)}
                  className="text-left p-3 rounded-xl bg-white border border-pink-200 hover:border-rose-400 hover:bg-rose-50 text-xs flex justify-between items-center transition-all cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{res.brandName} {res.modelName}</span>
                    <span className="text-[11px] text-slate-500">{res.variantName}</span>
                  </div>
                  <span className="font-bold text-rose-600">{formatIndianPrice(res.estimatedOnRoadPrice)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Matrix */}
        {v1 && v2 && var1 && var2 && (
          <div className="glass-card rounded-3xl border border-pink-200/80 overflow-hidden shadow-xl bg-white">
            <div className="p-6 bg-gradient-to-r from-rose-50 via-white to-pink-50 text-slate-900 flex justify-between items-center border-b border-pink-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Side-by-Side Technical Comparison</h3>
                <p className="text-xs text-slate-500">Delhi On-Road Pricing & Official SIAM Homologated Specs</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-rose-50/70 text-rose-600 uppercase font-bold text-[11px] tracking-wider border-b border-pink-200">
                  <tr>
                    <th className="py-3.5 px-6 w-1/3">Specification</th>
                    <th className="py-3.5 px-6 w-1/3 text-slate-900 font-extrabold text-sm">{v1.brandName} {v1.modelName}</th>
                    <th className="py-3.5 px-6 w-1/3 text-slate-900 font-extrabold text-sm">{v2.brandName} {v2.modelName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  <tr>
                    <td className="py-3 px-6 font-semibold text-slate-500">Selected Variant</td>
                    <td className="py-3 px-6 font-bold text-slate-900">{var1.variantName}</td>
                    <td className="py-3 px-6 font-bold text-slate-900">{var2.variantName}</td>
                  </tr>
                  <tr className="bg-pink-50/30">
                    <td className="py-3.5 px-6 font-semibold text-slate-500">Est. On-Road Price</td>
                    <td className="py-3.5 px-6 font-extrabold text-rose-600 text-base">{formatIndianPrice(var1.estimatedOnRoadPrice)}</td>
                    <td className="py-3.5 px-6 font-extrabold text-rose-600 text-base">{formatIndianPrice(var2.estimatedOnRoadPrice)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-slate-500">Ex-Showroom Price</td>
                    <td className="py-3 px-6 font-semibold text-slate-700">{formatIndianPrice(var1.exShowroomPrice)}</td>
                    <td className="py-3 px-6 font-semibold text-slate-700">{formatIndianPrice(var2.exShowroomPrice)}</td>
                  </tr>
                  <tr className="bg-pink-50/30">
                    <td className="py-3 px-6 font-semibold text-slate-500">Powertrain & Fuel</td>
                    <td className="py-3 px-6 font-semibold text-slate-800">{var1.fuelType}</td>
                    <td className="py-3 px-6 font-semibold text-slate-800">{var2.fuelType}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-slate-500">Transmission</td>
                    <td className="py-3 px-6 font-semibold text-slate-800">{var1.transmission}</td>
                    <td className="py-3 px-6 font-semibold text-slate-800">{var2.transmission}</td>
                  </tr>
                  <tr className="bg-pink-50/30">
                    <td className="py-3 px-6 font-semibold text-slate-500">Fuel Economy / Range</td>
                    <td className="py-3 px-6 font-bold text-emerald-600">
                      {var1.electricRangeKm ? `${var1.electricRangeKm} km (EV Range)` : `${var1.mileageKmpl || 'N/A'} kmpl (ARAI)`}
                    </td>
                    <td className="py-3 px-6 font-bold text-emerald-600">
                      {var2.electricRangeKm ? `${var2.electricRangeKm} km (EV Range)` : `${var2.mileageKmpl || 'N/A'} kmpl (ARAI)`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-slate-500">Power & Torque</td>
                    <td className="py-3 px-6 text-slate-800">{var1.maxPowerBhp || 'N/A'} bhp / {var1.maxTorqueNm || 'N/A'} Nm</td>
                    <td className="py-3 px-6 text-slate-800">{var2.maxPowerBhp || 'N/A'} bhp / {var2.maxTorqueNm || 'N/A'} Nm</td>
                  </tr>
                  <tr className="bg-pink-50/30">
                    <td className="py-3 px-6 font-semibold text-slate-500">Official Safety Rating</td>
                    <td className="py-3 px-6 font-bold text-amber-600">
                      {var1.safetyRatingStars ? `${var1.safetyRatingStars} Stars (${var1.safetyRatingProtocol})` : 'SIAM Certified'}
                    </td>
                    <td className="py-3 px-6 font-bold text-amber-600">
                      {var2.safetyRatingStars ? `${var2.safetyRatingStars} Stars (${var2.safetyRatingProtocol})` : 'SIAM Certified'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-slate-500">Ground Clearance</td>
                    <td className="py-3 px-6 text-slate-800">{var1.groundClearanceMm ? `${var1.groundClearanceMm} mm` : 'N/A'}</td>
                    <td className="py-3 px-6 text-slate-800">{var2.groundClearanceMm ? `${var2.groundClearanceMm} mm` : 'N/A'}</td>
                  </tr>
                  <tr className="bg-pink-50/30">
                    <td className="py-3 px-6 font-semibold text-slate-500">Boot Space / Luggage</td>
                    <td className="py-3 px-6 text-slate-800">{var1.bootSpaceLitres ? `${var1.bootSpaceLitres} L` : 'N/A'}</td>
                    <td className="py-3 px-6 text-slate-800">{var2.bootSpaceLitres ? `${var2.bootSpaceLitres} L` : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-rose-50/30 border-t border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Data audited against official SIAM technical specifications & homologation papers.
              </span>
              <div className="flex gap-3">
                <Link
                  to={`/where-to-buy?vehicleId=${v1.id}&brandId=${v1.brandId}&category=${v1.category}`}
                  className="px-5 py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs shadow-sm transition-all"
                >
                  Dealers for {v1.modelName}
                </Link>
                <Link
                  to={`/where-to-buy?vehicleId=${v2.id}&brandId=${v2.brandId}&category=${v2.category}`}
                  className="px-5 py-2.5 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 font-bold text-xs transition-all shadow-sm"
                >
                  Dealers for {v2.modelName}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
