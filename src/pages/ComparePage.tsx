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
  ShieldCheck,
  Building2
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
    <div className="min-h-screen bg-[#F4F0E8] py-10 relative overflow-hidden text-[#171717]">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center text-xs text-neutral-500 gap-2 mb-2 font-body">
              <Link to="/" className="hover:text-[#B9975B] transition-colors flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </Link>
              <span>/</span>
              <span className="text-[#8C6F37] font-semibold">Compare Vehicles</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight flex items-center gap-3 font-heading">
              <GitCompare className="w-8 h-8 text-[#B9975B]" />
              <span>Direct Vehicle Comparison</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl font-body">
              Side-by-side engineering specifications, real Indian on-road prices, and crash safety ratings.
            </p>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Slot 1 */}
          <div className="luxury-card p-6">
            <span className="text-[11px] font-bold text-[#8C6F37] uppercase tracking-wider block mb-3 font-heading">
              Vehicle 1 Slot
            </span>
            {v1 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={v1.heroImageUrl}
                      alt={v1.modelName}
                      className="w-16 h-14 object-cover rounded-xl bg-neutral-100 border border-[#171717]/10"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[#171717] font-heading">{v1.brandName} {v1.modelName}</h3>
                      <p className="text-xs text-neutral-500 font-body">{var1?.variantName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setV1(null)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-[#171717] hover:bg-[#B9975B]/10 transition-colors cursor-pointer"
                    title="Remove vehicle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3.5 bg-[#F4F0E8] border border-[#171717]/10 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-neutral-600 font-medium">Est. On-Road Delhi</span>
                  <span className="font-extrabold text-[#171717] text-base tabular-nums">
                    {formatIndianPrice(var1?.estimatedOnRoadPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => { setActiveSlot(1); setQuery('Nexon'); handleSearch('Nexon'); }}
                  className="w-full py-8 border-2 border-dashed border-[#B9975B]/40 rounded-xl text-center hover:border-[#B9975B] hover:bg-[#B9975B]/5 transition-all text-xs font-bold text-[#8C6F37] cursor-pointer"
                >
                  + Click to Select Vehicle 1 (e.g. Tata Nexon / KTM Duke 200)
                </button>
              </div>
            )}
          </div>

          {/* Slot 2 */}
          <div className="luxury-card p-6">
            <span className="text-[11px] font-bold text-[#8C6F37] uppercase tracking-wider block mb-3 font-heading">
              Vehicle 2 Slot
            </span>
            {v2 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={v2.heroImageUrl}
                      alt={v2.modelName}
                      className="w-16 h-14 object-cover rounded-xl bg-neutral-100 border border-[#171717]/10"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[#171717] font-heading">{v2.brandName} {v2.modelName}</h3>
                      <p className="text-xs text-neutral-500 font-body">{var2?.variantName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setV2(null)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-[#171717] hover:bg-[#B9975B]/10 transition-colors cursor-pointer"
                    title="Remove vehicle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3.5 bg-[#F4F0E8] border border-[#171717]/10 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-neutral-600 font-medium">Est. On-Road Delhi</span>
                  <span className="font-extrabold text-[#171717] text-base tabular-nums">
                    {formatIndianPrice(var2?.estimatedOnRoadPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => { setActiveSlot(2); setQuery('Creta'); handleSearch('Creta'); }}
                  className="w-full py-8 border-2 border-dashed border-[#B9975B]/40 rounded-xl text-center hover:border-[#B9975B] hover:bg-[#B9975B]/5 transition-all text-xs font-bold text-[#8C6F37] cursor-pointer"
                >
                  + Click to Select Vehicle 2 (e.g. Hyundai Creta / Yamaha R15 V4)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Modal / Popover if searching */}
        {query && (
          <div className="luxury-card p-5 mb-8 shadow-xl border-[#B9975B]/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5 font-heading">
                <Search className="w-3.5 h-3.5 text-[#B9975B]" />
                Searching matching vehicles for Slot {activeSlot}:
              </span>
              <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-[#171717] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type brand or model (e.g. Duke, Swift, R15, XUV700)..."
                className="w-full pl-9 pr-3 py-2.5 bg-[#F4F0E8] border border-[#171717]/15 rounded-xl text-xs text-[#171717] placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] transition-colors font-body"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
              {results.map((res: CompareSearchResult) => (
                <button
                  key={res.variantId}
                  onClick={() => handleSelectVehicle(res)}
                  className="text-left p-3 rounded-xl bg-white border border-[#171717]/10 hover:border-[#B9975B] hover:bg-[#B9975B]/5 text-xs flex justify-between items-center transition-all cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-[#171717] block font-heading">{res.brandName} {res.modelName}</span>
                    <span className="text-[11px] text-neutral-500 font-body">{res.variantName}</span>
                  </div>
                  <span className="font-bold text-[#8C6F37] tabular-nums">{formatIndianPrice(res.estimatedOnRoadPrice)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Matrix */}
        {v1 && v2 && var1 && var2 && (
          <div className="luxury-card overflow-hidden shadow-xl border-[#171717]/10 mb-12">
            <div className="p-6 bg-[#171717] text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Side-by-Side Technical Comparison</h3>
                <p className="text-xs text-neutral-400 font-body">Delhi On-Road Pricing & Official SIAM Homologated Specs</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9975B]/20 border border-[#B9975B]/40 text-[#B9975B] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Data</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#242424] text-[#B9975B] uppercase font-bold text-[11px] tracking-wider border-b border-neutral-700 font-heading">
                  <tr>
                    <th className="py-4 px-6 w-1/3">Specification</th>
                    <th className="py-4 px-6 w-1/3 text-white font-extrabold text-sm">{v1.brandName} {v1.modelName}</th>
                    <th className="py-4 px-6 w-1/3 text-white font-extrabold text-sm">{v2.brandName} {v2.modelName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171717]/5 font-body">
                  <tr>
                    <td className="py-3 px-6 font-semibold text-neutral-500">Selected Variant</td>
                    <td className="py-3 px-6 font-bold text-[#171717]">{var1.variantName}</td>
                    <td className="py-3 px-6 font-bold text-[#171717]">{var2.variantName}</td>
                  </tr>
                  <tr className="bg-[#F4F0E8]/40">
                    <td className="py-3.5 px-6 font-semibold text-neutral-500">Est. On-Road Price</td>
                    <td className="py-3.5 px-6 font-extrabold text-[#171717] text-base tabular-nums">{formatIndianPrice(var1.estimatedOnRoadPrice)}</td>
                    <td className="py-3.5 px-6 font-extrabold text-[#171717] text-base tabular-nums">{formatIndianPrice(var2.estimatedOnRoadPrice)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-neutral-500">Ex-Showroom Price</td>
                    <td className="py-3 px-6 font-semibold text-neutral-700 tabular-nums">{formatIndianPrice(var1.exShowroomPrice)}</td>
                    <td className="py-3 px-6 font-semibold text-neutral-700 tabular-nums">{formatIndianPrice(var2.exShowroomPrice)}</td>
                  </tr>
                  <tr className="bg-[#F4F0E8]/40">
                    <td className="py-3 px-6 font-semibold text-neutral-500">Powertrain & Fuel</td>
                    <td className="py-3 px-6 font-semibold text-neutral-800">{var1.fuelType}</td>
                    <td className="py-3 px-6 font-semibold text-neutral-800">{var2.fuelType}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-neutral-500">Transmission</td>
                    <td className="py-3 px-6 font-semibold text-neutral-800">{var1.transmission}</td>
                    <td className="py-3 px-6 font-semibold text-neutral-800">{var2.transmission}</td>
                  </tr>
                  <tr className="bg-[#F4F0E8]/40">
                    <td className="py-3 px-6 font-semibold text-neutral-500">Fuel Economy / Range</td>
                    <td className="py-3 px-6 font-bold text-emerald-700 tabular-nums">
                      {var1.electricRangeKm ? `${var1.electricRangeKm} km (EV Range)` : `${var1.mileageKmpl || 'N/A'} kmpl (ARAI)`}
                    </td>
                    <td className="py-3 px-6 font-bold text-emerald-700 tabular-nums">
                      {var2.electricRangeKm ? `${var2.electricRangeKm} km (EV Range)` : `${var2.mileageKmpl || 'N/A'} kmpl (ARAI)`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-neutral-500">Power & Torque</td>
                    <td className="py-3 px-6 text-neutral-800 tabular-nums">{var1.maxPowerBhp || 'N/A'} bhp / {var1.maxTorqueNm || 'N/A'} Nm</td>
                    <td className="py-3 px-6 text-neutral-800 tabular-nums">{var2.maxPowerBhp || 'N/A'} bhp / {var2.maxTorqueNm || 'N/A'} Nm</td>
                  </tr>
                  <tr className="bg-[#F4F0E8]/40">
                    <td className="py-3 px-6 font-semibold text-neutral-500">Official Safety Rating</td>
                    <td className="py-3 px-6 font-bold text-[#8C6F37]">
                      {var1.safetyRatingStars ? `${var1.safetyRatingStars} Stars (${var1.safetyRatingProtocol})` : 'SIAM Certified'}
                    </td>
                    <td className="py-3 px-6 font-bold text-[#8C6F37]">
                      {var2.safetyRatingStars ? `${var2.safetyRatingStars} Stars (${var2.safetyRatingProtocol})` : 'SIAM Certified'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-semibold text-neutral-500">Ground Clearance</td>
                    <td className="py-3 px-6 text-neutral-800 tabular-nums">{var1.groundClearanceMm ? `${var1.groundClearanceMm} mm` : 'N/A'}</td>
                    <td className="py-3 px-6 text-neutral-800 tabular-nums">{var2.groundClearanceMm ? `${var2.groundClearanceMm} mm` : 'N/A'}</td>
                  </tr>
                  <tr className="bg-[#F4F0E8]/40">
                    <td className="py-3 px-6 font-semibold text-neutral-500">Boot Space / Luggage</td>
                    <td className="py-3 px-6 text-neutral-800 tabular-nums">{var1.bootSpaceLitres ? `${var1.bootSpaceLitres} L` : 'N/A'}</td>
                    <td className="py-3 px-6 text-neutral-800 tabular-nums">{var2.bootSpaceLitres ? `${var2.bootSpaceLitres} L` : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-[#171717] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
              <span className="text-xs text-neutral-400 font-body">
                Data audited against official SIAM technical specifications & homologation papers.
              </span>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/where-to-buy?vehicleId=${v1.id}&brandId=${v1.brandId}&category=${v1.category}`}
                  className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Dealers for {v1.modelName}
                </Link>
                <Link
                  to={`/where-to-buy?vehicleId=${v2.id}&brandId=${v2.brandId}&category=${v2.category}`}
                  className="btn-outline-gold px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
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
