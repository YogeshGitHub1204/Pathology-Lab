import React from 'react';
import { MessageSquare, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
  onNavigateToAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  onNavigateToAdmin,
  isAdminLoggedIn
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              J
            </div>
            <span>Jeevan Pathology Lab</span>
          </a>

          {/* Zone 2: 4 Clean Single-Line Text Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#lab-tests"
              className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0"
            >
              Lab Tests
            </a>
            <a
              href="#facility-timings"
              className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0"
            >
              Timings & Location
            </a>
            <a
              href="#course-fees"
              className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0"
            >
              Course Fees
            </a>
            <a
              href="#contact-section"
              className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0"
            >
              Contact Pune
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToAdmin}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Admin Portal for Lead Management"
            >
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>{isAdminLoggedIn ? 'Dashboard' : 'Admin'}</span>
            </button>

            <button
              onClick={onOpenChat}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat with Jeevan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
