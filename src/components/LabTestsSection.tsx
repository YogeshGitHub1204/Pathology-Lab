import React, { useState, useMemo } from 'react';
import { LAB_TESTS_DATA } from '../data/labTests.js';
import { LabTest } from '../types/index.js';
import { Search, Clock, Droplets, MessageSquare, AlertCircle } from 'lucide-react';

interface LabTestsSectionProps {
  onSelectTest: (testName: string) => void;
}

const CATEGORIES = [
  'All Tests',
  'Blood Tests',
  'Urine Tests',
  'X-Ray',
  'Related Diagnostics',
  'Certification Courses'
] as const;

export const LabTestsSection: React.FC<LabTestsSectionProps> = ({ onSelectTest }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tests');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTests = useMemo(() => {
    return LAB_TESTS_DATA.filter((test: LabTest) => {
      const matchesCategory =
        selectedCategory === 'All Tests' || test.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        test.name.toLowerCase().includes(q) ||
        test.description.toLowerCase().includes(q) ||
        test.code.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="lab-tests" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            Diagnostic Menu & Services
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Pathology Laboratory Tests & Digital X-Ray
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Automated diagnostic testing adhering to national quality protocols. Select any test or course to discuss with our assistant Jeevan.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Functional Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests (e.g. CBC, Urine, X-Ray)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
            />
          </div>
        </div>

        {/* Tests Grid */}
        {filteredTests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-600">No diagnostic tests found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Tests');
              }}
              className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata per Zero-Pill Discipline */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-medium text-teal-800">{test.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-400">{test.code}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {test.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {test.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{test.sampleType}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Turnaround: {test.turnaround}</span>
                    </div>

                    {test.fastingRequired && (
                      <div className="flex items-center gap-1.5 text-amber-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Overnight 8-10 hrs fasting needed</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectTest(test.name)}
                    className="w-full mt-2 py-2 px-3 text-xs font-semibold text-slate-800 hover:text-teal-900 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>Inquire with Jeevan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
