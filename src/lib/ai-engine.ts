import {
  Challenge,
  ChallengeDomain,
  ChallengeUrgency,
  CHALLENGE_DOMAIN_COLORS,
  CHALLENGE_DOMAIN_ICONS,
  DOMAIN_SKILLS,
} from '@/data/challenges';
import { UNIVERSITIES_DATA, type University } from '@/data/universities';

const KEYWORDS: Array<{ domain: ChallengeDomain; words: string[] }> = [
  { domain: 'Water & Sanitation', words: ['water', 'borewell', 'fluoride', 'arsenic', 'handpump', 'pipeline', 'sanitation', 'toilet', 'drainage'] },
  { domain: 'Agriculture & Farming', words: ['soil', 'crop', 'farmer', 'yield', 'irrigation', 'seed', 'agriculture'] },
  { domain: 'Healthcare', words: ['health', 'hospital', 'asha', 'clinic', 'medicine', 'telemedicine', 'doctor'] },
  { domain: 'Education', words: ['school', 'student', 'teacher', 'literacy', 'education', 'classroom'] },
  { domain: 'Roads & Transport', words: ['road', 'pothole', 'bridge', 'monsoon', 'transport', 'culvert'] },
  { domain: 'Electricity & Energy', words: ['solar', 'electric', 'grid', 'transformer', 'power', 'energy'] },
  { domain: 'Environment', words: ['dust', 'pollution', 'quarry', 'forest', 'aqi', 'waste air'] },
  { domain: 'Rural Livelihoods', words: ['artisan', 'livelihood', 'handicraft', 'shg', 'market'] },
  { domain: 'Urban Infrastructure', words: ['waste', 'garbage', 'smart city', 'ward', 'municipal'] },
  { domain: 'Public Services', words: ['certificate', 'ration', 'csc', 'welfare', 'e-governance', 'office'] },
];

export function classifyChallenge(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const scored = KEYWORDS.map((entry) => ({
    domain: entry.domain,
    score: entry.words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0].score > 0 ? scored[0] : { domain: 'Public Services' as ChallengeDomain, score: 1 };
  const confidence = Math.min(96, 68 + best.score * 8);
  const urgency: ChallengeUrgency = /critical|emergency|children|cut off|death|fluoride/.test(text)
    ? 'Critical'
    : /delay|pending|drop|illness/.test(text)
    ? 'High'
    : 'Medium';

  return {
    domain: best.domain,
    domainIcon: CHALLENGE_DOMAIN_ICONS[best.domain],
    domainColor: CHALLENGE_DOMAIN_COLORS[best.domain],
    confidence,
    urgency,
    tags: DOMAIN_SKILLS[best.domain].slice(0, 4),
    skills: DOMAIN_SKILLS[best.domain],
  };
}

export function findDuplicateChallenges(incoming: { title: string; description: string; district: string; domain: ChallengeDomain }, pool: Challenge[]) {
  const haystack = `${incoming.title} ${incoming.description}`.toLowerCase();
  return pool
    .filter((item) => item.district === incoming.district && item.domain === incoming.domain)
    .map((item) => {
      const overlap = item.aiTags.filter((tag) => haystack.includes(tag.toLowerCase().split(' ')[0])).length;
      return { challenge: item, score: overlap + (item.title.split(' ').some((w) => haystack.includes(w.toLowerCase())) ? 2 : 0) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.challenge);
}

export function matchUniversities(domain: ChallengeDomain): University[] {
  return [...UNIVERSITIES_DATA]
    .map((uni) => ({
      uni,
      score: uni.domains.includes(domain) ? 5 : uni.disciplines.some((d) => d.toLowerCase().includes(domain.split(' ')[0].toLowerCase())) ? 2 : 0,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Number(b.uni.incubationFacility) !== Number(a.uni.incubationFacility)) {
        return Number(b.uni.incubationFacility) - Number(a.uni.incubationFacility);
      }
      return b.uni.activeProjects - a.uni.activeProjects;
    })
    .slice(0, 3)
    .map((item) => item.uni);
}

export const ECOSYSTEM_STEPS = [
  { key: 'report', label: 'Citizen report', detail: 'Photo, GPS, community evidence' },
  { key: 'pattern', label: 'Community pattern', detail: 'Support, comments, nearby duplicates' },
  { key: 'ai', label: 'AI classification', detail: 'Domain, priority, university match' },
  { key: 'validate', label: 'Expert validation', detail: 'Admin verifies and groups issues' },
  { key: 'university', label: 'University challenge', detail: 'Faculty + student team assigned' },
  { key: 'industry', label: 'Industry partnership', detail: 'Funding, mentor, prototype support' },
  { key: 'pilot', label: 'Pilot deployment', detail: 'Village or ward field test' },
  { key: 'impact', label: 'Impact measured', detail: 'People reached, IP, startups' },
];
