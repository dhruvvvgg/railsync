export type Language = 'en' | 'hi' | 'ta';

export interface GlossaryTerm {
  acronym: string;
  fullName: { en: string; hi: string; ta: string };
  category: 'Track' | 'Traction' | 'Signal' | 'Operations' | 'Rules';
  plainEnglish: { en: string; hi: string; ta: string };
  whyItMatters: { en: string; hi: string; ta: string };
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    acronym: 'OHE',
    fullName: {
      en: 'Overhead Equipment (25 kV AC Wires)',
      hi: 'ओवरहेड उपकरण (25 kV बिजली के तार)',
      ta: 'மேல்நிலை மின்சார உபகரணங்கள் (25 kV மின்கம்பிகள்)'
    },
    category: 'Traction',
    plainEnglish: {
      en: 'The high-voltage overhead electric cables that power electric locomotives.',
      hi: 'ट्रेनों को बिजली देने वाले 25,000 वोल्ट के ओवरहेड बिजली के तार।',
      ta: 'மின்சார ரயில்களுக்கு 25,000 வோல்ட் மின்சாரம் வழங்கும் மேல்நிலை உயர் மின்னழுத்த கம்பிகள்.'
    },
    whyItMatters: {
      en: 'Before humans or machines touch track, OHE must be de-energized and grounded with discharge rods.',
      hi: 'ट्रैक पर काम करने से पहले ओएचई बिजली बंद करना और अर्थिंग रॉड लगाना अनिवार्य सुरक्षा नियम है।',
      ta: 'பராமரிப்பு தொடங்கும் முன் OHE மின்சாரம் துண்டிக்கப்பட்டு தரையிறக்கும் கம்பிகள் பொருத்தப்பட வேண்டும்.'
    }
  },
  {
    acronym: 'TPC Power Block',
    fullName: {
      en: 'Traction Power Controller Isolation Permit',
      hi: 'ट्रैक्शन पावर कंट्रोलर (टीपीसी) आइसोलेशन परमिट',
      ta: 'மின் இழுவை மின்சாரக் கட்டுப்பாட்டு அனுமதி (TPC பவர் பிளாக்)'
    },
    category: 'Traction',
    plainEnglish: {
      en: 'Official authorized electrical shutdown of overhead wires for safe maintenance.',
      hi: 'सुरक्षित रखरखाव हेतु ओवरहेड तारों की आधिकारिक बिजली कटौती परमिट।',
      ta: 'பாதுகாப்பான பராமரிப்பிற்காக மேல்நிலை கம்பிகளில் மின்சாரத்தை நிறுத்தும் அதிகாரப்பூர்வ அனுமதி.'
    },
    whyItMatters: {
      en: 'Guarantees zero electric shock risk. Hardcoded in our safety validator; cannot be bypassed.',
      hi: 'करंट के खतरे को 100% रोकता है। हमारे सुरक्षा इंजन में अनिवार्य नियम के रूप में दर्ज है।',
      ta: 'மின் விபத்துக்களை 100% தடுக்கிறது. எங்கள் பாதுகாப்பு சரிபார்ப்பு விதிகளில் மாற்ற முடியாத விதியாக உள்ளது.'
    }
  },
  {
    acronym: 'CSM-09 Tamper',
    fullName: {
      en: 'Continuous Action Track Tamping Machine',
      hi: 'कंटीन्यूअस एक्शन ट्रैक टैम्पिंग मशीन',
      ta: 'தொடர் நடவடிக்கை தண்டவாள சீரமைப்பு இயந்திரம் (டாம்பிங் மெஷின்)'
    },
    category: 'Track',
    plainEnglish: {
      en: 'Heavy robotic track machine that lifts rails and compacts crushed ballast stones underneath.',
      hi: 'पटरियों को उठाकर उनके नीचे की गिट्टियों को मजबूती से पैक करने वाली भारी मशीन।',
      ta: 'தண்டவாளங்களை உயர்த்தி அதன் கீழ் உள்ள ஜல்லிக்கற்களை அழுத்தி சீரமைக்கும் தானியங்கி ரோபோ இயந்திரம்.'
    },
    whyItMatters: {
      en: 'High vibration machine. Our safety rules prevent it from operating within 1 km of delicate signal switches.',
      hi: 'यह भारी कंपन पैदा करती है। हमारा सिस्टम इसे नाजुक सिग्नल स्विच के 1 किमी के दायरे में चलने से रोकता है।',
      ta: 'அதிக அதிர்வு தரும் இயந்திரம். நுண்ணிய சிக்னல் சுவிட்சுகளிலிருந்து 1 கி.மீ தூரத்திற்குள் செயல்படுவதைத் தடுக்கிறது.'
    }
  },
  {
    acronym: 'MSDAC',
    fullName: {
      en: 'Multi-Section Digital Axle Counter',
      hi: 'मल्टी-सेक्शन डिजिटल एक्सल काउंटर',
      ta: 'மல்டி-செக்ஷன் டிஜிட்டல் ஆக்சில் கவுண்டர் (MSDAC சக்கர சென்சார்)'
    },
    category: 'Signal',
    plainEnglish: {
      en: 'Electronic track sensor that counts train wheel axles entering and exiting a track section.',
      hi: 'पटरियों पर लगा डिजिटल सेंसर जो डिब्बों के पहियों को गिनकर ट्रैक खाली होने की पुष्टि करता है।',
      ta: 'ரயில் பெட்டிகளின் சக்கரங்களை எண்ணி, அந்தப் பாதையில் ரயில் உள்ளதா இல்லையா எனத் தெரிவிக்கும் சென்சார்.'
    },
    whyItMatters: {
      en: 'Safety-critical. Tells automatic signals whether the track ahead is occupied or clear.',
      hi: 'अत्यंत संवेदनशील सिग्नल उपकरण जो बताता है कि आगे पटरी खाली है या नहीं।',
      ta: 'ரயில் பாதுகாப்புக்கு மிக முக்கியமானது. அடுத்த சிக்னலுக்கு பாதை காலியாக உள்ளதா என்பதை உறுதி செய்கிறது.'
    }
  },
  {
    acronym: 'Point Machine 143mm',
    fullName: {
      en: 'Electric Turnout Point Operating Motor',
      hi: 'इलेक्ट्रिक टर्नआउट पॉइंट मोटर',
      ta: 'மின்சார ரயில் பாதை மாற்றும் மோட்டார் (பாயிண்ட் மெஷின்)'
    },
    category: 'Signal',
    plainEnglish: {
      en: 'The motorized switch that physically moves rails so trains can switch from one track to another.',
      hi: 'पटरियों को दाएं-बाएं मोड़कर ट्रेन की दिशा बदलने वाली इलेक्ट्रॉनिक मोटर।',
      ta: 'ரயில்கள் ஒரு தண்டவாளத்திலிருந்து மற்றொரு தண்டவாளத்திற்கு மாற உதவும் மோட்டார் சுவிட்ச்.'
    },
    whyItMatters: {
      en: 'Misalignment causes derailments. Cannot be calibrated while track tamping causes ground vibration.',
      hi: 'जरा सी खराबी से ट्रेन पटरी से उतर सकती है। टैम्पिंग मशीन के कंपन के समय इसकी टेस्टिंग प्रतिबंधित है।',
      ta: 'சிறிய குறைபாடும் தடம் புரளலுக்கு வழிவகுக்கும். டாம்பிங் அதிர்வுகளின் போது இதன் சோதனை தடைசெய்யப்பட்டுள்ளது.'
    }
  },
  {
    acronym: 'TMS',
    fullName: {
      en: 'Track Management System',
      hi: 'ट्रैक मैनेजमेंट सिस्टम (सिविल पोर्टल)',
      ta: 'தண்டவாள பராமரிப்பு மேலாண்மை அமைப்பு (TMS)'
    },
    category: 'Track',
    plainEnglish: {
      en: 'Indian Railways database for rail fractures, sleeper defects, and track renewals.',
      hi: 'पटरियों, स्लीपरों और ट्रैक फ्रैक्चर का रिकॉर्ड रखने वाला रेलवे का आधिकारिक सॉफ्टवेयर।',
      ta: 'தண்டவாள விரிசல்கள், ஸ்லீப்பர் குறைபாடுகள் மற்றும் புதுப்பித்தல் பணிகளைப் பதிவு செய்யும் மென்பொருள்.'
    },
    whyItMatters: {
      en: 'Primary input source for Civil Engineering maintenance requests in RAILSYNC.',
      hi: 'रेलसिंक में सिविल इंजीनियरिंग विभाग के मेंटेनेंस डेटा का मुख्य स्रोत।',
      ta: 'சிவில் இன்ஜினியரிங் துறையின் பராமரிப்பு கோரிக்கைகளுக்கான முதன்மை தரவு ஆதாரம்.'
    }
  },
  {
    acronym: 'TDMS',
    fullName: {
      en: 'Traction Distribution Management System',
      hi: 'ट्रैक्शन डिस्ट्रीब्यूशन मैनेजमेंट सिस्टम (विद्युत पोर्टल)',
      ta: 'மின் இழுவை விநியோக மேலாண்மை அமைப்பு (TDMS)'
    },
    category: 'Traction',
    plainEnglish: {
      en: 'Indian Railways database for overhead electric wire (OHE) inspections and substation assets.',
      hi: 'ओवरहेड बिजली तारों और सबस्टेशनों के मेंटेनेंस का आधिकारिक रेलवे पोर्टल।',
      ta: 'மேல்நிலை மின்கம்பிகள் மற்றும் சப்-ஸ்டேஷன்களின் ஆய்வுகளுக்கான அதிகாரப்பூர்வ ரயில்வே தளம்.'
    },
    whyItMatters: {
      en: 'Provides all electrical maintenance tasks that require 25 kV power shutdowns.',
      hi: 'बिजली कटौती की मांग करने वाले सभी इलेक्ट्रिकल कार्यों का मुख्य डेटा स्रोत।',
      ta: '25 kV மின்சாரத்தை நிறுத்த வேண்டிய அனைத்து மின் பராமரிப்பு பணிகளையும் வழங்குகிறது.'
    }
  },
  {
    acronym: 'SMMS',
    fullName: {
      en: 'Signal & Telecom Maintenance Management System',
      hi: 'सिग्नल एवं टेलीकॉम मेंटेनेंस मैनेजमेंट सिस्टम',
      ta: 'சிக்னல் மற்றும் தொலைத்தொடர்பு பராமரிப்பு அமைப்பு (SMMS)'
    },
    category: 'Signal',
    plainEnglish: {
      en: 'Indian Railways portal for signals, point machines, and electronic interlocking units.',
      hi: 'रेलवे सिग्नलों, पॉइंट मोटरों और इंटरलॉकिंग सिस्टम के मेंटेनेंस का पोर्टल।',
      ta: 'சிக்னல்கள், பாயிண்ட் மோட்டார்கள் மற்றும் இன்டர்லாக்கிங் கருவிகளுக்கான பராமரிப்பு தளம்.'
    },
    whyItMatters: {
      en: 'Feeds S&T tasks that can be shadow-bundled during track closures.',
      hi: 'ट्रैक ब्लॉक के दौरान साथ मिलकर निपटाए जाने वाले सिग्नल कार्यों का स्रोत।',
      ta: 'தண்டவாளப் பிளாக்கின் போது ஒரே நேரத்தில் முடிக்கக்கூடிய சிக்னல் பணிகளை இணைக்கிறது.'
    }
  },
  {
    acronym: 'G&SR',
    fullName: {
      en: 'General and Subsidiary Rules',
      hi: 'सामान्य एवं सहायक नियम (जी एंड एसआर)',
      ta: 'பொது மற்றும் துணை விதிகள் (G&SR பாதுகாப்பு விதிகள்)'
    },
    category: 'Rules',
    plainEnglish: {
      en: 'The statutory safety bible and operating rulebook governing Indian Railways.',
      hi: 'भारतीय रेल का सर्वोच्च वैधानिक सुरक्षा नियम संग्रह।',
      ta: 'இந்திய ரயில்வேயின் செயல்பாடுகளை வழிநடத்தும் சட்டப்பூர்வ பாதுகாப்பு விதிமுறை புத்தகம்.'
    },
    whyItMatters: {
      en: 'Our safety rules are hardcoded directly from G&SR norms—AI cannot violate them.',
      hi: 'हमारा सुरक्षा वैलिडेटर सीधे इन नियमों पर आधारित है—AI इन्हें कभी नहीं तोड़ सकता।',
      ta: 'எங்கள் பாதுகாப்பு விதிகள் நேரடியாக G&SR நெறிமுறைகளில் கட்டமைக்கப்பட்டுள்ளன—AI இவற்றை மீற முடியாது.'
    }
  },
  {
    acronym: 'FCFS',
    fullName: {
      en: 'First-Come-First-Served (Current Manual Practice)',
      hi: 'पहले आओ-पहले पाओ (वर्तमान असमन्वित प्रथा)',
      ta: 'முதலில் வருபவருக்கு முன்னுரிமை (தற்போதைய பழைய முறை)'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'The current uncoordinated method where departments book blocks separately on the phone.',
      hi: 'मौजूदा पुरानी व्यवस्था जहां तीनों विभाग फोन पर अलग-अलग समय पर ट्रैक ब्लॉक मांगते हैं।',
      ta: 'மூன்று துறைகளும் தொலைபேசியில் தனித்தனியாக பிளாக் கேட்கும் தற்போதைய ஒருங்கிணைப்பற்ற முறை.'
    },
    whyItMatters: {
      en: 'Causes fragmented blocks, repeated line closures, and 4+ express train detentions.',
      hi: 'इसके कारण पटरी बार-बार बंद होती है और एक्सप्रेस ट्रेनें घंटों लेट होती हैं।',
      ta: 'தண்டவாளம் மீண்டும் மீண்டும் மூடப்படுவதால் விரைவு ரயில்கள் தாமதமாகின்றன.'
    }
  },
  {
    acronym: 'IMR Defect',
    fullName: {
      en: 'Immediate Removal Ultrasonic Rail Flaw',
      hi: 'अति-संवेदनशील रेल फ्रैक्चर (तत्काल मरम्मत योग्य)',
      ta: 'உடனடி நீக்க தண்டவாள விரிசல் குறைபாடு (IMR)'
    },
    category: 'Track',
    plainEnglish: {
      en: 'A severe internal crack in the rail detected by ultrasound that could cause derailment if not fixed.',
      hi: 'अल्ट्रासोनिक जांच में पकड़ी गई पटरी की गंभीर दरार, जिसे तुरंत न बदलने पर ट्रेन पलट सकती है।',
      ta: 'அல்ட்ராசவுண்ட் மூலம் கண்டறியப்பட்ட தண்டவாளத்தின் உட்புற விரிசல்; உடனே சரிசெய்யாவிடில் ரயில் தடம் புரளும்.'
    },
    whyItMatters: {
      en: 'Classified as P0 Emergency. Our CP-SAT solver prioritizes it within statutory 24h safety deadlines.',
      hi: 'P0 आपातकालीन श्रेणी। हमारा सॉल्वर 24 घंटे के अंदर इसके लिए ब्लॉक सुनिश्चित करता है।',
      ta: 'P0 அவசரப் பிரிவு. 24 மணி நேரத்திற்குள் பிளாக் ஒதுக்கி விபத்தைத் தவிர்க்கிறது.'
    }
  },
  {
    acronym: 'COA',
    fullName: {
      en: 'Control Office Application',
      hi: 'कंट्रोल ऑफिस एप्लीकेशन (लाइव ट्रेन ट्रैकिंग)',
      ta: 'கட்டுப்பாட்டு அலுவலக பயன்பாடு (நேரலை ரயில் கண்காணிப்பு)'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'Real-time train movement graph and dispatch logging system used by Section Controllers.',
      hi: 'सेक्शन कंट्रोलर द्वारा उपयोग किया जाने वाला लाइव ट्रेन मूवमेंट और ग्राफ सिस्टम।',
      ta: 'ரயில் இயக்கங்களை நிகழ்நேரத்தில் வரைபடமாகக் காட்டும் கன்ட்ரோலர் மென்பொருள்.'
    },
    whyItMatters: {
      en: 'Supplies real train paths to RAILSYNC to calculate and prevent timetable clashes.',
      hi: 'रेलसिंक को वास्तविक ट्रेन समय प्रदान करता है ताकि ट्रेनों से टकराव रोका जा सके।',
      ta: 'ரயில்களின் நேர அட்டவணையை வழங்கி, பராமரிப்பு நேரத்துடன் மோதல் ஏற்படாமல் தடுக்கிறது.'
    }
  },
  {
    acronym: 'FOIS',
    fullName: {
      en: 'Freight Operations Information System',
      hi: 'मालभाड़ा परिचालन सूचना प्रणाली',
      ta: 'சரக்கு ரயில் செயல்பாட்டு தகவல் அமைப்பு (FOIS)'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'Indian Railways database tracking all goods rakes, coal rakes, and freight trains.',
      hi: 'सभी मालगाड़ियों और कोयला रेकों की स्थिति और लोडिंग ट्रैक करने वाला सिस्टम।',
      ta: 'அனைத்து சரக்கு ரயில்கள் மற்றும் நிலக்கரி வேகன்களின் இருப்பிடத்தைக் கண்காணிக்கும் அமைப்பு.'
    },
    whyItMatters: {
      en: 'Allows RAILSYNC to schedule blocks into freight valleys and loop low-priority rakes safely.',
      hi: 'रेलसिंक को मालगाड़ियों के अंतराल की जानकारी देता है ताकि एक्सप्रेस प्रभावित न हों।',
      ta: 'இரவு நேர சரக்கு ரயில் இடைவெளிகளில் பயணிகள் ரயில்களை பாதிக்காமல் பராமரிப்பு பிளாக்குகளை திட்டமிடுகிறது.'
    }
  },
  {
    acronym: 'Marey Diagram',
    fullName: {
      en: 'Time-Distance String Chart',
      hi: 'समय-दूरी ट्रेन ग्राफ (मारे डायग्राम)',
      ta: 'நேரம்-தூர ரயில் வரைபடம் (மரே டயக்ராம்)'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'A 2D chart: Stations on Y-axis vs Time on X-axis. Slanted lines are moving trains; boxes are track blocks.',
      hi: 'सेक्शन कंट्रोलर का मुख्य ग्राफ: X-अक्ष पर समय और Y-अक्ष पर स्टेशन। ढलान वाली रेखाएं चलती ट्रेनें हैं।',
      ta: 'X-அச்சில் நேரமும், Y-அச்சில் ரயில் நிலையங்களும் இருக்கும் வரைபடம். சாய்வு கோடுகள் ரயில்கள், கட்டங்கள் பராமரிப்பு பிளாக்குகள்.'
    },
    whyItMatters: {
      en: 'Where a train line crosses a block box, there is a collision. Our AI ensures zero lines cross!',
      hi: 'जहां ट्रेन की रेखा ब्लॉक बॉक्स से टकराती है, वहां ट्रेन लेट होती है। हमारा AI इसे शून्य करता है!',
      ta: 'ரயில் கோடு ஒரு பராமரிப்பு பிளாக்குடன் குறுக்கிடும் போது மோதல் ஏற்படுகிறது. எங்கள் AI இதை பூஜ்ஜியமாக்குகிறது!'
    }
  }
];

export const TRANSLATIONS = {
  en: {
    headline: 'AI that plans railway maintenance blocks — so trains stop losing time to conflicts.',
    subheadline: 'Smart India Hackathon 2026 • Ministry of Railways (SIH26027) • North Central Railway Corridor',
    runDemoButton: '▶ Run Guided Demo (90s)',
    exploreConsoleButton: 'Explore Full Console →',
    backToStoryButton: '← Back to Story Overview',
    glossaryButton: 'Glossary [?]',
    act1Title: 'Act 1: The Chaos',
    act1Subtitle: 'Current Manual FCFS Booking',
    act1Badge: '❌ 4 Conflicts · 2 Delayed Express Trains · 6.5h Lost Capacity',
    act1Desc: 'Civil, Electrical, and Signal departments request track closures independently via phone calls. The same 40 km section is shut down 3 separate times in one week, forcing premium passenger trains to sit at red signals.',
    
    act2Title: 'Act 2: The Engine',
    act2Subtitle: 'Google OR-Tools CP-SAT Math Engine',
    act2Badge: '⚡ Solved in 0.031s · 100% G&SR Rules Enforced',
    act2Desc: 'In 31 milliseconds, mathematical constraint programming scans 14 days of pending tasks, screens 29 dirty records, enforces 25 kV AC power isolation, and shifts blocks into overnight freight lull valleys.',
    
    act3Title: 'Act 3: The Proof',
    act3Subtitle: 'RAILSYNC Synchronized Plan A',
    act3Badge: '✅ 0 Conflicts · 0m Express Train Delay · 3.25h Unified Window',
    act3Desc: 'All 3 departments perform track tamping, overhead wire inspection, and signal testing in the exact same 3.25-hour overnight window. Vande Bharat and Rajdhani express trains maintain 100% punctuality.',

    kpiDetentions: 'Express Train Delays',
    kpiDetentionsSub: 'Vande Bharat / Rajdhani',
    kpiDowntime: 'Track Downtime Needed',
    kpiDowntimeSub: 'Per 100 km Corridor / Week',
    kpiSafety: 'Safety Rule Compliance',
    kpiSafetySub: '25 kV OHE Isolation & G&SR',
    kpiBundling: '3-in-1 Coordinated Bundling',
    kpiBundlingSub: 'Multi-Department Synergy',

    compareTitle: 'Side-by-Side Reality Check',
    manualReality: 'Manual Booking (Current Reality)',
    railsyncOptimized: 'RAILSYNC (AI Optimized)',
    
    mareyCaption: 'Railway Time-Distance Graph: Horizontal axis shows Time (00:00 to 24:00), vertical axis shows Stations along the corridor. Where a train line intersects a maintenance block rectangle, trains are colliding or delayed.',
    conflictDetected: '⚠️ Manual Booking Collision: Overnight train path intersects track closure window here!',
    conflictResolved: '✅ Solved by CP-SAT: Maintenance shifted to 01:00–04:25 freight valley — 0 minutes express detention.',

    laneCivil: 'Track Work (Civil Engineering · TMS)',
    laneTrd: 'Power Shutdown (Electrical TRD · 25 kV OHE)',
    laneSnt: 'Signal Testing (Signal & Telecom · SMMS)',

    badgeLiveOhe: '🔴 OHE LIVE — NO TRACK ACCESS',
    badgeIsolating: '🟡 25 kV ISOLATION IN PROGRESS',
    badgeCleared: '🟢 CLEARED FOR CO-WORK (3-IN-1)',

    authFooter: 'Official Action Memo: Simulated Section Controller Authorization recorded under Indian Railways General & Subsidiary Rules.',
    authorizedBy: 'Authorized by: Senior Section Controller — CNB Division',

    tabCockpit: 'Planning Cockpit (Marey & Gantt)',
    tabGateway: 'Data-Quality Center',
    tabOpportunities: 'Look-Ahead Bundling',
    tabComparison: 'Plan Comparison',
    tabEmergency: 'Disruption Simulator',
    tabAudit: 'Audit Log'
  },
  hi: {
    headline: 'भारतीय रेल में स्वचालित ब्लॉक योजना — ट्रेनों की समयबद्धता और ट्रैक सुरक्षा का संतुलन।',
    subheadline: 'स्मार्ट इंडिया हैकथॉन 2026 • रेल मंत्रालय (SIH26027) • उत्तर मध्य रेलवे कॉरिडोर',
    runDemoButton: '▶ 90-सेकंड निर्देशित डेमो चलाएं',
    exploreConsoleButton: 'विस्तृत इंजीनियरिंग कंसोल देखें →',
    backToStoryButton: '← मुख्य विवरण पर लौटें',
    glossaryButton: 'रेल शब्दावली [?]',
    act1Title: 'अंक 1: वर्तमान अव्यवस्था',
    act1Subtitle: 'पारंपरिक मैन्युअल पहले आओ-पहले पाओ बुकिंग',
    act1Badge: '❌ 4 टकराव · 2 एक्सप्रेस ट्रेनें विलंबित · 6.5 घंटे क्षमता नष्ट',
    act1Desc: 'सिविल, इलेक्ट्रिकल और सिग्नल विभाग फोन कॉल पर अलग-अलग ट्रैक ब्लॉक मांगते हैं। एक ही 40 किमी रेल खंड को एक हफ्ते में 3 बार अलग-अलग बंद किया जाता है, जिससे प्रीमियम यात्री ट्रेनें लाल सिग्नल पर खड़ी रहती हैं।',
    
    act2Title: 'अंक 2: ऑप्टिमाइजेशन इंजन',
    act2Subtitle: 'Google OR-Tools CP-SAT गणितीय सॉल्वर',
    act2Badge: '⚡ मात्र 0.031 सेकंड में समाधान · 100% सुरक्षा नियम लागू',
    act2Desc: 'गणितीय कंस्ट्रेंट प्रोग्रामिंग मात्र 31 मिलीसेकंड में 14 दिनों के कार्यों को स्कैन करता है, 29 खराब डेटा रिकॉर्ड्स को अलग करता है, और 25 kV बिजली आइसोलेशन की पुष्टि करते हुए रात के खाली समय में काम तय करता है।',
    
    act3Title: 'अंक 3: वास्तविक परिणाम',
    act3Subtitle: 'रेलसिंक समन्वित प्लान A',
    act3Badge: '✅ 0 टकराव · शून्य मिनट एक्सप्रेस विलंब · 3.25 घंटे का एकल ब्लॉक',
    act3Desc: 'तीनों विभाग ट्रैक टैम्पिंग, ओवरहेड तार और सिग्नल टेस्टिंग का काम रात के एक ही 3.25 घंटे के ब्लॉक में मिलकर पूरा करते हैं। वंदे भारत और राजधानी जैसी ट्रेनें 100% समय पर चलती हैं।',

    kpiDetentions: 'एक्सप्रेस ट्रेन विलंब',
    kpiDetentionsSub: 'वंदे भारत / राजधानी',
    kpiDowntime: 'आवश्यक ट्रैक ब्लॉक समय',
    kpiDowntimeSub: 'प्रति 100 किमी कॉरिडोर / सप्ताह',
    kpiSafety: 'सुरक्षा नियमों का अनुपालन',
    kpiSafetySub: '25 kV ओएचई आइसोलेशन एवं जी एंड एसआर',
    kpiBundling: '3-इन-1 समन्वित बंडलिंग',
    kpiBundlingSub: 'बहु-विभागीय कार्य समन्वय',

    compareTitle: 'तुलनात्मक प्रभाव विश्लेषण',
    manualReality: 'पारंपरिक मैन्युअल व्यवस्था (वर्तमान स्थिति)',
    railsyncOptimized: 'रेलसिंक-एबीपी (AI गणितीय समाधान)',
    
    mareyCaption: 'समय-दूरी ट्रेन ग्राफ: क्षैतिज (X) अक्ष समय दर्शाता है (00:00 से 24:00), और लंबवत (Y) अक्ष कॉरिडोर के रेलवे स्टेशनों को दर्शाता है। जहां ट्रेन की रेखा ब्लॉक से टकराती है, वहां ट्रेन लेट होती है।',
    conflictDetected: '⚠️ टकराव: रात की ट्रेन का समय ट्रैक मेंटेनेंस ब्लॉक से सीधे टकरा रहा है!',
    conflictResolved: '✅ CP-SAT द्वारा समाधान: मेंटेनेंस को 01:00–04:25 रात के खाली समय में स्थानांतरित किया गया — 0 मिनट विलंब।',

    laneCivil: 'ट्रैक कार्य (सिविल इंजीनियरिंग · TMS)',
    laneTrd: 'बिजली कटौती कार्य (इलेक्ट्रिकल TRD · 25 kV OHE)',
    laneSnt: 'सिग्नल टेस्टिंग (सिग्नल एवं टेलीकॉम · SMMS)',

    badgeLiveOhe: '🔴 ओएचई चालू — ट्रैक पर जाना सख्त मना है',
    badgeIsolating: '🟡 25 kV बिजली कटौती प्रगति पर है',
    badgeCleared: '🟢 संयुक्त कार्य हेतु ट्रैक सुरक्षित घोषित (3-इन-1)',

    authFooter: 'आधिकारिक मेमो: भारतीय रेलवे सामान्य एवं सहायक नियमों के तहत अधिकृत सेक्शन कंट्रोलर द्वारा प्रमाणित।',
    authorizedBy: 'प्रमाणीकरणकर्ता: वरिष्ठ अनुभाग नियंत्रक — कानपुर मंडल',

    tabCockpit: 'प्लानिंग कॉकपिट (मारे एवं गैंट ग्राफ)',
    tabGateway: 'डेटा-क्वालिटी सेंटर',
    tabOpportunities: 'लुक-अहेड बंडलिंग',
    tabComparison: 'प्लान तुलना',
    tabEmergency: 'आपातकालीन व्यवधान सिमुलेटर',
    tabAudit: 'ऑडिट लॉग एवं अप्रूवल'
  },
  ta: {
    headline: 'ரயில்வே பராமரிப்பு பிளாக்குகளை திட்டமிடும் AI — ரயில்களின் தாமதத்தை முற்றிலும் தவிர்க்கிறது.',
    subheadline: 'ஸ்மார்ட் இந்தியா ஹேக்கத்தான் 2026 • ரயில்வே அமைச்சகம் (SIH26027) • வட மத்திய ரயில்வே காரிடார்',
    runDemoButton: '▶ 90 வினாடி நேரலை டெமோ',
    exploreConsoleButton: 'முழு பொறியியல் கன்சோல் →',
    backToStoryButton: '← கதை கண்ணோட்டத்திற்குத் திரும்பு',
    glossaryButton: 'ரயில் கலைச்சொற்கள் [?]',
    act1Title: 'பாகம் 1: தற்போதைய குழப்பம்',
    act1Subtitle: 'பழைய கையேடு முன்பதிவு (FCFS)',
    act1Badge: '❌ 4 மோதல்கள் · 2 பயணிகள் ரயில்கள் தாமதம் · 6.5 மணிநேர இழப்பு',
    act1Desc: 'சிவில், எலக்ட்ரிக்கல், சிக்னல் துறைகள் தொலைபேசி மூலம் தனித்தனியாக பிளாக் கேட்கின்றன. ஒரே 40 கி.மீ பாதை வாரத்தில் 3 முறை தனித்தனியாக மூடப்படுவதால், வந்தே பாரத் ரயில்கள் கூட சிக்னலில் நிற்கின்றன.',
    
    act2Title: 'பாகம் 2: உகப்பாக்க இயந்திரம்',
    act2Subtitle: 'Google OR-Tools CP-SAT கணித தீர்வு அமைப்பு',
    act2Badge: '⚡ 0.031 வினாடியில் தீர்வு · 100% G&SR பாதுகாப்பு விதிகள்',
    act2Desc: 'கணித கட்டுப்பாட்டு நிரலாக்கம் 31 மில்லி வினாடிகளில் 14 நாள் பணிகளை ஆய்வு செய்து, 29 பிழையான தரவுகளை நீக்கி, 25 kV மின்சார பாதுகாப்பை உறுதிசெய்து, இரவு நேர சரக்கு ரயில் இடைவெளியில் பணிகளை ஒருங்கிணைக்கிறது.',
    
    act3Title: 'பாகம் 3: நிரூபிக்கப்பட்ட முடிவு',
    act3Subtitle: 'ரயில்சிங்க் திட்ட ஒருங்கிணைப்பு A',
    act3Badge: '✅ 0 மோதல்கள் · பூஜ்ஜிய நிமிட பயணிகள் ரயில் தாமதம் · 3.25 மணிநேர ஒற்றை பிளாக்',
    act3Desc: 'மூன்று துறைகளும் தண்டவாளம் சீரமைப்பு, மின் கம்பி ஆய்வு, சிக்னல் சோதனையை ஒரே 3.25 மணிநேர இரவு பிளாக்கில் முடிக்கின்றன. வந்தே பாரத் மற்றும் ராஜ்தானி ரயில்கள் 100% சரியான நேரத்தில் இயங்குகின்றன.',

    kpiDetentions: 'விரைவு ரயில் தாமதங்கள்',
    kpiDetentionsSub: 'வந்தே பாரத் / ராஜ்தானி',
    kpiDowntime: 'தேவைப்படும் தண்டவாள மூடல் நேரம்',
    kpiDowntimeSub: '100 கி.மீ காரிடாருக்கு / வாரம்',
    kpiSafety: 'பாதுகாப்பு விதிகளுக்கு இணங்குதல்',
    kpiSafetySub: '25 kV OHE மின்சாரம் துண்டிப்பு & G&SR',
    kpiBundling: '3-இன்-1 ஒருங்கிணைந்த பணிக் கட்டமைப்பு',
    kpiBundlingSub: 'பல துறை கூட்டு ஒருங்கிணைப்பு',

    compareTitle: 'நேரடி ஒப்பீட்டு உண்மை நிலை',
    manualReality: 'பழைய தொலைபேசி முறை (தற்போதைய நிலை)',
    railsyncOptimized: 'ரயில்சிங்க்-ABP (AI கணித தீர்வு)',
    
    mareyCaption: 'ரயில்வே நேரம்-தூர வரைபடம்: கிடைமட்ட (X) அச்சு நேரத்தையும் (00:00 முதல் 24:00), செங்குத்து (Y) அச்சு நிலையங்களையும் காட்டுகிறது. ரயில் கோடு பராமரிப்பு பெட்டியைக் கடக்கும் போது ரயில் தாமதமாகிறது.',
    conflictDetected: '⚠️ நேரடி மோதல்: இரவு ரயில் பாதை திட்டமிடப்படாத பராமரிப்பு பிளாக்குடன் குறுக்கிடுகிறது!',
    conflictResolved: '✅ CP-SAT தீர்வு: பராமரிப்பு இரவு 01:00–04:25 இடைவெளிக்கு மாற்றப்பட்டது — 0 நிமிட தாமதம்.',

    laneCivil: 'தண்டவாளப் பணி (சிவில் இன்ஜினியரிங் · TMS)',
    laneTrd: 'மின் நிறுத்தம் (எலக்ட்ரிக்கல் TRD · 25 kV OHE)',
    laneSnt: 'சிக்னல் சோதனை (சிக்னல் & தொலைத்தொடர்பு · SMMS)',

    badgeLiveOhe: '🔴 OHE மின்சாரம் நேரலை — பாதையில் நுழையத் தடை',
    badgeIsolating: '🟡 25 kV மின்சாரம் துண்டிக்கப்படுகிறது',
    badgeCleared: '🟢 கூட்டுப் பணிக்கான அனுமதி வழங்கப்பட்டது (3-இன்-1)',

    authFooter: 'அதிகாரப்பூர்வ ஆவணம்: இந்திய ரயில்வே பொது மற்றும் துணை விதிகளின் கீழ் அங்கீகரிக்கப்பட்ட செக்ஷன் கன்ட்ரோலர் அனுமதி.',
    authorizedBy: 'சான்றளித்தவர்: மூத்த பிரிவு கட்டுப்பாட்டாளர் — கான்பூர் பிரிவு',

    tabCockpit: 'திட்டமிடல் காக்பிட் (மரே & கான்ட் வரைபடம்)',
    tabGateway: 'தரவுத் தர மையம்',
    tabOpportunities: 'முன்கூட்டியே ஒருங்கிணைக்கும் வாய்ப்புகள்',
    tabComparison: 'திட்ட ஒப்பீடு',
    tabEmergency: 'அவசரத் தடங்கல் சிமுலேட்டர்',
    tabAudit: 'தணிக்கை பதிவு & அனுமதி அறிக்கை'
  }
};
