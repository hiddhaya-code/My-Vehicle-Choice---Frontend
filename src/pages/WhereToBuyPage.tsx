import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Dealer, VehicleDetail } from '../types';
import { formatPriceINR } from '../utils/formatters';
import { 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Globe, 
  Clock, 
  Star,
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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WhereToBuyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicleId');
  const variantIdParam = searchParams.get('variantId');
  const queryModel = searchParams.get('model');
  const queryBrandId = searchParams.get('brandId');
  const queryCategory = searchParams.get('category');

  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [pincodeFilter, setPincodeFilter] = useState<string>('');
  const [radiusFilter, setRadiusFilter] = useState<string>('50');
  const [loading, setLoading] = useState(true);

  // Geolocation state (permission-gated)
  const [gpsLoading, setGpsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Enquiry Modal state
  const [activeDealer, setActiveDealer] = useState<Dealer | null>(null);
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [enquiryType, setEnquiryType] = useState<'TEST_DRIVE' | 'PRICE_QUOTE' | 'FINANCING'>('TEST_DRIVE');
  const [preferredDate, setPreferredDate] = useState('2026-03-10');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setCustomerName(user.fullName);
      setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Load canonical vehicle detail if vehicleId is in URL
  useEffect(() => {
    if (vehicleIdParam) {
      api.getVehicleById(Number(vehicleIdParam))
        .then((detail) => setVehicle(detail))
        .catch((err) => console.error('Failed to load vehicle detail:', err));
    }
  }, [vehicleIdParam]);

  // Fetch verified authorized dealers
  useEffect(() => {
    const fetchAccurateDealers = async () => {
      setLoading(true);
      try {
        const vId = vehicleIdParam ? Number(vehicleIdParam) : (vehicle ? vehicle.id : undefined);
        const bId = queryBrandId ? Number(queryBrandId) : (vehicle ? vehicle.brandId : undefined);
        const cat = queryCategory || (vehicle ? vehicle.category : undefined);

        const list = await api.getDealers({
          vehicleId: vId,
          variantId: variantIdParam ? Number(variantIdParam) : undefined,
          brandId: bId,
          category: cat,
          dealerType: 'SALES', // Excludes service-only workshops by default for purchases
          city: selectedCity !== 'ALL' ? selectedCity : undefined,
          pincode: pincodeFilter.trim() ? pincodeFilter.trim() : undefined,
          latitude: userCoords?.lat,
          longitude: userCoords?.lng,
          radiusKm: userCoords && radiusFilter !== 'ALL' ? Number(radiusFilter) : undefined,
        });

        setDealers(list);
      } catch (err) {
        console.error('Failed to load dealers:', err);
        setDealers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccurateDealers();
  }, [selectedCity, pincodeFilter, radiusFilter, vehicleIdParam, vehicle, queryBrandId, queryCategory, userCoords]);

  // Request browser geolocation with user consent
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
          setGpsError('Location permission denied. Please search by city or PIN code instead.');
        } else {
          setGpsError('Unable to retrieve location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClearGps = () => {
    setUserCoords(null);
    setGpsError(null);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDealer) return;
    setSubmitting(true);

    try {
      await api.submitEnquiry({
        dealerId: activeDealer.id,
        vehicleId: vehicle ? vehicle.id : 1,
        variantId: variantIdParam ? Number(variantIdParam) : (vehicle?.variants[0]?.id),
        customerName,
        customerEmail,
        customerPhone,
        city: activeDealer.city || selectedCity,
        enquiryType,
        preferredDate,
        message: message.trim() ? message : `Interested in test drive/quote at ${activeDealer.name}`,
      });

      setToastMessage(`Your enquiry for ${activeDealer.name} has been sent successfully! Reference lead generated.`);
      setActiveDealer(null);
      setMessage('');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Canonical manufacturer brand name and fallback locator
  const activeBrandName = vehicle?.brandName || (dealers.length > 0 ? dealers[0].brandName : undefined);
  const activeOfficialLocatorUrl = dealers.find(d => d.officialLocatorUrl)?.officialLocatorUrl 
    || 'https://www.google.com/search?q=' + encodeURIComponent((activeBrandName || 'manufacturer') + ' official dealer locator india');

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OEM Verified Authorized Dealership Network</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-rose-500" />
            <span>Where to Buy & Schedule Test Drive</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Strict canonical manufacturer matching. Only officially authorized sales dealerships for the selected brand and vehicle category are displayed. No competitor brand substitution.
          </p>
        </div>

        {/* Selected Vehicle Card if navigated from a model */}
        {(vehicle || queryModel) && (
          <div className="p-4 glass-card rounded-2xl border border-pink-200/80 shadow-md flex flex-wrap items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-4">
              {vehicle?.heroImageUrl && (
                <img
                  src={vehicle.heroImageUrl}
                  alt={vehicle.modelName}
                  className="w-20 h-14 rounded-xl object-cover bg-slate-100 border border-pink-200"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                    Selected Vehicle
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {vehicle?.category || queryCategory}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {vehicle ? `${vehicle.brandName} ${vehicle.modelName}` : queryModel}
                </h3>
                {vehicle?.headline && (
                  <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{vehicle.headline}</p>
                )}
              </div>
            </div>

            {vehicle && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Starting On-Road</span>
                <span className="text-lg font-extrabold text-rose-600">
                  {formatPriceINR(vehicle.startingOnRoadPrice)}
                </span>
                <span className="text-[11px] text-slate-500 block">Ex-showroom: {formatPriceINR(vehicle.startingExShowroomPrice)}</span>
              </div>
            )}
          </div>
        )}

        {/* Search & Location Controls */}
        <div className="glass-card rounded-2xl border border-pink-200/80 p-5 shadow-sm bg-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                1. Select Location or Use GPS
              </span>
              <p className="text-xs text-slate-500">
                Filter by verified city, PIN code, or calculate exact distance with your permission.
              </p>
            </div>

            {/* GPS Controls */}
            <div className="flex items-center gap-2">
              {!userCoords ? (
                <button
                  onClick={handleRequestGps}
                  disabled={gpsLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-pink-300 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-rose-600" />
                  <span>{gpsLoading ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                  <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span>GPS Active ({userCoords.lat.toFixed(2)}, {userCoords.lng.toFixed(2)})</span>
                  <button
                    onClick={handleClearGps}
                    className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                    title="Clear GPS filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {gpsError && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* City Selection Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {['New Delhi', 'Bengaluru', 'Mumbai', 'Chennai', 'Pune', 'Hyderabad', 'ALL'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'btn-galaxy-primary text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-rose-50 border border-pink-200'
                }`}
              >
                {city === 'ALL' ? 'All Locations (Pan-India)' : city}
              </button>
            ))}
          </div>

          {/* PIN code & Radius Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-pink-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filter by PIN Code:</span>
              <input
                type="text"
                maxLength={6}
                value={pincodeFilter}
                onChange={(e) => setPincodeFilter(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 110044"
                className="w-28 px-2.5 py-1.5 rounded-lg border border-pink-200 text-slate-900 bg-white focus:outline-none focus:border-rose-500"
              />
              {pincodeFilter && (
                <button
                  onClick={() => setPincodeFilter('')}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {userCoords && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Max Search Radius:</span>
                <select
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-pink-200 text-slate-900 bg-white focus:outline-none focus:border-rose-500 font-medium"
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
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Verified Authorized Dealerships</span>
                {selectedCity !== 'ALL' && <span className="text-rose-600 font-semibold">in {selectedCity}</span>}
              </h2>
              {vehicle && (
                <p className="text-xs text-slate-500">
                  Showing authorized sales points for {vehicle.brandName} ({vehicle.category})
                </p>
              )}
            </div>
            <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full font-bold border border-pink-200">
              {dealers.length} {dealers.length === 1 ? 'Showroom Found' : 'Showrooms Found'}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center glass-card bg-white rounded-2xl border border-pink-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-3"></div>
              <p className="text-xs font-semibold text-slate-600">Verifying authorized dealership network...</p>
              <p className="text-[11px] text-slate-400 mt-1">Filtering out unauthorized sellers and service-only points</p>
            </div>
          ) : dealers.length === 0 ? (
            /* Honest Empty State */
            <div className="p-8 text-center glass-card bg-white rounded-2xl border border-rose-200/80 shadow-md space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  No verified authorized sales dealer found for this vehicle in your selected area.
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
                  To protect your purchase, MyVehicleChoice strictly never substitutes competitor brands or unverified third-party brokers.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedCity('ALL');
                    setPincodeFilter('');
                    handleClearGps();
                  }}
                  className="px-4 py-2 rounded-xl btn-galaxy-primary text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Search All Locations (Pan-India)</span>
                </button>

                <a
                  href={activeOfficialLocatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white border border-pink-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                  <span>Open Official {activeBrandName || 'Manufacturer'} Locator</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dealers.map((dealer) => {
                // Determine model availability badge
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
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>Booking Open</span>
                    </div>
                  );
                } else {
                  availBadge = (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-medium">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Stock Status: Inquire with Dealer</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={dealer.id}
                    className="glass-card bg-white rounded-2xl border border-pink-200/80 p-6 shadow-md hover:border-pink-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Brand & Authorization Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
                            {dealer.brandName || 'Authorized OEM'}
                          </span>
                          {dealer.divisionName && (
                            <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                              {dealer.divisionName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {dealer.distanceKm != null && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-pink-300 text-[10px] font-bold">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              <span>{dealer.distanceKm} km away</span>
                            </span>
                          )}

                          {dealer.isAuthorized && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>OEM Authorized</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dealer Name */}
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {dealer.name}
                      </h3>

                      {/* Capabilities Tag */}
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold text-slate-600 px-2 py-0.5 rounded-md bg-slate-100">
                          {dealer.dealerType === 'SALES_AND_SERVICE' ? 'Sales Showroom & Authorized Workshop' : 'Exclusive Sales Showroom'}
                        </span>
                      </div>

                      {/* Address */}
                      <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-3 leading-relaxed">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {dealer.address}
                          {dealer.locality ? `, ${dealer.locality}` : ''}
                          , {dealer.city}
                          {dealer.state ? `, ${dealer.state}` : ''}
                          {dealer.pincode ? ` – ${dealer.pincode}` : ''}
                        </span>
                      </p>

                      {/* Inventory Availability Box */}
                      <div className="my-3">
                        {availBadge}
                      </div>

                      {/* Contact & Hours */}
                      <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-pink-100">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{dealer.phone}</span>
                        </div>
                        {dealer.businessHours && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dealer.businessHours}</span>
                          </div>
                        )}
                        {dealer.verifiedSource && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                            <span>Source: {dealer.verifiedSource}</span>
                            {dealer.verifiedDate && <span>• Audited {dealer.verifiedDate}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-pink-100 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setActiveDealer(dealer)}
                        className="py-2.5 px-2 rounded-xl btn-galaxy-primary text-white font-bold text-xs transition-colors shadow-sm text-center cursor-pointer col-span-1"
                      >
                        Book Test Drive
                      </button>

                      <a
                        href={`tel:${dealer.phone}`}
                        className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl border border-pink-200 hover:bg-rose-50 text-slate-700 text-xs font-semibold transition-colors shadow-sm col-span-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Call</span>
                      </a>

                      {dealer.officialLocatorUrl ? (
                        <a
                          href={dealer.officialLocatorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl border border-pink-200 hover:border-rose-400 text-rose-600 text-xs font-semibold transition-colors shadow-sm col-span-1"
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
                          className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl border border-pink-200 hover:bg-rose-50 text-slate-700 text-xs font-semibold transition-colors shadow-sm col-span-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
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
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-pink-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900">
              <div className="flex justify-between items-start pb-3 border-b border-pink-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">
                      {activeDealer.brandName} Authorized Dealership
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{activeDealer.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{activeDealer.address}, {activeDealer.city}</p>
                </div>
                <button
                  onClick={() => setActiveDealer(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitEnquiry} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 uppercase font-semibold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 uppercase font-semibold mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 uppercase font-semibold mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 uppercase font-semibold mb-1">Enquiry Type</label>
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value as any)}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium cursor-pointer"
                    >
                      <option value="TEST_DRIVE">Test Drive Request</option>
                      <option value="PRICE_QUOTE">On-Road Price Quote</option>
                      <option value="FINANCING">Loan & EMI Financing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 uppercase font-semibold mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase font-semibold mb-1">Vehicle of Interest</label>
                  <input
                    type="text"
                    readOnly
                    value={vehicle ? `${vehicle.brandName} ${vehicle.modelName}` : (queryModel || 'General Inquiry')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase font-semibold mb-1">Special Notes / Variant Choice</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Please bring an automatic variant for test drive"
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 cursor-pointer"
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
          <div className="fixed bottom-6 right-6 p-4 rounded-xl bg-white border border-emerald-300 text-slate-900 shadow-2xl flex items-center gap-3 z-50 animate-bounce max-w-md">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-slate-700 font-medium">{toastMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
