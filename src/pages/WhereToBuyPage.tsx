import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Dealer, VehicleDetail, VehicleSummary, VehicleVariant } from '../types';
import { formatPriceINR } from '../utils/formatters';
import { 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Clock, 
  CheckCircle2,
  X, 
  Send, 
  Navigation, 
  ExternalLink, 
  AlertCircle, 
  Car, 
  Compass, 
  CheckCircle, 
  HelpCircle, 
  RefreshCw,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Verified Manufacturer Locator Directory for direct OEM routing
const OEM_LOCATORS: Record<string, string> = {
  'Tata Motors': 'https://dealer-locator.cars.tatamotors.com/',
  'Hyundai': 'https://www.hyundai.com/in/en/click-to-buy/find-a-dealer-and-website',
  'Maruti Suzuki': 'https://www.marutisuzuki.com/dealer-locator',
  'KTM': 'https://www.ktmindia.com/ktm-dealers',
  'Yamaha': 'https://www.yamaha-motor-india.com/dealer-locator.html',
  'Royal Enfield': 'https://dealers.royalenfield.com/',
  'Ather Energy': 'https://www.atherenergy.com/experience-centres',
  'Honda': 'https://www.hondacarindia.com/dealer-locator',
  'Mahindra': 'https://auto.mahindra.com/dealer-locator',
  'Kia': 'https://www.kia.com/in/buy/find-a-dealer.html',
  'TVS Motor': 'https://dealers.tvsmotor.com/',
  'Bajaj Auto': 'https://www.bajajauto.com/dealer-locator',
  'Ola Electric': 'https://www.olaelectric.com/experience-centres',
  'BMW': 'https://www.bmw.in/en/fastlane/dealer-locator.html',
};

export const WhereToBuyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const vehicleIdParam = searchParams.get('vehicleId');
  const variantIdParam = searchParams.get('variantId');
  const queryBrandId = searchParams.get('brandId');
  const queryCategory = searchParams.get('category');
  const queryModel = searchParams.get('model');

  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant | null>(null);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [vehicleLoadError, setVehicleLoadError] = useState<string | null>(null);

  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [pincodeFilter, setPincodeFilter] = useState<string>('');
  const [radiusFilter, setRadiusFilter] = useState<string>('50');
  const [loading, setLoading] = useState(true);

  // In-page vehicle selector for direct / unlinked visits
  const [availableVehicles, setAvailableVehicles] = useState<VehicleSummary[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(false);

  // Geolocation state (permission-gated)
  const [gpsLoading, setGpsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Dynamic Date calculation helpers (Tomorrow & Today)
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Enquiry Modal state
  const [activeDealer, setActiveDealer] = useState<Dealer | null>(null);
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [enquiryType, setEnquiryType] = useState<'TEST_DRIVE' | 'PRICE_QUOTE' | 'FINANCING'>('TEST_DRIVE');
  const [preferredDate, setPreferredDate] = useState<string>(getTomorrowStr());
  const [dateError, setDateError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-populate authenticated user details
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.fullName);
      if (!customerEmail) setCustomerEmail(user.email);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Load canonical vehicle detail if vehicleId is in URL
  useEffect(() => {
    if (vehicleIdParam) {
      setVehicleLoading(true);
      setVehicleLoadError(null);
      api.getVehicleById(Number(vehicleIdParam))
        .then((detail) => {
          setVehicle(detail);
          if (detail.variants && detail.variants.length > 0) {
            const matched = variantIdParam 
              ? detail.variants.find(v => v.id === Number(variantIdParam)) || detail.variants[0]
              : detail.variants[0];
            setSelectedVariant(matched);
          }
        })
        .catch((err) => {
          console.error('Failed to load vehicle detail:', err);
          setVehicleLoadError(`Vehicle ID ${vehicleIdParam} could not be loaded (${err.message || 'Not found'}).`);
          setVehicle(null);
          setSelectedVariant(null);
        })
        .finally(() => {
          setVehicleLoading(false);
        });
    } else {
      setVehicle(null);
      setSelectedVariant(null);
      setVehicleLoadError(null);

      // Load catalogue summaries so the user can easily select a vehicle
      setCatalogueLoading(true);
      api.getVehicles({ size: 12 })
        .then((page) => setAvailableVehicles(page.content))
        .catch((err) => console.error('Failed to load vehicle picker list:', err))
        .finally(() => setCatalogueLoading(false));
    }
  }, [vehicleIdParam, variantIdParam]);

  // Handle in-page variant change
  const handleVariantChange = (variantId: number) => {
    if (!vehicle) return;
    const variant = vehicle.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
      // Synchronize URL variantId
      const newParams = new URLSearchParams(searchParams);
      newParams.set('variantId', String(variant.id));
      setSearchParams(newParams, { replace: true });
    }
  };

  // Handle vehicle selection from in-page catalogue picker
  const handleSelectVehicle = (selected: VehicleSummary) => {
    const newParams = new URLSearchParams();
    newParams.set('vehicleId', String(selected.id));
    if (selected.brandId) newParams.set('brandId', String(selected.brandId));
    if (selected.category) newParams.set('category', selected.category);
    navigate(`/where-to-buy?${newParams.toString()}`);
  };

  // Request browser GPS permission & coordinates
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please select your city manually below.');
        } else {
          setGpsError('Could not determine your GPS location. Please select your city manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClearGps = () => {
    setUserCoords(null);
    setGpsError(null);
  };

  // Fetch verified dealerships using strict server-side canonical filters
  useEffect(() => {
    setLoading(true);

    const effectiveBrandId = vehicle ? vehicle.brandId : (queryBrandId ? Number(queryBrandId) : undefined);
    const effectiveCategory = vehicle ? vehicle.category : (queryCategory || undefined);

    const queryParams: Record<string, any> = {
      onlySales: true, // Showrooms only; filters out service-only centers
    };

    if (effectiveBrandId) {
      queryParams.brandId = effectiveBrandId;
    }
    if (effectiveCategory) {
      queryParams.category = effectiveCategory;
    }

    if (pincodeFilter.trim().length === 6) {
      queryParams.pincode = pincodeFilter.trim();
    } else if (selectedCity && selectedCity !== 'ALL') {
      queryParams.city = selectedCity;
    }

    if (userCoords) {
      queryParams.userLat = userCoords.lat;
      queryParams.userLng = userCoords.lng;
      if (radiusFilter !== 'ALL') {
        queryParams.radiusKm = Number(radiusFilter);
      }
    }

    api.getDealers(queryParams)
      .then((data) => {
        setDealers(data);
      })
      .catch((err) => {
        console.error('Failed to load dealers:', err);
        setDealers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vehicle, queryBrandId, queryCategory, selectedCity, pincodeFilter, radiusFilter, userCoords]);

  // Handle Enquiry Submission
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDealer) return;

    if (!vehicle) {
      setFormError('Please select a vehicle before scheduling a test drive or submitting an enquiry.');
      return;
    }

    if (preferredDate && preferredDate < getTodayStr()) {
      setDateError('Test drive date cannot be in the past.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await api.submitEnquiry({
        dealerId: activeDealer.id,
        vehicleId: vehicle.id,
        variantId: selectedVariant?.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        enquiryType: enquiryType,
        preferredDate: preferredDate || undefined,
        message: message.trim() || undefined,
      });

      setToastMessage(`Your enquiry for ${activeDealer.name} has been transmitted successfully! Reference ID: #${response.id}`);
      setActiveDealer(null);
      setMessage('');
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err: any) {
      setFormError(err.message || 'Enquiry submission failed. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  // Verified Official OEM Locator derivation
  const activeBrandName = vehicle?.brandName;
  const officialOemLocatorUrl = activeBrandName && OEM_LOCATORS[activeBrandName] 
    ? OEM_LOCATORS[activeBrandName] 
    : (vehicle ? `https://www.google.com/search?q=${encodeURIComponent(vehicle.brandName + ' official dealer locator india')}` : null);

  return (
    <div className="min-h-screen bg-[#F4F0E8] py-10 px-4 sm:px-6 lg:px-8 text-[#171717] relative overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9975B]/15 border border-[#B9975B]/30 text-[#8C6F37] text-xs font-bold uppercase tracking-wider mb-2 font-heading">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B9975B]" />
            <span>OEM Verified Authorized Dealership Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight flex items-center gap-2 font-heading">
            <MapPin className="w-8 h-8 text-[#B9975B]" />
            <span>Where to Buy & Schedule Test Drive</span>
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-3xl leading-relaxed font-body">
            Strict canonical manufacturer matching. Only verified sales dealerships authorized for the selected brand and vehicle category are displayed. No competitor brand substitution.
          </p>
        </div>

        {/* Visible Vehicle Loading Error Alert */}
        {vehicleLoadError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-3 shadow-sm font-body">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{vehicleLoadError}</p>
                <p className="text-amber-800 mt-0.5">Please choose a valid vehicle from our verified catalogue to locate authorized showrooms.</p>
              </div>
            </div>
            <Link
              to="/vehicles"
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold shrink-0 transition-colors"
            >
              Browse Catalogue
            </Link>
          </div>
        )}

        {/* Selected Vehicle & Variant Card */}
        {vehicle ? (
          <div className="luxury-card p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {vehicle.heroImageUrl ? (
                <img
                  src={vehicle.heroImageUrl}
                  alt={vehicle.modelName}
                  className="w-24 h-16 rounded-xl object-cover bg-neutral-100 border border-[#171717]/10"
                />
              ) : (
                <div className="w-24 h-16 rounded-xl bg-[#B9975B]/10 border border-[#B9975B]/20 flex items-center justify-center text-[#B9975B]">
                  <Car className="w-8 h-8" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#8C6F37] uppercase tracking-wider font-heading">
                    Selected Vehicle
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F0E8] text-[#171717] border border-[#171717]/5 font-body">
                    {vehicle.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#171717] font-heading">
                  {vehicle.brandName} {vehicle.modelName}
                </h3>
                
                {/* Variant Switcher Dropdown */}
                {vehicle.variants && vehicle.variants.length > 0 && (
                  <div className="flex items-center gap-2 mt-1.5 font-body">
                    <span className="text-xs text-neutral-500 font-medium">Variant:</span>
                    <select
                      value={selectedVariant?.id || vehicle.variants[0].id}
                      onChange={(e) => handleVariantChange(Number(e.target.value))}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F4F0E8] border border-[#171717]/15 text-[#171717] focus:outline-none focus:border-[#B9975B] cursor-pointer"
                    >
                      {vehicle.variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.variantName} ({v.fuelType} {v.transmission}) — {formatPriceINR(v.estimatedOnRoadPrice)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {selectedVariant ? (
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase block font-medium font-body">On-Road Estimate</span>
                <span className="text-2xl font-black text-[#171717] tabular-nums font-heading">
                  {formatPriceINR(selectedVariant.estimatedOnRoadPrice)}
                </span>
                <span className="text-[11px] text-neutral-500 block font-body tabular-nums">Ex-showroom: {formatPriceINR(selectedVariant.exShowroomPrice)}</span>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase block font-medium font-body">Starting On-Road</span>
                <span className="text-2xl font-black text-[#171717] tabular-nums font-heading">
                  {formatPriceINR(vehicle.startingOnRoadPrice)}
                </span>
                <span className="text-[11px] text-neutral-500 block font-body tabular-nums">Ex-showroom: {formatPriceINR(vehicle.startingExShowroomPrice)}</span>
              </div>
            )}
          </div>
        ) : !vehicleIdParam && (
          /* Direct visit prompt with in-page vehicle selector */
          <div className="luxury-card p-6 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-[#171717] flex items-center gap-2 font-heading">
                  <Search className="w-4 h-4 text-[#B9975B]" />
                  <span>Select a Vehicle to Find Authorized Dealerships</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 font-body">
                  Choose a model below to locate verified authorized showrooms and schedule test drives.
                </p>
              </div>
              <Link
                to="/vehicles"
                className="text-xs font-bold text-[#8C6F37] hover:text-[#171717] flex items-center gap-1 font-body"
              >
                <span>View Full Catalogue</span>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
              </Link>
            </div>

            {catalogueLoading ? (
              <div className="py-6 text-center text-xs text-neutral-500 font-body">Loading catalogue models...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {availableVehicles.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectVehicle(item)}
                    className="p-2.5 rounded-xl border border-[#171717]/10 hover:border-[#B9975B] bg-white hover:bg-[#B9975B]/5 text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <img
                      src={item.heroImageUrl}
                      alt={item.modelName}
                      className="w-full h-16 rounded-lg object-cover bg-neutral-100 mb-1.5 border border-[#171717]/10"
                    />
                    <div className="text-[10px] text-[#8C6F37] font-bold uppercase truncate font-heading">{item.brandName}</div>
                    <div className="text-xs font-bold text-[#171717] truncate group-hover:text-[#8C6F37] transition-colors font-heading">
                      {item.modelName}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-medium mt-0.5 font-body tabular-nums">
                      {formatPriceINR(item.startingOnRoadPrice)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Location & Radius Controls */}
        <div className="luxury-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6F37] block font-heading">
                1. Select Location or Use GPS
              </span>
              <p className="text-xs text-neutral-500 font-body">
                Filter by verified city, PIN code, or calculate exact distance with your consent.
              </p>
            </div>

            {/* GPS Controls */}
            <div className="flex items-center gap-2 font-body">
              {!userCoords ? (
                <button
                  onClick={handleRequestGps}
                  disabled={gpsLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B9975B]/15 hover:bg-[#B9975B]/25 border border-[#B9975B]/30 text-[#8C6F37] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>{gpsLoading ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                  <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span className="tabular-nums">GPS Active ({userCoords.lat.toFixed(2)}, {userCoords.lng.toFixed(2)})</span>
                  <button
                    onClick={handleClearGps}
                    className="text-neutral-400 hover:text-neutral-700 ml-1 cursor-pointer"
                    title="Clear GPS filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {gpsError && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-body">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* City Selection Pills */}
          <div className="flex flex-wrap gap-2 pt-1 font-body">
            {['New Delhi', 'Bengaluru', 'Mumbai', 'Chennai', 'Pune', 'Hyderabad', 'ALL'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#171717] text-[#B9975B] shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-[#B9975B]/10 border border-[#171717]/10'
                }`}
              >
                {city === 'ALL' ? 'All Locations (Pan-India)' : city}
              </button>
            ))}
          </div>

          {/* PIN code & Radius Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#171717]/10 text-xs font-body">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-700">Filter by PIN Code:</span>
              <input
                type="text"
                maxLength={6}
                value={pincodeFilter}
                onChange={(e) => setPincodeFilter(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 110044"
                className="w-28 px-2.5 py-1.5 rounded-lg border border-[#171717]/15 text-[#171717] bg-white focus:outline-none focus:border-[#B9975B] tabular-nums"
              />
              {pincodeFilter && (
                <button
                  onClick={() => setPincodeFilter('')}
                  className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  title="Clear PIN code"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {userCoords && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-700">Max Search Radius:</span>
                <select
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-[#171717]/15 text-[#171717] bg-white focus:outline-none focus:border-[#B9975B] font-medium"
                >
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                  <option value="100">Within 100 km</option>
                  <option value="ALL">Any Distance</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Dealers Results Section */}
        <div>
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2 font-heading">
                <span>Verified Authorized Dealerships</span>
                {selectedCity !== 'ALL' && <span className="text-[#8C6F37] font-semibold">in {selectedCity}</span>}
              </h2>
              {vehicle && (
                <p className="text-xs text-neutral-500 font-body">
                  Showing authorized sales points for {vehicle.brandName} ({vehicle.category})
                </p>
              )}
            </div>
            <span className="text-xs bg-[#B9975B]/15 text-[#8C6F37] px-3 py-1 rounded-full font-bold border border-[#B9975B]/30 tabular-nums font-body">
              {dealers.length} {dealers.length === 1 ? 'Showroom Found' : 'Showrooms Found'}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center luxury-card rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B9975B] mx-auto mb-3"></div>
              <p className="text-xs font-semibold text-neutral-700 font-heading">Verifying authorized dealership network...</p>
              <p className="text-[11px] text-neutral-400 mt-1 font-body">Filtering out unauthorized sellers and service-only points</p>
            </div>
          ) : dealers.length === 0 ? (
            /* Honest Empty State */
            <div className="p-8 text-center luxury-card rounded-2xl space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#B9975B]/10 border border-[#B9975B]/30 flex items-center justify-center mx-auto text-[#B9975B]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#171717] font-heading">
                  No verified authorized sales dealer found for {vehicle ? `${vehicle.brandName} (${vehicle.category})` : 'this selection'} in your selected area.
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-lg mx-auto font-body">
                  To protect your purchase, MyVehicleChoice strictly never substitutes competitor brands or unverified third-party brokers.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2 font-body">
                <button
                  onClick={() => {
                    setSelectedCity('ALL');
                    setPincodeFilter('');
                    handleClearGps();
                  }}
                  className="btn-gold px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Search All Locations (Pan-India)</span>
                </button>

                {officialOemLocatorUrl && (
                  <a
                    href={officialOemLocatorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-gold px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#B9975B]" />
                    <span>Open Official {activeBrandName} Locator</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dealers.map((dealer) => {
                // Stock Availability Badge
                let availBadge = null;
                if (dealer.availabilityStatus === 'CONFIRMED_IN_STOCK') {
                  availBadge = (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirmed in Stock {dealer.estimatedDeliveryDays ? `(~${dealer.estimatedDeliveryDays}d delivery)` : ''}</span>
                    </div>
                  );
                } else if (dealer.availabilityStatus === 'AVAILABLE_FOR_TEST_DRIVE') {
                  availBadge = (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      <span>Demo Unit Available for Test Drive</span>
                    </div>
                  );
                } else if (dealer.availabilityStatus === 'BOOKING_OPEN') {
                  availBadge = (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Booking Open</span>
                    </div>
                  );
                } else {
                  availBadge = (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-600 border border-neutral-200 text-[11px] font-medium">
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Stock Status: Inquire with Dealer</span>
                    </div>
                  );
                }

                // OEM Authorized evidence check
                const isVerifiedOem = dealer.isAuthorized && dealer.verificationStatus === 'OFFICIAL_OEM_VERIFIED';

                return (
                  <div
                    key={dealer.id}
                    className="luxury-card p-6 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Brand & Authorization Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-body">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-extrabold text-[#8C6F37] uppercase tracking-wider font-heading">
                            {dealer.brandName || 'Authorized OEM'}
                          </span>
                          {dealer.divisionName && (
                            <span className="text-[10px] font-semibold text-neutral-600 px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                              {dealer.divisionName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {dealer.distanceKm != null && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B9975B]/15 text-[#8C6F37] border border-[#B9975B]/30 text-[10px] font-bold tabular-nums">
                              <MapPin className="w-3 h-3 text-[#B9975B]" />
                              <span>{dealer.distanceKm} km away</span>
                            </span>
                          )}

                          {isVerifiedOem ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>OEM Authorized</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-semibold">
                              <span>Partner Dealer</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dealer Name */}
                      <h3 className="text-base font-bold text-[#171717] mb-1 font-heading">
                        {dealer.name}
                      </h3>

                      {/* Capabilities Tag */}
                      <div className="mb-2 font-body">
                        <span className="text-[10px] font-semibold text-neutral-600 px-2 py-0.5 rounded-md bg-[#F4F0E8]">
                          {dealer.dealerType === 'SALES_AND_SERVICE' ? 'Sales Showroom & Authorized Workshop' : 'Exclusive Sales Showroom'}
                        </span>
                      </div>

                      {/* Address */}
                      <p className="text-xs text-neutral-600 flex items-start gap-1.5 mb-3 leading-relaxed font-body">
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <span>
                          {dealer.address}
                          {dealer.locality ? `, ${dealer.locality}` : ''}
                          , {dealer.city}
                          {dealer.state ? `, ${dealer.state}` : ''}
                          {dealer.pincode ? ` – ${dealer.pincode}` : ''}
                        </span>
                      </p>

                      {/* Inventory Availability Box */}
                      <div className="my-3 font-body">
                        {availBadge}
                      </div>

                      {/* Contact & Audit Source */}
                      <div className="space-y-1.5 text-xs text-neutral-500 pt-3 border-t border-[#171717]/10 font-body">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="font-semibold text-neutral-800 tabular-nums">{dealer.phone}</span>
                        </div>
                        {dealer.businessHours && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{dealer.businessHours}</span>
                          </div>
                        )}
                        {dealer.verifiedSource && (
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 pt-1">
                            <span>Source: {dealer.verifiedSource}</span>
                            {dealer.verifiedDate && <span className="tabular-nums">• Audited {dealer.verifiedDate}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[#171717]/10 grid grid-cols-3 gap-2 font-body">
                      <button
                        onClick={() => {
                          setActiveDealer(dealer);
                          setFormError(null);
                          setDateError(null);
                        }}
                        className="py-2.5 px-2 rounded-xl btn-gold font-bold text-xs transition-colors shadow-sm text-center cursor-pointer col-span-1"
                      >
                        Book Test Drive
                      </button>

                      <a
                        href={`tel:${dealer.phone}`}
                        className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl border border-[#171717]/15 hover:bg-[#B9975B]/10 text-neutral-700 text-xs font-semibold transition-colors shadow-sm col-span-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Call</span>
                      </a>

                      {dealer.officialLocatorUrl ? (
                        <a
                          href={dealer.officialLocatorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl border border-[#171717]/15 hover:border-[#B9975B] text-[#8C6F37] text-xs font-semibold transition-colors shadow-sm col-span-1"
                          title="Verify on manufacturer's official locator"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>OEM Locator</span>
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.name + ' ' + dealer.address + ' ' + dealer.city)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl border border-[#171717]/15 hover:bg-[#B9975B]/10 text-neutral-700 text-xs font-semibold transition-colors shadow-sm col-span-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Map</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Enquiry Modal */}
        {activeDealer && (
          <div className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="luxury-card rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#171717] border border-[#171717]/15">
              <div className="flex justify-between items-start pb-3 border-b border-[#171717]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#8C6F37] uppercase font-heading">
                      {activeDealer.brandName} Authorized Dealership
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#171717] font-heading">{activeDealer.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5 font-body">{activeDealer.address}, {activeDealer.city}</p>
                </div>
                <button
                  onClick={() => setActiveDealer(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-[#171717] hover:bg-[#F4F0E8] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-body">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitEnquiry} className="space-y-3 text-xs font-body">
                {/* Vehicle of Interest Warning / Selector */}
                <div>
                  <label className="block text-neutral-700 uppercase font-semibold mb-1 font-heading">Vehicle of Interest *</label>
                  {vehicle ? (
                    <div className="p-2.5 rounded-xl bg-[#F4F0E8] border border-[#171717]/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#171717] block font-heading">{vehicle.brandName} {vehicle.modelName}</span>
                        {selectedVariant && (
                          <span className="text-[11px] text-[#8C6F37] font-medium">Variant: {selectedVariant.variantName}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-neutral-600 border border-[#171717]/10">
                        {vehicle.category}
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2">
                      <p className="font-bold">No vehicle selected!</p>
                      <p>Please select a vehicle before scheduling a test drive or requesting a dealer quotation.</p>
                      <Link
                        to="/vehicles"
                        className="inline-block px-3 py-1.5 rounded-lg btn-gold text-xs font-bold"
                      >
                        Choose Vehicle from Catalogue
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase font-semibold mb-1 font-heading">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] placeholder-neutral-400 focus:outline-none focus:border-[#B9975B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 uppercase font-semibold mb-1 font-heading">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] placeholder-neutral-400 focus:outline-none focus:border-[#B9975B]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 uppercase font-semibold mb-1 font-heading">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 uppercase font-semibold mb-1 font-heading">Enquiry Type</label>
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value as any)}
                      className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] focus:outline-none focus:border-[#B9975B] font-medium cursor-pointer"
                    >
                      <option value="TEST_DRIVE">Test Drive Request</option>
                      <option value="PRICE_QUOTE">On-Road Price Quote</option>
                      <option value="FINANCING">Loan & EMI Financing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-700 uppercase font-semibold mb-1 font-heading">Preferred Date</label>
                    <input
                      type="date"
                      min={getTodayStr()}
                      value={preferredDate}
                      onChange={(e) => {
                        setPreferredDate(e.target.value);
                        if (e.target.value < getTodayStr()) {
                          setDateError('Test drive date cannot be in the past.');
                        } else {
                          setDateError(null);
                        }
                      }}
                      className={`w-full bg-white border ${dateError ? 'border-red-400' : 'border-[#171717]/15'} rounded-xl px-3 py-2 text-[#171717] focus:outline-none focus:border-[#B9975B] tabular-nums`}
                    />
                    {dateError && <span className="text-[10px] text-red-600 block mt-0.5">{dateError}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase font-semibold mb-1 font-heading">Special Notes / Requests</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Please arrange an automatic test drive vehicle"
                    className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] placeholder-neutral-400 focus:outline-none focus:border-[#B9975B]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !vehicle || Boolean(dateError)}
                    className="w-full py-2.5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Transmitting Request...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm & Send to Dealer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 p-4 rounded-xl bg-white border border-emerald-300 text-[#171717] shadow-2xl flex items-center gap-3 z-50 animate-bounce max-w-md font-body">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-neutral-700 font-medium">{toastMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
