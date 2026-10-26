// Mock data for Samadhan Connect: Citizen & Community Mobile Application
// Realistic issues from Jharkhand and Indian rural/semi-urban communities

import { ReportStatus } from '@/constants/samadhan-theme';

export interface ReportLocation {
  district: string;
  block: string;
  villageOrWard: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface TimelineEvent {
  status: ReportStatus;
  timestamp: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  actor: string;
  completed: boolean;
  current?: boolean;
}

export interface CivicReport {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  categoryId: string;
  status: ReportStatus;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  location: ReportLocation;
  submittedAt: string;
  submittedBy: {
    name: string;
    role: string;
    isAnonymous: boolean;
    contactMethod: 'Phone' | 'WhatsApp' | 'In-Person';
  };
  affectedCount: number;
  affectedGroups: string[];
  recurring: boolean;
  supporters: number;
  isUserReport?: boolean;
  media: {
    type: 'image' | 'video';
    url: string;
    captionEn: string;
    captionHi: string;
    fileSizeMb?: number;
  }[];
  beforeAfter?: {
    beforeUrl: string;
    afterUrl: string;
    noteEn: string;
    noteHi: string;
  };
  responsibleOrg?: {
    name: string;
    department: string;
    officer: string;
  };
  nextExpectedAction?: {
    labelEn: string;
    labelHi: string;
    estimatedDate: string;
  };
  timeline: TimelineEvent[];
  moderatedComments: {
    id: string;
    author: string;
    role: string;
    comment: string;
    date: string;
  }[];
}

export interface CivicNotification {
  id: string;
  type:
    | 'report_received'
    | 'report_validated'
    | 'info_requested'
    | 'report_assigned'
    | 'project_started'
    | 'status_updated'
    | 'pilot_started'
    | 'solution_deployed'
    | 'success_story'
    | 'announcement';
  reportId?: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
}

export interface SuccessStory {
  id: string;
  titleEn: string;
  titleHi: string;
  location: string;
  category: string;
  summaryEn: string;
  summaryHi: string;
  impactEn: string;
  impactHi: string;
  beforeImage: string;
  afterImage: string;
  completedDate: string;
  beneficiaries: string;
  implementingBody: string;
}

// 7 Detailed Realistic Community Reports
export const INITIAL_REPORTS: CivicReport[] = [
  {
    id: 'SC-JH-84920',
    titleEn: 'Broken handpump near Ormanjhi Primary School',
    titleHi: 'ओरमांझी प्राथमिक विद्यालय के निकट खराब हैंडपंप',
    descriptionEn:
      'The solitary drinking water handpump on school grounds has been leaking sand and non-functional for 3 weeks. 180+ school children and 60 neighborhood households are forced to walk 1.5 km to an open canal for drinking water.',
    descriptionHi:
      'स्कूल परिसर में एकमात्र पेयजल हैंडपंप 3 सप्ताह से रेत फेंक रहा है और बंद पड़ा है। 180 से अधिक स्कूली बच्चों और 60 पड़ोस के घरों को पीने के पानी के लिए 1.5 किमी दूर नहर पर जाना पड़ रहा है।',
    categoryId: 'water',
    status: 'In Progress',
    urgency: 'high',
    location: {
      district: 'Ranchi',
      block: 'Ormanjhi',
      villageOrWard: 'Chutupalu Panchayat',
      address: 'Near Govt. Middle School, NH-33 junction, Ormanjhi',
      latitude: 23.4789,
      longitude: 85.4789,
    },
    submittedAt: '10 Sep 2026, 09:30 AM',
    submittedBy: {
      name: 'Sunita Devi',
      role: 'Mahila Kalyan SHG Secretary',
      isAnonymous: false,
      contactMethod: 'Phone',
    },
    affectedCount: 240,
    affectedGroups: ['Children', 'Women', 'Entire community'],
    recurring: true,
    supporters: 48,
    isUserReport: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        captionEn: 'Damaged riser pipe and dry catchment basin',
        captionHi: 'क्षतिग्रस्त पाइप और सूखा बेसिन',
        fileSizeMb: 1.2,
      },
    ],
    responsibleOrg: {
      name: 'Drinking Water & Sanitation Dept (DWSD)',
      department: 'Sub-Divisional Office, Ormanjhi',
      officer: 'Er. R. K. Soren (Junior Engineer)',
    },
    nextExpectedAction: {
      labelEn: 'Cylinder replacement and deep flushing by mobile borewell rig',
      labelHi: 'सिलेंडर प्रतिस्थापन और मोबाइल रिग द्वारा गहरी सफाई',
      estimatedDate: '18 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '10 Sep 2026, 09:30 AM',
        titleEn: 'Report Logged',
        titleHi: 'रिपोर्ट दर्ज हुई',
        descriptionEn: 'Citizen report received via Samadhan Connect mobile app.',
        descriptionHi: 'नागरिक द्वारा मोबाइल ऐप के जरिए समस्या दर्ज की गई।',
        actor: 'Citizen Sunita Devi',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '11 Sep 2026, 11:15 AM',
        titleEn: 'Details Verified',
        titleHi: 'विवरण की पुष्टि',
        descriptionEn: 'Ormanjhi Block Coordinator inspected handpump serial and validated location.',
        descriptionHi: 'ओरमांझी प्रखंड समन्वयक द्वारा स्थल निरीक्षण और समस्या की पुष्टि की गई।',
        actor: 'Gram Panchayat Coordinator',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '12 Sep 2026, 02:40 PM',
        titleEn: 'Work Order Issued',
        titleHi: 'कार्य आदेश जारी',
        descriptionEn: 'Referred to DWSD Ranchi Circle; assigned to Junior Engineer Soren.',
        descriptionHi: 'पेयजल एवं स्वच्छता विभाग रांची अंचल को सौंपा गया।',
        actor: 'Block Development Officer, Ormanjhi',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '13 Sep 2026, 10:00 AM',
        titleEn: 'Repair Team Dispatched',
        titleHi: 'मरम्मत दल रवाना',
        descriptionEn: 'Mechanical team mobilized with new stainless steel cylinder and GI pipes.',
        descriptionHi: 'नए सिलेंडर और जीआई पाइप के साथ यांत्रिक दल को रवाना किया गया।',
        actor: 'DWSD Technical Field Crew',
        completed: true,
        current: true,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming (18 Sep)',
        titleEn: 'Water Quality Testing',
        titleHi: 'जल गुणवत्ता परीक्षण',
        descriptionEn: 'Field testing kit (FTK) sample collection for fluoride and iron content.',
        descriptionHi: 'फ्लोराइड और आयरन परीक्षण हेतु नमूना संग्रहण।',
        actor: 'District Water Testing Lab',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Public Supply Restored',
        titleHi: 'पेयजल आपूर्ति बहाल',
        descriptionEn: 'Operational handpump handed over to School Management Committee.',
        descriptionHi: 'हैंडपंप का संचालन विद्यालय प्रबंधन समिति को सौंपा जाएगा।',
        actor: 'Gram Panchayat Samiti',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Final Community Sign-off',
        titleHi: 'अंतिम नागरिक पुष्टि',
        descriptionEn: 'Verification by SHG members and report officially closed.',
        descriptionHi: 'स्वयं सहायता समूह सदस्यों की संतुष्टि के बाद केस बंद होगा।',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [
      {
        id: 'c1',
        author: 'Sunita Devi',
        role: 'Reporter',
        comment: 'Thank you for dispatching the team so quickly! The school children really need this.',
        date: '13 Sep 2026, 11:20 AM',
      },
      {
        id: 'c2',
        author: 'R. K. Soren',
        role: 'Junior Engineer, DWSD',
        comment: 'Parts procured from district store. Our rig will arrive tomorrow morning by 8 AM.',
        date: '13 Sep 2026, 03:45 PM',
      },
    ],
  },
  {
    id: 'SC-JH-84921',
    titleEn: 'Flooded village road during monsoon in Angara',
    titleHi: 'अनगड़ा में मानसून के दौरान जलमग्न मुख्य ग्रामीण सड़क',
    descriptionEn:
      'Culvert blockage has caused 2.5 feet deep waterlogging across the only road connecting 4 villages (Hesal, Nawagarh, Bedo, Lodhma) to the primary health centre and weekly market.',
    descriptionHi:
      'पुलिया जाम होने के कारण 4 गांवों को प्राथमिक स्वास्थ्य केंद्र और साप्ताहिक हाट से जोड़ने वाली एकमात्र सड़क पर 2.5 फीट पानी भर गया है।',
    categoryId: 'roads',
    status: 'Validated',
    urgency: 'high',
    location: {
      district: 'Ranchi',
      block: 'Angara',
      villageOrWard: 'Hesal Village',
      address: 'Main Approach Road near Sub-Health Centre, Hesal',
      latitude: 23.3642,
      longitude: 85.5342,
    },
    submittedAt: '12 Sep 2026, 04:15 PM',
    submittedBy: {
      name: 'Rameshwar Mahto',
      role: 'Farmer Producer Organization Member',
      isAnonymous: false,
      contactMethod: 'Phone',
    },
    affectedCount: 1200,
    affectedGroups: ['Farmers', 'Children', 'Older adults', 'Entire community'],
    recurring: true,
    supporters: 112,
    isUserReport: false,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
        captionEn: 'Waterlogged culvert approach blocking vehicles',
        captionHi: 'जलमग्न सड़क जिस पर वाहन नहीं चल सकते',
        fileSizeMb: 1.8,
      },
    ],
    responsibleOrg: {
      name: 'Rural Development Special Division (RWD)',
      department: 'Rural Works Division, Ranchi',
      officer: 'Executive Engineer RWD',
    },
    nextExpectedAction: {
      labelEn: 'Site survey for hume pipe culvert de-silting and emergency earth levelling',
      labelHi: 'पुलिया की सिल्ट सफाई और आकस्मिक मरम्मत हेतु स्थल सर्वेक्षण',
      estimatedDate: '16 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '12 Sep 2026, 04:15 PM',
        titleEn: 'Report Received',
        titleHi: 'रिपोर्ट प्राप्त हुई',
        descriptionEn: 'Logged by FPO coordinator with geotagged photo.',
        descriptionHi: 'जियोटैग फोटो के साथ एफपीओ सदस्य द्वारा दर्ज।',
        actor: 'Rameshwar Mahto',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '13 Sep 2026, 10:45 AM',
        titleEn: 'Urgency Confirmed',
        titleHi: 'गंभीरता की पुष्टि',
        descriptionEn: 'Validated as high urgency due to ambulance route obstruction.',
        descriptionHi: 'एम्बुलेंस मार्ग अवरुद्ध होने के कारण उच्च प्राथमिकता में सत्यापित।',
        actor: 'Angara Block Coordinator',
        completed: true,
        current: true,
      },
      {
        status: 'Assigned',
        timestamp: 'Pending',
        titleEn: 'Assigning to RWD Ranchi',
        titleHi: 'ग्रामीण कार्य विभाग को आवंटन',
        descriptionEn: 'Emergency desilting fund allocation being routed.',
        descriptionHi: 'आपातकालीन जल निकासी राशि जारी की जा रही है।',
        actor: 'District Magistrate Office',
        completed: false,
      },
      {
        status: 'In Progress',
        timestamp: 'Upcoming',
        titleEn: 'De-silting & Gravelling',
        titleHi: 'सिल्ट सफाई व मुरम भराव',
        descriptionEn: 'Excavator clearance of blocked culvert mouth.',
        descriptionHi: 'जेसीबी से जल निकासी मार्ग की सफाई।',
        actor: 'RWD Contractor',
        completed: false,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Temporary Cause-way Pass',
        titleHi: 'अस्थायी आवागमन मार्ग',
        descriptionEn: 'Testing light vehicle movement after water recession.',
        descriptionHi: 'पानी उतरने के बाद हल्के वाहनों के आवागमन का परीक्षण।',
        actor: 'Gram Panchayat Road Committee',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Permanent Concrete Culvert',
        titleHi: 'स्थायी कंक्रीट पुलिया',
        descriptionEn: 'Reinforced 3-vent RCC culvert constructed.',
        descriptionHi: '3-वेंट आरसीसी पुलिया का निर्माण पूर्ण।',
        actor: 'RWD Jharkhand',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Resolution Verified',
        titleHi: 'समाधान सत्यापित',
        descriptionEn: 'Final handover to Mukhiya and social audit clearance.',
        descriptionHi: 'ग्राम मुखिया को हस्तांतरण एवं सामाजिक अंकेक्षण।',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84922',
    titleEn: 'Missing solar streetlights near CHC Hospital',
    titleHi: 'सीएचसी अस्पताल के पास बंद पड़ी सोलर स्ट्रीटलाइट्स',
    descriptionEn:
      'Dark 600m stretch leading to the Community Health Centre (CHC) has 6 non-functioning solar streetlights for 4 months. Unsafe for pregnant women and emergency patients visiting at night.',
    descriptionHi:
      'सामुदायिक स्वास्थ्य केंद्र की ओर जाने वाले 600 मीटर रास्ते पर 6 सोलर लाइट 4 महीने से बंद हैं। रात में आने वाली गर्भवती महिलाओं और मरीजों के लिए असुरक्षित।',
    categoryId: 'infrastructure',
    status: 'Assigned',
    urgency: 'high',
    location: {
      district: 'Palamu',
      block: 'Bishrampur',
      villageOrWard: 'Ward 4, Hospital Road',
      address: 'Main Approach to Bishrampur CHC, Palamu',
      latitude: 24.1623,
      longitude: 83.9214,
    },
    submittedAt: '08 Sep 2026, 08:20 PM',
    submittedBy: {
      name: 'Dr. Anita Tirkey',
      role: 'Community Health Volunteer (ASHA)',
      isAnonymous: false,
      contactMethod: 'WhatsApp',
    },
    affectedCount: 850,
    affectedGroups: ['Women', 'Older adults', 'Children', 'Entire community'],
    recurring: false,
    supporters: 74,
    isUserReport: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        captionEn: 'Dark hospital approach road with inactive solar pole',
        captionHi: 'अंधेरी सड़क और बंद सोलर लाइट पोल',
        fileSizeMb: 0.9,
      },
    ],
    responsibleOrg: {
      name: 'Jharkhand Renewable Energy Development Agency (JREDA)',
      department: 'District Energy Cell, Medininagar',
      officer: 'Assistant Project Director, JREDA',
    },
    nextExpectedAction: {
      labelEn: 'Battery pack and LED luminaire replacement under Annual Maintenance Contract',
      labelHi: 'एएमसी के तहत नई लीथियम बैटरी और एलईडी लाइट लगाना',
      estimatedDate: '19 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '08 Sep 2026, 08:20 PM',
        titleEn: 'Report Submitted',
        titleHi: 'रिपोर्ट दर्ज',
        descriptionEn: 'Report filed by ASHA worker highlighting safety risk for expectant mothers.',
        descriptionHi: 'आशा कार्यकर्ता द्वारा सुरक्षा जोखिम बताते हुए दर्ज।',
        actor: 'Dr. Anita Tirkey',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '09 Sep 2026, 03:10 PM',
        titleEn: 'Site Verification by Mukhiya',
        titleHi: 'मुखिया द्वारा स्थल सत्यापन',
        descriptionEn: 'All 6 poles identified with serial numbers and dead lead-acid batteries.',
        descriptionHi: 'सभी 6 पोलों की बैटरी खराब होने की पुष्टि हुई।',
        actor: 'Ward Member & Coordinator',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '11 Sep 2026, 11:30 AM',
        titleEn: 'Forwarded to JREDA Vendor',
        titleHi: 'जेरेडा वेंडर को प्रेषित',
        descriptionEn: 'Warranty vendor M/s Surya Tech notified to replace battery assemblies.',
        descriptionHi: 'वारंटी वेंडर को बैटरी बदलने का नोटिस दिया गया।',
        actor: 'District Magistrate Palamu',
        completed: true,
        current: true,
      },
      {
        status: 'In Progress',
        timestamp: 'Upcoming',
        titleEn: 'Technician Installation',
        titleHi: 'तकनीकी संस्थापना',
        descriptionEn: 'Replacement of solar controllers and batteries.',
        descriptionHi: 'नए कंट्रोलर और बैटरी लगाई जाएगी।',
        actor: 'Authorized JREDA Technician',
        completed: false,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Night Lux-Level Audit',
        titleHi: 'रात्रि प्रकाश ऑडिट',
        descriptionEn: 'Measuring illumination across hospital gate for 48 hours.',
        descriptionHi: 'अस्पताल गेट पर 48 घंटे प्रकाश की तीव्रता की जांच।',
        actor: 'CHC Medical Superintendent',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Full Illumination Restored',
        titleHi: 'पूर्ण प्रकाश व्यवस्था बहाल',
        descriptionEn: 'All 6 lights certified functioning dusk-to-dawn.',
        descriptionHi: 'शाम से सुबह तक सभी 6 लाइटें चालू होने का प्रमाणपत्र।',
        actor: 'Panchayat Samiti Bishrampur',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Signed by CHC Head',
        titleHi: 'प्रभारी चिकित्सा पदाधिकारी द्वारा समापन',
        descriptionEn: 'Official resolution documented on portal.',
        descriptionHi: 'पोर्टल पर समाधान दर्ज कर केस बंद।',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84923',
    titleEn: 'Lack of separate girls toilet in Bundu Govt High School',
    titleHi: 'बुंडू राजकीय उच्च विद्यालय में बालिकाओं के लिए पृथक शौचालय का अभाव',
    descriptionEn:
      'Existing sanitation block is broken with no running water or privacy doors. 140 adolescent girl students face severe hygiene challenges, causing high absenteeism during menstrual cycles.',
    descriptionHi:
      'मौजूदा शौचालय ब्लॉक टूटा हुआ है और पानी या दरवाजे की व्यवस्था नहीं है। 140 किशोर छात्राओं को अत्यधिक कठिनाई का सामना करना पड़ रहा है, जिससे उपस्थिति पर असर पड़ रहा है।',
    categoryId: 'sanitation',
    status: 'Pilot',
    urgency: 'high',
    location: {
      district: 'Ranchi',
      block: 'Bundu',
      villageOrWard: 'Ward 2, Bundu Town',
      address: 'Upgraded High School Campus, Bundu, Ranchi',
      latitude: 23.1812,
      longitude: 85.5842,
    },
    submittedAt: '25 Aug 2026, 11:00 AM',
    submittedBy: {
      name: 'Pooja Kumari',
      role: 'Youth Club Leader & Alumna',
      isAnonymous: false,
      contactMethod: 'Phone',
    },
    affectedCount: 140,
    affectedGroups: ['Children', 'Women'],
    recurring: false,
    supporters: 189,
    isUserReport: false,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        captionEn: 'New pre-fab modular sanitation block installed during pilot testing',
        captionHi: 'पायलट परीक्षण में स्थापित नया मॉड्यूलर शौचालय ब्लॉक',
        fileSizeMb: 1.4,
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      noteEn: 'Before: Dilapidated unhygienic shed. After: 4-stall pre-fab toilet with overhead 1000L tank and incinerator.',
      noteHi: 'पहले: जर्जर अस्वास्थ्यकर शेड। बाद में: 1000 लीटर सिंटेक्स टंकी और भस्मीकरण यंत्र युक्त 4-सीटर स्वच्छ शौचालय।',
    },
    responsibleOrg: {
      name: 'Samagra Shiksha Abhiyan & CSR Partner (Tata Steel Foundation)',
      department: 'District Education Office, Ranchi',
      officer: 'District Superintendent of Education',
    },
    nextExpectedAction: {
      labelEn: 'Completion of 14-day community pilot trial and solar pump integration',
      labelHi: '14 दिवसीय सामुदायिक परीक्षण पूर्ण होना व सोलर मोटर चालू करना',
      estimatedDate: '20 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '25 Aug 2026, 11:00 AM',
        titleEn: 'Citizen Grievance Raised',
        titleHi: 'नागरिक शिकायत दर्ज',
        descriptionEn: 'Youth club petition submitted with school headmaster support.',
        descriptionHi: 'प्रधानाध्यापक के सहयोग से युवा क्लब द्वारा याचिका।',
        actor: 'Pooja Kumari',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '27 Aug 2026, 02:00 PM',
        titleEn: 'Field Inspection by BEO',
        titleHi: 'प्रखंड शिक्षा प्रसार पदाधिकारी द्वारा जांच',
        descriptionEn: 'Block Education Officer verified total absence of functional toilets.',
        descriptionHi: 'बीईओ द्वारा शौचालय की अनुपलब्धता की आधिकारिक पुष्टि।',
        actor: 'Block Education Officer',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '30 Aug 2026, 04:30 PM',
        titleEn: 'Fast-track CSR Partner Mobilization',
        titleHi: 'सीएसआर पार्टनर को दायित्व',
        descriptionEn: 'Tata Steel Foundation Rural Sanitation Cell adopted the project.',
        descriptionHi: 'टाटा स्टील फाउंडेशन ने परियोजना निर्माण का बीड़ा उठाया।',
        actor: 'District Magistrate Office',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '03 Sep 2026, 09:00 AM',
        titleEn: 'Foundation & Plumbing Civil Work',
        titleHi: 'नींव व प्लंबिंग निर्माण कार्य',
        descriptionEn: 'Plumbing lines, septic tank, and partition panels erected.',
        descriptionHi: 'सेप्टिक टैंक, पाइपलाइन एवं सेनेटरी फिटिंग का कार्य शुरू।',
        actor: 'Civil Construction Team',
        completed: true,
      },
      {
        status: 'Pilot',
        timestamp: '11 Sep 2026, 10:30 AM',
        titleEn: 'Pilot Use & Water Pressure Test',
        titleHi: 'पायलट उपयोग व जलापूर्ति परीक्षण',
        descriptionEn: 'Trial usage initiated with student hygiene committee feedback.',
        descriptionHi: 'बाल संसद स्वच्छता समिति द्वारा निगरानी व प्रायोगिक उपयोग आरंभ।',
        actor: 'School Hygiene Committee',
        completed: true,
        current: true,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming (22 Sep)',
        titleEn: 'Official Commissioning',
        titleHi: 'आधिकारिक लोकार्पण',
        descriptionEn: 'Handover ceremony with permanent maintenance charter.',
        descriptionHi: 'रखरखाव समझौते के साथ औपचारिक सुपुर्दगी।',
        actor: 'DEO Ranchi & CSR Team',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Audit Sign-off',
        titleHi: 'ऑडिट पुष्टि',
        descriptionEn: 'Satisfaction survey score >= 90% recorded.',
        descriptionHi: 'छात्राओं की संतुष्टि सर्वेक्षण उपरांत रिकॉर्ड बंद।',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [
      {
        id: 'c3',
        author: 'Headmaster B. Singh',
        role: 'School Principal',
        comment: 'Daily attendance has already improved. The solar borewell connection works smoothly.',
        date: '12 Sep 2026, 01:15 PM',
      },
    ],
  },
  {
    id: 'SC-JH-84924',
    titleEn: 'Fall Armyworm pest attack on Kharif maize crop',
    titleHi: 'खरीफ मक्का फसल पर फॉल आर्मीवर्म कीट का प्रकोप',
    descriptionEn:
      'Green larvae eating leaves and whorls across 45 acres of standing maize in 3 hamlets. Over 35 smallholder farmers at risk of losing entire seasonal livelihood without bio-pesticides.',
    descriptionHi:
      '3 टोलों के 45 एकड़ में खड़ी मक्के की फसल पर कीट का भारी हमला। जैविक कीटनाशक व छिड़काव के बिना 35 से अधिक छोटे किसान भारी नुकसान के कगार पर हैं।',
    categoryId: 'agriculture',
    status: 'Deployed',
    urgency: 'emergency',
    location: {
      district: 'Hazaribagh',
      block: 'Barhi',
      villageOrWard: 'Ghorji Panchayat',
      address: 'East Agricultural Fields, Barhi, Hazaribagh',
      latitude: 24.2981,
      longitude: 85.4291,
    },
    submittedAt: '18 Aug 2026, 07:30 AM',
    submittedBy: {
      name: 'Babulal Murmu',
      role: 'Birsa Kisan Club President',
      isAnonymous: false,
      contactMethod: 'Phone',
    },
    affectedCount: 35,
    affectedGroups: ['Farmers', 'Entire community'],
    recurring: false,
    supporters: 240,
    isUserReport: false,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
        captionEn: 'Drone-based bio-pesticide spraying deployed across affected fields',
        captionHi: 'प्रभावित खेतों में ड्रोन द्वारा जैविक कीटनाशक का छिड़काव',
        fileSizeMb: 1.6,
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      noteEn: 'Pest eradication achieved within 96 hours using drone micro-spraying.',
      noteHi: 'ड्रोन आधारित सूक्ष्म छिड़काव से 96 घंटे में कीटों पर पूर्ण नियंत्रण पाया गया।',
    },
    responsibleOrg: {
      name: 'Krishi Vigyan Kendra (KVK) & Birsa Agricultural University',
      department: 'Department of Agriculture & Farmers Welfare, Jharkhand',
      officer: 'Senior Scientist & Head, KVK Barhi',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '18 Aug 2026, 07:30 AM',
        titleEn: 'Emergency Alert Logged',
        titleHi: 'आपातकालीन चेतावनी दर्ज',
        descriptionEn: 'Kisan Club filed SOS alert with close-up photo of leaf damage.',
        descriptionHi: 'किसान क्लब ने कीट के फोटोग्राफ के साथ एसओएस अलर्ट भेजा।',
        actor: 'Babulal Murmu',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '18 Aug 2026, 11:00 AM',
        titleEn: 'KVK Agronomist Visit',
        titleHi: 'केवीके कृषि वैज्ञानिकों का दौरा',
        descriptionEn: 'Field team identified Spodoptera frugiperda infestation.',
        descriptionHi: 'फॉल आर्मीवर्म कीट के प्रकोप की त्वरित वैज्ञानिक पुष्टि।',
        actor: 'KVK Entomology Specialist',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '19 Aug 2026, 09:00 AM',
        titleEn: 'Emergency Response Sanctioned',
        titleHi: 'आपातकालीन कार्रवाई स्वीकृत',
        descriptionEn: 'Jharkhand Agri-Tech mission approved subsidized drone squad.',
        descriptionHi: 'कृषि विभाग ने तुरंत सबसिडीयुक्त ड्रोन स्प्रे दल स्वीकृत किया।',
        actor: 'District Agriculture Officer',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '20 Aug 2026, 06:00 AM',
        titleEn: 'Drone Bio-Spraying Mobilized',
        titleHi: 'ड्रोन स्प्रे दल की तैनाती',
        descriptionEn: 'Two 16L agricultural drones completed 28 acres on Day 1.',
        descriptionHi: 'दो 16 लीटर कृषि ड्रोन द्वारा पहले दिन 28 एकड़ में छिड़काव संपन्न।',
        actor: 'AgriDrone Service Partner',
        completed: true,
      },
      {
        status: 'Pilot',
        timestamp: '23 Aug 2026, 04:00 PM',
        titleEn: '72-Hour Larvae Count Check',
        titleHi: '72 घंटे बाद कीट गणना',
        descriptionEn: '94% larval mortality recorded in target zones.',
        descriptionHi: 'कीटों की संख्या में 94% की भारी गिरावट दर्ज।',
        actor: 'KVK Barhi Research Team',
        completed: true,
      },
      {
        status: 'Deployed',
        timestamp: '27 Aug 2026, 12:00 PM',
        titleEn: 'Full 45 Acres Treated & Saved',
        titleHi: 'संपूर्ण 45 एकड़ फसल सुरक्षित',
        descriptionEn: 'Pheromone traps installed around boundary to prevent resurgence.',
        descriptionHi: 'खेतों की मेड़ों पर फेरोमोन ट्रैप स्थापित किए गए।',
        actor: 'Barhi Farmers Collective',
        completed: true,
        current: true,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming (15 Sep)',
        titleEn: 'Crop Harvest Yield Verification',
        titleHi: 'कटाई व उत्पादन पुष्टि उपरांत क्लोजर',
        descriptionEn: 'Farmers will log final harvest output to archive case.',
        descriptionHi: 'फसल कटाई पर उत्पादन पुष्टि के बाद अंतिम क्लोजर।',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84925',
    titleEn: 'Dangerous broken ramp at Block Development Office',
    titleHi: 'प्रखंड विकास कार्यालय में खतरनाक टूटा हुआ दिव्यांग रैंप',
    descriptionEn:
      'The accessibility ramp outside the welfare window collapsed due to rains. Wheelchair users and elderly citizens applying for old-age pensions cannot enter the office without being physically carried.',
    descriptionHi:
      'कल्याण शाखा के बाहर का रैंप बारिश में ढह गया। वृद्धावस्था पेंशन और दिव्यांग पेंशन के लिए आने वाले वृद्ध व दिव्यांगजन बिना गोद में उठाए अंदर नहीं जा सकते।',
    categoryId: 'accessibility',
    status: 'In Progress',
    urgency: 'high',
    location: {
      district: 'Dhanbad',
      block: 'Govindpur',
      villageOrWard: 'BDO Office Campus',
      address: 'Govindpur Block Office Complex, GT Road, Dhanbad',
      latitude: 23.8341,
      longitude: 86.5182,
    },
    submittedAt: '05 Sep 2026, 10:15 AM',
    submittedBy: {
      name: 'Mohammad Shahid',
      role: 'Divyangjan Adhikar Manch Coordinator',
      isAnonymous: false,
      contactMethod: 'Phone',
    },
    affectedCount: 320,
    affectedGroups: ['People with disabilities', 'Older adults'],
    recurring: false,
    supporters: 96,
    isUserReport: false,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
        captionEn: 'Steep cracked ramp and broken stainless steel handrails',
        captionHi: 'टूटी हुई ढलान और उखड़ी हुई स्टील रेलिंग',
        fileSizeMb: 1.1,
      },
    ],
    responsibleOrg: {
      name: 'Building Construction Department',
      department: 'Sub-Division Govindpur, Dhanbad',
      officer: 'Executive Engineer BCD',
    },
    nextExpectedAction: {
      labelEn: 'Anti-skid tactile tile laying and 1:12 slope ramp curing',
      labelHi: 'एंटी-स्किड टाइल लगाना और 1:12 मानक ढलान का निर्माण पूरा करना',
      estimatedDate: '17 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '05 Sep 2026, 10:15 AM',
        titleEn: 'Complaint Submitted',
        titleHi: 'शिकायत दर्ज',
        descriptionEn: 'Grievance submitted with video of disabled pensioner struggling.',
        descriptionHi: 'दिव्यांग पेंशनभोगी की कठिनाई के वीडियो के साथ शिकायत दर्ज।',
        actor: 'Mohammad Shahid',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '06 Sep 2026, 12:30 PM',
        titleEn: 'Site Inspection by BDO',
        titleHi: 'बीडीओ द्वारा स्थल निरीक्षण',
        descriptionEn: 'Block Development Officer verified safety hazard.',
        descriptionHi: 'बीडीओ ने स्वयं स्थिति देखकर तत्काल निर्माण की अनुशंसा की।',
        actor: 'BDO Govindpur',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '07 Sep 2026, 03:00 PM',
        titleEn: 'Accessible India Funds Sanctioned',
        titleHi: 'सुगम्य भारत निधि से राशि स्वीकृत',
        descriptionEn: 'Special accessibility repair grant allocated.',
        descriptionHi: 'विशेष सुगम्यता मरम्मत राशि जारी।',
        actor: 'District Social Welfare Officer',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '10 Sep 2026, 08:30 AM',
        titleEn: 'Reconstruction with Tactile Pavers',
        titleHi: 'मानक अनुसार नया निर्माण जारी',
        descriptionEn: 'Civil contractor demolishing broken debris and laying 1:12 slope.',
        descriptionHi: 'मलबे को हटाकर मानक ढलान व ग्रैब बार का निर्माण कार्य जारी।',
        actor: 'BCD Construction Unit',
        completed: true,
        current: true,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Wheelchair Trial & Community Test',
        titleHi: 'व्हीलचेयर पर उपयोगकर्ता परीक्षण',
        descriptionEn: 'Local disabled welfare members will test gradient and grip.',
        descriptionHi: 'दिव्यांगजन मंच के सदस्यों द्वारा ढलान व ग्रिप का परीक्षण।',
        actor: 'Divyangjan Adhikar Manch',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Full Accessible Ramp Operational',
        titleHi: 'सुगम्य रैंप चालू',
        descriptionEn: 'Dedicated tactile path from gate to helpdesk.',
        descriptionHi: 'गेट से हेल्पडेस्क तक पूरी तरह से सुगम मार्ग।',
        actor: 'Govindpur Block Office',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Accessibility Certification',
        titleHi: 'सुगम्यता प्रमाणन',
        descriptionEn: 'Sign-off by Disabled Welfare Association.',
        descriptionHi: 'संबंधित संस्था द्वारा संतुष्टि पत्र के बाद क्लोजर।',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84926',
    titleEn: 'Irregular garbage dumping and open drain in Harmu',
    titleHi: 'हरमू आवासीय क्षेत्र में अनियमित कचरा डंपिंग और खुला नाला',
    descriptionEn:
      'Sanitation vehicles have skipped collection for 12 days. Garbage piling up on corner plot next to an open drain, causing foul stench and risk of dengue in densely populated residential lane.',
    descriptionHi:
      'नगर निगम की कचरा गाड़ी 12 दिनों से नहीं आई। खुले नाले के पास कूड़े का ढेर लग गया है, जिससे दुर्गंध और डेंगू का गंभीर खतरा बना हुआ है।',
    categoryId: 'sanitation',
    status: 'Received',
    urgency: 'medium',
    location: {
      district: 'Ranchi',
      block: 'Ranchi Sadar',
      villageOrWard: 'Ward 26, Harmu Housing Colony',
      address: 'Lane 4, Near Community Park, Harmu, Ranchi',
      latitude: 23.3551,
      longitude: 85.3092,
    },
    submittedAt: '14 Sep 2026, 08:00 AM',
    submittedBy: {
      name: 'Vikas Chandra',
      role: 'RWA Joint Secretary',
      isAnonymous: false,
      contactMethod: 'Phone',
    },
    affectedCount: 450,
    affectedGroups: ['Children', 'Older adults', 'Entire community'],
    recurring: true,
    supporters: 31,
    isUserReport: false,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
        captionEn: 'Overflowing dump near residential gate and clogged storm drain',
        captionHi: 'घरों के सामने लगा कचरे का ढेर और रुका हुआ नाला',
        fileSizeMb: 1.3,
      },
    ],
    responsibleOrg: {
      name: 'Ranchi Municipal Corporation (RMC)',
      department: 'Health & Solid Waste Management Section',
      officer: 'City Health Officer, RMC',
    },
    nextExpectedAction: {
      labelEn: 'Ward sanitation supervisor verification and tipper truck dispatch',
      labelHi: 'वार्ड स्वच्छता निरीक्षक द्वारा जांच व टिपर वाहन भेजना',
      estimatedDate: '15 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '14 Sep 2026, 08:00 AM',
        titleEn: 'Grievance Registered',
        titleHi: 'शिकायत पंजीकृत',
        descriptionEn: 'Resident Welfare Association uploaded photo with GPS coordinates.',
        descriptionHi: 'आरडब्ल्यूए द्वारा जियो-टैग फोटो के साथ शिकायत दर्ज की गई।',
        actor: 'Vikas Chandra',
        completed: true,
        current: true,
      },
      {
        status: 'Validated',
        timestamp: 'Upcoming (15 Sep)',
        titleEn: 'RMC Ward Inspector Check',
        titleHi: 'वार्ड निरीक्षक जांच',
        descriptionEn: 'Field assessment of waste volume and drainage block.',
        descriptionHi: 'कचरे की मात्रा और नाली जाम की स्थिति का आकलन।',
        actor: 'RMC Ward 26 Supervisor',
        completed: false,
      },
      {
        status: 'Assigned',
        timestamp: 'Upcoming',
        titleEn: 'Waste Evacuation Route Order',
        titleHi: 'सफाई वाहन निर्देश',
        descriptionEn: 'Designated compactor truck routed for deep cleaning.',
        descriptionHi: 'कचरा उठाने हेतु विशेष वाहन को रूट आबंटित होगा।',
        actor: 'RMC SWM Division',
        completed: false,
      },
      {
        status: 'In Progress',
        timestamp: 'Upcoming',
        titleEn: 'Waste Clearance & Bleaching',
        titleHi: 'कचरा उठाव व ब्लीचिंग छिड़काव',
        descriptionEn: 'Total removal of trash and disinfectant fogging.',
        descriptionHi: 'कचरे का पूर्ण उठाव एवं कीटनाशक पाउडर का छिड़काव।',
        actor: 'RMC Sanitation Team',
        completed: false,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Fixed Daily Route Monitoring',
        titleHi: 'नियमित दैनिक रूट निगरानी',
        descriptionEn: 'GPS tracking on door-to-door tipper for 7 days.',
        descriptionHi: 'डोर-टू-डोर गाड़ी पर 7 दिनों की जीपीएस ट्रैकिंग।',
        actor: 'RWA Verification Team',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Covered Bin & Regular Service',
        titleHi: 'ढक्कनदार डस्टबिन व नियमित सेवा',
        descriptionEn: 'Placement of 1100L community wheeled bin.',
        descriptionHi: 'मोहल्ले में बड़े पहिएदार ढक्कनदार कूड़ेदान की स्थापना।',
        actor: 'RMC & RWA',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Citizen Feedback Sign-off',
        titleHi: 'नागरिक संतुष्टि पुष्टि उपरांत केस बंद',
        descriptionEn: 'RWA signs completion receipt.',
        descriptionHi: 'आरडब्ल्यूए की संतुष्टि पर क्लोजर।',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
];

// 10 Detailed Realistic Civic Notifications
export const INITIAL_NOTIFICATIONS: CivicNotification[] = [
  {
    id: 'n1',
    type: 'report_received',
    reportId: 'SC-JH-84920',
    titleEn: 'Report Received (#SC-JH-84920)',
    titleHi: 'रिपोर्ट प्राप्त हुई (#SC-JH-84920)',
    messageEn: 'Your handpump issue in Ormanjhi has been received and assigned tracking ID #SC-JH-84920.',
    messageHi: 'ओरमांझी के हैंडपंप की रिपोर्ट दर्ज हो गई है। ट्रैकिंग आईडी: #SC-JH-84920।',
    timestamp: '10 Sep 2026, 09:31 AM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n2',
    type: 'report_validated',
    reportId: 'SC-JH-84920',
    titleEn: 'Report Validated by Coordinator',
    titleHi: 'समन्वयक द्वारा रिपोर्ट सत्यापित',
    messageEn: 'Ormanjhi Block Coordinator visited the primary school site and verified the issue.',
    messageHi: 'प्रखंड समन्वयक ने स्थल का दौरा कर समस्या की सत्यता प्रमाणित की है।',
    timestamp: '11 Sep 2026, 11:20 AM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n3',
    type: 'report_assigned',
    reportId: 'SC-JH-84920',
    titleEn: 'Assigned to Drinking Water Dept',
    titleHi: 'पेयजल विभाग को कार्य सौंपा गया',
    messageEn: 'Your report has been forwarded to Junior Engineer Soren at DWSD Ranchi Circle.',
    messageHi: 'आपकी रिपोर्ट कनीय अभियंता आर. के. सोरेन (पेयजल विभाग) को आवंटित कर दी गई है।',
    timestamp: '12 Sep 2026, 02:45 PM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n4',
    type: 'project_started',
    reportId: 'SC-JH-84920',
    titleEn: 'Field Team Dispatched! (In Progress)',
    titleHi: 'मरम्मत दल रवाना हुआ! (प्रगति पर)',
    messageEn: 'A mobile repair rig with GI pipe fittings has been dispatched to Ormanjhi School.',
    messageHi: 'ओरमांझी स्कूल के लिए आवश्यक पाइप व उपकरण लेकर मरम्मत दल निकल चुका है।',
    timestamp: '13 Sep 2026, 10:05 AM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n5',
    type: 'info_requested',
    reportId: 'SC-JH-84922',
    titleEn: 'Additional Landmark Requested',
    titleHi: 'अतिरिक्त स्थल विवरण अपेक्षित',
    messageEn: 'JREDA technician requested the exact pole number near Bishrampur CHC boundary.',
    messageHi: 'सोलर लाइट तकनीशियन ने अस्पताल बाउंड्री के पास पोल संख्या की जानकारी मांगी है।',
    timestamp: '11 Sep 2026, 01:15 PM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84922',
  },
  {
    id: 'n6',
    type: 'status_updated',
    reportId: 'SC-JH-84921',
    titleEn: 'Road Clearance Escalated to High Priority',
    titleHi: 'सड़क जलभराव मामला उच्च प्राथमिकता पर',
    messageEn: 'Angara Hesal culvert flooding marked High Urgency due to ambulance obstruction.',
    messageHi: 'एम्बुलेंस रुकावट के मद्देनजर अनगड़ा पुलिया मामले को उच्च प्राथमिकता दी गई है।',
    timestamp: '13 Sep 2026, 11:00 AM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84921',
  },
  {
    id: 'n7',
    type: 'pilot_started',
    reportId: 'SC-JH-84923',
    titleEn: 'Community Pilot Testing Underway',
    titleHi: 'सामुदायिक पायलट परीक्षण आरंभ',
    messageEn: 'Bundu High School girls toilet block trial started with student committee.',
    messageHi: 'बुंडू विद्यालय में बालिकाओं के नए शौचालय ब्लॉक का प्रायोगिक उपयोग शुरू हो गया है।',
    timestamp: '11 Sep 2026, 10:35 AM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84923',
  },
  {
    id: 'n8',
    type: 'solution_deployed',
    reportId: 'SC-JH-84924',
    titleEn: 'Solution Deployed: Maize Crop Protected',
    titleHi: 'समाधान सफल: मक्के की फसल बची',
    messageEn: 'Drone bio-spray completed across 45 acres in Barhi; armyworm eliminated.',
    messageHi: 'बरही में 45 एकड़ मक्के में ड्रोन छिड़काव पूरा; कीट प्रकोप समाप्त हुआ।',
    timestamp: '27 Aug 2026, 12:15 PM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84924',
  },
  {
    id: 'n9',
    type: 'success_story',
    titleEn: 'Success: Clean Drinking Water in Tamar',
    titleHi: 'सफलता: तमाड़ में 420 परिवारों को शुद्ध जल',
    messageEn: 'Read how a local SHG report brought a solar mini-water supply plant in 18 days.',
    messageHi: 'पढ़ें कैसे एक महिला समूह की रिपोर्ट से 18 दिन में सोलर जलापूर्ति संयंत्र लग सका।',
    timestamp: '02 Sep 2026, 04:00 PM',
    isRead: true,
    actionRoute: '/public-problem?id=SC-JH-84920',
  },
  {
    id: 'n10',
    type: 'announcement',
    titleEn: 'Jharkhand Monsoon Civic Drive Active',
    titleHi: 'झारखंड मानसून विशेष नागरिक अभियान सक्रिय',
    messageEn: 'Report waterlogging, broken culverts, and vector hazards with fast-track 48h dispatch.',
    messageHi: 'जलभराव, टूटी पुलिया व जलजनित रोगों की त्वरित रिपोर्ट दर्ज करें, 48 घंटे में कार्रवाई।',
    timestamp: '01 Sep 2026, 09:00 AM',
    isRead: true,
  },
];

// Success Story Featured on Home Screen
export const FEATURED_SUCCESS_STORY: SuccessStory = {
  id: 'story-1',
  titleEn: 'Solar Mini-Water Plant Restores Drinking Water to 420 Families',
  titleHi: 'सोलर मिनी जल संयंत्र से 420 परिवारों को मिला 24 घंटे स्वच्छ पेयजल',
  location: 'Ormanjhi Block, Ranchi District',
  category: 'Water & Sanitation',
  summaryEn:
    'For nearly 8 months, families in Chutupalu relied on dried streams due to ground water depletion. Within 18 days of lodging a report on Samadhan Connect, DWSD partnered with an innovation fund to install an automated solar borehole and filtration tap-stand.',
  summaryHi:
    'चुतुपालू गांव में 8 महीने से हैंडपंप सूखने के कारण महिलाएं 2 किमी दूर से पानी लाती थीं। समाधान कनेक्ट पर शिकायत के मात्र 18 दिनों में सोलर सबमर्सिबल और 4-नल स्टैंडपोस्ट चालू कर दिया गया।',
  impactEn: '420 Families & 1 School Served (Zero Walk Time)',
  impactHi: '420 परिवार और 1 स्कूल लाभान्वित (पैदल चलने का समय शून्य)',
  beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
  afterImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  completedDate: '28 Aug 2026',
  beneficiaries: '2,150 Citizens',
  implementingBody: 'DWSD Jharkhand & Gram Panchayat Ormanjhi',
};

// Realistic Jharkhand Locations Database
export interface LocationHierarchy {
  district: string;
  blocks: {
    name: string;
    panchayatsOrWards: string[];
  }[];
}

export const JHARKHAND_LOCATIONS: LocationHierarchy[] = [
  {
    district: 'Ranchi',
    blocks: [
      {
        name: 'Ormanjhi',
        panchayatsOrWards: ['Chutupalu', 'Daru', 'Kuchu', 'Irba', 'Chakla', 'Gagari'],
      },
      {
        name: 'Angara',
        panchayatsOrWards: ['Hesal', 'Nawagarh', 'Bedo', 'Rajaulatu', 'Sirka'],
      },
      {
        name: 'Bundu',
        panchayatsOrWards: ['Ward 1 (Station)', 'Ward 2 (School)', 'Humta', 'Barigara'],
      },
      {
        name: 'Ranchi Sadar',
        panchayatsOrWards: ['Harmu Colony', 'Bariatu', 'Morabadi', 'Hatia', 'Kokar'],
      },
      {
        name: 'Kanke',
        panchayatsOrWards: ['Arsande', 'Boreya', 'Sukhurhutu', 'Pithoria'],
      },
    ],
  },
  {
    district: 'Hazaribagh',
    blocks: [
      {
        name: 'Barhi',
        panchayatsOrWards: ['Ghorji', 'Kewal', 'Dhanwar', 'Bhandaro'],
      },
      {
        name: 'Chauparan',
        panchayatsOrWards: ['Tajpur', 'Pandeybara', 'Chauparan Bazar'],
      },
      {
        name: 'Ichak',
        panchayatsOrWards: ['Bhadup', 'Barkatta Mod', 'Kariyatpur'],
      },
    ],
  },
  {
    district: 'Dhanbad',
    blocks: [
      {
        name: 'Govindpur',
        panchayatsOrWards: ['Block Office Area', 'Barwadda', 'Nagarnabi', 'Kaliasole'],
      },
      {
        name: 'Dhanbad Urban',
        panchayatsOrWards: ['Hirapur', 'Bank More', 'Saraidhela', 'Jharia Ward 4'],
      },
      {
        name: 'Nirsa',
        panchayatsOrWards: ['Kumardhubi', 'Mugma', 'Benagoria'],
      },
    ],
  },
  {
    district: 'Palamu',
    blocks: [
      {
        name: 'Bishrampur',
        panchayatsOrWards: ['Hospital Ward 4', 'Rehla', 'Bhandar', 'Pandwa'],
      },
      {
        name: 'Medininagar',
        panchayatsOrWards: ['Town Ward 1', 'Town Ward 2', 'Chiyanki', 'Kewatwali'],
      },
    ],
  },
  {
    district: 'Bokaro',
    blocks: [
      {
        name: 'Chas',
        panchayatsOrWards: ['Chas Ward 5', 'Kura', 'Pindrajora', 'Kalamati'],
      },
      {
        name: 'Bermo',
        panchayatsOrWards: ['Phusro Bazar', 'Bokaro Thermal', 'Dhori'],
      },
    ],
  },
];
