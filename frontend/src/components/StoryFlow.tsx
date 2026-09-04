import React from 'react';
import {
  Play,
  ArrowRight,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  Layers,
  Clock,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Train,
  Sparkles,
  FileCheck,
  Zap,
  Radio,
  Hammer
} from 'lucide-react';
import type { Language } from '../i18n/translations';
import { TRANSLATIONS } from '../i18n/translations';

interface StoryFlowProps {
  language: Language;
  onLaunchDemo: () => void;
  onOpenConsole: (targetTab?: string) => void;
  onOpenGlossary: () => void;
}

export const StoryFlow: React.FC<StoryFlowProps> = ({
  language,
  onLaunchDemo,
  onOpenConsole,
  onOpenGlossary
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b132b] via-[#070b19] to-[#080d1e] border border-cyan-500/20 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/40 font-mono font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                SIH 2026 • Problem Statement SIH26027
              </span>
              <span className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full border border-red-500/40 font-semibold">
                Ministry of Railways
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/40 font-mono font-medium">
                North Central Railway (CNB–TDL–NDLS)
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.headline}
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {language === 'hi'
                ? 'पारंपरिक फोन-आधारित ब्लॉक बुकिंग को हटाकर 0.031 सेकंड में गणितीय रूप से 3 विभागों के कार्यों को रात के खाली समय में बंडल करता है — ताकि वंदे भारत और राजधानी ट्रेनें 0 मिनट लेट हों।'
                : 'Replacing disjointed phone calls with mathematical constraint programming. Bundles Civil, Electrical, and Signal maintenance into natural overnight freight valleys, ensuring zero express train delays.'}
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onLaunchDemo}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.runDemoButton}</span>
              </button>

              <button
                onClick={() => onOpenConsole('cockpit')}
                className="bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
              >
                <span>{t.exploreConsoleButton}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={onOpenGlossary}
                className="bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{t.glossaryButton}</span>
              </button>
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl md:w-72 flex-shrink-0 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium block">
                {language === 'hi' ? 'सॉल्वर गति' : 'CP-SAT Solver Latency'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-cyan-300">0.031s</span>
                <span className="text-xs text-emerald-400 font-semibold">⚡ Instant</span>
              </div>
            </div>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium block">
                {language === 'hi' ? 'डेटा गेटवे स्क्रीनिंग' : 'Dirty Data Filter'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-amber-300">29 / 29</span>
                <span className="text-xs text-amber-400 font-semibold">Quarantined</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">
                {language === 'hi' ? 'सुरक्षा नियम अनुपालन' : 'Statutory Safety Rules'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-emerald-300">100%</span>
                <span className="text-xs text-emerald-400 font-semibold">G&SR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Before / After Metrics Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>{t.compareTitle}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {language === 'hi' ? 'पारंपरिक बनाम AI का सीधा असर' : 'Measurable Impact on Indian Railways Operations'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Express Delays */}
          <div className="bg-[#0b132b] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
            <div className="text-xs text-slate-400 font-medium mb-2 flex items-center justify-between">
              <span>{t.kpiDetentions}</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black font-mono text-slate-400 line-through">4 Trains</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl font-black font-mono text-cyan-300">0 min</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium">
              ✓ {language === 'hi' ? 'शून्य एक्सप्रेस विलंब (100% समयबद्धता)' : 'Zero passenger detentions'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">{t.kpiDetentionsSub}</span>
          </div>

          {/* Card 2: Track Downtime */}
          <div className="bg-[#0b132b] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
            <div className="text-xs text-slate-400 font-medium mb-2 flex items-center justify-between">
              <span>{t.kpiDowntime}</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black font-mono text-slate-400 line-through">6.5 hrs</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl font-black font-mono text-emerald-300">3.25 hrs</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium">
              ✓ {language === 'hi' ? '50% कम लाइन बंदी' : '50% reduction in track closures'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">{t.kpiDowntimeSub}</span>
          </div>

          {/* Card 3: Multi-Dept Bundling */}
          <div className="bg-[#0b132b] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
            <div className="text-xs text-slate-400 font-medium mb-2 flex items-center justify-between">
              <span>{t.kpiBundling}</span>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black font-mono text-slate-400 line-through">0%</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl font-black font-mono text-purple-300">83.3%</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium">
              ✓ {language === 'hi' ? '3-इन-1 संयुक्त कॉरिडोर ब्लॉक' : 'Co-located simultaneous execution'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">{t.kpiBundlingSub}</span>
          </div>

          {/* Card 4: Safety SLA */}
          <div className="bg-[#0b132b] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
            <div className="text-xs text-slate-400 font-medium mb-2 flex items-center justify-between">
              <span>{t.kpiSafety}</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black font-mono text-slate-400 line-through">Phone</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl font-black font-mono text-blue-300">100%</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium">
              ✓ {language === 'hi' ? 'शून्य सुरक्षा उल्लंघन' : 'Zero manual safety oversights'}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">{t.kpiSafetySub}</span>
          </div>
        </div>
      </div>

      {/* The 3-Act Story Cards */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>{language === 'hi' ? 'सिस्टम की 3-चरणीय कार्यप्रणाली' : 'The 3-Act System Architecture'}</span>
          <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
            End-to-End
          </span>
        </h2>

        {/* Act 1 Card: The Chaos */}
        <div className="bg-[#0b132b] border border-red-500/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                  {t.act1Title}
                </span>
                <h3 className="text-xl font-bold text-white">{t.act1Subtitle}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">{t.act1Desc}</p>
            </div>
            <span className="bg-red-500/10 text-red-300 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-red-500/30 flex-shrink-0">
              {t.act1Badge}
            </span>
          </div>

          {/* Chaos Illustration: Departmental Silos calling controller */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-1.5">
                <Hammer className="w-4 h-4" />
                <span>Civil Track (TMS)</span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'hi'
                  ? 'सुबह 09:00 से 12:00 तक ट्रैक टैम्पिंग का ब्लॉक मांगता है।'
                  : 'Demands exclusive block 09:00–12:00 for CSM-09 track tamping.'}
              </p>
              <span className="text-[10px] text-red-400 font-mono mt-2 block">
                ❌ {language === 'hi' ? 'अलग से 3 घंटे लाइन बंद' : 'Independent 3h shutdown'}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                <Zap className="w-4 h-4" />
                <span>Electrical TRD (TDMS)</span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'hi'
                  ? 'दोपहर 13:00 से 15:30 तक 25 kV ओएचई निरीक्षण मांगता है।'
                  : 'Requests 25 kV power shutdown 13:00–15:30 for cantilever work.'}
              </p>
              <span className="text-[10px] text-red-400 font-mono mt-2 block">
                ❌ {language === 'hi' ? 'दोबारा 2.5 घंटे लाइन बंद' : 'Repeated 2.5h shutdown'}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-1.5">
                <Radio className="w-4 h-4" />
                <span>Signal S&T (SMMS)</span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'hi'
                  ? 'शाम 16:00 से 18:30 तक पॉइंट मोटर टेस्टिंग की मांग करता है।'
                  : 'Books 16:00–18:30 for 143mm point motor calibration.'}
              </p>
              <span className="text-[10px] text-red-400 font-mono mt-2 block">
                ❌ {language === 'hi' ? 'तीसरी बार 2.5 घंटे लाइन बंद' : 'Third separate shutdown'}
              </span>
            </div>
          </div>

          {/* The Real Train 12582 Conflict Alert */}
          <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-red-300 uppercase tracking-wide block">
                {language === 'hi' ? 'वास्तविक टकराव: ट्रेन 12582 बनाम सिविल ब्लॉक' : 'Real Schedule Clash: Train 12582 vs Uncoordinated Block'}
              </span>
              <p className="text-slate-300">
                {language === 'hi'
                  ? 'सेक्शन COR-005 (शिकोहाबाद-टुंडला) पर सिविल विभाग का ब्लॉक ट्रेन 12582 (बीएसबीएस-नई दिल्ली एक्सप्रेस) के मार्ग से रात 01:50 बजे टकराता है। इसके कारण ट्रेन को 48 मिनट लाल सिग्नल पर रोका जाता है।'
                  : 'On corridor COR-005 (Shikohabad–Tundla), an uncoordinated Civil block directly intersects Train 12582 (BSBS-NDLS Superfast Express) at 01:50, causing an immediate 48-minute passenger delay.'}
              </p>
            </div>
          </div>
        </div>

        {/* Act 2 Card: The Engine */}
        <div className="bg-[#0b132b] border border-blue-500/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                  {t.act2Title}
                </span>
                <h3 className="text-xl font-bold text-white">{t.act2Subtitle}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">{t.act2Desc}</p>
            </div>
            <span className="bg-blue-500/10 text-blue-300 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-blue-500/30 flex-shrink-0">
              {t.act2Badge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs mb-1">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>14-Day Lookahead</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'आगामी 14 दिनों के सिविल, ट्रैक्शन और सिग्नल कार्यों को एक साथ स्कैन करता है।'
                  : 'Aggregates upcoming work across TMS, TDMS, and SMMS into unified decision sets.'}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Data-Quality Gateway</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'अमान्य किमी और उलटे समय वाले 29 खराब रिकॉर्ड्स को अलग करके सॉल्वर क्रैश रोकता है।'
                  : 'Screens 29 anomalous dirty records before optimization; zero division crashes.'}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Rules</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? '25 kV बिजली कटौती और 1 किमी टैम्पिंग-स्विच दूरी जैसे नियम कभी नहीं तोड़े जा सकते।'
                  : 'Hardcoded G&SR safety constraints enforce OHE isolation and machine clearances.'}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs mb-1">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Freight Valley Solving</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'ब्लॉक को रात 01:00–04:25 के खाली समय में शिफ्ट करके पैसेंजर ट्रेनों को सुरक्षित करता है।'
                  : 'Pins possessions into 01:00–04:25 night lull valleys where freight can loop.'}
              </p>
            </div>
          </div>
        </div>

        {/* Act 3 Card: The Proof */}
        <div className="bg-[#0b132b] border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                  {t.act3Title}
                </span>
                <h3 className="text-xl font-bold text-white">{t.act3Subtitle}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">{t.act3Desc}</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-300 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/30 flex-shrink-0">
              {t.act3Badge}
            </span>
          </div>

          {/* Synchronized Corridor Strip */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3 mb-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Corridor Block B-101 (Kanpur–Etawah)</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                01:00 – 04:25 Night Window (3.25 hrs)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-cyan-950/30 border border-cyan-500/30 p-3 rounded-lg text-xs">
                <span className="text-cyan-300 font-bold block">1. Civil Track Tamping</span>
                <span className="text-slate-400 text-[11px]">CSM-09 Tamper (KM 44–83)</span>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg text-xs">
                <span className="text-emerald-300 font-bold block">2. 25 kV OHE Isolation</span>
                <span className="text-slate-400 text-[11px]">TRD Overhaul (KM 44–83)</span>
              </div>
              <div className="bg-purple-950/30 border border-purple-500/30 p-3 rounded-lg text-xs">
                <span className="text-purple-300 font-bold block">3. MSDAC & Points</span>
                <span className="text-slate-400 text-[11px]">Signal Sensor Check</span>
              </div>
            </div>
          </div>

          {/* Official Controller Authorization Memo Box */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {language === 'hi'
                    ? 'अनुभाग नियंत्रक डिजिटल लाइन क्लीयरेंस मेमो (सत्यापित)'
                    : 'Section Controller Digital Line Clearance Memo (Verified)'}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.authFooter}</p>
                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                  {t.authorizedBy} • Timestamp: 2026-09-04 23:45 IST
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenConsole('audit')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <span>{language === 'hi' ? 'ऑडिट लॉग देखें' : 'View Audit Trail'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Deep-Dive Console Navigation Bar */}
      <div className="bg-[#0b132b] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-white">
            {language === 'hi' ? 'विशेषज्ञ इंजीनियरिंग कंसोल' : 'Explore The Deep Engineering Console'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'जजों और तकनीकी विशेषज्ञों के लिए सभी 6 लाइव डेटा और सिमुलेशन टूल्स उपलब्ध हैं।'
              : 'All 6 engineering tools are active for deep-dive technical questions from judges.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenConsole('cockpit')}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Train className="w-3.5 h-3.5" />
            <span>Marey & Gantt</span>
          </button>
          <button
            onClick={() => onOpenConsole('gateway')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Data Gateway</span>
          </button>
          <button
            onClick={() => onOpenConsole('opportunities')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Look-Ahead</span>
          </button>
          <button
            onClick={() => onOpenConsole('emergency')}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Disruption Sandbox</span>
          </button>
        </div>
      </div>
    </div>
  );
};
