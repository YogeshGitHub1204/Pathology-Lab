import React from 'react';
import { GraduationCap, CheckCircle2, MessageSquare } from 'lucide-react';

interface FeeNoticeSectionProps {
  onOpenChat: (initialQuery?: string) => void;
}

export const FeeNoticeSection: React.FC<FeeNoticeSectionProps> = ({ onOpenChat }) => {
  return (
    <section id="course-fees" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            Academic & Training Department
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Pathology Laboratory Technician Certification Courses
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Practical hands-on training under senior clinical pathologists in Pune. Transparent monthly fee schedule.
          </p>
        </div>

        {/* Highlight Banner with Exact Fee Statement */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
              Official Course Fee Structure
            </span>
            <p className="text-sm font-semibold text-teal-950">
              The fees are Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course.
            </p>
            <p className="text-xs text-teal-800">
              Includes laboratory consumables, hands-on analyzer rotations, slide staining kits, and practical evaluation.
            </p>
          </div>
          <button
            onClick={() => onOpenChat('What are the course fees?')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Jeevan About Enrollment</span>
          </button>
        </div>

        {/* 3 Structured Course Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1: Rs 1,500 per month */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-500">Foundation Track</span>
                <GraduationCap className="w-5 h-5 text-teal-600" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Phlebotomy & Sample Accession
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Sterile venipuncture techniques, blood vacutainer selection, barcode accessioning, and patient care.
              </p>

              <div className="mb-6">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  Rs 1,500
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Flexible morning or weekend batches</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Vacutainer & syringe blood collection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Sample centrifugation & preservation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Bio-waste segregation protocols</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenChat('I am interested in the Phlebotomy Course (Rs 1,500/month)')}
              className="w-full py-2.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              Inquire for Rs 1,500 Course
            </button>
          </div>

          {/* Tier 2: Rs 2,500 per month */}
          <div className="bg-white rounded-xl border-2 border-teal-600 p-6 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-teal-800">Intermediate Track</span>
                <GraduationCap className="w-5 h-5 text-teal-600" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Clinical Pathology & Hematology
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Complete blood counting analyzers, peripheral blood smear preparation, Leishman staining, and urine microscopy.
              </p>

              <div className="mb-6">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  Rs 2,500
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Full bench rotation with clinical supervision</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Automated 5-part hematology operations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Slide smear preparation & differential counts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Urine chemical & microscopic analysis</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenChat('I am interested in the Clinical Pathology Course (Rs 2,500/month)')}
              className="w-full py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm"
            >
              Inquire for Rs 2,500 Course
            </button>
          </div>

          {/* Tier 3: Rs 3,000 per month */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-500">Advanced Masterclass</span>
                <GraduationCap className="w-5 h-5 text-teal-600" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Advanced Diagnostic Tech & Biochemistry
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Fully automated clinical chemistry analyzers, immunoassay testing, ELISA techniques, and digital X-ray processing.
              </p>

              <div className="mb-6">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  Rs 3,000
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Advanced diagnostic laboratory internship</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Clinical chemistry calibration & QC controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Serology, ELISA, and hormonal assays</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Digital Radiography (X-Ray) accessioning</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenChat('I am interested in Advanced Diagnostic Tech (Rs 3,000/month)')}
              className="w-full py-2.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              Inquire for Rs 3,000 Course
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
