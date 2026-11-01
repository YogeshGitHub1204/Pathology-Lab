import React from 'react';
import { Phone, MessageSquare, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LabConfig } from '../types/index.js';

interface HeroProps {
  config: LabConfig;
  onOpenChat: (initialQuery?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onOpenChat }) => {
  const phone = config.lab_phone || '+91 98220 12345';
  const phoneRaw = config.lab_phone_raw || '+919822012345';
  const address = config.lab_address || 'Shop 12-14, Ground Floor, Fortune Business Centre, FC Road, Shivaji Nagar, Pune, Maharashtra 411005';
  const timings = config.lab_timings || 'Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM';

  return (
    <section id="top" className="relative bg-gradient-to-b from-teal-50/60 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Proposition and Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider">
              <span>Diagnostic Pathology & Radiology</span>
              <span aria-hidden="true">·</span>
              <span>Pune, Maharashtra</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Precision Diagnostic Pathology & Digital X-Ray in Pune
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Welcome to <strong className="text-slate-800 font-semibold">Jeevan Pathology Lab</strong>. Offering accurate blood diagnostics, comprehensive urine panels, digital radiography, and certified technician courses with same-day reports.
            </p>

            {/* Quick Contact & Timings Bar */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5 max-w-xl">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{timings}</span>
                </div>
                <a
                  href={`tel:${phoneRaw}`}
                  className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>{phone}</span>
                </a>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenChat()}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask Assistant Jeevan</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>

              <a
                href="#lab-tests"
                className="px-5 py-3.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Explore All Tests
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="px-4 py-3.5 text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Lab Directly</span>
              </a>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Same-Day WhatsApp Reports</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Sterile Vaccutainer Collection</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Senior MD Pathologist Review</span>
              </div>
            </div>
          </div>

          {/* Right Column: Marquee Visual Carrier (Lab Interior) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 aspect-[16/11]">
              <img
                src="/src/assets/images/lab_interior_1793529103134.jpg"
                alt="Jeevan Pathology Lab interior in Pune, India featuring modern automated analyzers"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Resilient styled fallback container per Section 3.E
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback container */}
              <div
                style={{ display: 'none' }}
                className="absolute inset-0 bg-gradient-to-br from-teal-800 to-slate-900 text-white p-6 flex-col justify-between items-start"
              >
                <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">
                  Diagnostic Facility
                </span>
                <div>
                  <h3 className="text-xl font-bold">Jeevan Pathology Lab</h3>
                  <p className="text-xs text-slate-300 mt-1">FC Road, Shivaji Nagar, Pune</p>
                </div>
              </div>

              {/* Quiet photo caption tag */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/60 flex items-center justify-between text-[11px] text-slate-700">
                <span className="font-semibold">Clinical Laboratory Floor</span>
                <span className="text-slate-500">FC Road Branch, Pune</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
