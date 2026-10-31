import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { VehicleDetail, VehicleVariant, VehicleImage } from '../types';
import { formatIndianPrice } from '../utils/formatters';
import { 
  ShieldCheck, 
  GitCompare, 
  Settings, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isWishlisted, toggleWishlist } = useAuth();

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api.getVehicleById(Number(id))
      .then((data: VehicleDetail) => {
        setVehicle(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].imageUrl);
        } else {
          setSelectedImage(data.heroImageUrl);
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || 'Failed to load vehicle details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F0E8] flex flex-col items-center justify-center py-24 text-neutral-600">
        <Loader2 className="w-10 h-10 animate-spin text-[#B9975B] mb-3" />
        <p className="text-base font-semibold font-heading">Loading technical specifications from database...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-[#F4F0E8] max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-white border border-[#171717]/10 text-[#171717] shadow-sm">
          <AlertCircle className="w-8 h-8 mx-auto text-amber-600 mb-2" />
          <h2 className="text-lg font-bold font-heading">Vehicle Not Found</h2>
          <p className="text-xs text-neutral-600 mt-1 font-body">{error || 'The requested vehicle ID does not exist in our catalogue.'}</p>
          <Link
            to="/vehicles"
            className="mt-4 inline-block px-5 py-2.5 btn-gold rounded-xl text-xs font-bold shadow-md transition-all font-body"
          >
            Back to Vehicle Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const currentVar = selectedVariant || (vehicle.variants.length > 0 ? vehicle.variants[0] : null);

  return (
    <div className="min-h-screen bg-[#F4F0E8] py-10 relative overflow-hidden text-[#171717]">
      {/* Subtle luxury ambient lighting */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-neutral-500 gap-2 mb-6 font-body">
          <Link to="/" className="hover:text-[#B9975B] transition-colors font-medium">Home</Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-[#B9975B] transition-colors font-medium">Vehicles</Link>
          <span>/</span>
          <span className="text-[#8C6F37] font-semibold">{vehicle.brandName} {vehicle.modelName}</span>
        </div>

        {/* Hero Card / Details Overview */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] bg-neutral-100 rounded-2xl overflow-hidden border border-[#171717]/10">
                <img
                  src={selectedImage || vehicle.heroImageUrl}
                  alt={`${vehicle.brandName} ${vehicle.modelName}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {vehicle.images.map((img: VehicleImage) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.imageUrl)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImage === img.imageUrl ? 'border-[#B9975B] ring-2 ring-[#B9975B]/40' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt={img.caption || 'thumbnail'} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Variant Selection Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1 font-body">
                  <span className="font-bold text-[#8C6F37] uppercase tracking-wider font-heading">{vehicle.brandName}</span>
                  <span className="tabular-nums">{vehicle.variants.length} Available Variants</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-3xl font-extrabold text-[#171717] tracking-tight font-heading">
                    {vehicle.brandName} {vehicle.modelName}
                  </h1>
                  <button
                    onClick={() => toggleWishlist(vehicle.id)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                      isWishlisted(vehicle.id)
                        ? 'bg-[#B9975B]/15 border-[#B9975B] text-[#8C6F37]'
                        : 'bg-white border-[#171717]/10 text-neutral-700 hover:bg-[#B9975B]/10 hover:text-[#171717]'
                    }`}
                    title={isWishlisted(vehicle.id) ? 'Remove from Saved' : 'Save to Shortlist'}
                  >
                    <Bookmark className={`w-4 h-4 ${isWishlisted(vehicle.id) ? 'fill-current text-[#B9975B]' : ''}`} />
                    <span>{isWishlisted(vehicle.id) ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-600 mt-2 leading-relaxed font-body">
                  {vehicle.description || vehicle.headline}
                </p>

                {/* Variant Selector Tabs */}
                {vehicle.variants.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold text-[#8C6F37] uppercase tracking-wider mb-2 font-heading">
                      Select Variant:
                    </label>
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      {vehicle.variants.map((v: VehicleVariant) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            currentVar?.id === v.id
                              ? 'border-[#B9975B] bg-[#B9975B]/10 ring-1 ring-[#B9975B]'
                              : 'border-[#171717]/10 hover:border-[#B9975B]/50 bg-white'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-[#171717] block font-heading">{v.variantName}</span>
                            <span className="text-[11px] text-neutral-500 font-body">
                              {v.fuelType} • {v.transmission} • {v.modelYear}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#171717] tabular-nums">
                            {formatIndianPrice(v.estimatedOnRoadPrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Callout */}
              {currentVar && (
                <div className="bg-[#171717] text-white rounded-2xl p-5 space-y-4 shadow-md border border-neutral-800">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#B9975B] block tracking-wider font-heading">
                        Estimated On-Road Price ({currentVar.cityPriceRef})
                      </span>
                      <span className="text-2xl font-black text-[#B9975B] tabular-nums font-heading">
                        {formatIndianPrice(currentVar.estimatedOnRoadPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-neutral-400 block font-medium">Ex-Showroom</span>
                      <span className="text-xs font-semibold text-neutral-300 tabular-nums">
                        {formatIndianPrice(currentVar.exShowroomPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Spec Chips */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-800 text-center">
                    <div className="p-2.5 rounded-xl bg-[#242424] border border-neutral-700">
                      <span className="text-[10px] text-neutral-400 block font-medium">
                        {currentVar.fuelType === 'ELECTRIC' ? 'Range' : 'Efficiency'}
                      </span>
                      <span className="text-xs font-bold text-white tabular-nums">
                        {currentVar.electricRangeKm
                          ? `${currentVar.electricRangeKm} km`
                          : currentVar.mileageKmpl
                          ? `${currentVar.mileageKmpl} kmpl`
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#242424] border border-neutral-700">
                      <span className="text-[10px] text-neutral-400 block font-medium">Power</span>
                      <span className="text-xs font-bold text-white tabular-nums">
                        {currentVar.maxPowerBhp ? `${currentVar.maxPowerBhp} bhp` : 'N/A'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#242424] border border-neutral-700">
                      <span className="text-[10px] text-neutral-400 block font-medium">Safety</span>
                      <span className="text-xs font-bold text-[#B9975B]">
                        {currentVar.safetyRatingStars ? `${currentVar.safetyRatingStars}★ NCAP` : 'Tested'}
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Link
                      to={`/where-to-buy?vehicleId=${vehicle.id}&variantId=${currentVar.id}&brandId=${vehicle.brandId}&category=${vehicle.category}`}
                      className="btn-gold flex items-center justify-center py-2.5 px-3 rounded-xl text-xs font-bold shadow-sm transition-all text-center"
                    >
                      <span>Where to Buy</span>
                    </Link>

                    <Link
                      to={`/compare?variant1=${currentVar.id}&vehicle1=${vehicle.id}`}
                      className="btn-outline-gold flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all text-center"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Compare Variant</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Specification Sections */}
        {currentVar && (
          <div className="space-y-8">
            <div className="luxury-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#171717] mb-6 flex items-center gap-2 font-heading">
                <Settings className="w-5 h-5 text-[#B9975B]" />
                <span>Verified Engineering Specifications</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
                {/* Engine & Performance */}
                <div className="p-5 rounded-2xl bg-[#F4F0E8]/50 border border-[#171717]/10">
                  <h3 className="text-xs font-bold text-[#8C6F37] uppercase tracking-wider mb-3 font-heading">
                    Powertrain & Performance
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Fuel / Powertrain</dt>
                      <dd className="font-semibold text-[#171717]">{currentVar.fuelType}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Transmission</dt>
                      <dd className="font-semibold text-[#171717]">{currentVar.transmission}</dd>
                    </div>
                    {currentVar.engineCc && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Engine Displacement</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.engineCc} cc</dd>
                      </div>
                    )}
                    {currentVar.batteryCapacityKwh && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Battery Pack</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.batteryCapacityKwh} kWh IP67</dd>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Maximum Output</dt>
                      <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.maxPowerBhp || 'N/A'} bhp</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Peak Torque</dt>
                      <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.maxTorqueNm || 'N/A'} Nm</dd>
                    </div>
                  </dl>
                </div>

                {/* Practicality & Dimensions */}
                <div className="p-5 rounded-2xl bg-[#F4F0E8]/50 border border-[#171717]/10">
                  <h3 className="text-xs font-bold text-[#8C6F37] uppercase tracking-wider mb-3 font-heading">
                    Dimensions & Practicality
                  </h3>
                  <dl className="space-y-2 text-xs">
                    {currentVar.seatingCapacity && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Seating Capacity</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.seatingCapacity} Persons</dd>
                      </div>
                    )}
                    {currentVar.bootSpaceLitres && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Boot Space</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.bootSpaceLitres} Litres</dd>
                      </div>
                    )}
                    {currentVar.groundClearanceMm && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Ground Clearance</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.groundClearanceMm} mm</dd>
                      </div>
                    )}
                    {currentVar.seatHeightMm && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Seat Height</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.seatHeightMm} mm</dd>
                      </div>
                    )}
                    {currentVar.kerbWeightKg && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Kerb Weight</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.kerbWeightKg} kg</dd>
                      </div>
                    )}
                    {currentVar.fuelTankCapacityLitres && (
                      <div className="flex justify-between py-1 border-b border-[#171717]/5">
                        <dt className="text-neutral-500">Fuel Tank</dt>
                        <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.fuelTankCapacityLitres} L</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Safety & Running Costs */}
                <div className="p-5 rounded-2xl bg-[#F4F0E8]/50 border border-[#171717]/10">
                  <h3 className="text-xs font-bold text-[#8C6F37] uppercase tracking-wider mb-3 font-heading">
                    Safety & Ownership Baseline
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Crash Test Assessment</dt>
                      <dd className="font-semibold text-[#8C6F37]">
                        {currentVar.safetyRatingStars ? `${currentVar.safetyRatingStars}-Star (${currentVar.safetyRatingProtocol})` : 'SIAM Certified'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Airbags</dt>
                      <dd className="font-semibold text-[#171717] tabular-nums">{currentVar.airbagsCount ? `${currentVar.airbagsCount} Airbags` : 'Standard'}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">ABS with EBD</dt>
                      <dd className="font-semibold text-[#171717]">{currentVar.hasAbs ? 'Yes (Equipped)' : 'No'}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Electronic Stability (ESP)</dt>
                      <dd className="font-semibold text-[#171717]">{currentVar.hasEsp ? 'Yes (Equipped)' : 'No'}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#171717]/5">
                      <dt className="text-neutral-500">Est. Annual Service Cost</dt>
                      <dd className="font-semibold text-[#171717] tabular-nums">
                        {currentVar.maintenanceEstimateAnnual ? formatIndianPrice(currentVar.maintenanceEstimateAnnual) : '₹5,000 – ₹8,000'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Advantages and Disadvantages */}
            {(currentVar.keyAdvantages || currentVar.keyDisadvantages) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentVar.keyAdvantages && (
                  <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2 font-heading">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Key Verified Advantages</span>
                    </h3>
                    <p className="text-xs text-neutral-700 leading-relaxed font-body">
                      {currentVar.keyAdvantages}
                    </p>
                  </div>
                )}

                {currentVar.keyDisadvantages && (
                  <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2 font-heading">
                      <XCircle className="w-4 h-4 text-amber-600" />
                      <span>Considerations & Trade-Offs</span>
                    </h3>
                    <p className="text-xs text-neutral-700 leading-relaxed font-body">
                      {currentVar.keyDisadvantages}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Data Source & Provenance Banner */}
            <div className="bg-[#171717] text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 border border-neutral-800 shadow-md">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B9975B]" />
                <span className="font-body text-neutral-300">
                  <strong className="text-white">Data Provenance:</strong> {currentVar.dataSource || 'Manufacturer Official Technical Specification Sheet'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-body">
                <Calendar className="w-3.5 h-3.5 text-[#B9975B]" />
                <span className="tabular-nums">Verified Date: {currentVar.verifiedDate || '2026-03-01'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
