import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  GitCompare, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Car, 
  Bike
} from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

interface HeroSlide {
  id: number;
  vehicleType: 'CAR' | 'BIKE';
  name: string;
  brand: string;
  seriesTag: string;
  headline: string;
  tagline: string;
  bgImageUrl: string;
  onRoadPrice: number;
  keySpecs: {
    power: string;
    efficiency: string;
    safetyOrFeature: string;
    accelerationOrSpeed: string;
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 19,
    vehicleType: 'CAR',
    name: 'BMW 3 Series Gran Limousine',
    brand: 'BMW',
    seriesTag: 'THE ULTIMATE DRIVING MACHINE',
    headline: 'SHEER DRIVING PLEASURE.',
    tagline: 'TwinPower Turbo inline dynamics, 50:50 axle weight balance, BMW Curved Display with OS 8, and executive limousine legroom.',
    bgImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2400&q=85',
    onRoadPrice: 6240000,
    keySpecs: {
      power: '258 bhp / 400 Nm',
      efficiency: '15.39 km/l ARAI',
      safetyOrFeature: '5★ Euro NCAP',
      accelerationOrSpeed: '0-100 in 6.2s',
    },
  },
  {
    id: 6,
    vehicleType: 'BIKE',
    name: 'Yamaha YZF R15 V4',
    brand: 'Yamaha',
    seriesTag: 'TRACK-BRED SUPERSPORT',
    headline: 'BORN OF MOTO GP DNA.',
    tagline: 'Variable Valve Actuation (VVA), factory quickshifter, upside-down front forks, and aerodynamic racing fairing.',
    bgImageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=2400&q=85',
    onRoadPrice: 215000,
    keySpecs: {
      power: '18.4 bhp @ 10,000 RPM',
      efficiency: '51.4 km/l ARAI',
      safetyOrFeature: 'Dual ABS + Traction',
      accelerationOrSpeed: '142 km/h Top Speed',
    },
  },
  {
    id: 4,
    vehicleType: 'CAR',
    name: 'Tata Nexon.ev Long Range',
    brand: 'Tata Motors',
    seriesTag: 'ELECTRIC REVOLUTION',
    headline: 'THE SILENT POWERHOUSE.',
    tagline: '465 km certified single-charge range, V2L bidirectional power sharing, and 0-100 acceleration in 8.9 seconds.',
    bgImageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=2400&q=85',
    onRoadPrice: 1785000,
    keySpecs: {
      power: '142.7 bhp',
      efficiency: '465 km Range',
      safetyOrFeature: '5★ Bharat NCAP',
      accelerationOrSpeed: '0-100 in 8.9s',
    },
  },
  {
    id: 7,
    vehicleType: 'BIKE',
    name: 'Royal Enfield Hunter 350',
    brand: 'Royal Enfield',
    seriesTag: 'PURE MODERN ROADSTER',
    headline: 'PULSE OF THE METROPOLIS.',
    tagline: 'Agile 17-inch cast alloy wheels, signature 349cc J-Series counterbalanced thumper torque, and neo-retro cafe posture.',
    bgImageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2400&q=85',
    onRoadPrice: 178000,
    keySpecs: {
      power: '20.2 bhp',
      efficiency: '36.2 km/l ARAI',
      safetyOrFeature: 'Dual-Channel ABS',
      accelerationOrSpeed: '27 Nm @ 4,000 RPM',
    },
  },
  {
    id: 3,
    vehicleType: 'CAR',
    name: 'Hyundai Creta Panoramic',
    brand: 'Hyundai',
    seriesTag: 'PARAMETRIC COMPACT SUV',
    headline: 'UNRIVALED ROAD PRESENCE.',
    tagline: 'Voice-controlled panoramic sunroof, Bose 8-speaker acoustics, dual-zone climate, and refined highway cruising.',
    bgImageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=2400&q=85',
    onRoadPrice: 1380000,
    keySpecs: {
      power: '115 bhp',
      efficiency: '17.4 km/l ARAI',
      safetyOrFeature: '6 Airbags Standard',
      accelerationOrSpeed: '433L Boot Capacity',
    },
  },
];

export const HeroSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CAR' | 'BIKE'>('ALL');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const filteredSlides = HERO_SLIDES.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.vehicleType === activeFilter;
  });

  const safeIdx = currentIdx % filteredSlides.length;
  const currentSlide = filteredSlides[safeIdx] || filteredSlides[0];

  const SLIDE_DURATION = 6500;

  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);
    const intervalMs = 50;
    const stepPercent = (intervalMs / SLIDE_DURATION) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIdx((c) => (c + 1) % filteredSlides.length);
          return 0;
        }
        return prev + stepPercent;
      });
    }, intervalMs);

    return () => clearInterval(progressTimer);
  }, [isPlaying, safeIdx, filteredSlides.length]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % filteredSlides.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + filteredSlides.length) % filteredSlides.length);
    setProgress(0);
  };

  const handleSelectSlide = (idx: number) => {
    setCurrentIdx(idx);
    setProgress(0);
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[670px] max-h-[960px] overflow-hidden bg-[#fff0f4] text-white flex flex-col justify-between border-b border-pink-200 select-none">
      {/* 1. DYNAMIC CINEMATIC BACKGROUND LAYERS WITH LIGHT PINK RADIANT GRADIENT BLENDING */}
      <div className="absolute inset-0 z-0">
        {filteredSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === safeIdx ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Background image with Ken-Burns motion */}
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[7000ms] ease-out ${
                idx === safeIdx ? 'scale-105' : 'scale-100'
              }`}
              style={{
                backgroundImage: `url(${slide.bgImageUrl})`,
              }}
            />

            {/* Radiant White & Light Pink Vignette Film */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent lg:w-3/5 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,114,182,0.2),transparent_60%)] pointer-events-none" />
          </div>
        ))}
      </div>

      {/* 2. TOP FLOATING LUXURY BAR (Filters & Mission) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-pink-300/40 text-xs text-pink-200 font-semibold shadow-[0_0_20px_rgba(244,114,182,0.25)]">
          <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
          <span className="tracking-wide">100% VERIFIED INDIAN AUTOMOTIVE DATA & SPECIFICATIONS</span>
        </div>

        {/* Category Switcher Pill: ALL / CARS / BIKES */}
        <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/20">
          <button
            onClick={() => { setActiveFilter('ALL'); setCurrentIdx(0); }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Showcases
          </button>
          <button
            onClick={() => { setActiveFilter('CAR'); setCurrentIdx(0); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'CAR'
                ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Car className="w-3 h-3" />
            <span>Cars</span>
          </button>
          <button
            onClick={() => { setActiveFilter('BIKE'); setCurrentIdx(0); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'BIKE'
                ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bike className="w-3 h-3" />
            <span>Bikes</span>
          </button>
        </div>
      </div>

      {/* 3. HERO EDITORIAL STAGE */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 my-auto">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Active Model Series Tag */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-rose-500/20 border border-rose-400/50 text-rose-300 font-mono text-[11px] font-extrabold tracking-widest uppercase">
              {currentSlide.seriesTag}
            </span>
            <span className="text-xs text-slate-200 font-semibold tracking-wider uppercase">
              {currentSlide.brand} • Est. Delhi On-Road {formatIndianPrice(currentSlide.onRoadPrice)}
            </span>
          </div>

          {/* Main Monumental Headline */}
          <div className="space-y-1">
            <h2 className="text-lg sm:text-2xl font-light tracking-[0.2em] text-pink-300 uppercase">
              {currentSlide.name}
            </h2>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none uppercase drop-shadow-2xl">
              {currentSlide.headline}
            </h1>
          </div>

          {/* Subtitle / Narrative */}
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-md">
            {currentSlide.tagline}
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
            <Link
              to="/find-my-vehicle"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500 text-white font-black text-sm tracking-wide shadow-[0_0_30px_rgba(244,63,94,0.45)] hover:shadow-[0_0_40px_rgba(244,63,94,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>FIND MY VEHICLE (WIZARD)</span>
            </Link>

            <Link
              to={`/compare?vehicle1=${currentSlide.id}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/50 hover:border-pink-300 text-white font-bold text-sm tracking-wide transition-all shadow-lg active:scale-95"
            >
              <GitCompare className="w-4 h-4 text-pink-300" />
              <span>COMPARE THIS MODEL</span>
            </Link>

            <Link
              to={`/vehicles/${currentSlide.id}`}
              className="text-xs font-semibold text-slate-200 hover:text-pink-300 flex items-center gap-1.5 py-2 px-3 transition-colors"
            >
              <span>Explore Verified Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM HUD SPECIFICATION BAR & SLIDESHOW NAVIGATOR */}
      <div className="relative z-20 w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-6 pb-6 border-t border-white/15 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Live Vehicle Spec HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1">
              <div className="border-l-2 border-rose-400 pl-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Performance Output
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  {currentSlide.keySpecs.power}
                </span>
              </div>

              <div className="border-l-2 border-rose-400 pl-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-semibold">
                  {currentSlide.vehicleType === 'CAR' ? 'Efficiency / Range' : 'ARAI Mileage'}
                </span>
                <span className="text-base sm:text-lg font-black text-pink-300">
                  {currentSlide.keySpecs.efficiency}
                </span>
              </div>

              <div className="border-l-2 border-rose-400 pl-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Certified Benchmark
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  {currentSlide.keySpecs.safetyOrFeature}
                </span>
              </div>

              <div className="border-l-2 border-rose-400 pl-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Acceleration / Torque
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  {currentSlide.keySpecs.accelerationOrSpeed}
                </span>
              </div>
            </div>

            {/* Timeline Slideshow Navigator */}
            <div className="flex items-center gap-4 self-end lg:self-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  title="Previous Vehicle"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  title="Next Vehicle"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Thumbnails / Progress Chips */}
              <div className="flex items-center gap-2">
                {filteredSlides.map((slide, idx) => {
                  const isActive = idx === safeIdx;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => handleSelectSlide(idx)}
                      className={`group relative text-left py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-500/30 border border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                          : 'bg-black/50 border border-white/20 text-slate-300 hover:text-white hover:bg-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-pink-300">
                          0{idx + 1}
                        </span>
                        <span className="text-[11px] font-bold hidden sm:inline">
                          {slide.name.split(' ')[0]}
                        </span>
                      </div>

                      {isActive && isPlaying && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-600 rounded-b-lg overflow-hidden">
                          <div
                            className="h-full bg-rose-400 transition-all duration-75"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
