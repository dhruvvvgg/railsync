import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Sparkles, FileText } from 'lucide-react';
import type { Language } from '../i18n/translations';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreConsole: () => void;
  language: Language;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onExploreConsole,
  language
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const steps = [
    {
      id: 'step-1',
      number: '01',
      title: {
        en: 'The Problem: Uncoordinated Block Collision',
        hi: 'समस्या: बिना तालमेल के ट्रेन और ब्लॉक का टकराव',
        ta: 'சிக்கல்: ஒருங்கிணைப்பற்ற பராமரிப்பு பிளாக்கினால் ரயில் மோதல்'
      },
      duration: 15,
      badge: {
        en: '❌ 4 Conflicts · 2 Delayed Passenger Trains',
        hi: '❌ 4 टकराव · 2 एक्सप्रेस ट्रेनें लेट',
        ta: '❌ 4 மோதல்கள் · 2 பயணிகள் ரயில்கள் தாமதம்'
      },
      summary: {
        en: 'In current manual operations, Civil, Electrical, and Signal departments book maintenance blocks on separate phone calls. On corridor COR-005, an uncoordinated Civil block directly collides with Train 12582 (BSBS-NDLS Express), forcing a 48-minute passenger detention.',
        hi: 'मौजूदा व्यवस्था में तीनों विभाग फोन पर अलग-अलग ब्लॉक मांगते हैं। कानपुर-टुंडला सेक्शन (COR-005) पर सिविल इंजीनियरिंग का ब्लॉक सीधे ट्रेन 12582 (बीएसबीएस-नई दिल्ली एक्सप्रेस) के रास्ते में आ जाता है, जिससे ट्रेन 48 मिनट लेट हो जाती है।',
        ta: 'தற்போதைய பழைய முறையில் சிவில், எலக்ட்ரிக்கல், சிக்னல் துறைகள் தொலைபேசி மூலம் தனித்தனியாக பிளாக் கேட்கின்றன. காரிடார் COR-005 இல், சிவில் பிளாக் நேரடியாக ரயில் 12582 (BSBS-NDLS எக்ஸ்பிரஸ்) பாதையில் குறுக்கிட்டு 48 நிமிட தாமதத்தை உருவாக்குகிறது.'
      },
      visual: (
        <div className="bg-[var(--cr-status-red)]/10 border border-[var(--cr-status-red)]/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--cr-status-red)] font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[var(--cr-status-red)]" />
              CRITICAL TIMETABLE COLLISION DETECTED
            </span>
            <span className="bg-[var(--cr-status-red)]/20 text-[var(--cr-status-red)] px-2 py-0.5 rounded text-xs font-semibold tabular-nums">COR-005 Km 195–231</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs bg-[var(--cr-surface)] p-3 rounded-xl border border-[var(--cr-border)]">
            <div>
              <span className="text-[var(--cr-text-muted)] block text-[10px] uppercase">Passenger Movement:</span>
              <strong className="text-[var(--cr-text-primary)] text-sm">Train 12582 BSBS-NDLS Express</strong>
              <span className="text-[var(--cr-status-amber)] block text-[11px] mt-0.5 tabular-nums">Scheduled at COR-005: 01:20 – 02:30</span>
            </div>
            <div className="border-l border-[var(--cr-border)] pl-3">
              <span className="text-[var(--cr-text-muted)] block text-[10px] uppercase">Manual Block Window:</span>
              <strong className="text-[var(--cr-status-red)] text-sm">Civil Track Tamping (Separate)</strong>
              <span className="text-[var(--cr-status-red)] block text-[11px] mt-0.5 tabular-nums">Booked Window: 01:00 – 04:00 (Direct Overlap!)</span>
            </div>
          </div>
          <p className="text-[11px] text-[var(--cr-status-red)] font-medium">
            ⚠ Result under manual FCFS: Passenger express train stopped at home signal; cascading delays across 3 divisions.
          </p>
        </div>
      )
    },
    {
      id: 'step-2',
      number: '02',
      title: {
        en: 'The Inefficiency: Departmental Silos & Fragmented Closures',
        hi: 'विभागीय दूरियां: एक ही पटरी को हफ्ते में 3 बार बंद करना'
      },
      duration: 12,
      badge: {
        en: '📉 6.5 Hours Lost Track Capacity · 3 Possessions',
        hi: '📉 6.5 घंटे ट्रैक क्षमता नष्ट · 3 अलग-अलग बंद'
      },
      summary: {
        en: 'Engineering requests a block on Monday. Traction TRD requests 25 kV wire inspection on Wednesday. S&T requests point motor testing on Friday. The same 40 km track is closed 3 separate times because systems (TMS, TDMS, SMMS) don\'t talk to each other.',
        hi: 'सिविल विभाग सोमवार को ट्रैक बंद करता है। बिजली विभाग बुधवार को ओवरहेड तार की जांच करता है। सिग्नल विभाग शुक्रवार को पॉइंट मोटर ठीक करता है। एक ही 40 किमी रेल लाइन को हफ्ते में 3 बार बंद किया जाता है क्योंकि तीनों सॉफ्टवेयर (TMS, TDMS, SMMS) आपस में जुड़े नहीं हैं।'
      },
      visual: (
        <div className="bg-[var(--cr-surface)] border border-[var(--cr-border)] rounded-2xl p-4 space-y-3">
          <div className="text-xs font-semibold text-[var(--cr-text-primary)]">Uncoordinated 14-Day Maintenance Pipeline:</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs bg-[var(--cr-bg)] border border-[var(--cr-border)] p-2 rounded-lg">
              <span className="text-[var(--cr-primary)] font-medium">Day 1: Civil Track Tamping (TMS)</span>
              <span className="text-[var(--cr-text-muted)] tabular-nums">2.5h Possession · Daytime</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-[var(--cr-bg)] border border-[var(--cr-border)] p-2 rounded-lg">
              <span className="text-[var(--cr-status-green)] font-medium">Day 3: 25 kV OHE Inspection (TDMS)</span>
              <span className="text-[var(--cr-text-muted)] tabular-nums">2.0h Possession · Daytime</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-[var(--cr-bg)] border border-[var(--cr-border)] p-2 rounded-lg">
              <span className="text-[var(--cr-primary)] font-medium">Day 5: Point Machine 143mm (SMMS)</span>
              <span className="text-[var(--cr-text-muted)] tabular-nums">2.0h Possession · Evening</span>
            </div>
          </div>
          <div className="text-[11px] text-[var(--cr-status-amber)] font-medium bg-[var(--cr-status-amber)]/10 border border-[var(--cr-status-amber)]/30 p-2 rounded-lg">
            Total disruption: 6.5 hours of track closure when all 3 jobs could be done in 1 shared 3.25-hour window.
          </div>
        </div>
      )
    },
    {
      id: 'step-3',
      number: '03',
      title: {
        en: 'The Solve: Google OR-Tools CP-SAT In Action',
        hi: 'समाधान: मात्र 0.031 सेकंड में CP-SAT गणितीय ऑप्टिमाइजेशन'
      },
      duration: 20,
      badge: {
        en: '⚡ Solved in 0.031s · 0 Express Delays',
        hi: '⚡ 0.031 सेकंड में समाधान · शून्य विलंब'
      },
      summary: {
        en: 'RAILSYNC\'s CP-SAT engine formulates 2880-minute decision intervals, screens 29 dirty records, and solves multi-department bundling. It shifts maintenance into natural overnight freight lull valleys (01:00–04:25), clearing Train 12582 with zero delay.',
        hi: 'रेलसिंक का CP-SAT सॉल्वर 14 दिनों के सभी कार्यों को स्कैन करता है, 29 खराब डेटा रिकॉर्ड्स को अलग करता है, और ट्रेन 12582 के समय को सुरक्षित रखते हुए ब्लॉक को रात 01:00–04:25 के खाली समय में शिफ्ट कर देता है।'
      },
      visual: (
        <div className="bg-[var(--cr-status-green)]/10 border border-[var(--cr-status-green)]/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--cr-status-green)] font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[var(--cr-status-green)]" />
              CP-SAT LEXICOGRAPHIC MULTI-OBJECTIVE RESULT
            </span>
            <span className="bg-[var(--cr-status-green)]/20 text-[var(--cr-status-green)] px-2 py-0.5 rounded font-bold text-[10px]">OPTIMAL FOUND (31ms)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center bg-[var(--cr-surface)] p-3 rounded-xl border border-[var(--cr-border)]">
            <div>
              <span className="text-[var(--cr-text-muted)] block text-[10px]">Conflicts</span>
              <span className="text-xl font-bold tabular-nums text-[var(--cr-status-green)]">0</span>
              <span className="text-[10px] text-[var(--cr-text-muted)] block">was 4</span>
            </div>
            <div className="border-x border-[var(--cr-border)]">
              <span className="text-[var(--cr-text-muted)] block text-[10px]">Vande Bharat / Rajdhani</span>
              <span className="text-xl font-bold tabular-nums text-[var(--cr-primary)]">0 min</span>
              <span className="text-[10px] text-[var(--cr-text-muted)] block">100% Punctual</span>
            </div>
            <div>
              <span className="text-[var(--cr-text-muted)] block text-[10px]">Total Downtime</span>
              <span className="text-xl font-bold tabular-nums text-[var(--cr-status-green)]">3.25h</span>
              <span className="text-[10px] text-[var(--cr-status-green)] block font-medium">-50% line downtime</span>
            </div>
          </div>
          <p className="text-[11px] text-[var(--cr-status-green)] font-medium">
            ✓ 3-in-1 Coordinated Possession: Civil track tamping, 25 kV wire inspection, and signal testing execute in 1 shared block.
          </p>
        </div>
      )
    },
    {
      id: 'step-4',
      number: '04',
      title: {
        en: 'The Deterministic Safety Engine (Never Delegated to ML)',
        hi: 'कठोर सुरक्षा नियम: AI कभी सुरक्षा नियमों को नहीं तोड़ सकता',
        ta: 'கட்டாய பாதுகாப்பு விதிகள் (G&SR சட்ட விதிமுறைகள்)'
      },
      duration: 15,
      badge: {
        en: '🛡 100% Indian Railways G&SR Compliance',
        hi: '🛡 100% रेलवे सुरक्षा नियम (G&SR) प्रमाणित',
        ta: '🛡 100% இந்திய ரயில்வே G&SR பாதுகாப்பு நெறிமுறைகள்'
      },
      summary: {
        en: 'Safety on Indian Railways cannot hallucinate. Our deterministic validator enforces: (1) 25 kV AC OHE power cutoff with earthing discharge rods, (2) 15.0 km maximum worksite single protection zone, and (3) Ballast vibration buffers between heavy tampers and delicate signal switches.',
        hi: 'रेल सुरक्षा में कोई अनुमान या गलती स्वीकार्य नहीं है। हमारा सुरक्षा इंजन सख्ती से लागू करता है: (1) काम से पहले 25 kV बिजली बंद और अर्थिंग रॉड, (2) अधिकतम 15 किमी का सुरक्षा दायरा, और (3) भारी मशीनों के कंपन से सिग्नल मोटरों की सुरक्षा।',
        ta: 'ரயில்வே பாதுகாப்பில் எந்த தவறும் நிகழக்கூடாது. எங்கள் விதிமுறை அமைப்பு: (1) மனிதர்கள் நுழையும் முன் 25 kV OHE மின்சார துண்டிப்பு, (2) அதிகபட்சம் 15 கி.மீ பாதுகாப்பு மண்டலம், மற்றும் (3) சிக்னல் மோட்டாரை சேதப்படுத்தாத டாம்பிங் அதிர்வு இடைவெளியை உறுதி செய்கிறது.'
      },
      visual: (
        <div className="bg-[var(--cr-surface)] border border-[var(--cr-border)] rounded-2xl p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--cr-border)]">
            <span className="font-bold text-[var(--cr-text-primary)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--cr-status-green)]" />
              Deterministic Safety Invariants Verified
            </span>
            <span className="bg-[var(--cr-primary)]/15 text-[var(--cr-primary)] text-[10px] font-semibold px-2 py-0.5 rounded">G&SR Chapter XV</span>
          </div>
          <div className="space-y-1.5 text-[var(--cr-text-primary)]">
            <div className="flex items-center gap-2 text-[var(--cr-status-green)]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span><strong>Rule 1:</strong> 25 kV Traction Power Isolation mandatory before any human track access.</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--cr-status-green)]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span><strong>Rule 2:</strong> Worksite span constrained to ≤ 15.0 km (under 1 Section Controller jurisdiction).</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--cr-status-green)]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span><strong>Rule 3:</strong> CSM Tamper ground vibration isolated from electronic point switches (&gt;1.0 km buffer).</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'step-5',
      number: '05',
      title: {
        en: 'The Human-in-the-Loop Payoff: Certified Section Controller Memo',
        hi: 'नियंत्रक प्रमाणीकरण: आधिकारिक डिजिटल ब्लॉक मेमो',
        ta: 'மனித கட்டுப்பாட்டில் முடிவு: சான்றளிக்கப்பட்ட பிரிவு கட்டுப்பாட்டாளர் மெமோ'
      },
      duration: 15,
      badge: {
        en: '📝 Legally Binding Authorization · Complete Audit Trail',
        hi: '📝 प्रमाणित डिजिटल रिकॉर्ड · 100% ऑडिट लॉग',
        ta: '📝 சட்டப்பூர்வ டிஜிட்டல் அனுமதி · முழுமையான தணிக்கை பதிவு'
      },
      summary: {
        en: 'AI recommends; the human Chief Controller decides. Plan A generates an official electronic block authorization memo with complete shift handover notes and one-click rollback capability, ready for immediate CRIS integration.',
        hi: 'AI योजना बनाता है, लेकिन अंतिम निर्णय ड्यूटी पर तैनात सेक्शन कंट्रोलर का होता है। प्लान A का चयन होते ही आधिकारिक डिजिटल ब्लॉक मेमो जनरेट हो जाता है, जिसे रेलवे के CRIS नेटवर्क पर तुरंत लागू किया जा सकता है।',
        ta: 'AI பரிந்துரைக்கிறது; பணியில் உள்ள தலைமை கட்டுப்பாட்டாளர் முடிவு செய்கிறார். திட்டம் A அதிகாரப்பூர்வ டிஜிட்டல் மெமோவை உருவாக்குகிறது, இதை ரயில்வேயின் CRIS அமைப்பில் உடனே செயல்படுத்த முடியும்.'
      },
      visual: (
        <div className="bg-[var(--cr-surface)] border border-[var(--cr-border)] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--cr-border)] pb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--cr-primary)]" />
              <span className="text-xs font-bold text-[var(--cr-text-primary)]">MEMO #AUTH-REC-104</span>
            </div>
            <span className="bg-[var(--cr-status-green)]/15 text-[var(--cr-status-green)] text-[10px] font-bold px-2 py-0.5 rounded">
              DIGITALLY AUTHORIZED
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--cr-text-muted)]">
            <div>Officer: <strong className="text-[var(--cr-text-primary)]">Senior Section Controller</strong></div>
            <div>Division: <strong className="text-[var(--cr-text-primary)]">Kanpur Central (CNB)</strong></div>
            <div>Granted Window: <strong className="text-[var(--cr-text-primary)] tabular-nums">Day 1 01:00 – 04:25 (3h 25m)</strong></div>
            <div>Express Detention: <strong className="text-[var(--cr-status-green)]">0 Minutes (100% Punctual)</strong></div>
          </div>
          <p className="text-[10px] text-[var(--cr-text-muted)] italic pt-1 border-t border-[var(--cr-border)]">
            Recorded under Indian Railways General & Subsidiary Rules. Pilot-ready for deployment on Kanpur–New Delhi HDN trunk line.
          </p>
        </div>
      )
    }
  ];

  const current = steps[currentStep];

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = 100; // tick every 100ms
    const totalTicks = (current.duration * 1000) / interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStep < steps.length - 1) {
            setCurrentStep((s) => s + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + 100 / totalTicks;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentStep, current.duration, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    } else {
      onClose();
      onExploreConsole();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="cr-panel w-full max-w-2xl rounded-xl overflow-hidden border border-[var(--cr-border)] bg-[var(--cr-surface)] shadow-2xl flex flex-col animate-scale-up">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--cr-border)] bg-[var(--cr-bg)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--cr-surface)] text-[var(--cr-primary)] rounded-lg border border-[var(--cr-border)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--cr-primary)] uppercase tracking-wider">
                  {language === 'hi' ? '90-सेकंड जज डेमो वॉकथ्रू' : (language === 'ta' ? '90 வினாடி நடுவர் டெமோ உலா' : '90-Second Judge Demo Tour')}
                </span>
                <span className="cr-badge-blue text-[10px]">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--cr-text-primary)] mt-0.5">
                {current.title[language]}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--cr-text-muted)] hover:text-[var(--cr-text-primary)] bg-[var(--cr-surface)] hover:bg-[var(--cr-border)]/50 rounded-lg transition-colors cursor-pointer border border-[var(--cr-border)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--cr-bg)] h-1 border-b border-[var(--cr-border)]">
          <div
            className="bg-[var(--cr-primary)] h-1 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="cr-badge-neutral text-xs py-1">
              {current.badge[language]}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="cr-btn-secondary py-1 px-2.5 text-xs flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-[var(--cr-status-amber)]" /> : <Play className="w-3.5 h-3.5 text-[var(--cr-status-green)]" />}
                <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-[var(--cr-text-muted)] leading-relaxed font-normal">
            {current.summary[language]}
          </p>

          {/* Interactive Visual Card for this step */}
          <div className="pt-2">
            {current.visual}
          </div>
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="p-4 sm:p-5 border-t border-[var(--cr-border)] bg-[var(--cr-bg)] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleJumpToStep(idx)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  idx === currentStep
                    ? 'bg-[var(--cr-primary)] text-white shadow-sm'
                    : idx < currentStep
                    ? 'bg-[var(--cr-status-green)]/15 text-[var(--cr-status-green)] border border-[var(--cr-status-green)]/40'
                    : 'bg-[var(--cr-surface)] text-[var(--cr-text-muted)] border border-[var(--cr-border)]'
                }`}
              >
                {s.number}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`cr-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 ${
                currentStep === 0 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {language === 'hi' ? 'पिछला' : (language === 'ta' ? 'முந்தைய' : 'Back')}
            </button>

            <button
              onClick={handleNext}
              className="cr-btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5"
            >
              <span>{currentStep === steps.length - 1 ? (language === 'hi' ? 'कंसोल खोलें' : (language === 'ta' ? 'கன்சோல் திறக்க' : 'Explore Live Console')) : (language === 'hi' ? 'अगला कदम' : (language === 'ta' ? 'அடுத்த படி' : 'Next Step'))}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
