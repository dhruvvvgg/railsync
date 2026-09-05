import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  Layers,
  Clock,
  TrendingUp,
  CheckCircle2,
  FileCheck,
  Zap,
  Radio,
  Hammer
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="space-y-8 w-full py-2">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="cr-panel p-6 sm:p-8 relative transition-colors"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            {/* Single authoritative indicator, no badge cluster */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--cr-primary-interactive)]"></span>
              <span className="text-xs font-bold text-[var(--cr-primary-interactive)] uppercase tracking-wider">
                North Central Railway • Corridor CNB–TDL–NDLS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--cr-text-primary)] tracking-tight leading-tight">
              {t.headline}
            </h1>

            <p className="text-[var(--cr-text-secondary)] text-sm sm:text-base leading-relaxed">
              {language === 'hi'
                ? 'पारंपरिक फोन-आधारित ब्लॉक बुकिंग को हटाकर गणितीय रूप से 3 विभागों के कार्यों को रात के खाली समय में बंडल करता है — ताकि वंदे भारत और राजधानी ट्रेनें 0 मिनट लेट हों।'
                : (language === 'ta'
                ? 'தொலைபேசி அழைப்பு முறைக்கு பதிலாக கணித நிரலாக்க உகப்பாக்கம் மூலம் சிவில், எலக்ட்ரிக்கல், சிக்னல் பணிகளை இரவு நேர சரக்கு ரயில் இடைவெளியில் ஒருங்கிணைக்கிறது — ரயில்களின் தாமதத்தை முற்றிலும் தவிர்க்கிறது.'
                : 'Replacing disjointed phone calls with mathematical constraint programming. Bundles Civil, Electrical, and Signal maintenance into natural overnight freight valleys, ensuring zero express train delays.')}
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={onLaunchDemo}
                className="cr-btn-primary"
              >
                <span>{t.runDemoButton}</span>
              </button>

              <button
                onClick={() => onOpenConsole('cockpit')}
                className="cr-btn-secondary font-semibold"
              >
                <span>{t.exploreConsoleButton}</span>
              </button>

              <button
                onClick={onOpenGlossary}
                className="cr-btn-secondary"
              >
                <span>{t.glossaryButton}</span>
              </button>
            </div>
          </div>

          {/* Key Metric Card (Clean, sans-serif, high contrast) */}
          <div className="cr-card p-5 md:w-72 flex-shrink-0 space-y-3.5">
            <div className="border-b border-[var(--cr-border-subtle)] pb-2.5">
              <span className="text-xs uppercase tracking-wider text-[var(--cr-text-secondary)] font-bold block">
                {language === 'hi' ? 'सॉल्वर गति' : (language === 'ta' ? 'சால்வர் வேகம்' : 'CP-SAT Latency')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-[var(--cr-primary-interactive)]">0.031s</span>
                <span className="text-xs font-semibold text-[var(--cr-status-green)]">Optimal</span>
              </div>
            </div>

            <div className="border-b border-[var(--cr-border-subtle)] pb-2.5">
              <span className="text-xs uppercase tracking-wider text-[var(--cr-text-secondary)] font-bold block">
                {language === 'hi' ? 'डेटा गेटवे स्क्रीनिंग' : (language === 'ta' ? 'தரவு வடிகட்டுதல்' : 'Dirty Data Screened')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-[var(--cr-text-primary)]">29 / 29</span>
                <span className="text-xs font-semibold text-[var(--cr-status-amber)]">Quarantined</span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-[var(--cr-text-secondary)] font-bold block">
                {language === 'hi' ? 'सुरक्षा नियम अनुपालन' : (language === 'ta' ? 'சட்டப்பூர்வ பாதுகாப்பு விதிகள்' : 'Safety Rules')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-[var(--cr-status-green)]">100%</span>
                <span className="text-xs font-semibold text-[var(--cr-status-green)]">G&SR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Live Before / After Metrics Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-[var(--cr-text-secondary)] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--cr-primary-interactive)]" />
            <span>{t.compareTitle}</span>
          </h2>
          <span className="text-xs text-[var(--cr-text-muted)]">
            {language === 'hi' ? 'पारंपरिक बनाम AI का सीधा असर' : (language === 'ta' ? 'பழைய முறை vs AI இன் நேரடி தாக்கம்' : 'Measurable Impact on Indian Railways Operations')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Express Delays */}
          <div className="cr-card p-4 relative overflow-hidden">
            <div className="text-xs text-[var(--cr-text-secondary)] font-bold mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t.kpiDetentions}</span>
              <Clock className="w-3.5 h-3.5 text-[var(--cr-primary-interactive)]" />
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-lg font-bold text-[var(--cr-text-muted)] line-through">4 Trains</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />
              <span className="text-2xl font-extrabold text-[var(--cr-status-green)]">0 min</span>
            </div>
            <p className="text-xs text-[var(--cr-status-green)] font-bold">
              ✓ {language === 'hi' ? 'शून्य एक्सप्रेस विलंब (100% समयबद्धता)' : (language === 'ta' ? 'பூஜ்ஜிய பயணிகள் ரயில் தாமதம் (100% சரியான நேரம்)' : 'Zero passenger detentions')}
            </p>
            <span className="text-xs text-[var(--cr-text-muted)] block mt-1">{t.kpiDetentionsSub}</span>
          </div>

          {/* Card 2: Track Downtime */}
          <div className="cr-card p-4 relative overflow-hidden">
            <div className="text-xs text-[var(--cr-text-secondary)] font-bold mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t.kpiDowntime}</span>
              <Layers className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-lg font-bold text-[var(--cr-text-muted)] line-through">6.5 hrs</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />
              <span className="text-2xl font-extrabold text-[var(--cr-status-green)]">3.25 hrs</span>
            </div>
            <p className="text-xs text-[var(--cr-status-green)] font-bold">
              ✓ {language === 'hi' ? '50% कम लाइन बंदी' : (language === 'ta' ? '50% குறைவான பாதை முடக்கம்' : '50% reduction in track closures')}
            </p>
            <span className="text-xs text-[var(--cr-text-muted)] block mt-1">{t.kpiDowntimeSub}</span>
          </div>

          {/* Card 3: Multi-Dept Bundling */}
          <div className="cr-card p-4 relative overflow-hidden">
            <div className="text-xs text-[var(--cr-text-secondary)] font-bold mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t.kpiBundling}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--cr-primary-interactive)]" />
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-lg font-bold text-[var(--cr-text-muted)] line-through">0%</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />
              <span className="text-2xl font-extrabold text-[var(--cr-text-primary)]">83.3%</span>
            </div>
            <p className="text-xs text-[var(--cr-status-green)] font-bold">
              ✓ {language === 'hi' ? '3-इन-1 संयुक्त कॉरिडोर ब्लॉक' : (language === 'ta' ? '3-இன்-1 ஒரே நேரத்தில் செயல்படுத்தல்' : 'Co-located simultaneous execution')}
            </p>
            <span className="text-xs text-[var(--cr-text-muted)] block mt-1">{t.kpiBundlingSub}</span>
          </div>

          {/* Card 4: Safety SLA */}
          <div className="cr-card p-4 relative overflow-hidden">
            <div className="text-xs text-[var(--cr-text-secondary)] font-bold mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t.kpiSafety}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-lg font-bold text-[var(--cr-text-muted)] line-through">Phone</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />
              <span className="text-2xl font-extrabold text-[var(--cr-status-green)]">100%</span>
            </div>
            <p className="text-xs text-[var(--cr-status-green)] font-bold">
              ✓ {language === 'hi' ? 'शून्य सुरक्षा उल्लंघन' : (language === 'ta' ? 'பூஜ்ஜிய பாதுகாப்பு மீறல்கள்' : 'Zero manual safety oversights')}
            </p>
            <span className="text-xs text-[var(--cr-text-muted)] block mt-1">{t.kpiSafetySub}</span>
          </div>
        </div>
      </div>

      {/* The 3-Act Story Cards */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-[var(--cr-text-primary)] flex items-center gap-2">
          <span>{language === 'hi' ? 'सिस्टम की 3-चरणीय कार्यप्रणाली' : (language === 'ta' ? 'கணினியின் 3-படி செயல்முறை' : 'The 3-Act System Architecture')}</span>
        </h2>

        {/* Act 1 Card: The Chaos */}
        <div className="cr-panel border-l-4 border-l-[var(--cr-status-red)] p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--cr-border-subtle)] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="cr-badge-red text-xs">
                  {t.act1Title}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--cr-text-primary)]">{t.act1Subtitle}</h3>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)] mt-1">{t.act1Desc}</p>
            </div>
            <span className="cr-badge-neutral text-xs">
              {t.act1Badge}
            </span>
          </div>

          {/* Chaos Illustration: Departmental Silos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="cr-card p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[var(--cr-primary-interactive)] font-bold text-xs mb-1.5">
                <Hammer className="w-4 h-4" />
                <span>Civil Track (TMS)</span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)]">
                {language === 'hi'
                  ? 'सुबह 09:00 से 12:00 तक ट्रैक टैम्पिंग का ब्लॉक मांगता है।'
                  : (language === 'ta'
                  ? 'காலை 09:00 முதல் 12:00 வரை தண்டவாளம் சீரமைக்க தனி பிளாக் கேட்கிறது.'
                  : 'Demands exclusive block 09:00–12:00 for CSM-09 track tamping.')}
              </p>
              <span className="text-xs text-[var(--cr-status-red)] font-semibold mt-2 block">
                ❌ {language === 'hi' ? 'अलग से 3 घंटे लाइन बंद' : (language === 'ta' ? 'தனியாக 3 மணிநேரம் பாதை மூடல்' : 'Independent 3h shutdown')}
              </span>
            </div>

            <div className="cr-card p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[var(--cr-status-green)] font-bold text-xs mb-1.5">
                <Zap className="w-4 h-4" />
                <span>Electrical TRD (TDMS)</span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)]">
                {language === 'hi'
                  ? 'दोपहर 13:00 से 15:30 तक 25 kV ओएचई निरीक्षण मांगता है।'
                  : (language === 'ta'
                  ? 'பிற்பகல் 13:00 முதல் 15:30 வரை 25 kV கம்பி ஆய்வுக்கு மின் நிறுத்தம் கேட்கிறது.'
                  : 'Requests 25 kV power shutdown 13:00–15:30 for cantilever work.')}
              </p>
              <span className="text-xs text-[var(--cr-status-red)] font-semibold mt-2 block">
                ❌ {language === 'hi' ? 'दोबारा 2.5 घंटे लाइन बंद' : (language === 'ta' ? 'மீண்டும் 2.5 மணிநேரம் பாதை மூடல்' : 'Repeated 2.5h shutdown')}
              </span>
            </div>

            <div className="cr-card p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[var(--cr-primary-interactive)] font-bold text-xs mb-1.5">
                <Radio className="w-4 h-4" />
                <span>Signal S&T (SMMS)</span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)]">
                {language === 'hi'
                  ? 'शाम 16:00 से 18:30 तक पॉइंट मोटर टेस्टिंग की मांग करता है।'
                  : (language === 'ta'
                  ? 'மாலை 16:00 முதல் 18:30 வரை சிக்னல் மோட்டார் சோதனைக்கு பிளாக் கோருகிறது.'
                  : 'Books 16:00–18:30 for 143mm point motor calibration.')}
              </p>
              <span className="text-xs text-[var(--cr-status-red)] font-semibold mt-2 block">
                ❌ {language === 'hi' ? 'तीसरी बार 2.5 घंटे लाइन बंद' : (language === 'ta' ? '3-வது முறையாக 2.5 மணிநேர மூடல்' : 'Third separate shutdown')}
              </span>
            </div>
          </div>

          {/* The Real Train 12582 Conflict Alert */}
          <div className="bg-[var(--cr-status-red-bg)] border border-[var(--cr-status-red-border)] p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--cr-status-red)] flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[var(--cr-status-red)] uppercase tracking-wide block">
                {language === 'hi' ? 'वास्तविक टकराव: ट्रेन 12582 बनाम सिविल ब्लॉक' : (language === 'ta' ? 'உண்மை மோதல்: ரயில் 12582 vs திட்டமிடப்படாத சிவில் பிளாக்' : 'Real Schedule Clash: Train 12582 vs Uncoordinated Block')}
              </span>
              <p className="text-[var(--cr-text-primary)] leading-relaxed">
                {language === 'hi'
                  ? 'सेक्शन COR-005 (शिकोहाबाद-टुंडला) पर सिविल विभाग का ब्लॉक ट्रेन 12582 (बीएसबीएस-नई दिल्ली एक्सप्रेस) के मार्ग से रात 01:50 बजे टकराता है। इसके कारण ट्रेन को 48 मिनट लाल सिग्नल पर रोका जाता है।'
                  : (language === 'ta'
                  ? 'காரிடார் COR-005 இல், சிவில் பிளாக் நேரடியாக ரயில் 12582 (BSBS-NDLS எக்ஸ்பிரஸ்) உடன் இரவு 01:50 மணிக்கு மோதி 48 நிமிட தாமதத்தை உருவாக்குகிறது.'
                  : 'On corridor COR-005 (Shikohabad–Tundla), an uncoordinated Civil block directly intersects Train 12582 (BSBS-NDLS Superfast Express) at 01:50, causing an immediate 48-minute passenger delay.')}
              </p>
            </div>
          </div>
        </div>

        {/* Act 2 Card: The Engine */}
        <div className="cr-panel border-l-4 border-l-[var(--cr-primary-interactive)] p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--cr-border-subtle)] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="cr-badge-blue text-xs">
                  {t.act2Title}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--cr-text-primary)]">{t.act2Subtitle}</h3>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)] mt-1">{t.act2Desc}</p>
            </div>
            <span className="cr-badge-neutral text-xs">
              {t.act2Badge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="cr-card p-4">
              <div className="flex items-center gap-2 text-[var(--cr-primary-interactive)] font-bold text-xs mb-1">
                <Layers className="w-4 h-4 text-[var(--cr-primary-interactive)]" />
                <span>14-Day Lookahead</span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)] leading-relaxed">
                {language === 'hi'
                  ? 'आगामी 14 दिनों के सिविल, ट्रैक्शन और सिग्नल कार्यों को एक साथ स्कैन करता है।'
                  : (language === 'ta'
                  ? 'அடுத்த 14 நாட்களுக்கான சிவில், எலக்ட்ரிக்கல், சிக்னல் பணிகளை ஒன்றாக ஸ்கேன் செய்கிறது.'
                  : 'Aggregates upcoming work across TMS, TDMS, and SMMS into unified decision sets.')}
              </p>
            </div>

            <div className="cr-card p-4">
              <div className="flex items-center gap-2 text-[var(--cr-status-amber)] font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-[var(--cr-status-amber)]" />
                <span>Data-Quality Gateway</span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)] leading-relaxed">
                {language === 'hi'
                  ? 'अमान्य किमी और उलटे समय वाले 29 खराब रिकॉर्ड्स को अलग करके सॉल्वर क्रैश रोकता है।'
                  : (language === 'ta'
                  ? 'தவறான கி.மீ மற்றும் நேரப் பிழையுள்ள 29 பதிவுகளை நீக்கி சால்வர் முடக்கத்தை தடுக்கிறது.'
                  : 'Screens 29 anomalous dirty records before optimization; zero division crashes.')}
              </p>
            </div>

            <div className="cr-card p-4">
              <div className="flex items-center gap-2 text-[var(--cr-status-green)] font-bold text-xs mb-1">
                <ShieldCheck className="w-4 h-4 text-[var(--cr-status-green)]" />
                <span>Deterministic Rules</span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)] leading-relaxed">
                {language === 'hi'
                  ? '25 kV बिजली कटौती और 1 किमी टैम्पिंग-स्विच दूरी जैसे नियम कभी नहीं तोड़े जा सकते।'
                  : (language === 'ta'
                  ? '25 kV மின் நிறுத்தம் மற்றும் 1 கி.மீ அதிர்வு இடைவெளி போன்ற பாதுகாப்பு விதிகளை உறுதி செய்கிறது.'
                  : 'Hardcoded G&SR safety constraints enforce OHE isolation and machine clearances.')}
              </p>
            </div>

            <div className="cr-card p-4">
              <div className="flex items-center gap-2 text-[var(--cr-primary-interactive)] font-bold text-xs mb-1">
                <Cpu className="w-4 h-4 text-[var(--cr-primary-interactive)]" />
                <span>Freight Valley Solving</span>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)] leading-relaxed">
                {language === 'hi'
                  ? 'ब्लॉक को रात 01:00–04:25 के खाली समय में शिफ्ट करके पैसेंजर ट्रेनों को सुरक्षित करता है।'
                  : (language === 'ta'
                  ? 'பராமரிப்பை இரவு 01:00–04:25 சரக்கு ரயில் இடைவெளிக்கு மாற்றி பயணிகள் ரயில்களை பாதுகாக்கிறது.'
                  : 'Pins possessions into 01:00–04:25 night lull valleys where freight can loop.')}
              </p>
            </div>
          </div>
        </div>

        {/* Act 3 Card: The Proof */}
        <div className="cr-panel border-l-4 border-l-[var(--cr-status-green)] p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--cr-border-subtle)] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="cr-badge-green text-xs">
                  {t.act3Title}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--cr-text-primary)]">{t.act3Subtitle}</h3>
              </div>
              <p className="text-xs text-[var(--cr-text-secondary)] mt-1">{t.act3Desc}</p>
            </div>
            <span className="cr-badge-neutral text-xs">
              {t.act3Badge}
            </span>
          </div>

          {/* Synchronized Corridor Strip */}
          <div className="cr-card p-4 space-y-3 mb-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--cr-text-primary)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--cr-status-green)]"></span>
                <span>Corridor Block B-101 (Kanpur–Etawah)</span>
              </span>
              <span className="cr-badge-green text-xs font-bold">
                01:00 – 04:25 Night Window (3.25 hrs)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="cr-card-subtle p-3 rounded-lg text-xs">
                <span className="text-[var(--cr-primary-interactive)] font-bold block">1. Civil Track Tamping</span>
                <span className="text-[var(--cr-text-secondary)] text-xs font-medium">CSM-09 Tamper (KM 44–83)</span>
              </div>
              <div className="cr-card-subtle p-3 rounded-lg text-xs">
                <span className="text-[var(--cr-status-green)] font-bold block">2. 25 kV OHE Isolation</span>
                <span className="text-[var(--cr-text-secondary)] text-xs font-medium">TRD Overhaul (KM 44–83)</span>
              </div>
              <div className="cr-card-subtle p-3 rounded-lg text-xs">
                <span className="text-[var(--cr-primary-interactive)] font-bold block">3. MSDAC & Points</span>
                <span className="text-[var(--cr-text-secondary)] text-xs font-medium">Signal Sensor Check</span>
              </div>
            </div>
          </div>

          {/* Official Controller Authorization Memo Box */}
          <div className="cr-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[var(--cr-status-green-bg)] text-[var(--cr-status-green)] border border-[var(--cr-status-green-border)] flex-shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[var(--cr-text-primary)] block">
                  {language === 'hi'
                    ? 'अनुभाग नियंत्रक डिजिटल लाइन क्लीयरेंस मेमो (सत्यापित)'
                    : (language === 'ta'
                    ? 'பிரிவு கட்டுப்பாட்டாளர் டிஜிட்டல் பாதை அனுமதி மெமோ (சரிபார்க்கப்பட்டது)'
                    : 'Section Controller Digital Line Clearance Memo (Verified)')}
                </span>
                <p className="text-xs text-[var(--cr-text-secondary)] mt-0.5">{t.authFooter}</p>
                <span className="text-xs text-[var(--cr-text-muted)] font-medium block mt-1">
                  {t.authorizedBy} • Timestamp: 2026-09-04 23:45 IST
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenConsole('audit')}
              className="cr-btn-secondary flex-shrink-0 font-semibold"
            >
              <span>{language === 'hi' ? 'ऑडिट लॉग देखें' : (language === 'ta' ? 'தணிக்கை பதிவு பார்க்க' : 'View Audit Trail')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deep-Dive Console Navigation Bar */}
      <div className="cr-panel p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--cr-text-primary)]">
            {language === 'hi' ? 'विशेषज्ञ इंजीनियरिंग कंसोल' : (language === 'ta' ? 'முழு பொறியியல் கன்சோல்' : 'Explore The Deep Engineering Console')}
          </h3>
          <p className="text-xs text-[var(--cr-text-secondary)] mt-0.5">
            {language === 'hi'
              ? 'जजों और तकनीकी विशेषज्ञों के लिए सभी 6 लाइव डेटा और सिमुलेशन टूल्स उपलब्ध हैं।'
              : (language === 'ta'
              ? 'நடுவர்களின் தொழில்நுட்ப கேள்விகளுக்கு பதிலளிக்க அனைத்து 6 கருவிகளும் நேரலையில் தயாராக உள்ளன.'
              : 'All 6 engineering tools are active for deep-dive technical questions from judges.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenConsole('cockpit')}
            className="cr-btn-secondary"
          >
            <span>Marey & Gantt</span>
          </button>
          <button
            onClick={() => onOpenConsole('gateway')}
            className="cr-btn-secondary"
          >
            <span>Data Gateway</span>
          </button>
          <button
            onClick={() => onOpenConsole('opportunities')}
            className="cr-btn-secondary"
          >
            <span>Look-Ahead</span>
          </button>
          <button
            onClick={() => onOpenConsole('emergency')}
            className="cr-btn-secondary"
          >
            <span>Disruption Sandbox</span>
          </button>
        </div>
      </div>
    </div>
  );
};
