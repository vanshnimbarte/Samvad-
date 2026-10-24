// ─────────────────────────────────────────────────────────────────────────────
// Samvad — Dashboard Analytics Mock Data
// ─────────────────────────────────────────────────────────────────────────────

export interface DomainStat {
  domain: string;
  icon: string;
  color: string;
  submitted: number;
  inProgress: number;
  resolved: number;
}

export interface DistrictStat {
  district: string;
  challenges: number;
  resolved: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface MonthlyTrend {
  month: string;
  submitted: number;
  resolved: number;
}

export interface HEIPerformance {
  heiId: string;
  heiName: string;
  shortName: string;
  assigned: number;
  ongoing: number;
  completed: number;
  ipGenerated: number;
  startupsCreated: number;
}

export interface IndustryPerformance {
  companyName: string;
  shortName: string;
  type: string;
  projectsSupported: number;
  fundingCommitted: string;
  beneficiariesReached: number;
}

export const HEADLINE_KPIS = {
  totalChallenges: 1247,
  submitted: 312,
  underReview: 204,
  assigned: 287,
  inProgress: 198,
  pilotTesting: 89,
  deployed: 157,
  heiPartners: 28,
  industryPartners: 45,
  totalBeneficiaries: 284000,
  districtsActive: 24,
  patentsApplied: 18,
  startupsCreated: 12,
  researchPapers: 67,
};

export const DOMAIN_STATS: DomainStat[] = [
  { domain: 'Water & Sanitation', icon: '💧', color: '#0284c7', submitted: 198, inProgress: 42, resolved: 31 },
  { domain: 'Agriculture & Farming', icon: '🌾', color: '#16a34a', submitted: 167, inProgress: 38, resolved: 28 },
  { domain: 'Healthcare', icon: '🏥', color: '#dc2626', submitted: 189, inProgress: 31, resolved: 25 },
  { domain: 'Education', icon: '📚', color: '#9333ea', submitted: 142, inProgress: 24, resolved: 19 },
  { domain: 'Roads & Transport', icon: '🛣️', color: '#475569', submitted: 134, inProgress: 18, resolved: 14 },
  { domain: 'Electricity & Energy', icon: '⚡', color: '#f59e0b', submitted: 98, inProgress: 14, resolved: 12 },
  { domain: 'Environment', icon: '🌿', color: '#059669', submitted: 112, inProgress: 12, resolved: 9 },
  { domain: 'Rural Livelihoods', icon: '🏡', color: '#c2410c', submitted: 89, inProgress: 11, resolved: 8 },
  { domain: 'Urban Infrastructure', icon: '🏗️', color: '#0891b2', submitted: 67, inProgress: 6, resolved: 7 },
  { domain: 'Public Services', icon: '🏛️', color: '#7c3aed', submitted: 51, inProgress: 2, resolved: 4 },
];

export const DISTRICT_STATS: DistrictStat[] = [
  { district: 'Ranchi', challenges: 187, resolved: 42, severity: 'high' },
  { district: 'Dhanbad', challenges: 134, resolved: 31, severity: 'high' },
  { district: 'Jamshedpur', challenges: 98, resolved: 28, severity: 'high' },
  { district: 'Bokaro', challenges: 78, resolved: 18, severity: 'medium' },
  { district: 'Hazaribagh', challenges: 67, resolved: 14, severity: 'medium' },
  { district: 'Deoghar', challenges: 61, resolved: 11, severity: 'medium' },
  { district: 'Palamu', challenges: 58, resolved: 9, severity: 'high' },
  { district: 'Giridih', challenges: 54, resolved: 7, severity: 'medium' },
  { district: 'Khunti', challenges: 51, resolved: 6, severity: 'critical' },
  { district: 'Dumka', challenges: 48, resolved: 8, severity: 'high' },
  { district: 'West Singhbhum', challenges: 44, resolved: 5, severity: 'critical' },
  { district: 'East Singhbhum', challenges: 42, resolved: 9, severity: 'medium' },
  { district: 'Latehar', challenges: 38, resolved: 7, severity: 'medium' },
  { district: 'Simdega', challenges: 36, resolved: 4, severity: 'high' },
  { district: 'Gumla', challenges: 34, resolved: 3, severity: 'critical' },
  { district: 'Lohardaga', challenges: 31, resolved: 5, severity: 'medium' },
  { district: 'Chatra', challenges: 28, resolved: 2, severity: 'medium' },
  { district: 'Koderma', challenges: 26, resolved: 4, severity: 'low' },
  { district: 'Seraikela', challenges: 24, resolved: 3, severity: 'low' },
  { district: 'Godda', challenges: 22, resolved: 2, severity: 'medium' },
  { district: 'Sahibganj', challenges: 21, resolved: 3, severity: 'low' },
  { district: 'Pakur', challenges: 19, resolved: 1, severity: 'medium' },
  { district: 'Jamtara', challenges: 17, resolved: 2, severity: 'low' },
  { district: 'Ramgarh', challenges: 15, resolved: 2, severity: 'low' },
];

export const MONTHLY_TREND: MonthlyTrend[] = [
  { month: 'Apr', submitted: 78, resolved: 12 },
  { month: 'May', submitted: 112, resolved: 18 },
  { month: 'Jun', submitted: 167, resolved: 24 },
  { month: 'Jul', submitted: 198, resolved: 28 },
  { month: 'Aug', submitted: 234, resolved: 35 },
  { month: 'Sep', submitted: 458, resolved: 40 },
];

export const HEI_PERFORMANCE: HEIPerformance[] = [
  { heiId: 'IIT-ISM', heiName: 'IIT (ISM) Dhanbad', shortName: 'IIT ISM', assigned: 14, ongoing: 12, completed: 8, ipGenerated: 7, startupsCreated: 5 },
  { heiId: 'NIT-JKD', heiName: 'NIT Jamshedpur', shortName: 'NIT Jmshdpr', assigned: 11, ongoing: 9, completed: 6, ipGenerated: 4, startupsCreated: 3 },
  { heiId: 'BIT-MESRA', heiName: 'BIT Mesra', shortName: 'BIT Mesra', assigned: 9, ongoing: 7, completed: 11, ipGenerated: 5, startupsCreated: 4 },
  { heiId: 'BASU', heiName: 'Birsa Agricultural University', shortName: 'BAU Ranchi', assigned: 10, ongoing: 8, completed: 14, ipGenerated: 3, startupsCreated: 2 },
  { heiId: 'RANCHI-UNIV', heiName: 'Ranchi University', shortName: 'Ranchi Univ', assigned: 8, ongoing: 6, completed: 7, ipGenerated: 2, startupsCreated: 1 },
  { heiId: 'XAVIER', heiName: 'XISS Ranchi', shortName: 'XISS', assigned: 7, ongoing: 5, completed: 9, ipGenerated: 1, startupsCreated: 0 },
  { heiId: 'XLRI', heiName: 'XLRI Jamshedpur', shortName: 'XLRI', assigned: 6, ongoing: 4, completed: 5, ipGenerated: 1, startupsCreated: 6 },
];

export const INDUSTRY_PERFORMANCE: IndustryPerformance[] = [
  { companyName: 'Tata Steel Foundation', shortName: 'Tata Steel', type: 'CSR', projectsSupported: 7, fundingCommitted: '₹1.2 Cr', beneficiariesReached: 28000 },
  { companyName: 'Wipro Foundation', shortName: 'Wipro', type: 'CSR', projectsSupported: 4, fundingCommitted: '₹85 L', beneficiariesReached: 65000 },
  { companyName: 'Google.org', shortName: 'Google', type: 'Innovation Hub', projectsSupported: 1, fundingCommitted: '₹50 L', beneficiariesReached: 8000 },
  { companyName: 'SELCO Foundation', shortName: 'SELCO', type: 'Innovation Hub', projectsSupported: 3, fundingCommitted: '₹56 L', beneficiariesReached: 5200 },
  { companyName: 'ITC Agribusiness', shortName: 'ITC Agri', type: 'CSR', projectsSupported: 3, fundingCommitted: '₹40 L', beneficiariesReached: 3600 },
  { companyName: 'Amazon Karigar', shortName: 'Amazon', type: 'Innovation Hub', projectsSupported: 1, fundingCommitted: '₹5 L', beneficiariesReached: 1800 },
  { companyName: 'CSC e-Governance', shortName: 'CSC SPV', type: 'Innovation Hub', projectsSupported: 2, fundingCommitted: '₹16 L', beneficiariesReached: 22000 },
];
