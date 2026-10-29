import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  GitCompare, 
  ShieldCheck, 
  ArrowRight, 
  Car, 
  Bike, 
  Zap, 
  MapPin, 
  Search,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

interface FeaturedVehicle {
  id: number;
  type: 'CAR' | 'BIKE' | 'EV';
  name: string;
  brand: string;
  variant: string;
  tagline: string;
  imageUrl: string;
  exShowroomPrice: number;
  estimatedOnRoadPrice: number;
  highlightBadge: string;
  specs: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
  };
}

const FEATURED_VEHICLES: FeaturedVehicle[] = [
  {
    id: 4,
    type: 'EV',
    name: 'Tata Nexon.ev',
    brand: 'Tata Motors',
    variant: 'Empowered+ Long Range (45 kWh)',
    tagline: 'India’s most celebrated electric SUV with V2L bidirectional charging.',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1600&q=85',
    exShowroomPrice: 1699000,
    estimatedOnRoadPrice: 1785000,
    highlightBadge: '5-Star Bharat NCAP',
    specs: {
      label1: 'Certified Range',
      val1: '465 km ARAI',
      label2: 'Running Cost',
      val2: '₹0.85 / km',
      label3: 'Acceleration',
      val3: '0-100 in 8.9s'
    }
  },
  {
    id: 19,
    type: 'CAR',
    name: 'BMW 3 Series GL',
    brand: 'BMW',
    variant: '330Li M Sport Gran Limousine',
    tagline: 'TwinPower Turbo dynamics, 50:50 weight distribution & limousine rear legroom.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=85',
    exShowroomPrice: 6060000,
    estimatedOnRoadPrice: 6240000,
    highlightBadge: '5-Star Euro NCAP',
    specs: {
      label1: 'Peak Power',
      val1: '258 bhp / 400 Nm',
      label2: 'Fuel Economy',
      val2: '15.39 km/l',
      label3: 'Acceleration',
      val3: '0-100 in 6.2s'
    }
  },
  {
    id: 6,
    type: 'BIKE',
    name: 'Yamaha YZF R15 V4',
    brand: 'Yamaha',
    variant: 'Racing Edition Dual ABS',
    tagline: 'Track-bred Variable Valve Actuation (VVA) and factory quickshifter.',
    imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1600&q=85',
    exShowroomPrice: 187000,
    estimatedOnRoadPrice: 215000,
    highlightBadge: 'Dual-Channel ABS',
    specs: {
      label1: 'Engine Power',
      val1: '18.4 bhp @ 10k RPM',
      label2: 'Efficiency',
      val2: '51.4 km/l ARAI',
      label3: 'Top Speed',
      val3: '142 km/h'
    }
  },
  {
    id: 7,
    type: 'BIKE',
    name: 'Royal Enfield Hunter 350',
    brand: 'Royal Enfield',
    variant: 'Metro Dapper Series',
    tagline: 'Agile 17-inch alloy dynamics with the iconic 349cc J-Series counterbalanced thumper.',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=85',
    exShowroomPrice: 149900,
    estimatedOnRoadPrice: 178000,
    highlightBadge: 'Neo-Retro Roadster',
    specs: {
      label1: 'Torque Curve',
      val1: '27 Nm @ 4k RPM',
      label2: 'Fuel Economy',
      val2: '36.2 km/l ARAI',
      label3: 'Kerb Weight',
      val3: '181 kg Agile'
    }
  }
];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [quickCategory, setQuickCategory] = useState<'ALL' | 'CAR' | 'MOTORCYCLE' | 'EV'>('ALL');
  const [budgetRange, setBudgetRange] = useState<string>('all');

  const currentVehicle = FEATURED_VEHICLES[selectedIdx];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/vehicles';
    const params = new URLSearchParams();

    if (quickCategory === 'CAR') params.set('category', 'CAR');
    else if (quickCategory === 'MOTORCYCLE') params.set('category', 'MOTORCYCLE');
    else if (quickCategory === 'EV') params.set('category', 'ELECTRIC_CAR');

    if (budgetRange === 'under-2l') {
      params.set('minPrice', '50000');
      params.set('maxPrice', '200000');
    } else if (budgetRange === '5-8l') {
      params.set('minPrice', '500000');
      params.set('maxPrice', '800000');
    } else if (budgetRange === '8-12l') {
      params.set('minPrice', '800000');
      params.set('maxPrice', '1200000');
    } else if (budgetRange === '12-20l') {
      params.set('minPrice', '1200000');
      params.set('maxPrice', '2000000');
    } else if (budgetRange === 'above-20l') {
      params.set('minPrice', '2000000');
      params.set('maxPrice', '10000000');
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    navigate(url);
  };

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#fafbfc] via-white to-[#f8fafc] border-b border-slate-200/80">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 -translate-y-1/2 w-[700px] h-[350px] bg-rose-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[300px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content & Quick Budget Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mednix Style Pre-Title Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Independent Automotive Decision Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] font-heading">
              Find the Vehicle That <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500">
                Fits Your Life.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-body leading-relaxed">
              Compare cars and bikes, explore your best options, and make a confident buying decision without dealer markups or showroom pressure.
            </p>

            {/* Prominent Quick Budget Selector Box (Mednix Card Layout) */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Quick Vehicle Finder
                </span>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  18+ Verified Indian Models
                </span>
              </div>

              {/* Category Radio Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ALL', label: 'All Classes', icon: TrendingUp },
                  { id: 'CAR', label: 'Cars', icon: Car },
                  { id: 'MOTORCYCLE', label: 'Bikes', icon: Bike },
                  { id: 'EV', label: 'Electric EVs', icon: Zap },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = quickCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQuickCategory(item.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Budget Selector Dropdown + Search Button */}
              <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <div className="flex-1">
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="all">Any Price / Budget</option>
                    <option value="under-2l">Under ₹2 Lakh (2-Wheelers)</option>
                    <option value="5-8l">₹5 Lakh – ₹8 Lakh (Budget Hatchbacks)</option>
                    <option value="8-12l">₹8 Lakh – ₹12 Lakh (Compact SUVs & Sedans)</option>
                    <option value="12-20l">₹12 Lakh – ₹20 Lakh (Midsize SUVs & EVs)</option>
                    <option value="above-20l">₹20 Lakh & Above (Premium & Luxury)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Matches</span>
                </button>
              </form>
            </div>

            {/* Primary & Secondary Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/find-my-vehicle"
                className="btn-pill-primary text-sm shadow-md group"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Find My Vehicle</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/compare"
                className="btn-pill-outline text-sm"
              >
                <GitCompare className="w-4 h-4 text-slate-500" />
                <span>Compare Vehicles</span>
              </Link>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>SIAM & ARAI Homologated</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Bharat NCAP Tested</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Verified OEM Dealerships</span>
              </span>
            </div>
          </div>

          {/* Right Column: Mednix-style Automotive Composition with Floating Stat Badges */}
          <div className="lg:col-span-5 relative">
            {/* Interactive Vehicle Switcher Tabs */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Featured Showroom Picks
              </span>
              <div className="flex items-center gap-1">
                {FEATURED_VEHICLES.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      selectedIdx === idx ? 'w-6 bg-rose-600' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`View ${v.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Main Showcase Card */}
            <div className="mednix-card overflow-hidden relative group">
              {/* Vehicle Image Container */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
                <img
                  src={currentVehicle.imageUrl}
                  alt={currentVehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Floating Top Badge: Highlight (e.g. 5-Star NCAP) */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="mednix-floating-badge px-3 py-1.5 flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-extrabold text-slate-900">
                      {currentVehicle.highlightBadge}
                    </span>
                  </div>
                </div>

                {/* Vehicle Quick Switch Pill */}
                <div className="absolute top-4 right-4 z-20 flex gap-1">
                  {FEATURED_VEHICLES.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        selectedIdx === idx
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-white/80 backdrop-blur-md text-slate-800 hover:bg-white'
                      }`}
                    >
                      {v.type}
                    </button>
                  ))}
                </div>

                {/* Image Overlay Title & Variant */}
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                    {currentVehicle.brand}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    {currentVehicle.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                    {currentVehicle.variant}
                  </p>
                </div>
              </div>

              {/* Specs & Pricing Details */}
              <div className="p-5 sm:p-6 bg-white space-y-4">
                {/* 3 Key Specs Strip */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      {currentVehicle.specs.label1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {currentVehicle.specs.val1}
                    </span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      {currentVehicle.specs.label2}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 mt-0.5 block">
                      {currentVehicle.specs.val2}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      {currentVehicle.specs.label3}
                    </span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {currentVehicle.specs.val3}
                    </span>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Est. On-Road (Delhi)
                    </span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {formatIndianPrice(currentVehicle.estimatedOnRoadPrice)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Ex-showroom: {formatIndianPrice(currentVehicle.exShowroomPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/vehicles/${currentVehicle.id}`}
                      className="btn-pill-primary text-xs py-2 px-4 shadow-sm"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mednix Floating Micro-Card Over Hero: Dealer Locator / Pan-India Verification */}
            <div className="mednix-floating-badge p-3.5 sm:p-4 absolute -bottom-6 -left-4 sm:-left-6 max-w-[260px] z-30 shadow-xl hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">100% OEM Authorized</p>
                <p className="text-[11px] text-slate-500">Official brand showrooms verified across India</p>
              </div>
            </div>

            {/* Mednix Floating Micro-Card Over Hero: Efficiency / Savings */}
            <div className="mednix-floating-badge p-3.5 sm:p-4 absolute -top-5 -right-4 sm:-right-6 max-w-[240px] z-30 shadow-xl hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Real TCO Math</p>
                <p className="text-[11px] text-slate-500">5-year fuel & maintenance analytics</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
