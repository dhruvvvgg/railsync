import React from 'react';
import {
  Train,
  Activity,
  AlertTriangle,
  Layers,
  GitCompare,
  FileCheck,
  Play,
  BookOpen,
  Compass
} from 'lucide-react';
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
  onOpenGlossary
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <header className="bg-[#0b132b] border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      {/* Top Banner */}
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('story')}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-md flex items-center justify-center hover:opacity-90 transition-all cursor-pointer"
            title="Go to Story Overview"
          >
            <Train className="w-6 h-6 text-white" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                onClick={() => setViewMode('story')}
                className="text-xl font-bold tracking-tight text-white font-mono cursor-pointer hover:text-cyan-300 transition-colors"
              >
                RAILSYNC-ABP
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 text-[11px] px-2 py-0.5 rounded-full border border-cyan-500/30 font-semibold font-mono">
                SIH26027
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono hidden sm:inline-block">
                CP-SAT 0.031s
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 hidden md:block">
              {language === 'hi'
                ? 'भारतीय रेल के लिए AI-संचालित स्वचालित ब्लॉक नियोजन • उत्तर मध्य रेलवे'
                : (language === 'ta'
                ? 'இந்திய ரயில்வேக்கான AI-இயங்கும் தானியங்கி பிளாக் திட்டமிடல் • வட மத்திய ரயில்வே'
                : 'AI-Powered Automatic Block Planning for Train Operations • North Central Railway')}
            </p>
          </div>
        </div>

        {/* Global Controls: Mode Toggle, Guided Demo CTA, Glossary, Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 90-Second Guided Demo CTA */}
          <button
            onClick={onLaunchDemo}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 sm:px-3.5 py-1.5 rounded-xl text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all transform hover:scale-[1.02]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">
              {language === 'hi' ? '90s निर्देशित डेमो' : (language === 'ta' ? '90s நேரலை டெமோ' : '90s Guided Demo')}
            </span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* View Mode Switcher: Story Flow vs Full Console */}
          <div className="bg-slate-900 border border-slate-700/80 p-0.5 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('story')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'story'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'कहानी' : (language === 'ta' ? 'கதை' : 'Story')}</span>
            </button>
            <button
              onClick={() => {
                setViewMode('console');
                if (activeTab === 'story') setActiveTab('cockpit');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'console'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'कंसोल' : (language === 'ta' ? 'கன்சோல்' : 'Console')}</span>
            </button>
          </div>

          {/* Glossary Drawer Trigger */}
          <button
            onClick={onOpenGlossary}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            title="Open Railway Jargon Glossary"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">
              {language === 'hi' ? 'शब्दावली' : (language === 'ta' ? 'கலைச்சொற்கள்' : 'Glossary')}
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1 rounded-full font-mono font-bold">14</span>
          </button>

          {/* Trilingual Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg font-mono font-semibold transition-all ${
                language === 'en'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg font-mono font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-1 rounded-lg font-mono font-semibold transition-all ${
                language === 'ta'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Sub-bar */}
      {viewMode === 'console' ? (
        <div className="px-4 sm:px-6 flex items-center gap-2 overflow-x-auto bg-[#080d1e] py-1.5 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'cockpit'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>{t.tabCockpit}</span>
          </button>

          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'gateway'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{t.tabGateway}</span>
            <span className="bg-amber-500/30 text-amber-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
              {anomaliesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'opportunities'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>{t.tabOpportunities}</span>
            <span className="bg-emerald-500/30 text-emerald-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
              {opportunitiesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitCompare className="w-4 h-4 text-purple-400" />
            <span>{t.tabComparison}</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'emergency'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4 text-red-400" />
            <span>{t.tabEmergency}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-slate-700/60 text-white border border-slate-600 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck className="w-4 h-4 text-slate-300" />
            <span>{t.tabAudit}</span>
          </button>
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-1.5 bg-[#080d1e] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              {language === 'hi'
                ? 'स्टोरी मोड सक्रिय: 5-7 मिनट के प्रेजेंटेशन और जजों के मूल्यांकन हेतु अनुकूलित'
                : (language === 'ta'
                ? 'கதை பயன்முறை: 5-7 நிமிட நடுவர் விளக்கக்காட்சிக்கு ஏற்றவாறு வடிவமைக்கப்பட்டுள்ளது'
                : 'Pitch Mode Active: Streamlined for 5–7 minute hackathon evaluation')}
            </span>
          </div>
          <button
            onClick={() => setViewMode('console')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{t.exploreConsoleButton}</span>
          </button>
        </div>
      )}
    </header>
  );
};
