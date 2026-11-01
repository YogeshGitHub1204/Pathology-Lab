import React from 'react';
import { Phone, MapPin, Clock, Shield, Heart } from 'lucide-react';
import { LabConfig } from '../types/index.js';

interface FooterProps {
  config: LabConfig;
  onNavigateToAdmin: () => void;
  onNavigateToMcp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigateToAdmin, onNavigateToMcp }) => {
  const phone = config.lab_phone || '+91 98220 12345';
  const phoneRaw = config.lab_phone_raw || '+919822012345';
  const address = config.lab_address || 'Shop 12-14, Ground Floor, Fortune Business Centre, Near Goodluck Chowk, FC Road, Shivaji Nagar, Pune, Maharashtra 411005';
  const timings = config.lab_timings || 'Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM';

  return (
    <footer id="contact-section" className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Wordmark & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-base">
                J
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Jeevan Pathology Lab</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trusted clinical pathology, automated biochemistry diagnostics, and digital X-ray center in Pune, Maharashtra.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Assistant</span>
              <span className="font-semibold text-teal-400">Jeevan</span>
              <span>active 24/7 for lead inquiries.</span>
            </div>
          </div>

          {/* Col 2: Pune Address & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pune Centre</h4>
            <div className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs pt-1">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <a
                href={`tel:${phoneRaw}`}
                className="font-bold text-white hover:text-teal-300 transition-colors"
              >
                {phone}
              </a>
            </div>
          </div>

          {/* Col 3: Timings & Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operational Hours</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{timings}</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5.5">
                Sample Collection: 7:00 AM - 8:30 PM
              </p>
              <p className="text-[11px] text-slate-400 pl-5.5">
                Report Dispatch: Same Day by 7:00 PM
              </p>
            </div>
          </div>

          {/* Col 4: Course Fees & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Academics & Management</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pathology Technician Courses: <strong className="text-teal-300">Rs 1,500, Rs 2,500, and Rs 3,000 / month</strong>.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={onNavigateToAdmin}
                className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>Staff Portal</span>
              </button>

              {onNavigateToMcp && (
                <button
                  onClick={onNavigateToMcp}
                  className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 font-mono"
                >
                  <span>/mcp-test</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Jeevan Pathology Lab, Pune. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Lead Capture Portal: JeevanChat</span>
            <span aria-hidden="true">·</span>
            <span>Pune, Maharashtra, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
