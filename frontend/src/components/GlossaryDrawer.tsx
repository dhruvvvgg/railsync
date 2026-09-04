import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, ShieldCheck, Zap, Radio, Hammer } from 'lucide-react';
import { GLOSSARY_TERMS, type Language } from '../i18n/translations';

interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({ isOpen, onClose, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Track', 'Traction', 'Signal', 'Operations', 'Rules'];

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        term.acronym.toLowerCase().includes(q) ||
        term.fullName[language].toLowerCase().includes(q) ||
        term.plainEnglish[language].toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in flex justify-end">
      <div className="w-full max-w-lg bg-[#0a1024] border-l border-slate-800 h-full shadow-2xl flex flex-col z-50">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1738]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'भारतीय रेल शब्दावली कोष' : 'Indian Railways Domain Glossary'}</span>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {GLOSSARY_TERMS.length} Terms
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'तकनीकी रेलवे शब्दों की सरल हिंदी व्याख्या'
                  : 'Plain-English decoder for all railway systems & acronyms'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filters */}
        <div className="p-4 border-b border-slate-800/60 space-y-3 bg-[#080d1e]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'खोजें (जैसे TMS, OHE, MSDAC, Tamper)...' : 'Search acronym (e.g. TMS, OHE, MSDAC, Tamper)...'}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Terms List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/50">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {language === 'hi' ? 'कोई मेल नहीं मिला।' : 'No matching railway terms found.'}
            </div>
          ) : (
            filteredTerms.map((term) => {
              const getCategoryBadge = () => {
                switch (term.category) {
                  case 'Track':
                    return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2 py-0.5 rounded flex items-center gap-1"><Hammer className="w-3 h-3" /> Track / Civil</span>;
                  case 'Traction':
                    return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded flex items-center gap-1"><Zap className="w-3 h-3" /> 25 kV Electrical</span>;
                  case 'Signal':
                    return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded flex items-center gap-1"><Radio className="w-3 h-3" /> S&T / Signal</span>;
                  case 'Rules':
                    return <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] px-2 py-0.5 rounded flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Safety Rules</span>;
                  default:
                    return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">Operations</span>;
                }
              };

              return (
                <div key={term.acronym} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {term.acronym}
                    </span>
                    {getCategoryBadge()}
                  </div>

                  <h3 className="text-xs font-semibold text-cyan-300">
                    {term.fullName[language]}
                  </h3>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {language === 'hi' ? 'सरल व्याख्या' : 'Plain-English Meaning'}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {term.plainEnglish[language]}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-slate-800/60">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                        {language === 'hi' ? 'रेलसिंक में इसका महत्व' : 'Why It Matters In RAILSYNC'}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {term.whyItMatters[language]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#080d1e] text-[11px] text-slate-400 text-center flex items-center justify-between">
          <span>{language === 'hi' ? 'रेलवे मानक शब्दावली' : 'Standard IR Acronym Reference'}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
          >
            {language === 'hi' ? 'बंद करें' : 'Close Drawer'}
          </button>
        </div>
      </div>
    </div>
  );
};
