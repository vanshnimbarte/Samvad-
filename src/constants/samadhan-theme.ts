// Design tokens and theme system for Samadhan Connect

export const SamadhanColors = {
  // Brand trust & institutional colors
  primary: '#1E3A8A',        // Deep Navy
  primaryDark: '#0F172A',    // Midnight Charcoal
  primaryLight: '#3B82F6',   // Soft Indigo
  primarySurface: '#EFF6FF', // Ice Blue Tint

  // Community progress & ecological impact
  secondary: '#0D9488',      // Teal
  secondaryDark: '#115E59',  // Deep Teal
  secondaryLight: '#14B8A6', // Bright Teal
  secondarySurface: '#F0FDFA',

  // Action CTA
  action: '#EA580C',         // Warm Orange
  actionHover: '#C2410C',
  actionSurface: '#FFF7ED',

  // Neutral backgrounds & surfaces
  background: '#F8FAFC',     // Light grayish off-white
  surface: '#FFFFFF',        // Card background
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Text colors
  textPrimary: '#0F172A',    // High contrast charcoal (WCAG AAA)
  textSecondary: '#475569',  // Accessible subtext
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  // Status Colors (Strict 7-stage flow)
  status: {
    received: {
      color: '#2563EB',      // Blue
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
    validated: {
      color: '#7C3AED',      // Purple
      bg: '#F5F3FF',
      border: '#DDD6FE',
    },
    assigned: {
      color: '#4F46E5',      // Indigo
      bg: '#EEF2FF',
      border: '#C7D2FE',
    },
    inProgress: {
      color: '#EA580C',      // Orange
      bg: '#FFF7ED',
      border: '#FED7AA',
    },
    pilot: {
      color: '#0D9488',      // Teal
      bg: '#F0FDFA',
      border: '#99F6E4',
    },
    deployed: {
      color: '#16A34A',      // Green
      bg: '#F0FDF4',
      border: '#BBF7D0',
    },
    closed: {
      color: '#64748B',      // Slate Gray
      bg: '#F8FAFC',
      border: '#E2E8F0',
    },
  },

  // Urgency colors
  urgency: {
    low: '#0284C7',
    medium: '#D97706',
    high: '#EA580C',
    emergency: '#DC2626',
  },

  // Network simulation states
  network: {
    online: '#16A34A',
    slow: '#D97706',
    offline: '#DC2626',
    syncing: '#2563EB',
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  floating: {
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
};

// 7 Official Report Statuses
export type ReportStatus =
  | 'Received'
  | 'Validated'
  | 'Assigned'
  | 'In Progress'
  | 'Pilot'
  | 'Deployed'
  | 'Closed';

export interface StatusMeta {
  key: ReportStatus;
  labelEn: string;
  labelHi: string;
  color: string;
  bg: string;
  borderColor: string;
  explanationEn: string;
  explanationHi: string;
  iconName: string;
}

export const REPORT_STATUS_CONFIG: Record<ReportStatus, StatusMeta> = {
  Received: {
    key: 'Received',
    labelEn: 'Received',
    labelHi: 'प्राप्त हुआ',
    color: SamadhanColors.status.received.color,
    bg: SamadhanColors.status.received.bg,
    borderColor: SamadhanColors.status.received.border,
    explanationEn: 'Your report was submitted successfully and logged in our system.',
    explanationHi: 'आपकी रिपोर्ट सफलतापूर्वक दर्ज की गई है।',
    iconName: 'Inbox',
  },
  Validated: {
    key: 'Validated',
    labelEn: 'Validated',
    labelHi: 'सत्यापित',
    color: SamadhanColors.status.validated.color,
    bg: SamadhanColors.status.validated.bg,
    borderColor: SamadhanColors.status.validated.border,
    explanationEn: 'Our community coordinators have reviewed and verified the details.',
    explanationHi: 'सामुदायिक समन्वयकों द्वारा विवरण की पुष्टि कर ली गई है।',
    iconName: 'CheckCircle2',
  },
  Assigned: {
    key: 'Assigned',
    labelEn: 'Assigned',
    labelHi: 'सौंपा गया',
    color: SamadhanColors.status.assigned.color,
    bg: SamadhanColors.status.assigned.bg,
    borderColor: SamadhanColors.status.assigned.border,
    explanationEn: 'The problem has been assigned to the responsible department or partner agency.',
    explanationHi: 'संबंधित विभाग अथवा क्रियान्वयन एजेंसी को सौंपा गया है।',
    iconName: 'UserCheck',
  },
  'In Progress': {
    key: 'In Progress',
    labelEn: 'In Progress',
    labelHi: 'प्रगति पर है',
    color: SamadhanColors.status.inProgress.color,
    bg: SamadhanColors.status.inProgress.bg,
    borderColor: SamadhanColors.status.inProgress.border,
    explanationEn: 'Field team or contractors have initiated action on the ground.',
    explanationHi: 'ज़मीनी स्तर पर समाधान कार्य आरंभ हो चुका है।',
    iconName: 'Wrench',
  },
  Pilot: {
    key: 'Pilot',
    labelEn: 'Pilot Testing',
    labelHi: 'प्रायोगिक परीक्षण',
    color: SamadhanColors.status.pilot.color,
    bg: SamadhanColors.status.pilot.bg,
    borderColor: SamadhanColors.status.pilot.border,
    explanationEn: 'A prototype solution is being tested with local community members.',
    explanationHi: 'समाधान का स्थानीय स्तर पर परीक्षण किया जा रहा है।',
    iconName: 'FlaskConical',
  },
  Deployed: {
    key: 'Deployed',
    labelEn: 'Deployed',
    labelHi: 'लागू किया गया',
    color: SamadhanColors.status.deployed.color,
    bg: SamadhanColors.status.deployed.bg,
    borderColor: SamadhanColors.status.deployed.border,
    explanationEn: 'The solution has been fully installed, repaired, or implemented.',
    explanationHi: 'समस्या का स्थायी समाधान पूर्ण रूप से स्थापित कर दिया गया है।',
    iconName: 'CheckCheck',
  },
  Closed: {
    key: 'Closed',
    labelEn: 'Closed',
    labelHi: 'समाप्त / बंद',
    color: SamadhanColors.status.closed.color,
    bg: SamadhanColors.status.closed.bg,
    borderColor: SamadhanColors.status.closed.border,
    explanationEn: 'Resolution verified and officially signed off with community feedback.',
    explanationHi: 'नागरिक संतुष्टि पुष्टि के बाद केस आधिकारिक रूप से बंद किया गया।',
    iconName: 'Archive',
  },
};

export const STATUS_STEPS: ReportStatus[] = [
  'Received',
  'Validated',
  'Assigned',
  'In Progress',
  'Pilot',
  'Deployed',
  'Closed',
];

// 12 Required Problem Categories
export interface CivicCategory {
  id: string;
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  iconName: string;
  color: string;
  badgeBg: string;
}

export const CIVIC_CATEGORIES: CivicCategory[] = [
  {
    id: 'education',
    nameEn: 'Education',
    nameHi: 'Education',
    descriptionEn: 'Schools, teachers, classrooms, books, uniforms',
    iconName: 'GraduationCap',
    color: '#7C3AED',
    badgeBg: '#F5F3FF',
  },
  {
    id: 'health',
    nameEn: 'Health',
    nameHi: 'Health',
    descriptionEn: 'Clinics, medicines, doctors, ambulances',
    iconName: 'HeartPulse',
    color: '#DC2626',
    badgeBg: '#FEF2F2',
  },
  {
    id: 'water',
    nameEn: 'Water',
    nameHi: 'Water',
    descriptionEn: 'Handpumps, piped supply, borewells, clean water',
    iconName: 'Droplet',
    color: '#0284C7',
    badgeBg: '#F0F9FF',
  },
  {
    id: 'agriculture',
    nameEn: 'Agriculture',
    nameHi: 'Agriculture',
    descriptionEn: 'Crops, irrigation, seeds, fertilizers, market',
    iconName: 'Sprout',
    color: '#16A34A',
    badgeBg: '#F0FDF4',
  },
  {
    id: 'sanitation',
    nameEn: 'Sanitation',
    nameHi: 'Sanitation',
    descriptionEn: 'Toilets, open drainage, waste collection',
    iconName: 'Trash2',
    color: '#D97706',
    badgeBg: '#FFFBEB',
  },
  {
    id: 'roads',
    nameEn: 'Roads & Transport',
    nameHi: 'Roads & Transport',
    descriptionEn: 'Potholes, bridges, bus stops, flooded streets',
    iconName: 'Navigation',
    color: '#475569',
    badgeBg: '#F1F5F9',
  },
  {
    id: 'environment',
    nameEn: 'Environment',
    nameHi: 'Environment',
    descriptionEn: 'Pollution, tree felling, forest fires, wildlife',
    iconName: 'Trees',
    color: '#059669',
    badgeBg: '#ECFDF5',
  },
  {
    id: 'accessibility',
    nameEn: 'Accessibility',
    nameHi: 'Accessibility',
    descriptionEn: 'Ramps, tactile paths, wheelchair access',
    iconName: 'Accessibility',
    color: '#0D9488',
    badgeBg: '#F0FDFA',
  },
  {
    id: 'women-child',
    nameEn: 'Women & Child Welfare',
    nameHi: 'Women & Child Welfare',
    descriptionEn: 'Anganwadi, nutrition, safe spaces, mother care',
    iconName: 'Users',
    color: '#E11D48',
    badgeBg: '#FFF1F2',
  },
  {
    id: 'digital-services',
    nameEn: 'Digital Services',
    nameHi: 'Digital Services',
    descriptionEn: 'CSC centers, ration card portal, certificates',
    iconName: 'Laptop',
    color: '#2563EB',
    badgeBg: '#EFF6FF',
  },
  {
    id: 'infrastructure',
    nameEn: 'Public Infrastructure',
    nameHi: 'Public Infrastructure',
    descriptionEn: 'Streetlights, community halls, electricity poles',
    iconName: 'Building2',
    color: '#B45309',
    badgeBg: '#FEF3C7',
  },
  {
    id: 'other',
    nameEn: 'Other Community Issues',
    nameHi: 'Other Community Issues',
    descriptionEn: 'General neighborhood & livelihood concerns',
    iconName: 'HelpCircle',
    color: '#64748B',
    badgeBg: '#F8FAFC',
  },
];

// Translations Dictionary
export type ChallengeStageKey =
  | 'Submitted'
  | 'Under Review'
  | 'Validated'
  | 'Assigned'
  | 'In Progress'
  | 'Pilot Testing'
  | 'Deployed';

export const CHALLENGE_STAGE_CONFIG: Record<
  ChallengeStageKey,
  { labelEn: string; labelHi: string; color: string; bg: string; border: string }
> = {
  Submitted: { labelEn: 'Submitted', labelHi: 'Submitted', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  'Under Review': { labelEn: 'AI Review', labelHi: 'AI Review', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  Validated: { labelEn: 'Validated', labelHi: 'Validated', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
  Assigned: { labelEn: 'Assigned to HEI', labelHi: 'Assigned to HEI', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
  'In Progress': { labelEn: 'In Progress', labelHi: 'In Progress', color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
  'Pilot Testing': { labelEn: 'Pilot', labelHi: 'Pilot', color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  Deployed: { labelEn: 'Deployed', labelHi: 'Deployed', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
};

const ENGLISH_STRINGS = {
  appName: 'Samvad',
  appTagline: 'Jharkhand Societal Innovation Portal',
  greeting: 'Hello',
  reportProblem: 'Submit a Challenge',
  reportProblemFast: 'Submit in <3 Minutes',
  heroTitle: 'Turn local challenges into solutions',
  heroDesc: 'Citizens raise problems. Universities build solutions. Industry helps deploy them across Jharkhand.',
  trackReport: 'Track Status',
  myReports: 'My Reports',
  exploreProblems: 'Explore',
  notifications: 'Notifications',
  profile: 'Profile',
  savedDrafts: 'Saved Drafts',
  getHelp: 'Get Help',
  nearbyProblems: 'Nearby Community Problems',
  impactSummary: 'Impact Created Together',
  reportsSubmitted: 'Reports Filed',
  problemsResolved: 'Resolved',
  peopleSupported: 'People Impacted',
  successStories: 'Community Success Stories',
  readStory: 'Read Full Story',
  searchPlaceholder: 'Search reports by title, village, ward...',
  filter: 'Filter',
  allCategories: 'All Categories',
  allStatuses: 'All Statuses',
  support: 'Support Issue',
  supported: 'Supported',
  share: 'Share',
  offlineBannerTitle: 'Offline Mode Active',
  offlineBannerDesc: 'Drafts will be saved safely on this device and synced when connected.',
  slowNetworkNotice: 'Slow connection detected. Data-saving mode active.',
  syncNow: 'Sync Now',
  pendingUploads: 'pending in queue',
  step: 'Step',
  of: 'of',
  next: 'Continue',
  back: 'Back',
  cancel: 'Cancel',
  saveDraft: 'Save as Draft',
  submitReport: 'Submit Report',
  anonymousReport: 'Submit Anonymously',
  anonymousNote: 'Your name and contact details will not be visible publicly.',
};

export const TRANSLATIONS = {
  en: ENGLISH_STRINGS,
  hi: ENGLISH_STRINGS,
};
