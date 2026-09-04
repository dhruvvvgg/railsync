export type Language = 'en' | 'hi';

export interface GlossaryTerm {
  acronym: string;
  fullName: { en: string; hi: string };
  category: 'Track' | 'Traction' | 'Signal' | 'Operations' | 'Rules';
  plainEnglish: { en: string; hi: string };
  whyItMatters: { en: string; hi: string };
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    acronym: 'OHE',
    fullName: {
      en: 'Overhead Equipment (25 kV AC Wires)',
      hi: 'ओवरहेड उपकरण (25 kV बिजली के तार)'
    },
    category: 'Traction',
    plainEnglish: {
      en: 'The high-voltage overhead electric cables that power electric locomotives.',
      hi: 'ट्रेनों को बिजली देने वाले 25,000 वोल्ट के ओवरहेड बिजली के तार।'
    },
    whyItMatters: {
      en: 'Before humans or machines touch track, OHE must be de-energized and grounded with discharge rods.',
      hi: 'ट्रैक पर काम करने से पहले ओएचई बिजली बंद करना और अर्थिंग रॉड लगाना अनिवार्य सुरक्षा नियम है।'
    }
  },
  {
    acronym: 'TPC Power Block',
    fullName: {
      en: 'Traction Power Controller Isolation Permit',
      hi: 'ट्रैक्शन पावर कंट्रोलर (टीपीसी) आइसोलेशन परमिट'
    },
    category: 'Traction',
    plainEnglish: {
      en: 'Official authorized electrical shutdown of overhead wires for safe maintenance.',
      hi: 'सुरक्षित रखरखाव हेतु ओवरहेड तारों की आधिकारिक बिजली कटौती परमिट।'
    },
    whyItMatters: {
      en: 'Guarantees zero electric shock risk. Hardcoded in our safety validator; cannot be bypassed.',
      hi: 'करंट के खतरे को 100% रोकता है। हमारे सुरक्षा इंजन में अनिवार्य नियम के रूप में दर्ज है।'
    }
  },
  {
    acronym: 'CSM-09 Tamper',
    fullName: {
      en: 'Continuous Action Track Tamping Machine',
      hi: 'कंटीन्यूअस एक्शन ट्रैक टैम्पिंग मशीन'
    },
    category: 'Track',
    plainEnglish: {
      en: 'Heavy robotic track machine that lifts rails and compacts crushed ballast stones underneath.',
      hi: 'पटरियों को उठाकर उनके नीचे की गिट्टियों को मजबूती से पैक करने वाली भारी मशीन।'
    },
    whyItMatters: {
      en: 'High vibration machine. Our safety rules prevent it from operating within 1 km of delicate signal switches.',
      hi: 'यह भारी कंपन पैदा करती है। हमारा सिस्टम इसे नाजुक सिग्नल स्विच के 1 किमी के दायरे में चलने से रोकता है।'
    }
  },
  {
    acronym: 'MSDAC',
    fullName: {
      en: 'Multi-Section Digital Axle Counter',
      hi: 'मल्टी-सेक्शन डिजिटल एक्सल काउंटर'
    },
    category: 'Signal',
    plainEnglish: {
      en: 'Electronic track sensor that counts train wheel axles entering and exiting a track section.',
      hi: 'पटरियों पर लगा डिजिटल सेंसर जो डिब्बों के पहियों को गिनकर ट्रैक खाली होने की पुष्टि करता है।'
    },
    whyItMatters: {
      en: 'Safety-critical. Tells automatic signals whether the track ahead is occupied or clear.',
      hi: 'अत्यंत संवेदनशील सिग्नल उपकरण जो बताता है कि आगे पटरी खाली है या नहीं।'
    }
  },
  {
    acronym: 'Point Machine 143mm',
    fullName: {
      en: 'Electric Turnout Point Operating Motor',
      hi: 'इलेक्ट्रिक टर्नआउट पॉइंट मोटर'
    },
    category: 'Signal',
    plainEnglish: {
      en: 'The motorized switch that physically moves rails so trains can switch from one track to another.',
      hi: 'पटरियों को दाएं-बाएं मोड़कर ट्रेन की दिशा बदलने वाली इलेक्ट्रॉनिक मोटर।'
    },
    whyItMatters: {
      en: 'Misalignment causes derailments. Cannot be calibrated while track tamping causes ground vibration.',
      hi: 'जरा सी खराबी से ट्रेन पटरी से उतर सकती है। टैम्पिंग मशीन के कंपन के समय इसकी टेस्टिंग प्रतिबंधित है।'
    }
  },
  {
    acronym: 'TMS',
    fullName: {
      en: 'Track Management System',
      hi: 'ट्रैक मैनेजमेंट सिस्टम (सिविल पोर्टल)'
    },
    category: 'Track',
    plainEnglish: {
      en: 'Indian Railways database for rail fractures, sleeper defects, and track renewals.',
      hi: 'पटरियों, स्लीपरों और ट्रैक फ्रैक्चर का रिकॉर्ड रखने वाला रेलवे का आधिकारिक सॉफ्टवेयर।'
    },
    whyItMatters: {
      en: 'Primary input source for Civil Engineering maintenance requests in RAILSYNC.',
      hi: 'रेलसिंक में सिविल इंजीनियरिंग विभाग के मेंटेनेंस डेटा का मुख्य स्रोत।'
    }
  },
  {
    acronym: 'TDMS',
    fullName: {
      en: 'Traction Distribution Management System',
      hi: 'ट्रैक्शन डिस्ट्रीब्यूशन मैनेजमेंट सिस्टम (विद्युत पोर्टल)'
    },
    category: 'Traction',
    plainEnglish: {
      en: 'Indian Railways database for overhead electric wire (OHE) inspections and substation assets.',
      hi: 'ओवरहेड बिजली तारों और सबस्टेशनों के मेंटेनेंस का आधिकारिक रेलवे पोर्टल।'
    },
    whyItMatters: {
      en: 'Provides all electrical maintenance tasks that require 25 kV power shutdowns.',
      hi: 'बिजली कटौती की मांग करने वाले सभी इलेक्ट्रिकल कार्यों का मुख्य डेटा स्रोत।'
    }
  },
  {
    acronym: 'SMMS',
    fullName: {
      en: 'Signal & Telecom Maintenance Management System',
      hi: 'सिग्नल एवं टेलीकॉम मेंटेनेंस मैनेजमेंट सिस्टम'
    },
    category: 'Signal',
    plainEnglish: {
      en: 'Indian Railways portal for signals, point machines, and electronic interlocking units.',
      hi: 'रेलवे सिग्नलों, पॉइंट मोटरों और इंटरलॉकिंग सिस्टम के मेंटेनेंस का पोर्टल।'
    },
    whyItMatters: {
      en: 'Feeds S&T tasks that can be shadow-bundled during track closures.',
      hi: 'ट्रैक ब्लॉक के दौरान साथ मिलकर निपटाए जाने वाले सिग्नल कार्यों का स्रोत।'
    }
  },
  {
    acronym: 'G&SR',
    fullName: {
      en: 'General and Subsidiary Rules',
      hi: 'सामान्य एवं सहायक नियम (जी एंड एसआर)'
    },
    category: 'Rules',
    plainEnglish: {
      en: 'The statutory safety bible and operating rulebook governing Indian Railways.',
      hi: 'भारतीय रेल का सर्वोच्च वैधानिक सुरक्षा नियम संग्रह।'
    },
    whyItMatters: {
      en: 'Our safety rules are hardcoded directly from G&SR norms—AI cannot violate them.',
      hi: 'हमारा सुरक्षा वैलिडेटर सीधे इन नियमों पर आधारित है—AI इन्हें कभी नहीं तोड़ सकता।'
    }
  },
  {
    acronym: 'FCFS',
    fullName: {
      en: 'First-Come-First-Served (Current Manual Practice)',
      hi: 'पहले आओ-पहले पाओ (वर्तमान असमन्वित प्रथा)'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'The current uncoordinated method where departments book blocks separately on the phone.',
      hi: 'मौजूदा पुरानी व्यवस्था जहां तीनों विभाग फोन पर अलग-अलग समय पर ट्रैक ब्लॉक मांगते हैं।'
    },
    whyItMatters: {
      en: 'Causes fragmented blocks, repeated line closures, and 4+ express train detentions.',
      hi: 'इसके कारण पटरी बार-बार बंद होती है और एक्सप्रेस ट्रेनें घंटों लेट होती हैं।'
    }
  },
  {
    acronym: 'IMR Defect',
    fullName: {
      en: 'Immediate Removal Ultrasonic Rail Flaw',
      hi: 'अति-संवेदनशील रेल फ्रैक्चर (तत्काल मरम्मत योग्य)'
    },
    category: 'Track',
    plainEnglish: {
      en: 'A severe internal crack in the rail detected by ultrasound that could cause derailment if not fixed.',
      hi: 'अल्ट्रासोनिक जांच में पकड़ी गई पटरी की गंभीर दरार, जिसे तुरंत न बदलने पर ट्रेन पलट सकती है।'
    },
    whyItMatters: {
      en: 'Classified as P0 Emergency. Our CP-SAT solver prioritizes it within statutory 24h safety deadlines.',
      hi: 'P0 आपातकालीन श्रेणी। हमारा सॉल्वर 24 घंटे के अंदर इसके लिए ब्लॉक सुनिश्चित करता है।'
    }
  },
  {
    acronym: 'COA',
    fullName: {
      en: 'Control Office Application',
      hi: 'कंट्रोल ऑफिस एप्लीकेशन (लाइव ट्रेन ट्रैकिंग)'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'Real-time train movement graph and dispatch logging system used by Section Controllers.',
      hi: 'सेक्शन कंट्रोलर द्वारा उपयोग किया जाने वाला लाइव ट्रेन मूवमेंट और ग्राफ सिस्टम।'
    },
    whyItMatters: {
      en: 'Supplies real train paths to RAILSYNC to calculate and prevent timetable clashes.',
      hi: 'रेलसिंक को वास्तविक ट्रेन समय प्रदान करता है ताकि ट्रेनों से टकराव रोका जा सके।'
    }
  },
  {
    acronym: 'FOIS',
    fullName: {
      en: 'Freight Operations Information System',
      hi: 'मालभाड़ा परिचालन सूचना प्रणाली'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'Indian Railways database tracking all goods rakes, coal rakes, and freight trains.',
      hi: 'सभी मालगाड़ियों और कोयला रेकों की स्थिति और लोडिंग ट्रैक करने वाला सिस्टम।'
    },
    whyItMatters: {
      en: 'Allows RAILSYNC to schedule blocks into freight valleys and loop low-priority rakes safely.',
      hi: 'रेलसिंक को मालगाड़ियों के अंतराल की जानकारी देता है ताकि एक्सप्रेस प्रभावित न हों।'
    }
  },
  {
    acronym: 'Marey Diagram',
    fullName: {
      en: 'Time-Distance String Chart',
      hi: 'समय-दूरी ट्रेन ग्राफ (मारे डायग्राम)'
    },
    category: 'Operations',
    plainEnglish: {
      en: 'A 2D chart: Stations on Y-axis vs Time on X-axis. Slanted lines are moving trains; boxes are track blocks.',
      hi: 'सेक्शन कंट्रोलर का मुख्य ग्राफ: X-अक्ष पर समय और Y-अक्ष पर स्टेशन। ढलान वाली रेखाएं चलती ट्रेनें हैं।'
    },
    whyItMatters: {
      en: 'Where a train line crosses a block box, there is a collision. Our AI ensures zero lines cross!',
      hi: 'जहां ट्रेन की रेखा ब्लॉक बॉक्स से टकराती है, वहां ट्रेन लेट होती है। हमारा AI इसे शून्य करता है!'
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
    act3Subtitle: 'RAILSYNC-ABP Synchronized Plan A',
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
    railsyncOptimized: 'RAILSYNC-ABP (AI Optimized)',
    
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
  }
};
