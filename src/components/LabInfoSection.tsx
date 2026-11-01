import React from 'react';
import { MapPin, Phone, Clock, Calendar, ShieldCheck, Mail } from 'lucide-react';
import { LabConfig } from '../types/index.js';

interface LabInfoSectionProps {
  config: LabConfig;
}

export const LabInfoSection: React.FC<LabInfoSectionProps> = ({ config }) => {
  const phone = config.lab_phone || '+91 98220 12345';
  const phoneRaw = config.lab_phone_raw || '+919822012345';
  const address = config.lab_address || 'Shop 12-14, Ground Floor, Fortune Business Centre, Near Goodluck Chowk, FC Road, Shivaji Nagar, Pune, Maharashtra 411005';
  const timings = config.lab_timings || 'Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM';
  const email = config.lab_email || 'contact@jeevanpathologylab.com';

  return (
    <section id="facility-timings" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            Clinical Facility & Timings
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Visit Jeevan Pathology Lab in Pune
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Located at FC Road, Shivaji Nagar. Equipped with automated hematology analyzers, sterile phlebotomy bays, and digital radiography.
          </p>
        </div>

        {/* 2-Column Split: Details & Timings on Left, Lab Photo Slots on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Timings, Address, Phone */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Timings Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Lab Timings</h3>
                  <p className="text-xs text-slate-500">Open 7 days a week for sample collection</p>
                </div>
              </div>

              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium text-slate-700">Monday – Saturday</span>
                  <span className="font-semibold text-slate-900 font-mono">7:00 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-medium text-slate-700">Sunday</span>
                  <span className="font-semibold text-slate-900 font-mono">7:00 AM – 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center pt-3 text-slate-600">
                  <span>Blood Sample Accession</span>
                  <span className="font-mono">7:00 AM – 8:30 PM</span>
                </div>
                <div className="flex justify-between items-center pt-3 text-slate-600">
                  <span>Report Dispatch Counter</span>
                  <span>Same-Day by 7:00 PM</span>
                </div>
              </div>
            </div>

            {/* Address and Direct Contact Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pune Laboratory Address</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {address}
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Helpline / Booking:</span>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{phone}</span>
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">WhatsApp Dispatch:</span>
                  <a
                    href={`https://wa.me/${phoneRaw.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 underline"
                  >
                    Connect on WhatsApp
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Email:</span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quality Commitment */}
            <div className="flex items-center gap-3 p-4 bg-teal-900 text-white rounded-xl shadow-sm">
              <ShieldCheck className="w-6 h-6 text-teal-300 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-teal-100">Quality Certified Laboratory</div>
                <div className="text-teal-200/80 mt-0.5">Standardized daily 3-level controls and MD Pathologist verification on all reports.</div>
              </div>
            </div>

          </div>

          {/* Right Column: Pathology Lab Photo Slots (Sample Collection & Pathologist at Work) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Photo Slot 1: Sample Collection Phlebotomy Station */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-slate-100">
                <img
                  src="/src/assets/images/sample_collection_1793529105321.jpg"
                  alt="Sample Collection phlebotomy station at Jeevan Pathology Lab Pune"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback container per Zero-Broken-Image rule */}
                <div
                  style={{ display: 'none' }}
                  className="absolute inset-0 bg-slate-800 text-white p-6 flex flex-col justify-center items-center text-center"
                >
                  <span className="text-xs font-mono text-teal-400">PHOTO SLOT: SAMPLE COLLECTION</span>
                  <p className="text-sm font-semibold mt-1">Sterile Phlebotomy & Sample Accession Bay</p>
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-slate-800 shadow-sm">
                  Placeholder Slot 1: Sample Collection
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900">Sterile Sample Collection Counter</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Gentle phlebotomy using vacuum-sealed disposable vacutainers with barcoded accessioning to prevent cross-contamination or sample mix-ups.
                </p>
              </div>
            </div>

            {/* Photo Slot 2: Pathologist at Work */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-slate-100">
                <img
                  src="/src/assets/images/pathologist_at_work_1793529103564.jpg"
                  alt="Pathologist at work reviewing blood slide under microscope at Jeevan Pathology Lab"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback container */}
                <div
                  style={{ display: 'none' }}
                  className="absolute inset-0 bg-slate-800 text-white p-6 flex flex-col justify-center items-center text-center"
                >
                  <span className="text-xs font-mono text-teal-400">PHOTO SLOT: PATHOLOGIST AT WORK</span>
                  <p className="text-sm font-semibold mt-1">Microscopic Slide Examination</p>
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-slate-800 shadow-sm">
                  Placeholder Slot 2: Pathologist at Work
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900">Microscopic Slide & Histopathology Review</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Every abnormal blood smear and cytological specimen undergoes careful microscopic examination by qualified clinical pathologists.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
