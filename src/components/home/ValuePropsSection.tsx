import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  IndianRupee, 
  Cpu, 
  ChevronDown, 
  Sparkles, 
  MapPin, 
  Calculator, 
  Zap, 
  TrendingUp, 
  Car, 
  Bike, 
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const ValuePropsSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const valueProps = [
    {
      icon: ShieldCheck,
      title: 'Zero Spec Fabrication',
      desc: 'Every engine displacement, power figure, ARAI certified mileage, and battery kWh is audited against official SIAM and OEM homologation documentation.',
      badge: 'Certified Data',
      color: 'rose',
    },
    {
      icon: IndianRupee,
      title: 'Real Total Ownership Costs',
      desc: 'We calculate realistic 5-year running costs comparing ₹100/L petrol against ₹8/kWh home EV charging, factoring in periodic servicing and scheduled maintenance.',
      badge: '5-Year TCO',
      color: 'emerald',
    },
    {
      icon: Cpu,
      title: 'Deterministic Scoring Engine',
      desc: 'Our recommendation logic evaluates hard budget and lifestyle constraints with explainable mathematical weights — never paid manufacturer promotions.',
      badge: '100% Unbiased',
      color: 'indigo',
    },
    {
      icon: MapPin,
      title: 'Verified Authorized Dealers',
      desc: 'Connect directly with certified OEM brand showrooms across major Indian metros. No middlemen markups, fabricated stock, or phantom discounts.',
      badge: 'OEM Authorized',
      color: 'blue',
    },
  ];

  const calculators = [
    {
      title: 'Loan EMI Calculator',
      desc: 'Calculate precise monthly installments with Indian interest rates (8%–12%), flexible tenure, and down payment schedules.',
      link: '/calculators?tab=emi',
      icon: Calculator,
      tag: 'Smart Financing',
    },
    {
      title: 'Petrol vs. EV Savings',
      desc: 'Compare daily commute costs at ₹100/L petrol versus ₹8/kWh home EV charging over 50,000 km to see your exact break-even timeline.',
      link: '/calculators?tab=savings',
      icon: Zap,
      tag: 'Green Mobility',
    },
    {
      title: '5-Year Ownership TCO',
      desc: 'Factor in true vehicle depreciation, annual insurance premiums, RTO taxes, and scheduled maintenance over 5 years.',
      link: '/calculators?tab=tco',
      icon: TrendingUp,
      tag: 'Total Ownership',
    },
  ];

  const buyerGuides = [
    {
      title: 'Understanding Ex-Showroom vs On-Road Price in India',
      category: 'Pricing Guide',
      readTime: '4 min read',
      summary: 'Learn how state RTO taxes, TCS, FASTag, mandatory insurance, and dealer logistics charges impact your final invoice.',
      link: '/vehicles',
    },
    {
      title: 'Electric Vehicles in India: Real-World 5-Year Economics',
      category: 'EV Intelligence',
      readTime: '5 min read',
      summary: 'Is an EV worth the upfront premium? We analyze real battery degradation, home charging tariffs, and resale dynamics.',
      link: '/calculators?tab=savings',
    },
    {
      title: 'Bharat NCAP & Global NCAP: What Crash Stars Really Mean',
      category: 'Safety Standard',
      readTime: '3 min read',
      summary: 'Distinguish active safety tech (ESP, ABS) from structural crashworthiness scores for adult and child occupants.',
      link: '/vehicles',
    },
  ];

  const faqs = [
    {
      q: 'How does MyVehicleChoice calculate estimated on-road prices in India?',
      a: 'We combine the verified manufacturer ex-showroom price with representative state RTO tax slabs, mandatory third-party liability insurance, FASTag fees, and municipal registration charges. You can also view dealer-level quotes across Delhi, Mumbai, Bengaluru, and Chennai.',
    },
    {
      q: 'Are the safety crash ratings official?',
      a: 'Yes. We strictly distinguish verified Bharat NCAP, Euro NCAP, and Global NCAP laboratory crash assessments from general safety equipment. We never fabricate safety stars or award points for unverified manufacturer claims.',
    },
    {
      q: 'Can I compare motorcycles and cars simultaneously?',
      a: 'Our comparison engine separates vehicle taxonomies. While you can compare vehicles within matching vehicle classes, specs like kerb weight, seat height, and suspension are tailored specifically for two-wheelers, while boot space, seating capacity, and NCAP ratings are tailored for passenger cars.',
    },
    {
      q: 'How does the "Where to Buy" feature work?',
      a: 'Our directory connects you with verified, authorized dealerships across Indian cities, allowing you to compare ex-showroom quotes, estimated delivery timelines, and schedule genuine test drives without middlemen markups.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* 1. MEDNIX VALUE PROPOSITIONS SECTION */}
      <section className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Core Engineering Principles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
              Why Buyers Trust MyVehicleChoice
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-body">
              Built from first principles to eliminate showroom pressure, exaggerated mileage claims, and confusing specification sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="mednix-card p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-950 mb-2 group-hover:text-rose-600 transition-colors font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-body">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Authenticity</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE RECOMMENDATION TEASER BANNER (MEDNIX APPOINTMENT/CALLOUT CONVERTED) */}
      <section className="py-20 bg-[#fafbfc] border-b border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mednix-card p-8 sm:p-14 bg-gradient-to-br from-slate-950 via-[#0b132b] to-slate-900 text-white relative overflow-hidden shadow-2xl">
            {/* Ambient subtle glow inside dark banner */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/15 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Intelligent Decision Flow</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight">
                Not Sure Which Vehicle Fits? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-200">
                  Find Your Perfect Match in 2 Minutes.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-body">
                Answer a few quick questions about your budget, monthly commute, fuel preferences, and seating requirements. Our mathematical scoring engine ranks the top candidates with transparent trade-offs.
              </p>
            </div>

            {/* 3 Steps Visual Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-slate-800 relative z-10">
              <div className="space-y-1.5">
                <span className="text-2xl font-black text-rose-400 font-heading">01</span>
                <h4 className="text-sm font-bold text-white font-heading">Define Budget & Body Class</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Select Cars, Motorcycles, or EVs, along with purchase budget ceiling or monthly loan EMI.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-2xl font-black text-rose-400 font-heading">02</span>
                <h4 className="text-sm font-bold text-white font-heading">Usage & Non-Negotiables</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Specify city commute distance, highway frequency, 5-star NCAP safety, or transmission preferences.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-2xl font-black text-rose-400 font-heading">03</span>
                <h4 className="text-sm font-bold text-white font-heading">Get Ranked Matches & TCO</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-body">
                  Receive an explainable match score with 5-year running cost projections and dealer quotes.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-4 flex flex-wrap items-center gap-4 relative z-10">
              <Link
                to="/find-my-vehicle"
                className="btn-pill-primary text-sm shadow-xl"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Recommendation Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/vehicles"
                className="btn-pill-outline text-sm bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <span>Browse Catalogue Directly</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FINANCIAL CALCULATORS TEASER SECTION */}
      <section className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-2.5">
                <Calculator className="w-3.5 h-3.5 text-rose-600" />
                <span>Financial Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
                Automotive Financial Calculators
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl font-body">
                Make fully informed calculations before stepping into any dealership showroom.
              </p>
            </div>

            <Link
              to="/calculators"
              className="btn-pill-outline text-xs self-start md:self-auto"
            >
              <span>Open All Calculators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <div
                  key={calc.title}
                  className="mednix-card p-6 sm:p-7 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {calc.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-rose-600 transition-colors font-heading">
                      {calc.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-body">
                      {calc.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to={calc.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      <span>Calculate Now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHERE TO BUY / DEALER DISCOVERY TEASER */}
      <section className="py-20 bg-[#fafbfc] border-b border-slate-200/80 relative overflow-hidden text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mednix-card p-8 sm:p-12 shadow-sm bg-white border border-slate-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Network</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-heading">
                  Find Verified Authorized Dealerships Near You
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                  Locate certified brand showrooms for Tata, Hyundai, Mahindra, Maruti Suzuki, BMW, Yamaha, Royal Enfield, and Ola Electric. Filter by sales showrooms, compare estimated delivery times, and request authentic test drives.
                </p>

                {/* Popular Metros */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Popular Metros:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune'].map((city) => (
                      <Link
                        key={city}
                        to={`/where-to-buy?city=${encodeURIComponent(city.split(' ')[0])}`}
                        className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:border-rose-400 hover:text-rose-600 text-xs font-bold transition-all"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Link
                  to="/where-to-buy"
                  className="btn-pill-primary text-xs py-3.5 px-6 shadow-md text-center"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Launch Dealer Locator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center text-[11px] text-slate-500 font-medium">
                  Verified against official OEM manufacturer directories. Zero spam brokers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDUCATIONAL BUYER WISDOM (REPLACING MEDICAL TESTIMONIALS) */}
      <section className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-rose-600" />
              <span>Automotive Buying Knowledge</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
              Indian Automotive Buyer Wisdom
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-body">
              Clear, transparent guides to demystify on-road pricing, EV ownership realities, and crash test ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buyerGuides.map((guide) => (
              <div
                key={guide.title}
                className="mednix-card p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-bold text-rose-600 uppercase tracking-wider text-[10px]">
                      {guide.category}
                    </span>
                    <span>{guide.readTime}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-950 group-hover:text-rose-600 transition-colors font-heading mb-2 leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-body">
                    {guide.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={guide.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-rose-600 transition-colors"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-rose-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQS ACCORDION */}
      <section className="py-20 bg-[#fafbfc] border-b border-slate-200/80 relative overflow-hidden text-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-heading">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-body">
              Everything you need to know about our data sources, pricing models, and verification methods.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-6 py-4.5 flex items-center justify-between text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span className="font-heading">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-rose-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 bg-slate-50/50 font-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
