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
        (term.fullName[language] && term.fullName[language].toLowerCase().includes(q)) ||
        (term.plainEnglish[language] && term.plainEnglish[language].toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[var(--cr-surface)] border-l border-[var(--cr-border)] h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--cr-border)] flex items-center justify-between bg-[var(--cr-bg)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--cr-surface)] text-[var(--cr-primary)] rounded-lg border border-[var(--cr-border)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--cr-text-primary)] flex items-center gap-2">
                <span>
                  {language === 'hi'
                    ? 'भारतीय रेल शब्दावली कोष'
                    : (language === 'ta'
                    ? 'இந்திய ரயில்வே கலைச்சொல் அகராதி'
                    : 'Indian Railways Domain Glossary')}
                </span>
                <span className="cr-badge-blue text-xs">
                  {GLOSSARY_TERMS.length} Terms
                </span>
              </h2>
              <p className="text-xs text-[var(--cr-text-secondary)] mt-0.5">
                {language === 'hi'
                  ? 'तकनीकी रेलवे शब्दों की सरल हिंदी व्याख्या'
                  : (language === 'ta'
                  ? 'ரயில்வே அமைப்புகள் மற்றும் சுருக்கங்களின் எளிய விளக்கம்'
                  : 'Plain-English decoder for all railway systems & acronyms')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] bg-[var(--cr-surface)] hover:bg-[var(--cr-border)]/50 rounded-lg transition-colors cursor-pointer border border-[var(--cr-border)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filters */}
        <div className="p-4 border-b border-[var(--cr-border)] space-y-3 bg-[var(--cr-bg)]">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--cr-text-secondary)] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'खोजें (जैसे TMS, OHE, MSDAC, Tamper)...'
                  : (language === 'ta'
                  ? 'தேடுக (எ.கா. TMS, OHE, MSDAC, Tamper)...'
                  : 'Search acronym (e.g. TMS, OHE, MSDAC, Tamper)...')
              }
              className="w-full bg-[var(--cr-surface)] border border-[var(--cr-border)] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[var(--cr-text-primary)] placeholder-[var(--cr-text-secondary)] focus:outline-none focus:border-[var(--cr-primary-interactive)]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[var(--cr-primary-interactive)] text-white font-bold shadow-sm'
                    : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] bg-[var(--cr-surface)] border border-[var(--cr-border)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Terms List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[var(--cr-border)]">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-[var(--cr-text-secondary)] text-xs italic">
              {language === 'hi'
                ? 'कोई मेल नहीं मिला।'
                : (language === 'ta'
                ? 'பொருத்தமான ரயில்வே சொற்கள் எதுவும் கிடைக்கவில்லை.'
                : 'No matching railway terms found.')}
            </div>
          ) : (
            filteredTerms.map((term) => {
              const getCategoryBadge = () => {
                switch (term.category) {
                  case 'Track':
                    return <span className="cr-badge-blue text-xs"><Hammer className="w-3 h-3" /> Track / Civil</span>;
                  case 'Traction':
                    return <span className="cr-badge-green text-xs"><Zap className="w-3 h-3" /> 25 kV Electrical</span>;
                  case 'Signal':
                    return <span className="cr-badge-blue text-xs"><Radio className="w-3 h-3" /> S&T / Signal</span>;
                  case 'Rules':
                    return <span className="cr-badge-red text-xs"><ShieldCheck className="w-3 h-3" /> Safety Rules</span>;
                  default:
                    return <span className="cr-badge-neutral text-xs">Operations</span>;
                }
              };

              return (
                <div key={term.acronym} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--cr-primary-interactive)] text-xs bg-[var(--cr-bg)] px-2 py-0.5 rounded border border-[var(--cr-border)]">
                      {term.acronym}
                    </span>
                    {getCategoryBadge()}
                  </div>

                  <h3 className="text-xs font-semibold text-[var(--cr-text-primary)]">
                    {term.fullName[language] || term.fullName.en}
                  </h3>

                  <div className="bg-[var(--cr-bg)] p-2.5 rounded-xl border border-[var(--cr-border)] space-y-1.5">
                    <div>
                      <span className="text-xs uppercase font-bold text-[var(--cr-text-secondary)] block tracking-wider">
                        {language === 'hi'
                          ? 'सरल व्याख्या'
                          : (language === 'ta'
                          ? 'எளிய விளக்கம்'
                          : 'Plain-English Meaning')}
                      </span>
                      <p className="text-xs text-[var(--cr-text-primary)] leading-relaxed">
                        {term.plainEnglish[language] || term.plainEnglish.en}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-[var(--cr-border)]">
                      <span className="text-xs uppercase font-bold text-[var(--cr-status-green)] block tracking-wider">
                        {language === 'hi'
                          ? 'रेलसिंक में इसका महत्व'
                          : (language === 'ta'
                          ? 'ரயில்சிங்கில் இதன் முக்கியத்துவம்'
                          : 'Why It Matters In RAILSYNC')}
                      </span>
                      <p className="text-xs text-[var(--cr-text-secondary)] leading-relaxed">
                        {term.whyItMatters[language] || term.whyItMatters.en}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--cr-border)] bg-[var(--cr-bg)] text-xs text-[var(--cr-text-muted)] text-center flex items-center justify-between">
          <span>
            {language === 'hi'
              ? 'रेलवे मानक शब्दावली'
              : (language === 'ta'
              ? 'நிலையான ரயில்வே சுருக்கங்கள்'
              : 'Standard IR Acronym Reference')}
          </span>
          <button
            onClick={onClose}
            className="cr-btn-secondary py-1 text-xs"
          >
            {language === 'hi' ? 'बंद करें' : (language === 'ta' ? 'மூடுக' : 'Close Drawer')}
          </button>
        </div>
      </div>
    </div>
  );
};
