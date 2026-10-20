import React, { useState } from 'react';
import { ShieldCheck, IndianRupee, Cpu, ChevronDown, Sparkles } from 'lucide-react';

export const ValuePropsSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does MyVehicleChoice calculate estimated on-road prices in India?',
      a: 'We combine the verified manufacturer ex-showroom price with official state RTO tax slabs, mandatory third-party liability insurance, FASTag fees, and municipal registration charges. You can also view dealer-level quotes across Delhi, Mumbai, Bengaluru, and Chennai.',
    },
    {
      q: 'Are the safety crash ratings official?',
      a: 'Yes. We strictly distinguish verified Bharat NCAP and Global NCAP laboratory crash assessments from general safety equipment. We never fabricate safety stars or award points for unverified manufacturer claims.',
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
    <section className="py-20 bg-[#fff9fa] border-b border-pink-100 relative overflow-hidden text-slate-900">
      {/* Radiant very light pink ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-pink-200/25 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Why Choose MyVehicleChoice */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            Automotive Decision Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Why Choose MyVehicleChoice?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Built from first principles to eliminate showroom pressure, exaggerated mileage claims, and confusing specification sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card p-6 rounded-2xl hover:border-rose-400/60 transition-all flex flex-col group border border-pink-200/80 bg-white/95 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">Zero Spec Fabrication</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every engine displacement, power figure, ARAI certified mileage, and battery kilowatt-hour is audited against official SIAM and OEM homologation documentation.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:border-rose-400/60 transition-all flex flex-col group border border-pink-200/80 bg-white/95 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">Real Total Ownership Costs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We calculate realistic 5-year running costs comparing ₹100/L petrol against ₹8/kWh home EV charging, factoring in periodic servicing and scheduled maintenance.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:border-rose-400/60 transition-all flex flex-col group border border-pink-200/80 bg-white/95 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">Deterministic Scoring Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our recommendation logic evaluates hard budget and lifestyle constraints with explainable mathematical weights — not paid manufacturer promotions.
            </p>
          </div>
        </div>

        {/* How It Works in 3 Steps */}
        <div className="rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 text-white shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-rose-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Simple Streamlined Process
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">How It Works in 3 Steps</h3>
            <p className="text-xs sm:text-sm text-pink-100 mt-2">
              From defining your budget to taking delivery from verified authorized dealerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-8 border-t border-white/20 relative z-10">
            <div className="space-y-2">
              <span className="text-3xl font-black text-rose-200">01</span>
              <h4 className="text-base font-bold text-white">Share Your Budget & Usage</h4>
              <p className="text-xs text-pink-100 leading-relaxed">
                Specify whether you need a car, motorcycle, scooter, or EV, your monthly commute distance, and non-negotiables.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-3xl font-black text-rose-200">02</span>
              <h4 className="text-base font-bold text-white">Compare Exact Variants</h4>
              <p className="text-xs text-pink-100 leading-relaxed">
                Evaluate verified safety ratings, true on-road pricing, fuel efficiency, and key advantages side by side.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-3xl font-black text-rose-200">03</span>
              <h4 className="text-base font-bold text-white">Connect with Authorized Dealers</h4>
              <p className="text-xs text-pink-100 leading-relaxed">
                Find the closest authorized dealership, compare transparent dealer quotes, and book verified test drives.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-xl border border-pink-200 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-rose-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-pink-100 pt-3 bg-rose-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
