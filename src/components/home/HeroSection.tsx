import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  GitCompare, 
  ShieldCheck, 
  ArrowRight, 
  Car, 
  Bike, 
  Zap, 
  Search,
  CheckCircle,
  TrendingUp,
  Play,
  Pause,
  ChevronRight
} from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

interface CinematicScene {
  id: number;
  type: 'CAR' | 'BIKE' | 'EV';
  categoryLabel: string;
  name: string;
  brand: string;
  variant: string;
  tagline: string;
  imageUrl: string;
  atmosphereBg: string;
  lightingTone: string;
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

// 3-Vehicle Cinematic Sequence: BMW -> Superbike -> EV -> BMW
const CINEMATIC_SCENES: CinematicScene[] = [
  {
    id: 19,
    type: 'CAR',
    categoryLabel: 'Luxury Sedan',
    name: 'BMW 3 Series Gran Limousine',
    brand: 'BMW',
    variant: '330Li M Sport Gran Limousine',
    tagline: 'TwinPower Turbo dynamics, 50:50 weight distribution & executive limousine rear legroom.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=85',
    atmosphereBg: 'radial-gradient(ellipse at 70% 40%, rgba(185, 151, 91, 0.22) 0%, rgba(23, 23, 23, 0.95) 75%)',
    lightingTone: 'from-[#B9975B]/20 via-transparent to-transparent',
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
    categoryLabel: 'Supersport',
    name: 'Yamaha YZF R15 V4',
    brand: 'Yamaha',
    variant: 'Racing Edition Dual-Channel ABS',
    tagline: 'Track-bred Variable Valve Actuation (VVA), factory quickshifter, and aggressive aerodynamics.',
    imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1600&q=85',
    atmosphereBg: 'radial-gradient(ellipse at 70% 40%, rgba(201, 171, 117, 0.25) 0%, rgba(23, 23, 23, 0.95) 75%)',
    lightingTone: 'from-[#C9AB75]/25 via-transparent to-transparent',
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
    id: 4,
    type: 'EV',
    categoryLabel: 'Electric SUV',
    name: 'Tata Nexon.ev',
    brand: 'Tata Motors',
    variant: 'Empowered+ Long Range (45 kWh)',
    tagline: 'India’s most celebrated electric SUV with 465 km range and V2L bidirectional charging.',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1600&q=85',
    atmosphereBg: 'radial-gradient(ellipse at 70% 40%, rgba(185, 151, 91, 0.18) 0%, rgba(23, 23, 23, 0.95) 75%)',
    lightingTone: 'from-[#B9975B]/20 via-transparent to-transparent',
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
  }
];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Quick Search States
  const [quickCategory, setQuickCategory] = useState<'ALL' | 'CAR' | 'MOTORCYCLE' | 'EV'>('ALL');
  const [budgetRange, setBudgetRange] = useState<string>('all');

  const SCENE_DURATION_MS = 5200; // ~5 seconds per scene

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Continuous Cinematic 3D Loop: BMW -> Superbike -> EV -> BMW
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSceneIdx((prev) => (prev + 1) % CINEMATIC_SCENES.length);
        setIsTransitioning(false);
      }, 500); // 500ms crossfade point
    }, SCENE_DURATION_MS);

    return () => clearInterval(interval);
  }, [isPlaying, prefersReducedMotion]);

  const currentScene = CINEMATIC_SCENES[currentSceneIdx];

  const handleManualSceneSelect = (idx: number) => {
    if (idx === currentSceneIdx) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSceneIdx(idx);
      setIsTransitioning(false);
    }, 300);
  };

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
    <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-20 overflow-hidden bg-[#F4F0E8] border-b border-[#E5E0D8]">
      {/* Subtle Warm Luxury Ambient Accents */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[700px] h-[350px] bg-[#B9975B]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* =========================================================================
             LEFT COLUMN: STABLE FOREGROUND CONTENT & QUICK BUDGET SELECTOR
             (Guaranteed 100% stable, high contrast, never obscured)
             ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Headline (Manrope 700-800) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#171717] tracking-tight leading-[1.12] font-heading">
              Find the Vehicle That <br className="hidden sm:inline" />
              <span className="text-[#B9975B]">
                Fits Your Life.
              </span>
            </h1>

            {/* Supporting Text (DM Sans 400-500) */}
            <p className="text-base sm:text-lg text-[#404040] max-w-xl font-body leading-relaxed">
              Compare cars and bikes, explore your best options, and make a confident buying decision without dealer markups or showroom pressure.
            </p>

            {/* Prominent Quick Budget Selector Box in Luxury Palette */}
            <div className="luxury-card p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#171717] uppercase tracking-wider font-heading">
                  Quick Vehicle Finder
                </span>
                <span className="text-[11px] font-semibold text-[#9F7F45] bg-[#B9975B]/12 px-2.5 py-0.5 rounded-full font-heading">
                  18+ Verified Indian Models
                </span>
              </div>

              {/* Category Radio Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ALL', label: 'All Classes', icon: Sparkles },
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
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer font-heading ${
                        isSelected
                          ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B] shadow-xs'
                          : 'bg-[#FAF8F5] border border-[#E5E0D8] text-[#404040] hover:border-[#B9975B] hover:text-[#171717]'
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
                    className="w-full h-11 px-4 rounded-full border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-medium text-[#171717] focus:outline-none focus:border-[#B9975B] focus:bg-white transition-all cursor-pointer font-body"
                  >
                    <option value="all">Any Price / Budget Ceiling</option>
                    <option value="under-2l">Under ₹2 Lakh (Two-Wheelers & Scooters)</option>
                    <option value="5-8l">₹5 Lakh – ₹8 Lakh (Budget Hatchbacks)</option>
                    <option value="8-12l">₹8 Lakh – ₹12 Lakh (Compact SUVs & Sedans)</option>
                    <option value="12-20l">₹12 Lakh – ₹20 Lakh (Midsize SUVs & EVs)</option>
                    <option value="above-20l">₹20 Lakh & Above (Premium & Luxury Cars)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-charcoal h-11 px-6 text-xs text-[#FFFFFF]"
                >
                  <Search className="w-3.5 h-3.5 text-[#B9975B]" />
                  <span>Search Matches</span>
                </button>
              </form>
            </div>

            {/* Primary & Secondary Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1 font-body">
              <Link
                to="/find-my-vehicle"
                className="btn-gold text-sm shadow-md group"
              >
                <Sparkles className="w-4 h-4 text-[#171717]" />
                <span>Find My Vehicle</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/compare"
                className="btn-outline-gold text-sm"
              >
                <GitCompare className="w-4 h-4 text-[#B9975B]" />
                <span>Compare Vehicles</span>
              </Link>
            </div>

            {/* Trust Indicators Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#525252] font-medium font-body">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#B9975B]" />
                <span>SIAM & ARAI Homologated</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B9975B]" />
                <span>Bharat NCAP Tested</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#B9975B]" />
                <span>Verified OEM Dealerships</span>
              </span>
            </div>
          </div>

          {/* =========================================================================
             RIGHT COLUMN: CINEMATIC DYNAMIC 3D VEHICLE SHOWCASE
             (Completely fixes the overlap defect - all metrics in normal document flow)
             ========================================================================= */}
          <div className="lg:col-span-5 w-full">
            
            {/* Cinematic Stage Header: Scene Indicators & Pause/Resume Control */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider font-heading">
                  Cinematic Stage
                </span>
                <span className="text-[10px] text-[#B9975B] font-semibold bg-[#B9975B]/15 px-2 py-0.5 rounded-full font-heading">
                  Scene {currentSceneIdx + 1} of 3
                </span>
              </div>

              {/* Controls: Manual scene tabs + Pause/Play */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {CINEMATIC_SCENES.map((scene, idx) => (
                    <button
                      key={scene.id}
                      onClick={() => handleManualSceneSelect(idx)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer font-heading ${
                        currentSceneIdx === idx
                          ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B]'
                          : 'bg-white border border-[#E5E0D8] text-stone-500 hover:text-[#171717]'
                      }`}
                      aria-label={`Switch to ${scene.name}`}
                    >
                      {scene.type}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full bg-white border border-[#E5E0D8] text-stone-600 hover:text-[#171717] hover:border-[#B9975B] transition-all cursor-pointer"
                  title={isPlaying ? 'Pause 3D Transition' : 'Resume 3D Transition'}
                  aria-label={isPlaying ? 'Pause 3D Transition' : 'Resume 3D Transition'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#B9975B]" />}
                </button>
              </div>
            </div>

            {/* Main Showcase Card with Explicit Layout Boundary (Zero Overlaps) */}
            <div className="luxury-card overflow-hidden relative shadow-sm border border-[#E5E0D8] bg-white">
              
              {/* Dynamic 3D Vehicle Stage Container */}
              <div 
                className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#171717] perspective-1000"
                style={{ background: currentScene.atmosphereBg }}
              >
                {/* 3D Depth Layer with Smooth Perspective Transform */}
                <div 
                  className={`w-full h-full relative transition-all duration-700 ease-out preserve-3d ${
                    isTransitioning 
                      ? 'opacity-0 scale-95 translate-y-2' 
                      : 'opacity-100 scale-100 translate-y-0'
                  }`}
                  style={{
                    transform: prefersReducedMotion ? 'none' : 'perspective(1000px) rotateY(-2deg) translateZ(10px)'
                  }}
                >
                  <img
                    src={currentScene.imageUrl}
                    alt={currentScene.name}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  {/* Subtle Luxury Vignette & Contrast Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/25 to-transparent pointer-events-none" />
                </div>

                {/* Golden Light Sweep Animation during Scene Transitions */}
                {isTransitioning && (
                  <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#B9975B]/60 to-transparent animate-gold-sweep" />
                  </div>
                )}

                {/* Category Pill Tag */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#B9975B] text-[#171717] shadow-sm font-heading">
                    {currentScene.categoryLabel}
                  </span>
                </div>

                {/* Vehicle Identification Overlay */}
                <div className="absolute bottom-3 left-4 right-4 z-20 text-white">
                  <span className="text-[11px] font-bold text-[#B9975B] uppercase tracking-wider block font-heading">
                    {currentScene.brand}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading leading-tight truncate">
                    {currentScene.name}
                  </h3>
                  <p className="text-xs text-stone-300 font-medium truncate mt-0.5 font-body">
                    {currentScene.variant}
                  </p>
                </div>
              </div>

              {/* Showcase Card Specifications & Pricing Area */}
              <div className="p-5 sm:p-6 bg-white space-y-4">
                
                {/* 3 Key Homologated Specs Strip (Tabular Numerals) */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-center font-body">
                  <div>
                    <span className="text-[10px] font-semibold text-stone-500 block uppercase font-heading">
                      {currentScene.specs.label1}
                    </span>
                    <span className="text-xs font-bold text-[#171717] mt-0.5 block tabular-numbers">
                      {currentScene.specs.val1}
                    </span>
                  </div>
                  <div className="border-x border-[#E5E0D8]">
                    <span className="text-[10px] font-semibold text-stone-500 block uppercase font-heading">
                      {currentScene.specs.label2}
                    </span>
                    <span className="text-xs font-bold text-[#B9975B] mt-0.5 block tabular-numbers">
                      {currentScene.specs.val2}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-stone-500 block uppercase font-heading">
                      {currentScene.specs.label3}
                    </span>
                    <span className="text-xs font-bold text-[#171717] mt-0.5 block tabular-numbers">
                      {currentScene.specs.val3}
                    </span>
                  </div>
                </div>

                {/* Pricing & Call to Action (Completely Visible & Unobstructed) */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 block uppercase font-heading">
                      Est. On-Road (Delhi)
                    </span>
                    <span className="text-xl font-extrabold text-[#171717] tabular-numbers font-heading">
                      {formatIndianPrice(currentScene.estimatedOnRoadPrice)}
                    </span>
                    <span className="text-[10px] text-stone-500 block tabular-numbers font-body">
                      Ex-showroom: {formatIndianPrice(currentScene.exShowroomPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/vehicles/${currentScene.id}`}
                      className="btn-gold text-xs py-2 px-4 shadow-sm"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
               FIX FOR OVERLAP DEFECT:
               Information cards placed in normal document flow directly below the showcase
               ========================================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              
              {/* Feature Badge 1: 100% OEM Authorized */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#171717] text-[#B9975B] flex items-center justify-center shrink-0 border border-[#B9975B]/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#171717] font-heading">100% OEM Authorized</p>
                  <p className="text-[11px] text-stone-500 font-body leading-tight">Official brand showrooms verified across India</p>
                </div>
              </div>

              {/* Feature Badge 2: Real TCO Math */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B9975B]/15 text-[#9F7F45] flex items-center justify-center shrink-0 border border-[#B9975B]/40">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#171717] font-heading">Real TCO Math</p>
                  <p className="text-[11px] text-stone-500 font-body leading-tight">5-year fuel & maintenance projections</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
