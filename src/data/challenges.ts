// ─────────────────────────────────────────────────────────────────────────────
// Samvad — Societal Innovation Collaboration Portal
// Centralized Challenge Data & TypeScript Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type ChallengeStage =
  | 'Submitted'
  | 'Under Review'
  | 'Validated'
  | 'Assigned'
  | 'In Progress'
  | 'Pilot Testing'
  | 'Deployed';

export type ChallengeUrgency = 'Low' | 'Medium' | 'High' | 'Critical';
export type SubmitterType = 'Citizen' | 'Community Org' | 'PRI' | 'ULB' | 'Govt Dept';
export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ChallengeDomain =
  | 'Water & Sanitation'
  | 'Roads & Transport'
  | 'Agriculture & Farming'
  | 'Healthcare'
  | 'Education'
  | 'Electricity & Energy'
  | 'Environment'
  | 'Rural Livelihoods'
  | 'Urban Infrastructure'
  | 'Public Services';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface UniversityAssignment {
  heiId: string;
  heiName: string;
  heiShortName: string;
  facultyLead: string;
  teamSize: number;
  disciplines: string[];
  proposalSubmitted: boolean;
}

export interface IndustryPartner {
  partnerId: string;
  companyName: string;
  type: 'CSR' | 'MSME' | 'Startup' | 'Research Lab' | 'Innovation Hub';
  contributionType: ('Funding' | 'Mentoring' | 'Prototyping' | 'Pilot Testing' | 'Tech Transfer')[];
  fundingAmount?: string;
}

export interface Challenge {
  id: string;
  title: string;
  domain: ChallengeDomain;
  domainIcon: string;
  domainColor: string;
  district: string;
  location: string;
  description: string;
  stage: ChallengeStage;
  urgency: ChallengeUrgency;
  impactLevel: ImpactLevel;
  submitterType: SubmitterType;
  submittedBy: string;
  submittedAt: string;
  timeAgo: string;
  beneficiaries: number;
  upvotes: number;
  comments: number;
  photoCount: number;
  aiTags: string[];
  milestones: Milestone[];
  assignedUniversity?: UniversityAssignment;
  industryPartner?: IndustryPartner;
  progressPercent: number;
  imageUrl?: string;
  requiredSkills?: string[];
  fundingAvailable?: string;
  applications?: number;
  deadline?: string;
  department?: string;
  aiConfidence?: number;
  similarChallengeIds?: string[];
  expectedSolution?: string;
  teamMembers?: { name: string; role: string; discipline: string }[];
  commentsFeed?: { id: string; author: string; role: string; text: string; at: string }[];
  isUserChallenge?: boolean;
}

export const DOMAIN_EVIDENCE_IMAGES: Record<ChallengeDomain, string> = {
  'Water & Sanitation': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=80',
  'Roads & Transport': 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=1200&q=80',
  'Agriculture & Farming': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
  Healthcare: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
  Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
  'Electricity & Energy': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
  Environment: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=80',
  'Rural Livelihoods': 'https://images.unsplash.com/photo-1452865560743-4c0de115da59?auto=format&fit=crop&w=1200&q=80',
  'Urban Infrastructure': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
  'Public Services': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
};

export const DOMAIN_SKILLS: Record<ChallengeDomain, string[]> = {
  'Water & Sanitation': ['IoT', 'Water testing', 'Environmental engg', 'Public health'],
  'Roads & Transport': ['Civil engg', 'GIS', 'Low-cost materials', 'Surveying'],
  'Agriculture & Farming': ['Soil science', 'Agronomy', 'Data analytics', 'Extension'],
  Healthcare: ['Telemedicine', 'Mobile UX', 'Public health', 'Connectivity'],
  Education: ['EdTech', 'Offline apps', 'HCI', 'Teacher training'],
  'Electricity & Energy': ['Solar', 'Microgrids', 'Electrical engg', 'Community ops'],
  Environment: ['AQI sensors', 'Dust control', 'Env law', 'IoT'],
  'Rural Livelihoods': ['E-commerce', 'HCI', 'Logistics', 'Social enterprise'],
  'Urban Infrastructure': ['Waste systems', 'Biogas', 'Civil engg', 'ULB ops'],
  'Public Services': ['e-Governance', 'Process design', 'CS', 'Law'],
};

export const DOMAIN_DEPARTMENTS: Record<ChallengeDomain, string> = {
  'Water & Sanitation': 'Water Resources / PHED',
  'Roads & Transport': 'Rural Works / Road Construction',
  'Agriculture & Farming': 'Agriculture, Animal Husbandry & Co-op',
  Healthcare: 'Health, Medical Education & Family Welfare',
  Education: 'School Education & Literacy',
  'Electricity & Energy': 'Energy / JREDA',
  Environment: 'Forest, Environment & Climate Change',
  'Rural Livelihoods': 'Rural Development / JSLPS',
  'Urban Infrastructure': 'Urban Development & Housing',
  'Public Services': 'IT & e-Governance / District Admin',
};

export function getChallengeImage(challenge: Challenge) {
  return challenge.imageUrl || DOMAIN_EVIDENCE_IMAGES[challenge.domain];
}

export function enrichChallenge(challenge: Challenge, all: Challenge[]): Challenge {
  const similar = all
    .filter((other) => other.id !== challenge.id && other.domain === challenge.domain && other.district === challenge.district)
    .map((other) => other.id);
  const sameDomain = all.filter((other) => other.id !== challenge.id && other.domain === challenge.domain).map((other) => other.id);

  return {
    ...challenge,
    imageUrl: challenge.imageUrl || DOMAIN_EVIDENCE_IMAGES[challenge.domain],
    requiredSkills: challenge.requiredSkills || DOMAIN_SKILLS[challenge.domain],
    department: challenge.department || DOMAIN_DEPARTMENTS[challenge.domain],
    fundingAvailable: challenge.fundingAvailable || challenge.industryPartner?.fundingAmount || (challenge.urgency === 'Critical' ? '₹2,00,000' : '₹1,20,000'),
    applications: challenge.applications ?? Math.max(4, Math.round(challenge.upvotes / 8)),
    deadline: challenge.deadline || '15 Oct 2026',
    aiConfidence: challenge.aiConfidence ?? (challenge.stage === 'Submitted' ? 71 : 86 + (challenge.id.charCodeAt(challenge.id.length - 1) % 10)),
    similarChallengeIds: challenge.similarChallengeIds || (similar.length ? similar : sameDomain.slice(0, 2)),
    expectedSolution: challenge.expectedSolution || `Technological or process solution in ${challenge.domain.toLowerCase()} that can be piloted in ${challenge.district}.`,
    teamMembers: challenge.teamMembers || (challenge.assignedUniversity
      ? [
          { name: challenge.assignedUniversity.facultyLead, role: 'Faculty mentor', discipline: challenge.assignedUniversity.disciplines[0] },
          { name: 'Student lead', role: 'Team captain', discipline: challenge.assignedUniversity.disciplines[1] || 'Multidisciplinary' },
        ]
      : []),
    commentsFeed: challenge.commentsFeed || [
      { id: `${challenge.id}-c1`, author: challenge.submittedBy, role: challenge.submitterType, text: 'Community members confirmed this is still unresolved on the ground.', at: challenge.timeAgo },
    ],
  };
}

export function enrichChallenges(list: Challenge[]) {
  return list.map((item) => enrichChallenge(item, list));
}

export const CHALLENGE_DOMAIN_COLORS: Record<ChallengeDomain, string> = {
  'Water & Sanitation': '#0284c7',
  'Roads & Transport': '#475569',
  'Agriculture & Farming': '#16a34a',
  'Healthcare': '#dc2626',
  'Education': '#9333ea',
  'Electricity & Energy': '#f59e0b',
  'Environment': '#059669',
  'Rural Livelihoods': '#c2410c',
  'Urban Infrastructure': '#0891b2',
  'Public Services': '#7c3aed',
};

export const CHALLENGE_DOMAIN_ICONS: Record<ChallengeDomain, string> = {
  'Water & Sanitation': '💧',
  'Roads & Transport': '🛣️',
  'Agriculture & Farming': '🌾',
  'Healthcare': '🏥',
  'Education': '📚',
  'Electricity & Energy': '⚡',
  'Environment': '🌿',
  'Rural Livelihoods': '🏡',
  'Urban Infrastructure': '🏗️',
  'Public Services': '🏛️',
};

export const CHALLENGES_DATA: Challenge[] = [
  {
    id: 'SMV-2024-001',
    title: 'Contaminated groundwater affecting 3 villages in Khunti district',
    domain: 'Water & Sanitation',
    domainIcon: '💧',
    domainColor: '#0284c7',
    district: 'Khunti',
    location: 'Torpa Block, Khunti',
    description:
      'Three villages — Karandih, Bero, and Namkum — have been reporting elevated fluoride and arsenic levels in their borewells since June 2024. Over 2,400 residents are dependent on these borewells. Children are showing early signs of dental fluorosis. No alternative water source is currently available within 5 km radius.',
    stage: 'In Progress',
    urgency: 'Critical',
    impactLevel: 'Critical',
    submitterType: 'PRI',
    submittedBy: 'Torpa Panchayat Samiti',
    submittedAt: '2024-07-15',
    timeAgo: '2 months ago',
    beneficiaries: 2400,
    upvotes: 148,
    comments: 34,
    photoCount: 7,
    aiTags: ['Groundwater Contamination', 'Fluoride', 'Rural Water Supply', 'Public Health'],
    milestones: [
      { id: 'm1', title: 'Water quality testing & lab report', dueDate: '2024-08-01', completed: true, completedDate: '2024-07-28' },
      { id: 'm2', title: 'Solution proposal submission by BIT Mesra', dueDate: '2024-08-20', completed: true, completedDate: '2024-08-18' },
      { id: 'm3', title: 'Prototype low-cost filtration unit', dueDate: '2024-09-30', completed: false },
      { id: 'm4', title: 'Pilot deployment in Karandih village', dueDate: '2024-11-15', completed: false },
    ],
    assignedUniversity: {
      heiId: 'BIT-MESRA',
      heiName: 'Birsa Institute of Technology, Mesra',
      heiShortName: 'BIT Mesra',
      facultyLead: 'Dr. Anjali Singh (Env. Engineering)',
      teamSize: 8,
      disciplines: ['Environmental Engineering', 'Chemistry', 'Public Health'],
      proposalSubmitted: true,
    },
    industryPartner: {
      partnerId: 'TATA-CSR',
      companyName: 'Tata Steel Foundation',
      type: 'CSR',
      contributionType: ['Funding', 'Prototyping'],
      fundingAmount: '₹12 Lakhs',
    },
    progressPercent: 55,
  },
  {
    id: 'SMV-2024-002',
    title: 'Soil degradation reducing crop yield by 40% in Palamu district',
    domain: 'Agriculture & Farming',
    domainIcon: '🌾',
    domainColor: '#16a34a',
    district: 'Palamu',
    location: 'Medininagar, Palamu',
    description:
      'Over 1,200 small and marginal farmers in Palamu district report consistent yield decline over 3 years due to progressive soil acidification and organic matter loss. Traditional practices are no longer effective. Farmers lack access to soil testing and organic amendment advisory services.',
    stage: 'Assigned',
    urgency: 'High',
    impactLevel: 'High',
    submitterType: 'Community Org',
    submittedBy: 'Kisaan Vikas Samiti, Palamu',
    submittedAt: '2024-08-10',
    timeAgo: '1 month ago',
    beneficiaries: 1200,
    upvotes: 93,
    comments: 21,
    photoCount: 5,
    aiTags: ['Soil Health', 'Organic Farming', 'Crop Yield', 'Small Farmers'],
    milestones: [
      { id: 'm1', title: 'Soil sampling & analysis across 10 zones', dueDate: '2024-09-15', completed: true, completedDate: '2024-09-12' },
      { id: 'm2', title: 'AI-based soil health recommendation system design', dueDate: '2024-10-30', completed: false },
      { id: 'm3', title: 'Farmer training workshops (batch 1)', dueDate: '2024-11-30', completed: false },
    ],
    assignedUniversity: {
      heiId: 'BASU',
      heiName: 'Birsa Agricultural University',
      heiShortName: 'BAU Ranchi',
      facultyLead: 'Dr. Ramesh Oraon (Soil Science)',
      teamSize: 6,
      disciplines: ['Soil Science', 'Agronomy', 'Extension Education'],
      proposalSubmitted: true,
    },
    industryPartner: {
      partnerId: 'ITC-AGRI',
      companyName: 'ITC Limited — Agribusiness',
      type: 'CSR',
      contributionType: ['Mentoring', 'Pilot Testing'],
      fundingAmount: '₹8 Lakhs',
    },
    progressPercent: 30,
  },
  {
    id: 'SMV-2024-003',
    title: 'Lack of telemedicine infrastructure in 28 remote health sub-centres',
    domain: 'Healthcare',
    domainIcon: '🏥',
    domainColor: '#dc2626',
    district: 'West Singhbhum',
    location: 'Chakradharpur Block, West Singhbhum',
    description:
      'Remote tribal areas of West Singhbhum have 28 health sub-centres with basic ANM-level staff but no specialist access. Maternal and infant mortality remains high. Patients travel 60–80 km to reach Chaibasa district hospital. A low-bandwidth telemedicine system integrated with ASHA workers could dramatically improve outcomes.',
    stage: 'In Progress',
    urgency: 'Critical',
    impactLevel: 'Critical',
    submitterType: 'Govt Dept',
    submittedBy: 'Jharkhand Health Dept., District Cell',
    submittedAt: '2024-06-20',
    timeAgo: '3 months ago',
    beneficiaries: 45000,
    upvotes: 211,
    comments: 58,
    photoCount: 4,
    aiTags: ['Telemedicine', 'Rural Healthcare', 'ASHA Network', 'Maternal Health'],
    milestones: [
      { id: 'm1', title: 'Connectivity feasibility study (VSAT/4G)', dueDate: '2024-07-20', completed: true, completedDate: '2024-07-18' },
      { id: 'm2', title: 'UI/UX design for ASHA-facing mobile app', dueDate: '2024-08-15', completed: true, completedDate: '2024-08-20' },
      { id: 'm3', title: 'Beta deployment at 5 pilot sub-centres', dueDate: '2024-10-01', completed: false },
      { id: 'm4', title: 'Doctor onboarding & ASHA training', dueDate: '2024-10-31', completed: false },
      { id: 'm5', title: 'Full rollout to all 28 sub-centres', dueDate: '2025-01-31', completed: false },
    ],
    assignedUniversity: {
      heiId: 'XAVIER',
      heiName: 'Xavier Institute of Social Service',
      heiShortName: 'XISS Ranchi',
      facultyLead: 'Fr. Dr. Thomas Kujur (Public Health)',
      teamSize: 12,
      disciplines: ['Public Health', 'Information Technology', 'Social Work'],
      proposalSubmitted: true,
    },
    industryPartner: {
      partnerId: 'JSSPDC',
      companyName: 'Wipro Foundation',
      type: 'CSR',
      contributionType: ['Funding', 'Tech Transfer', 'Mentoring'],
      fundingAmount: '₹35 Lakhs',
    },
    progressPercent: 42,
  },
  {
    id: 'SMV-2024-004',
    title: 'Digital literacy gap preventing tribal students from accessing online education',
    domain: 'Education',
    domainIcon: '📚',
    domainColor: '#9333ea',
    district: 'Dumka',
    location: 'Jama Block, Dumka',
    description:
      'Over 8,000 students in grades 6–12 across 45 government schools in Dumka have smartphones but lack digital skills to access DIKSHA, e-Pathshala, and other government e-learning portals. Teachers also lack confidence in digital pedagogy. Offline-capable learning tools designed for low-bandwidth are urgently needed.',
    stage: 'Pilot Testing',
    urgency: 'High',
    impactLevel: 'High',
    submitterType: 'Govt Dept',
    submittedBy: 'Jharkhand Education Project Council',
    submittedAt: '2024-05-01',
    timeAgo: '4 months ago',
    beneficiaries: 8000,
    upvotes: 178,
    comments: 42,
    photoCount: 9,
    aiTags: ['Digital Literacy', 'EdTech', 'Tribal Education', 'Offline Learning'],
    milestones: [
      { id: 'm1', title: 'Baseline digital literacy assessment', dueDate: '2024-06-01', completed: true, completedDate: '2024-05-28' },
      { id: 'm2', title: 'Offline app prototype (Android)', dueDate: '2024-07-15', completed: true, completedDate: '2024-07-10' },
      { id: 'm3', title: 'Teacher training program (Batch 1 — 120 teachers)', dueDate: '2024-08-30', completed: true, completedDate: '2024-08-25' },
      { id: 'm4', title: 'Pilot in 10 schools — student feedback', dueDate: '2024-10-15', completed: false },
      { id: 'm5', title: 'Scale to all 45 schools', dueDate: '2025-02-28', completed: false },
    ],
    assignedUniversity: {
      heiId: 'NIT-JKD',
      heiName: 'National Institute of Technology, Jamshedpur',
      heiShortName: 'NIT Jamshedpur',
      facultyLead: 'Dr. Priya Sharma (Computer Science)',
      teamSize: 10,
      disciplines: ['Computer Science', 'HCI', 'Education Technology'],
      proposalSubmitted: true,
    },
    industryPartner: {
      partnerId: 'GOOGLE-EDU',
      companyName: 'Google.org',
      type: 'Innovation Hub',
      contributionType: ['Funding', 'Tech Transfer'],
      fundingAmount: '₹50 Lakhs',
    },
    progressPercent: 68,
  },
  {
    id: 'SMV-2024-005',
    title: 'Unregulated stone quarry dust causing respiratory illness in 4 villages',
    domain: 'Environment',
    domainIcon: '🌿',
    domainColor: '#059669',
    district: 'Hazaribagh',
    location: 'Barhi Block, Hazaribagh',
    description:
      'Silica dust from 6 unregulated stone quarries in Barhi has caused a sharp rise in silicosis and chronic respiratory disease. PM2.5 levels measured at 3× permissible limits. Around 1,800 quarry workers and 4,000 nearby residents are affected. Dust suppression technology and real-time AQI monitoring are urgently needed.',
    stage: 'Validated',
    urgency: 'Critical',
    impactLevel: 'Critical',
    submitterType: 'Community Org',
    submittedBy: "Jharkhand Mines Workers' Collective",
    submittedAt: '2024-08-25',
    timeAgo: '3 weeks ago',
    beneficiaries: 5800,
    upvotes: 267,
    comments: 71,
    photoCount: 12,
    aiTags: ['Air Quality', 'Silicosis', 'Mining', 'Dust Suppression', 'Worker Safety'],
    milestones: [
      { id: 'm1', title: 'AQI sensor network deployment (6 sites)', dueDate: '2024-10-01', completed: false },
      { id: 'm2', title: 'Dust suppression pilot design', dueDate: '2024-10-30', completed: false },
    ],
    assignedUniversity: undefined,
    industryPartner: undefined,
    progressPercent: 10,
  },
  {
    id: 'SMV-2024-006',
    title: 'Solar micro-grid needed for 6 off-grid hamlets in Latehar',
    domain: 'Electricity & Energy',
    domainIcon: '⚡',
    domainColor: '#f59e0b',
    district: 'Latehar',
    location: 'Manika Block, Latehar',
    description:
      'Six hamlets with 340 households remain unelectrified despite SAUBHAGYA scheme coverage. Dense forest cover and terrain make grid extension unviable. A solar micro-grid with battery storage and a community-managed energy cooperative model could provide reliable power and generate local employment.',
    stage: 'Deployed',
    urgency: 'Medium',
    impactLevel: 'High',
    submitterType: 'PRI',
    submittedBy: 'Manika Gram Panchayat',
    submittedAt: '2024-01-10',
    timeAgo: '8 months ago',
    beneficiaries: 1700,
    upvotes: 312,
    comments: 89,
    photoCount: 15,
    aiTags: ['Solar Energy', 'Rural Electrification', 'Micro-grid', 'Energy Cooperative'],
    milestones: [
      { id: 'm1', title: 'Site survey & load estimation', dueDate: '2024-02-15', completed: true, completedDate: '2024-02-12' },
      { id: 'm2', title: 'Micro-grid system design', dueDate: '2024-03-30', completed: true, completedDate: '2024-03-28' },
      { id: 'm3', title: 'Installation in 3 hamlets (Phase 1)', dueDate: '2024-06-01', completed: true, completedDate: '2024-05-29' },
      { id: 'm4', title: 'Community training & cooperative formation', dueDate: '2024-07-15', completed: true, completedDate: '2024-07-20' },
      { id: 'm5', title: 'Full deployment (all 6 hamlets)', dueDate: '2024-09-01', completed: true, completedDate: '2024-08-28' },
    ],
    assignedUniversity: {
      heiId: 'IIT-ISM',
      heiName: 'IIT (ISM) Dhanbad',
      heiShortName: 'IIT ISM',
      facultyLead: 'Prof. Sunil Mahto (Electrical Engineering)',
      teamSize: 7,
      disciplines: ['Electrical Engineering', 'Renewable Energy', 'Economics'],
      proposalSubmitted: true,
    },
    industryPartner: {
      partnerId: 'SELCO',
      companyName: 'SELCO Foundation',
      type: 'Innovation Hub',
      contributionType: ['Funding', 'Tech Transfer', 'Pilot Testing'],
      fundingAmount: '₹28 Lakhs',
    },
    progressPercent: 100,
  },
  {
    id: 'SMV-2024-007',
    title: 'Waste management crisis in Deoghar Smart City — 40 TPD unprocessed',
    domain: 'Urban Infrastructure',
    domainIcon: '🏗️',
    domainColor: '#0891b2',
    district: 'Deoghar',
    location: 'Deoghar Municipal Corporation',
    description:
      'Deoghar generates ~40 tonnes of solid waste per day. Only 15 TPD is processed; the rest is dumped at an open landfill near a residential area. Citizens are demanding a decentralised waste processing model with biogas recovery, composting, and material recovery facilities within ward boundaries.',
    stage: 'In Progress',
    urgency: 'High',
    impactLevel: 'High',
    submitterType: 'ULB',
    submittedBy: 'Deoghar Nagar Parishad',
    submittedAt: '2024-04-05',
    timeAgo: '5 months ago',
    beneficiaries: 180000,
    upvotes: 423,
    comments: 112,
    photoCount: 18,
    aiTags: ['Solid Waste', 'Biogas', 'Composting', 'Smart City', 'Urban Planning'],
    milestones: [
      { id: 'm1', title: 'Waste composition analysis (10 wards)', dueDate: '2024-05-15', completed: true, completedDate: '2024-05-14' },
      { id: 'm2', title: 'Decentralised model feasibility report', dueDate: '2024-06-30', completed: true, completedDate: '2024-07-05' },
      { id: 'm3', title: 'Biogas pilot at ward 7 market complex', dueDate: '2024-09-30', completed: false },
      { id: 'm4', title: 'Scale to 5 wards', dueDate: '2025-03-31', completed: false },
    ],
    assignedUniversity: {
      heiId: 'RANCHI-UNIV',
      heiName: 'Ranchi University',
      heiShortName: 'Ranchi Univ.',
      facultyLead: 'Dr. Monika Kumari (Environmental Science)',
      teamSize: 9,
      disciplines: ['Environmental Science', 'Chemical Engineering', 'Urban Planning'],
      proposalSubmitted: true,
    },
    industryPartner: {
      partnerId: 'RAMKY-ENV',
      companyName: 'Ramky Enviro Engineers',
      type: 'MSME',
      contributionType: ['Prototyping', 'Pilot Testing', 'Tech Transfer'],
    },
    progressPercent: 45,
  },
  {
    id: 'SMV-2024-008',
    title: 'Tribal artisans lack e-commerce access — handicrafts going unsold',
    domain: 'Rural Livelihoods',
    domainIcon: '🏡',
    domainColor: '#c2410c',
    district: 'East Singhbhum',
    location: 'Baharagora, East Singhbhum',
    description:
      'Over 600 Santali and Munda tribal artisans in 12 villages produce high-quality bamboo crafts, dokra metalwork, and Sohrai art. Despite quality products, they have zero online presence and sell only at haats with exploitative middlemen. A platform with vernacular language UI and direct buyer connection could transform their income.',
    stage: 'Pilot Testing',
    urgency: 'Medium',
    impactLevel: 'High',
    submitterType: 'Community Org',
    submittedBy: 'Tribal Artisan Cooperative, Baharagora',
    submittedAt: '2024-03-15',
    timeAgo: '6 months ago',
    beneficiaries: 600,
    upvotes: 198,
    comments: 47,
    photoCount: 22,
    aiTags: ['Tribal Livelihoods', 'E-commerce', 'Handicrafts', 'Vernacular Tech'],
    milestones: [
      { id: 'm1', title: 'Artisan onboarding & digital catalogue creation', dueDate: '2024-05-01', completed: true, completedDate: '2024-04-28' },
      { id: 'm2', title: 'App prototype (Hindi + Santali UI)', dueDate: '2024-06-30', completed: true, completedDate: '2024-07-02' },
      { id: 'm3', title: 'Logistics integration with India Post', dueDate: '2024-08-15', completed: true, completedDate: '2024-08-22' },
      { id: 'm4', title: '3-month pilot — first 50 artisans selling online', dueDate: '2024-11-15', completed: false },
    ],
    assignedUniversity: {
      heiId: 'XLRI',
      heiName: 'XLRI Jamshedpur',
      heiShortName: 'XLRI',
      facultyLead: 'Prof. Ajay Thomas (Rural Management)',
      teamSize: 5,
      disciplines: ['Rural Management', 'Marketing', 'HCI'],
      proposalSubmitted: true,
    },
    industryPartner: {
      partnerId: 'AMAZON-SMB',
      companyName: 'Amazon Karigar',
      type: 'Innovation Hub',
      contributionType: ['Tech Transfer', 'Mentoring'],
    },
    progressPercent: 72,
  },
  {
    id: 'SMV-2024-009',
    title: 'Road connectivity gap isolating 18 villages during monsoon in Giridih',
    domain: 'Roads & Transport',
    domainIcon: '🛣️',
    domainColor: '#475569',
    district: 'Giridih',
    location: 'Pirtand Block, Giridih',
    description:
      'Eighteen villages in Pirtand become completely cut off during monsoon due to no all-weather connectivity. Emergency vehicles cannot reach them; school attendance drops to zero for 3 months. PMGSY roads exist on paper but were never built. A low-cost wire-suspended pedestrian bridge and culvert solution is proposed.',
    stage: 'Under Review',
    urgency: 'High',
    impactLevel: 'High',
    submitterType: 'Citizen',
    submittedBy: 'Ratan Munda, Village Representative',
    submittedAt: '2024-09-01',
    timeAgo: '1 week ago',
    beneficiaries: 4200,
    upvotes: 67,
    comments: 13,
    photoCount: 6,
    aiTags: ['Rural Roads', 'Monsoon Connectivity', 'Bridge', 'Infrastructure Gap'],
    milestones: [
      { id: 'm1', title: 'Site survey & topographic mapping', dueDate: '2024-10-15', completed: false },
    ],
    assignedUniversity: undefined,
    industryPartner: undefined,
    progressPercent: 5,
  },
  {
    id: 'SMV-2024-010',
    title: 'Caste certificate issuance delays causing welfare exclusion in Simdega',
    domain: 'Public Services',
    domainIcon: '🏛️',
    domainColor: '#7c3aed',
    district: 'Simdega',
    location: 'Simdega District HQ',
    description:
      'Citizens in Simdega report 3–8 month delays in caste, residence, and income certificate issuance due to manual verification workflows and staff shortage. Over 14,000 pending applications are blocking scholarship disbursement, welfare scheme enrolment, and government job applications for tribal youth.',
    stage: 'Assigned',
    urgency: 'High',
    impactLevel: 'High',
    submitterType: 'Citizen',
    submittedBy: 'Jan Seva Kendra Users, Simdega',
    submittedAt: '2024-07-30',
    timeAgo: '6 weeks ago',
    beneficiaries: 14000,
    upvotes: 334,
    comments: 88,
    photoCount: 3,
    aiTags: ['e-Governance', 'Certificate Services', 'Tribal Welfare', 'Digital Process'],
    milestones: [
      { id: 'm1', title: 'Current process mapping & bottleneck analysis', dueDate: '2024-09-15', completed: true, completedDate: '2024-09-10' },
      { id: 'm2', title: 'Automated verification module design', dueDate: '2024-10-30', completed: false },
      { id: 'm3', title: 'Pilot at Simdega SDO office', dueDate: '2024-12-15', completed: false },
    ],
    assignedUniversity: {
      heiId: 'RANCHI-UNIV',
      heiName: 'Ranchi University',
      heiShortName: 'Ranchi Univ.',
      facultyLead: 'Dr. Kavita Tirkey (Public Administration)',
      teamSize: 4,
      disciplines: ['Public Administration', 'Computer Science', 'Law'],
      proposalSubmitted: false,
    },
    industryPartner: {
      partnerId: 'CSC-GOV',
      companyName: 'CSC e-Governance Services India Ltd.',
      type: 'Innovation Hub',
      contributionType: ['Tech Transfer', 'Mentoring'],
    },
    progressPercent: 22,
  },
];

export const STAGE_COLORS: Record<ChallengeStage, string> = {
  'Submitted': '#64748b',
  'Under Review': '#0284c7',
  'Validated': '#7c3aed',
  'Assigned': '#f59e0b',
  'In Progress': '#ea580c',
  'Pilot Testing': '#8b5cf6',
  'Deployed': '#16a34a',
};

export const URGENCY_COLORS: Record<ChallengeUrgency, string> = {
  'Low': '#64748b',
  'Medium': '#f59e0b',
  'High': '#ea580c',
  'Critical': '#dc2626',
};
