import React from 'react';
import {
  Activity,
  AlertTriangle,
  Layers,
  GitCompare,
  FileCheck,
  Play,
  BookOpen,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Language } from '../i18n/translations';
import { TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  anomaliesCount: number;
  opportunitiesCount: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  viewMode: 'story' | 'console';
  setViewMode: (mode: 'story' | 'console') => void;
  onLaunchDemo: () => void;
  onOpenGlossary: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  anomaliesCount,
  opportunitiesCount,
  language,
  setLanguage,
  viewMode,
  setViewMode,
  onLaunchDemo,
  onOpenGlossary,
  theme,
  onToggleTheme
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <header className="w-full max-w-full bg-[var(--cr-surface)] border-b border-[var(--cr-border)] text-[var(--cr-text-primary)] sticky top-0 z-40 transition-colors shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Operational Subtitle (Clean, zero badge clutter, no train icon) */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setViewMode('story')}
            className="cursor-pointer group flex items-center gap-2.5"
          >
            {/* Live operational indicator dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cr-status-green)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--cr-status-green)]"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--cr-text-primary)] group-hover:text-[var(--cr-primary-interactive)] transition-colors">
                  RAILSYNC
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--cr-surface-subtle)] text-[var(--cr-text-secondary)] border border-[var(--cr-border)]">
                  Live Dispatch • CNB Division
                </span>
              </div>
              <p className="text-[11px] text-[var(--cr-text-secondary)] mt-0.5 hidden lg:block leading-none">
                {language === 'hi'
                  ? 'भारतीय रेल स्वचालित ब्लॉक नियोजन • उत्तर मध्य रेलवे'
                  : (language === 'ta'
                  ? 'இந்திய ரயில்வே தானியங்கி பிளாக் திட்டமிடல் • வட மத்திய ரயில்வே'
                  : 'Automatic Block Planning & Maintenance Synchronizer • North Central Railway')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Demo CTA, Story/Console Toggle, Glossary, Theme Toggle, Language */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* 90-Second Guided Demo CTA */}
          <button
            onClick={onLaunchDemo}
            className="cr-btn-primary text-xs"
            title="Launch 90-Second Guided Demo"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">
              {language === 'hi' ? '90s निर्देशित डेमो' : (language === 'ta' ? '90s நேரலை டெமோ' : '90s Guided Demo')}
            </span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* View Mode Switcher: Story Flow vs Full Console (Uiverse tactile segmented control) */}
          <div className="cr-segmented-container text-xs">
            <button
              onClick={() => setViewMode('story')}
              className={`relative px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'story'
                  ? 'text-[var(--cr-primary-interactive)]'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
              }`}
            >
              {viewMode === 'story' && (
                <motion.div
                  layoutId="header-viewmode"
                  className="absolute inset-0 bg-[var(--cr-surface)] rounded-md border border-[var(--cr-border-active)] shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Compass className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{language === 'hi' ? 'कहानी' : (language === 'ta' ? 'கதை' : 'Story')}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('console');
                if (activeTab === 'story') setActiveTab('cockpit');
              }}
              className={`relative px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'console'
                  ? 'text-[var(--cr-primary-interactive)]'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
              }`}
            >
              {viewMode === 'console' && (
                <motion.div
                  layoutId="header-viewmode"
                  className="absolute inset-0 bg-[var(--cr-surface)] rounded-md border border-[var(--cr-border-active)] shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Layers className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{language === 'hi' ? 'कंसोल' : (language === 'ta' ? 'கன்சோல்' : 'Console')}</span>
            </button>
          </div>

          {/* Glossary Drawer Trigger */}
          <button
            onClick={onOpenGlossary}
            className="cr-btn-secondary text-xs"
            title="Open Railway Jargon Glossary"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--cr-status-amber)]" />
            <span className="hidden md:inline">
              {language === 'hi' ? 'शब्दावली' : (language === 'ta' ? 'கலைச்சொற்கள்' : 'Glossary')}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--cr-status-amber-bg)] text-[var(--cr-status-amber)]">
              14
            </span>
          </button>

          {/* Theme Toggle (Sun / Moon) */}
          <button
            onClick={onToggleTheme}
            className="cr-btn-secondary p-1.5 rounded-lg text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--cr-primary-interactive)] transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Trilingual Language Switcher */}
          <div className="cr-segmented-container text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[var(--cr-primary-interactive)] text-white shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                language === 'hi'
                  ? 'bg-[var(--cr-primary-interactive)] text-white shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                language === 'ta'
                  ? 'bg-[var(--cr-primary-interactive)] text-white shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)]'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Sub-bar (Full Console mode) */}
      {viewMode === 'console' ? (
        <div className="border-t border-[var(--cr-border-subtle)] bg-[var(--cr-surface-subtle)]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('cockpit')}
              className={`relative px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'cockpit'
                  ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border)] font-bold shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] border border-transparent'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cr-primary-interactive)]"></span>
              <span>{t.tabCockpit}</span>
            </button>

            <button
              onClick={() => setActiveTab('gateway')}
              className={`relative px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'gateway'
                  ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border)] font-bold shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] border border-transparent'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--cr-status-amber)]" />
              <span>{t.tabGateway}</span>
              <span className="cr-badge-amber text-[10px] py-0 px-1.5">
                {anomaliesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('opportunities')}
              className={`relative px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'opportunities'
                  ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border)] font-bold shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />
              <span>{t.tabOpportunities}</span>
              <span className="cr-badge-green text-[10px] py-0 px-1.5">
                {opportunitiesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`relative px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border)] font-bold shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] border border-transparent'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-[var(--cr-status-blue)]" />
              <span>{t.tabComparison}</span>
            </button>

            <button
              onClick={() => setActiveTab('emergency')}
              className={`relative px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'emergency'
                  ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border)] font-bold shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] border border-transparent'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[var(--cr-status-red)]" />
              <span>{t.tabEmergency}</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`relative px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[var(--cr-surface)] text-[var(--cr-text-primary)] border border-[var(--cr-border)] font-bold shadow-xs'
                  : 'text-[var(--cr-text-secondary)] hover:text-[var(--cr-text-primary)] border border-transparent'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-[var(--cr-text-secondary)]" />
              <span>{t.tabAudit}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-[var(--cr-border-subtle)] bg-[var(--cr-surface-subtle)]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs text-[var(--cr-text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cr-primary-interactive)]"></span>
              <span className="font-semibold text-[var(--cr-text-primary)]">
                {language === 'hi'
                  ? 'स्टोरी मोड सक्रिय: 5-7 मिनट के प्रेजेंटेशन और जजों के मूल्यांकन हेतु अनुकूलित'
                  : (language === 'ta'
                  ? 'கதை பயன்முறை: 5-7 நிமிட நடுவர் விளக்கக்காட்சிக்கு ஏற்றவாறு வடிவமைக்கப்பட்டுள்ளது'
                  : 'Pitch Mode Active: Streamlined for 5–7 minute evaluation')}
              </span>
            </div>
            <button
              onClick={() => setViewMode('console')}
              className="text-[var(--cr-primary-interactive)] hover:underline font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{t.exploreConsoleButton}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
