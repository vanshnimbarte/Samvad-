
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

export const INITIAL_REPORTS: CivicReport[] = [
  {
    id: 'SC-JH-84920',
    titleEn: 'Broken handpump near Ormanjhi Primary School',
    titleHi: 'Broken handpump near Ormanjhi Primary School',
    descriptionEn:
      'The solitary drinking water handpump on school grounds has been leaking sand and non-functional for 3 weeks. 180+ school children and 60 neighborhood households are forced to walk 1.5 km to an open canal for drinking water.',
    descriptionHi:
      'The solitary drinking water handpump on school grounds has been leaking sand and non-functional for 3 weeks. 180+ school children and 60 neighborhood households are forced to walk 1.5 km to an open canal for drinking water.',
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
      name: 'Community Citizen',
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
        captionHi: 'Damaged riser pipe and dry catchment basin',
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
      labelHi: 'Cylinder replacement and deep flushing by mobile borewell rig',
      estimatedDate: '18 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '10 Sep 2026, 09:30 AM',
        titleEn: 'Report Logged',
        titleHi: 'Report Logged',
        descriptionEn: 'Citizen report received via Samadhan Connect mobile app.',
        descriptionHi: 'Citizen report received via Samadhan Connect mobile app.',
        actor: 'Citizen Member',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '11 Sep 2026, 11:15 AM',
        titleEn: 'Details Verified',
        titleHi: 'Details Verified',
        descriptionEn: 'Ormanjhi Block Coordinator inspected handpump serial and validated location.',
        descriptionHi: 'Ormanjhi Block Coordinator inspected handpump serial and validated location.',
        actor: 'Gram Panchayat Coordinator',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '12 Sep 2026, 02:40 PM',
        titleEn: 'Work Order Issued',
        titleHi: 'Work Order Issued',
        descriptionEn: 'Referred to DWSD Ranchi Circle; assigned to Junior Engineer Soren.',
        descriptionHi: 'Referred to DWSD Ranchi Circle; assigned to Junior Engineer Soren.',
        actor: 'Block Development Officer, Ormanjhi',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '13 Sep 2026, 10:00 AM',
        titleEn: 'Repair Team Dispatched',
        titleHi: 'Repair Team Dispatched',
        descriptionEn: 'Mechanical team mobilized with new stainless steel cylinder and GI pipes.',
        descriptionHi: 'Mechanical team mobilized with new stainless steel cylinder and GI pipes.',
        actor: 'DWSD Technical Field Crew',
        completed: true,
        current: true,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming (18 Sep)',
        titleEn: 'Water Quality Testing',
        titleHi: 'Water Quality Testing',
        descriptionEn: 'Field testing kit (FTK) sample collection for fluoride and iron content.',
        descriptionHi: 'Field testing kit (FTK) sample collection for fluoride and iron content.',
        actor: 'District Water Testing Lab',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Public Supply Restored',
        titleHi: 'Public Supply Restored',
        descriptionEn: 'Operational handpump handed over to School Management Committee.',
        descriptionHi: 'Operational handpump handed over to School Management Committee.',
        actor: 'Gram Panchayat Samiti',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Final Community Sign-off',
        titleHi: 'Final Community Sign-off',
        descriptionEn: 'Verification by SHG members and report officially closed.',
        descriptionHi: 'Verification by SHG members and report officially closed.',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [
      {
        id: 'c1',
        author: 'Community Member',
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
    titleHi: 'Flooded village road during monsoon in Angara',
    descriptionEn:
      'Culvert blockage has caused 2.5 feet deep waterlogging across the only road connecting 4 villages (Hesal, Nawagarh, Bedo, Lodhma) to the primary health centre and weekly market.',
    descriptionHi:
      'Culvert blockage has caused 2.5 feet deep waterlogging across the only road connecting 4 villages (Hesal, Nawagarh, Bedo, Lodhma) to the primary health centre and weekly market.',
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
        captionHi: 'Waterlogged culvert approach blocking vehicles',
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
      labelHi: 'Site survey for hume pipe culvert de-silting and emergency earth levelling',
      estimatedDate: '16 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '12 Sep 2026, 04:15 PM',
        titleEn: 'Report Received',
        titleHi: 'Report Received',
        descriptionEn: 'Logged by FPO coordinator with geotagged photo.',
        descriptionHi: 'Logged by FPO coordinator with geotagged photo.',
        actor: 'Rameshwar Mahto',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '13 Sep 2026, 10:45 AM',
        titleEn: 'Urgency Confirmed',
        titleHi: 'Urgency Confirmed',
        descriptionEn: 'Validated as high urgency due to ambulance route obstruction.',
        descriptionHi: 'Validated as high urgency due to ambulance route obstruction.',
        actor: 'Angara Block Coordinator',
        completed: true,
        current: true,
      },
      {
        status: 'Assigned',
        timestamp: 'Pending',
        titleEn: 'Assigning to RWD Ranchi',
        titleHi: 'Assigning to RWD Ranchi',
        descriptionEn: 'Emergency desilting fund allocation being routed.',
        descriptionHi: 'Emergency desilting fund allocation being routed.',
        actor: 'District Magistrate Office',
        completed: false,
      },
      {
        status: 'In Progress',
        timestamp: 'Upcoming',
        titleEn: 'De-silting & Gravelling',
        titleHi: 'De-silting & Gravelling',
        descriptionEn: 'Excavator clearance of blocked culvert mouth.',
        descriptionHi: 'Excavator clearance of blocked culvert mouth.',
        actor: 'RWD Contractor',
        completed: false,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Temporary Cause-way Pass',
        titleHi: 'Temporary Cause-way Pass',
        descriptionEn: 'Testing light vehicle movement after water recession.',
        descriptionHi: 'Testing light vehicle movement after water recession.',
        actor: 'Gram Panchayat Road Committee',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Permanent Concrete Culvert',
        titleHi: 'Permanent Concrete Culvert',
        descriptionEn: 'Reinforced 3-vent RCC culvert constructed.',
        descriptionHi: 'Reinforced 3-vent RCC culvert constructed.',
        actor: 'RWD Jharkhand',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Resolution Verified',
        titleHi: 'Resolution Verified',
        descriptionEn: 'Final handover to Mukhiya and social audit clearance.',
        descriptionHi: 'Final handover to Mukhiya and social audit clearance.',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84922',
    titleEn: 'Missing solar streetlights near CHC Hospital',
    titleHi: 'Missing solar streetlights near CHC Hospital',
    descriptionEn:
      'Dark 600m stretch leading to the Community Health Centre (CHC) has 6 non-functioning solar streetlights for 4 months. Unsafe for pregnant women and emergency patients visiting at night.',
    descriptionHi:
      'Dark 600m stretch leading to the Community Health Centre (CHC) has 6 non-functioning solar streetlights for 4 months. Unsafe for pregnant women and emergency patients visiting at night.',
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
        captionHi: 'Dark hospital approach road with inactive solar pole',
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
      labelHi: 'Battery pack and LED luminaire replacement under Annual Maintenance Contract',
      estimatedDate: '19 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '08 Sep 2026, 08:20 PM',
        titleEn: 'Report Submitted',
        titleHi: 'Report Submitted',
        descriptionEn: 'Report filed by ASHA worker highlighting safety risk for expectant mothers.',
        descriptionHi: 'Report filed by ASHA worker highlighting safety risk for expectant mothers.',
        actor: 'Dr. Anita Tirkey',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '09 Sep 2026, 03:10 PM',
        titleEn: 'Site Verification by Mukhiya',
        titleHi: 'Site Verification by Mukhiya',
        descriptionEn: 'All 6 poles identified with serial numbers and dead lead-acid batteries.',
        descriptionHi: 'All 6 poles identified with serial numbers and dead lead-acid batteries.',
        actor: 'Ward Member & Coordinator',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '11 Sep 2026, 11:30 AM',
        titleEn: 'Forwarded to JREDA Vendor',
        titleHi: 'Forwarded to JREDA Vendor',
        descriptionEn: 'Warranty vendor M/s Surya Tech notified to replace battery assemblies.',
        descriptionHi: 'Warranty vendor M/s Surya Tech notified to replace battery assemblies.',
        actor: 'District Magistrate Palamu',
        completed: true,
        current: true,
      },
      {
        status: 'In Progress',
        timestamp: 'Upcoming',
        titleEn: 'Technician Installation',
        titleHi: 'Technician Installation',
        descriptionEn: 'Replacement of solar controllers and batteries.',
        descriptionHi: 'Replacement of solar controllers and batteries.',
        actor: 'Authorized JREDA Technician',
        completed: false,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Night Lux-Level Audit',
        titleHi: 'Night Lux-Level Audit',
        descriptionEn: 'Measuring illumination across hospital gate for 48 hours.',
        descriptionHi: 'Measuring illumination across hospital gate for 48 hours.',
        actor: 'CHC Medical Superintendent',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Full Illumination Restored',
        titleHi: 'Full Illumination Restored',
        descriptionEn: 'All 6 lights certified functioning dusk-to-dawn.',
        descriptionHi: 'All 6 lights certified functioning dusk-to-dawn.',
        actor: 'Panchayat Samiti Bishrampur',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Signed by CHC Head',
        titleHi: 'Signed by CHC Head',
        descriptionEn: 'Official resolution documented on portal.',
        descriptionHi: 'Official resolution documented on portal.',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84923',
    titleEn: 'Lack of separate girls toilet in Bundu Govt High School',
    titleHi: 'Lack of separate girls toilet in Bundu Govt High School',
    descriptionEn:
      'Existing sanitation block is broken with no running water or privacy doors. 140 adolescent girl students face severe hygiene challenges, causing high absenteeism during menstrual cycles.',
    descriptionHi:
      'Existing sanitation block is broken with no running water or privacy doors. 140 adolescent girl students face severe hygiene challenges, causing high absenteeism during menstrual cycles.',
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
        captionHi: 'New pre-fab modular sanitation block installed during pilot testing',
        fileSizeMb: 1.4,
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      noteEn: 'Before: Dilapidated unhygienic shed. After: 4-stall pre-fab toilet with overhead 1000L tank and incinerator.',
      noteHi: 'Before: Dilapidated unhygienic shed. After: 4-stall pre-fab toilet with overhead 1000L tank and incinerator.',
    },
    responsibleOrg: {
      name: 'Samagra Shiksha Abhiyan & CSR Partner (Tata Steel Foundation)',
      department: 'District Education Office, Ranchi',
      officer: 'District Superintendent of Education',
    },
    nextExpectedAction: {
      labelEn: 'Completion of 14-day community pilot trial and solar pump integration',
      labelHi: 'Completion of 14-day community pilot trial and solar pump integration',
      estimatedDate: '20 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '25 Aug 2026, 11:00 AM',
        titleEn: 'Citizen Grievance Raised',
        titleHi: 'Citizen Grievance Raised',
        descriptionEn: 'Youth club petition submitted with school headmaster support.',
        descriptionHi: 'Youth club petition submitted with school headmaster support.',
        actor: 'Pooja Kumari',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '27 Aug 2026, 02:00 PM',
        titleEn: 'Field Inspection by BEO',
        titleHi: 'Field Inspection by BEO',
        descriptionEn: 'Block Education Officer verified total absence of functional toilets.',
        descriptionHi: 'Block Education Officer verified total absence of functional toilets.',
        actor: 'Block Education Officer',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '30 Aug 2026, 04:30 PM',
        titleEn: 'Fast-track CSR Partner Mobilization',
        titleHi: 'Fast-track CSR Partner Mobilization',
        descriptionEn: 'Tata Steel Foundation Rural Sanitation Cell adopted the project.',
        descriptionHi: 'Tata Steel Foundation Rural Sanitation Cell adopted the project.',
        actor: 'District Magistrate Office',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '03 Sep 2026, 09:00 AM',
        titleEn: 'Foundation & Plumbing Civil Work',
        titleHi: 'Foundation & Plumbing Civil Work',
        descriptionEn: 'Plumbing lines, septic tank, and partition panels erected.',
        descriptionHi: 'Plumbing lines, septic tank, and partition panels erected.',
        actor: 'Civil Construction Team',
        completed: true,
      },
      {
        status: 'Pilot',
        timestamp: '11 Sep 2026, 10:30 AM',
        titleEn: 'Pilot Use & Water Pressure Test',
        titleHi: 'Pilot Use & Water Pressure Test',
        descriptionEn: 'Trial usage initiated with student hygiene committee feedback.',
        descriptionHi: 'Trial usage initiated with student hygiene committee feedback.',
        actor: 'School Hygiene Committee',
        completed: true,
        current: true,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming (22 Sep)',
        titleEn: 'Official Commissioning',
        titleHi: 'Official Commissioning',
        descriptionEn: 'Handover ceremony with permanent maintenance charter.',
        descriptionHi: 'Handover ceremony with permanent maintenance charter.',
        actor: 'DEO Ranchi & CSR Team',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Audit Sign-off',
        titleHi: 'Audit Sign-off',
        descriptionEn: 'Satisfaction survey score >= 90% recorded.',
        descriptionHi: 'Satisfaction survey score >= 90% recorded.',
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
    titleHi: 'Fall Armyworm pest attack on Kharif maize crop',
    descriptionEn:
      'Green larvae eating leaves and whorls across 45 acres of standing maize in 3 hamlets. Over 35 smallholder farmers at risk of losing entire seasonal livelihood without bio-pesticides.',
    descriptionHi:
      'Green larvae eating leaves and whorls across 45 acres of standing maize in 3 hamlets. Over 35 smallholder farmers at risk of losing entire seasonal livelihood without bio-pesticides.',
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
        captionHi: 'Drone-based bio-pesticide spraying deployed across affected fields',
        fileSizeMb: 1.6,
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      noteEn: 'Pest eradication achieved within 96 hours using drone micro-spraying.',
      noteHi: 'Pest eradication achieved within 96 hours using drone micro-spraying.',
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
        titleHi: 'Emergency Alert Logged',
        descriptionEn: 'Kisan Club filed SOS alert with close-up photo of leaf damage.',
        descriptionHi: 'Kisan Club filed SOS alert with close-up photo of leaf damage.',
        actor: 'Babulal Murmu',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '18 Aug 2026, 11:00 AM',
        titleEn: 'KVK Agronomist Visit',
        titleHi: 'KVK Agronomist Visit',
        descriptionEn: 'Field team identified Spodoptera frugiperda infestation.',
        descriptionHi: 'Field team identified Spodoptera frugiperda infestation.',
        actor: 'KVK Entomology Specialist',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '19 Aug 2026, 09:00 AM',
        titleEn: 'Emergency Response Sanctioned',
        titleHi: 'Emergency Response Sanctioned',
        descriptionEn: 'Jharkhand Agri-Tech mission approved subsidized drone squad.',
        descriptionHi: 'Jharkhand Agri-Tech mission approved subsidized drone squad.',
        actor: 'District Agriculture Officer',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '20 Aug 2026, 06:00 AM',
        titleEn: 'Drone Bio-Spraying Mobilized',
        titleHi: 'Drone Bio-Spraying Mobilized',
        descriptionEn: 'Two 16L agricultural drones completed 28 acres on Day 1.',
        descriptionHi: 'Two 16L agricultural drones completed 28 acres on Day 1.',
        actor: 'AgriDrone Service Partner',
        completed: true,
      },
      {
        status: 'Pilot',
        timestamp: '23 Aug 2026, 04:00 PM',
        titleEn: '72-Hour Larvae Count Check',
        titleHi: '72-Hour Larvae Count Check',
        descriptionEn: '94% larval mortality recorded in target zones.',
        descriptionHi: '94% larval mortality recorded in target zones.',
        actor: 'KVK Barhi Research Team',
        completed: true,
      },
      {
        status: 'Deployed',
        timestamp: '27 Aug 2026, 12:00 PM',
        titleEn: 'Full 45 Acres Treated & Saved',
        titleHi: 'Full 45 Acres Treated & Saved',
        descriptionEn: 'Pheromone traps installed around boundary to prevent resurgence.',
        descriptionHi: 'Pheromone traps installed around boundary to prevent resurgence.',
        actor: 'Barhi Farmers Collective',
        completed: true,
        current: true,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming (15 Sep)',
        titleEn: 'Crop Harvest Yield Verification',
        titleHi: 'Crop Harvest Yield Verification',
        descriptionEn: 'Farmers will log final harvest output to archive case.',
        descriptionHi: 'Farmers will log final harvest output to archive case.',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84925',
    titleEn: 'Dangerous broken ramp at Block Development Office',
    titleHi: 'Dangerous broken ramp at Block Development Office',
    descriptionEn:
      'The accessibility ramp outside the welfare window collapsed due to rains. Wheelchair users and elderly citizens applying for old-age pensions cannot enter the office without being physically carried.',
    descriptionHi:
      'The accessibility ramp outside the welfare window collapsed due to rains. Wheelchair users and elderly citizens applying for old-age pensions cannot enter the office without being physically carried.',
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
        captionHi: 'Steep cracked ramp and broken stainless steel handrails',
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
      labelHi: 'Anti-skid tactile tile laying and 1:12 slope ramp curing',
      estimatedDate: '17 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '05 Sep 2026, 10:15 AM',
        titleEn: 'Complaint Submitted',
        titleHi: 'Complaint Submitted',
        descriptionEn: 'Grievance submitted with video of disabled pensioner struggling.',
        descriptionHi: 'Grievance submitted with video of disabled pensioner struggling.',
        actor: 'Mohammad Shahid',
        completed: true,
      },
      {
        status: 'Validated',
        timestamp: '06 Sep 2026, 12:30 PM',
        titleEn: 'Site Inspection by BDO',
        titleHi: 'Site Inspection by BDO',
        descriptionEn: 'Block Development Officer verified safety hazard.',
        descriptionHi: 'Block Development Officer verified safety hazard.',
        actor: 'BDO Govindpur',
        completed: true,
      },
      {
        status: 'Assigned',
        timestamp: '07 Sep 2026, 03:00 PM',
        titleEn: 'Accessible India Funds Sanctioned',
        titleHi: 'Accessible India Funds Sanctioned',
        descriptionEn: 'Special accessibility repair grant allocated.',
        descriptionHi: 'Special accessibility repair grant allocated.',
        actor: 'District Social Welfare Officer',
        completed: true,
      },
      {
        status: 'In Progress',
        timestamp: '10 Sep 2026, 08:30 AM',
        titleEn: 'Reconstruction with Tactile Pavers',
        titleHi: 'Reconstruction with Tactile Pavers',
        descriptionEn: 'Civil contractor demolishing broken debris and laying 1:12 slope.',
        descriptionHi: 'Civil contractor demolishing broken debris and laying 1:12 slope.',
        actor: 'BCD Construction Unit',
        completed: true,
        current: true,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Wheelchair Trial & Community Test',
        titleHi: 'Wheelchair Trial & Community Test',
        descriptionEn: 'Local disabled welfare members will test gradient and grip.',
        descriptionHi: 'Local disabled welfare members will test gradient and grip.',
        actor: 'Divyangjan Adhikar Manch',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Full Accessible Ramp Operational',
        titleHi: 'Full Accessible Ramp Operational',
        descriptionEn: 'Dedicated tactile path from gate to helpdesk.',
        descriptionHi: 'Dedicated tactile path from gate to helpdesk.',
        actor: 'Govindpur Block Office',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Accessibility Certification',
        titleHi: 'Accessibility Certification',
        descriptionEn: 'Sign-off by Disabled Welfare Association.',
        descriptionHi: 'Sign-off by Disabled Welfare Association.',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
  {
    id: 'SC-JH-84926',
    titleEn: 'Irregular garbage dumping and open drain in Harmu',
    titleHi: 'Irregular garbage dumping and open drain in Harmu',
    descriptionEn:
      'Sanitation vehicles have skipped collection for 12 days. Garbage piling up on corner plot next to an open drain, causing foul stench and risk of dengue in densely populated residential lane.',
    descriptionHi:
      'Sanitation vehicles have skipped collection for 12 days. Garbage piling up on corner plot next to an open drain, causing foul stench and risk of dengue in densely populated residential lane.',
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
        captionHi: 'Overflowing dump near residential gate and clogged storm drain',
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
      labelHi: 'Ward sanitation supervisor verification and tipper truck dispatch',
      estimatedDate: '15 Sep 2026',
    },
    timeline: [
      {
        status: 'Received',
        timestamp: '14 Sep 2026, 08:00 AM',
        titleEn: 'Grievance Registered',
        titleHi: 'Grievance Registered',
        descriptionEn: 'Resident Welfare Association uploaded photo with GPS coordinates.',
        descriptionHi: 'Resident Welfare Association uploaded photo with GPS coordinates.',
        actor: 'Vikas Chandra',
        completed: true,
        current: true,
      },
      {
        status: 'Validated',
        timestamp: 'Upcoming (15 Sep)',
        titleEn: 'RMC Ward Inspector Check',
        titleHi: 'RMC Ward Inspector Check',
        descriptionEn: 'Field assessment of waste volume and drainage block.',
        descriptionHi: 'Field assessment of waste volume and drainage block.',
        actor: 'RMC Ward 26 Supervisor',
        completed: false,
      },
      {
        status: 'Assigned',
        timestamp: 'Upcoming',
        titleEn: 'Waste Evacuation Route Order',
        titleHi: 'Waste Evacuation Route Order',
        descriptionEn: 'Designated compactor truck routed for deep cleaning.',
        descriptionHi: 'Designated compactor truck routed for deep cleaning.',
        actor: 'RMC SWM Division',
        completed: false,
      },
      {
        status: 'In Progress',
        timestamp: 'Upcoming',
        titleEn: 'Waste Clearance & Bleaching',
        titleHi: 'Waste Clearance & Bleaching',
        descriptionEn: 'Total removal of trash and disinfectant fogging.',
        descriptionHi: 'Total removal of trash and disinfectant fogging.',
        actor: 'RMC Sanitation Team',
        completed: false,
      },
      {
        status: 'Pilot',
        timestamp: 'Upcoming',
        titleEn: 'Fixed Daily Route Monitoring',
        titleHi: 'Fixed Daily Route Monitoring',
        descriptionEn: 'GPS tracking on door-to-door tipper for 7 days.',
        descriptionHi: 'GPS tracking on door-to-door tipper for 7 days.',
        actor: 'RWA Verification Team',
        completed: false,
      },
      {
        status: 'Deployed',
        timestamp: 'Upcoming',
        titleEn: 'Covered Bin & Regular Service',
        titleHi: 'Covered Bin & Regular Service',
        descriptionEn: 'Placement of 1100L community wheeled bin.',
        descriptionHi: 'Placement of 1100L community wheeled bin.',
        actor: 'RMC & RWA',
        completed: false,
      },
      {
        status: 'Closed',
        timestamp: 'Upcoming',
        titleEn: 'Citizen Feedback Sign-off',
        titleHi: 'Citizen Feedback Sign-off',
        descriptionEn: 'RWA signs completion receipt.',
        descriptionHi: 'RWA signs completion receipt.',
        actor: 'Samadhan Community Lead',
        completed: false,
      },
    ],
    moderatedComments: [],
  },
];

export const INITIAL_NOTIFICATIONS: CivicNotification[] = [
  {
    id: 'n1',
    type: 'report_received',
    reportId: 'SC-JH-84920',
    titleEn: 'Report Received (#SC-JH-84920)',
    titleHi: 'Report Received (#SC-JH-84920)',
    messageEn: 'Your handpump issue in Ormanjhi has been received and assigned tracking ID #SC-JH-84920.',
    messageHi: 'Your handpump issue in Ormanjhi has been received and assigned tracking ID #SC-JH-84920.',
    timestamp: '10 Sep 2026, 09:31 AM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n2',
    type: 'report_validated',
    reportId: 'SC-JH-84920',
    titleEn: 'Report Validated by Coordinator',
    titleHi: 'Report Validated by Coordinator',
    messageEn: 'Ormanjhi Block Coordinator visited the primary school site and verified the issue.',
    messageHi: 'Ormanjhi Block Coordinator visited the primary school site and verified the issue.',
    timestamp: '11 Sep 2026, 11:20 AM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n3',
    type: 'report_assigned',
    reportId: 'SC-JH-84920',
    titleEn: 'Assigned to Drinking Water Dept',
    titleHi: 'Assigned to Drinking Water Dept',
    messageEn: 'Your report has been forwarded to Junior Engineer Soren at DWSD Ranchi Circle.',
    messageHi: 'Your report has been forwarded to Junior Engineer Soren at DWSD Ranchi Circle.',
    timestamp: '12 Sep 2026, 02:45 PM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n4',
    type: 'project_started',
    reportId: 'SC-JH-84920',
    titleEn: 'Field Team Dispatched! (In Progress)',
    titleHi: 'Field Team Dispatched! (In Progress)',
    messageEn: 'A mobile repair rig with GI pipe fittings has been dispatched to Ormanjhi School.',
    messageHi: 'A mobile repair rig with GI pipe fittings has been dispatched to Ormanjhi School.',
    timestamp: '13 Sep 2026, 10:05 AM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84920',
  },
  {
    id: 'n5',
    type: 'info_requested',
    reportId: 'SC-JH-84922',
    titleEn: 'Additional Landmark Requested',
    titleHi: 'Additional Landmark Requested',
    messageEn: 'JREDA technician requested the exact pole number near Bishrampur CHC boundary.',
    messageHi: 'JREDA technician requested the exact pole number near Bishrampur CHC boundary.',
    timestamp: '11 Sep 2026, 01:15 PM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84922',
  },
  {
    id: 'n6',
    type: 'status_updated',
    reportId: 'SC-JH-84921',
    titleEn: 'Road Clearance Escalated to High Priority',
    titleHi: 'Road Clearance Escalated to High Priority',
    messageEn: 'Angara Hesal culvert flooding marked High Urgency due to ambulance obstruction.',
    messageHi: 'Angara Hesal culvert flooding marked High Urgency due to ambulance obstruction.',
    timestamp: '13 Sep 2026, 11:00 AM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84921',
  },
  {
    id: 'n7',
    type: 'pilot_started',
    reportId: 'SC-JH-84923',
    titleEn: 'Community Pilot Testing Underway',
    titleHi: 'Community Pilot Testing Underway',
    messageEn: 'Bundu High School girls toilet block trial started with student committee.',
    messageHi: 'Bundu High School girls toilet block trial started with student committee.',
    timestamp: '11 Sep 2026, 10:35 AM',
    isRead: false,
    actionRoute: '/report-detail?id=SC-JH-84923',
  },
  {
    id: 'n8',
    type: 'solution_deployed',
    reportId: 'SC-JH-84924',
    titleEn: 'Solution Deployed: Maize Crop Protected',
    titleHi: 'Solution Deployed: Maize Crop Protected',
    messageEn: 'Drone bio-spray completed across 45 acres in Barhi; armyworm eliminated.',
    messageHi: 'Drone bio-spray completed across 45 acres in Barhi; armyworm eliminated.',
    timestamp: '27 Aug 2026, 12:15 PM',
    isRead: true,
    actionRoute: '/report-detail?id=SC-JH-84924',
  },
  {
    id: 'n9',
    type: 'success_story',
    titleEn: 'Success: Clean Drinking Water in Tamar',
    titleHi: 'Success: Clean Drinking Water in Tamar',
    messageEn: 'Read how a local SHG report brought a solar mini-water supply plant in 18 days.',
    messageHi: 'Read how a local SHG report brought a solar mini-water supply plant in 18 days.',
    timestamp: '02 Sep 2026, 04:00 PM',
    isRead: true,
    actionRoute: '/public-problem?id=SC-JH-84920',
  },
  {
    id: 'n10',
    type: 'announcement',
    titleEn: 'Jharkhand Monsoon Civic Drive Active',
    titleHi: 'Jharkhand Monsoon Civic Drive Active',
    messageEn: 'Report waterlogging, broken culverts, and vector hazards with fast-track 48h dispatch.',
    messageHi: 'Report waterlogging, broken culverts, and vector hazards with fast-track 48h dispatch.',
    timestamp: '01 Sep 2026, 09:00 AM',
    isRead: true,
  },
];

export const FEATURED_SUCCESS_STORY: SuccessStory = {
  id: 'story-1',
  titleEn: 'Solar Mini-Water Plant Restores Drinking Water to 420 Families',
  titleHi: 'Solar Mini-Water Plant Restores Drinking Water to 420 Families',
  location: 'Ormanjhi Block, Ranchi District',
  category: 'Water & Sanitation',
  summaryEn:
    'For nearly 8 months, families in Chutupalu relied on dried streams due to ground water depletion. Within 18 days of lodging a report on Samadhan Connect, DWSD partnered with an innovation fund to install an automated solar borehole and filtration tap-stand.',
  summaryHi:
    'For nearly 8 months, families in Chutupalu relied on dried streams due to ground water depletion. Within 18 days of lodging a report on Samadhan Connect, DWSD partnered with an innovation fund to install an automated solar borehole and filtration tap-stand.',
  impactEn: '420 Families & 1 School Served (Zero Walk Time)',
  impactHi: '420 Families & 1 School Served (Zero Walk Time)',
  beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
  afterImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  completedDate: '28 Aug 2026',
  beneficiaries: '2,150 Citizens',
  implementingBody: 'DWSD Jharkhand & Gram Panchayat Ormanjhi',
};

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
