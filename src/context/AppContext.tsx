import React, { createContext, useContext, useState } from 'react';
import {
  CivicReport,
  CivicNotification,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  FEATURED_SUCCESS_STORY,
  SuccessStory,
} from '@/data/samadhan-mock-data';
import {
  Challenge,
  ChallengeStage,
  CHALLENGES_DATA,
  enrichChallenges,
  DOMAIN_EVIDENCE_IMAGES,
} from '@/data/challenges';
import { UNIVERSITIES_DATA } from '@/data/universities';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';
import { classifyChallenge, findDuplicateChallenges, matchUniversities } from '@/lib/ai-engine';
import { TRANSLATIONS } from '@/constants/samadhan-theme';

export type Language = 'en' | 'hi';
export type TextSize = 'small' | 'normal' | 'large';
export type NetworkStatus = 'online' | 'slow' | 'offline' | 'syncing' | 'sync-failed';
export type UserRole = 'citizen' | 'university' | 'industry' | 'government';

export interface DraftReport {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  district: string;
  block: string;
  villageOrWard: string;
  address: string;
  affectedCount: number;
  affectedGroups: string[];
  recurring: boolean;
  isAnonymous: boolean;
  contactMethod: 'Phone' | 'WhatsApp' | 'In-Person';
  mediaCount: number;
  savedAt: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  communityRole: string;
  district: string;
  block: string;
  isGuest: boolean;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Localization & Translations
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;

  // Accessibility & Preferences
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  fontScale: number;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  dataSavingMode: boolean;
  setDataSavingMode: (v: boolean) => void;
  voiceInputEnabled: boolean;
  setVoiceInputEnabled: (v: boolean) => void;

  // Network Simulation
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: NetworkStatus) => void;
  lastSyncedTime: string;
  syncDrafts: () => Promise<void>;

  // User Authentication
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  loginWithMobile: (phone: string, name?: string) => void;
  continueAsGuest: (name?: string, phone?: string) => void;
  logout: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Reports
  reports: CivicReport[];
  drafts: DraftReport[];
  getReportById: (id: string) => CivicReport | undefined;
  submitNewReport: (reportData: Partial<CivicReport>) => string;
  saveNewDraft: (draftData: Partial<DraftReport>) => string;
  deleteDraft: (draftId: string) => void;

  // Problem Supporting (Upvoting)
  supportedProblemIds: Record<string, boolean>;
  toggleSupportProblem: (reportId: string) => void;
  hasSupportedProblem: (reportId: string) => boolean;

  // Updates & Comments
  requestReportUpdate: (reportId: string) => void;
  addReportComment: (reportId: string, comment: string) => void;

  // Notifications
  notifications: CivicNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Success Story
  featuredStory: SuccessStory;

  // Societal innovation portal
  challenges: Challenge[];
  getChallengeById: (id: string) => Challenge | undefined;
  submitChallenge: (input: {
    title: string;
    description: string;
    district: string;
    location: string;
    affectedCount: number;
    submitterType?: Challenge['submitterType'];
    imageUrl?: string;
  }) => { id: string; duplicates: Challenge[] };
  supportChallenge: (id: string) => void;
  addChallengeComment: (id: string, text: string) => void;
  validateChallenge: (id: string) => void;
  mergeAsDuplicate: (id: string, canonicalId: string) => void;
  assignUniversity: (id: string, heiId: string) => void;
  acceptChallenge: (id: string) => void;
  formProjectTeam: (id: string) => void;
  submitProposal: (id: string) => void;
  offerIndustrySupport: (id: string, partnerId: string, kind: 'Funding' | 'Mentoring' | 'Prototyping' | 'Pilot Testing' | 'Tech Transfer') => void;
  toggleMilestone: (id: string, milestoneId: string) => void;

  // Toast System
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
}

const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  citizen: {
    name: 'Sunita Devi',
    phone: '+91 98351 44210',
    email: 'sunita.shg@samadhan.org',
    communityRole: 'Secretary, Mahila Kalyan SHG',
    district: 'Ranchi',
    block: 'Ormanjhi',
    isGuest: false,
  },
  university: {
    name: 'Dr. Anjali Singh',
    phone: '+91 94311 20560',
    email: 'anjali.singh@bitmesra.ac.in',
    communityRole: 'Faculty Lead, IoT & Innovation Centre (BIT Mesra)',
    district: 'Ranchi',
    block: 'Kanke',
    isGuest: false,
  },
  industry: {
    name: 'Rajiv Sharma',
    phone: '+91 97714 88320',
    email: 'csr.lead@tatasteel.com',
    communityRole: 'Head of CSR Partnerships (Tata Steel)',
    district: 'East Singhbhum',
    block: 'Jamshedpur',
    isGuest: false,
  },
  government: {
    name: 'Amit Verma, IAS',
    phone: '+91 94300 11223',
    email: 'nodal.officer@jharkhand.gov.in',
    communityRole: 'District Nodal Officer, Societal Innovation Mission',
    district: 'Ranchi',
    block: 'Ranchi Sadar',
    isGuest: false,
  },
};

const DEFAULT_USER = ROLE_PROFILES.citizen;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Locale
  const [language, setLanguage] = useState<Language>('en');

  // Accessibility
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [dataSavingMode, setDataSavingMode] = useState<boolean>(false);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState<boolean>(true);

  // Network
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  // User
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [userRole, setUserRoleState] = useState<UserRole>('citizen');

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (ROLE_PROFILES[role]) {
      setUser(ROLE_PROFILES[role]);
    }
  };
  const [challenges, setChallenges] = useState<Challenge[]>(() => enrichChallenges(CHALLENGES_DATA));

  // Reports & Drafts
  const [reports, setReports] = useState<CivicReport[]>(INITIAL_REPORTS);
  const [drafts, setDrafts] = useState<DraftReport[]>([
    {
      id: 'DRAFT-JH-01',
      title: 'Low voltage transformer tripping daily in Angara',
      description: 'The local 63kVA transformer drops voltage to 110V every evening, preventing irrigation motors from running.',
      categoryId: 'infrastructure',
      urgency: 'medium',
      district: 'Ranchi',
      block: 'Angara',
      villageOrWard: 'Hesal',
      address: 'Near Kali Temple, Hesal Village',
      affectedCount: 150,
      affectedGroups: ['Farmers', 'Entire community'],
      recurring: true,
      isAnonymous: false,
      contactMethod: 'Phone',
      mediaCount: 1,
      savedAt: '13 Sep 2026, 06:20 PM',
    },
  ]);

  // Support Upvotes
  const [supportedProblemIds, setSupportedProblemIds] = useState<Record<string, boolean>>({
    'SC-JH-84920': true,
    'SC-JH-84924': true,
  });

  // Notifications
  const [notifications, setNotifications] = useState<CivicNotification[]>(INITIAL_NOTIFICATIONS);

  // Toast
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  // Derived font scale
  const fontScale = textSize === 'small' ? 0.9 : textSize === 'large' ? 1.18 : 1.0;

  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || '';
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Upvoting logic
  const toggleSupportProblem = (reportId: string) => {
    const currentlySupported = !!supportedProblemIds[reportId];
    setSupportedProblemIds((prev) => ({
      ...prev,
      [reportId]: !currentlySupported,
    }));

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            supporters: currentlySupported ? Math.max(0, r.supporters - 1) : r.supporters + 1,
          };
        }
        return r;
      })
    );

    showToast(
      currentlySupported
        ? language === 'hi'
          ? 'समर्थन हटाया गया'
          : 'Support removed'
        : language === 'hi'
        ? 'आपने इस समस्या का समर्थन किया है!'
        : 'You supported this problem!',
      'success'
    );
  };

  const hasSupportedProblem = (reportId: string): boolean => {
    return !!supportedProblemIds[reportId];
  };

  // Submit report
  const submitNewReport = (reportData: Partial<CivicReport>): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `SC-JH-${randomNum}`;

    const newReport: CivicReport = {
      id: newId,
      titleEn: reportData.titleEn || 'New Community Issue',
      titleHi: reportData.titleHi || reportData.titleEn || 'नई सामुदायिक समस्या',
      descriptionEn: reportData.descriptionEn || '',
      descriptionHi: reportData.descriptionHi || reportData.descriptionEn || '',
      categoryId: reportData.categoryId || 'other',
      status: 'Received',
      urgency: reportData.urgency || 'medium',
      location: reportData.location || {
        district: user.district || 'Ranchi',
        block: user.block || 'Ormanjhi',
        villageOrWard: 'Local Area',
        address: 'Near Main Road',
        latitude: 23.3441,
        longitude: 85.3095,
      },
      submittedAt: 'Just now',
      submittedBy: {
        name: reportData.submittedBy?.name || user.name,
        role: reportData.submittedBy?.role || user.communityRole,
        isAnonymous: !!reportData.submittedBy?.isAnonymous,
        contactMethod: reportData.submittedBy?.contactMethod || 'Phone',
      },
      affectedCount: reportData.affectedCount || 50,
      affectedGroups: reportData.affectedGroups || ['Entire community'],
      recurring: !!reportData.recurring,
      supporters: 1,
      isUserReport: true,
      media: reportData.media || [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
          captionEn: 'Attached field photograph',
          captionHi: 'संलग्न स्थल फोटोग्राफ',
        },
      ],
      nextExpectedAction: {
        labelEn: 'Community coordinator validation within 24-48 hours',
        labelHi: '24-48 घंटे के भीतर सामुदायिक समन्वयक द्वारा सत्यापन',
        estimatedDate: 'Tomorrow, 05:00 PM',
      },
      timeline: [
        {
          status: 'Received',
          timestamp: 'Just now',
          titleEn: 'Report Lodged Successfully',
          titleHi: 'रिपोर्ट सफलतापूर्वक दर्ज हुई',
          descriptionEn: 'Your grievance has been logged and assigned tracking ID.',
          descriptionHi: 'आपकी शिकायत दर्ज कर ली गई है और ट्रैकिंग आईडी प्रदान की गई है।',
          actor: user.name || 'Citizen',
          completed: true,
          current: true,
        },
        {
          status: 'Validated',
          timestamp: 'Upcoming (24h)',
          titleEn: 'Coordination Check',
          titleHi: 'समन्वयक सत्यापन',
          descriptionEn: 'Local coordinator will inspect site details.',
          descriptionHi: 'स्थानीय समन्वयक स्थल का निरीक्षण करेंगे।',
          actor: 'Block Coordinator',
          completed: false,
        },
        {
          status: 'Assigned',
          timestamp: 'Upcoming',
          titleEn: 'Routing to Nodal Agency',
          titleHi: 'नोडल एजेंसी को प्रेषण',
          descriptionEn: 'Report forwarded to line department.',
          descriptionHi: 'संबंधित सरकारी विभाग को भेजा जाएगा।',
          actor: 'District Administration',
          completed: false,
        },
        {
          status: 'In Progress',
          timestamp: 'Upcoming',
          titleEn: 'Remedial Action Started',
          titleHi: 'निवारक कार्य आरंभ',
          descriptionEn: 'Field team commences work on ground.',
          descriptionHi: 'ज़मीनी स्तर पर कार्य शुरू होगा।',
          actor: 'Field Operations Team',
          completed: false,
        },
        {
          status: 'Pilot',
          timestamp: 'Upcoming',
          titleEn: 'Community Trial',
          titleHi: 'सामुदायिक परीक्षण',
          descriptionEn: 'Testing solution with affected citizens.',
          descriptionHi: 'प्रभावित नागरिकों के साथ समाधान का परीक्षण।',
          actor: 'User Committee',
          completed: false,
        },
        {
          status: 'Deployed',
          timestamp: 'Upcoming',
          titleEn: 'Permanent Implementation',
          titleHi: 'स्थायी समाधान लागू',
          descriptionEn: 'Solution fully operational on site.',
          descriptionHi: 'स्थल पर समाधान पूर्ण रूप से क्रियाशील।',
          actor: 'Implementing Agency',
          completed: false,
        },
        {
          status: 'Closed',
          timestamp: 'Upcoming',
          titleEn: 'Citizen Confirmation & Close',
          titleHi: 'नागरिक संतुष्टि पश्चात केस बंद',
          descriptionEn: 'Verified by citizen reporter.',
          descriptionHi: 'रिपोर्टर की संतुष्टि पर क्लोजर।',
          actor: 'Samadhan Community Lead',
          completed: false,
        },
      ],
      moderatedComments: [],
    };

    setReports((prev) => [newReport, ...prev]);

    // Also inject a notification
    const newNotif: CivicNotification = {
      id: `n-${Date.now()}`,
      type: 'report_received',
      reportId: newId,
      titleEn: `Report Logged (#${newId})`,
      titleHi: `रिपोर्ट दर्ज हुई (#${newId})`,
      messageEn: `Your report has been received and scheduled for validation.`,
      messageHi: `आपकी रिपोर्ट प्राप्त हो गई है और सत्यापन हेतु निर्धारित है।`,
      timestamp: 'Just now',
      isRead: false,
      actionRoute: `/report-detail?id=${newId}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newId;
  };

  // Save draft
  const saveNewDraft = (draftData: Partial<DraftReport>): string => {
    const draftId = `DRAFT-JH-${Math.floor(10 + Math.random() * 90)}`;
    const newDraft: DraftReport = {
      id: draftId,
      title: draftData.title || 'Untitled Community Issue',
      description: draftData.description || '',
      categoryId: draftData.categoryId || 'other',
      urgency: draftData.urgency || 'medium',
      district: draftData.district || user.district || 'Ranchi',
      block: draftData.block || user.block || 'Ormanjhi',
      villageOrWard: draftData.villageOrWard || 'Ward 1',
      address: draftData.address || '',
      affectedCount: draftData.affectedCount || 10,
      affectedGroups: draftData.affectedGroups || ['Entire community'],
      recurring: !!draftData.recurring,
      isAnonymous: !!draftData.isAnonymous,
      contactMethod: draftData.contactMethod || 'Phone',
      mediaCount: draftData.mediaCount || 0,
      savedAt: 'Just now (Saved on this device)',
    };

    setDrafts((prev) => [newDraft, ...prev]);
    showToast(
      language === 'hi'
        ? 'ड्राफ्ट फोन में सुरक्षित सहेजा गया।'
        : 'Draft saved securely on this device.',
      'info'
    );
    return draftId;
  };

  const deleteDraft = (draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    showToast(
      language === 'hi' ? 'ड्राफ्ट हटा दिया गया।' : 'Draft deleted.',
      'info'
    );
  };

  // Sync drafts when online
  const syncDrafts = async () => {
    if (drafts.length === 0) {
      showToast(
        language === 'hi' ? 'कोई लंबित ड्राफ्ट नहीं है।' : 'No pending drafts to sync.',
        'info'
      );
      return;
    }

    setNetworkStatus('syncing');
    showToast(
      language === 'hi' ? 'ड्राफ्ट्स सर्वर के साथ सिंक हो रहे हैं...' : 'Syncing drafts with server...',
      'info'
    );

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 2000));

    // Convert drafts to reports
    drafts.forEach((draft) => {
      submitNewReport({
        titleEn: draft.title,
        titleHi: draft.title,
        descriptionEn: draft.description,
        descriptionHi: draft.description,
        categoryId: draft.categoryId,
        urgency: draft.urgency,
        location: {
          district: draft.district,
          block: draft.block,
          villageOrWard: draft.villageOrWard,
          address: draft.address,
          latitude: 23.3441,
          longitude: 85.3095,
        },
        affectedCount: draft.affectedCount,
        affectedGroups: draft.affectedGroups,
        recurring: draft.recurring,
        submittedBy: {
          name: user.name,
          role: user.communityRole,
          isAnonymous: draft.isAnonymous,
          contactMethod: draft.contactMethod,
        },
      });
    });

    setDrafts([]);
    setNetworkStatus('online');
    setLastSyncedTime('Just now');
    showToast(
      language === 'hi'
        ? 'सभी ड्राफ्ट्स सफलतापूर्वक अपलोड हो गए!'
        : 'All drafts synchronized successfully!',
      'success'
    );
  };

  const getReportById = (id: string): CivicReport | undefined => {
    return reports.find((r) => r.id === id);
  };

  const requestReportUpdate = (reportId: string) => {
    showToast(
      language === 'hi'
        ? 'अपडेट का अनुरोध नोडल अधिकारी को भेज दिया गया है।'
        : 'Update request sent to nodal field team.',
      'success'
    );
  };

  const addReportComment = (reportId: string, comment: string) => {
    if (!comment.trim()) return;
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            moderatedComments: [
              ...r.moderatedComments,
              {
                id: `c-${Date.now()}`,
                author: user.name,
                role: user.isGuest ? 'Community Member' : user.communityRole,
                comment: comment.trim(),
                date: 'Just now',
              },
            ],
          };
        }
        return r;
      })
    );
    showToast(
      language === 'hi' ? 'आपकी टिप्पणी दर्ज की गई।' : 'Your comment was posted.',
      'success'
    );
  };

  // Notifications actions
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast(
      language === 'hi'
        ? 'सभी सूचनाएं पढ़ी हुई चिह्नित की गईं।'
        : 'All notifications marked as read.',
      'info'
    );
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const pushPortalNote = (titleEn: string, messageEn: string, route?: string) => {
    const note: CivicNotification = {
      id: `n-${Date.now()}`,
      type: 'status_updated',
      titleEn,
      titleHi: titleEn,
      messageEn,
      messageHi: messageEn,
      timestamp: 'Just now',
      isRead: false,
      actionRoute: route,
    };
    setNotifications((prev) => [note, ...prev]);
  };

  const getChallengeById = (id: string) => challenges.find((c) => c.id === id);

  const submitChallenge: AppContextType['submitChallenge'] = (input) => {
    const ai = classifyChallenge(input.title, input.description);
    const duplicates = findDuplicateChallenges(
      { title: input.title, description: input.description, district: input.district, domain: ai.domain },
      challenges
    );
    const matches = matchUniversities(ai.domain);
    const newId = `SMV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const created: Challenge = {
      id: newId,
      title: input.title,
      domain: ai.domain,
      domainIcon: ai.domainIcon,
      domainColor: ai.domainColor,
      district: input.district,
      location: input.location,
      description: input.description,
      stage: duplicates.length ? 'Under Review' : 'Submitted',
      urgency: ai.urgency,
      impactLevel: ai.urgency === 'Critical' ? 'Critical' : 'High',
      submitterType: input.submitterType || 'Citizen',
      submittedBy: user.name,
      submittedAt: new Date().toISOString().slice(0, 10),
      timeAgo: 'Just now',
      beneficiaries: input.affectedCount,
      upvotes: 1,
      comments: 0,
      photoCount: input.imageUrl ? 1 : 0,
      aiTags: ai.tags,
      milestones: [{ id: 'm1', title: 'AI classification & duplicate scan', dueDate: 'Today', completed: true, completedDate: 'Just now' }],
      progressPercent: 8,
      imageUrl: input.imageUrl || DOMAIN_EVIDENCE_IMAGES[ai.domain],
      requiredSkills: ai.skills,
      fundingAvailable: 'Open for CSR / MSME support',
      applications: 0,
      deadline: '15 Oct 2026',
      aiConfidence: ai.confidence,
      similarChallengeIds: duplicates.map((d) => d.id),
      expectedSolution: `Solution using ${ai.skills.slice(0, 2).join(' and ')}`,
      isUserChallenge: true,
      commentsFeed: [],
      teamMembers: [],
    };
    if (matches[0] && !duplicates.length) {
      created.assignedUniversity = undefined;
    }
    setChallenges((prev) => [created, ...prev]);
    pushPortalNote(
      `Challenge logged (${newId})`,
      `AI classified as ${ai.domain} (${ai.confidence}% confidence). ${duplicates.length ? `${duplicates.length} similar reports found nearby.` : 'Queued for validation and HEI routing.'}`,
      `/challenge-detail?id=${newId}`
    );
    showToast(
      duplicates.length
        ? 'Submitted. AI found similar nearby reports for admin grouping.'
        : `Submitted. AI tagged this as ${ai.domain}.`,
      'success'
    );
    return { id: newId, duplicates };
  };

  const supportChallenge = (id: string) => {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c)));
    showToast('You supported this community challenge.', 'success');
  };

  const addChallengeComment = (id: string, text: string) => {
    if (!text.trim()) return;
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              comments: c.comments + 1,
              commentsFeed: [
                ...(c.commentsFeed || []),
                { id: `c-${Date.now()}`, author: user.name, role: userRole, text: text.trim(), at: 'Just now' },
              ],
            }
          : c
      )
    );
    showToast('Comment posted to the public challenge thread.', 'success');
  };

  const validateChallenge = (id: string) => {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, stage: 'Validated' as ChallengeStage, progressPercent: Math.max(c.progressPercent, 18) } : c)));
    pushPortalNote('Challenge validated', 'An administrator confirmed this as a genuine societal challenge.', `/challenge-detail?id=${id}`);
    showToast('Challenge validated and opened for universities.', 'success');
  };

  const mergeAsDuplicate = (id: string, canonicalId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === canonicalId) {
          return { ...c, upvotes: c.upvotes + 12, similarChallengeIds: [...new Set([...(c.similarChallengeIds || []), id])] };
        }
        if (c.id === id) {
          return { ...c, stage: 'Under Review' as ChallengeStage };
        }
        return c;
      })
    );
    showToast('Reports grouped as one community pattern.', 'info');
  };

  const assignUniversity = (id: string, heiId: string) => {
    const uni = UNIVERSITIES_DATA.find((u) => u.id === heiId);
    if (!uni) return;
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              stage: 'Assigned' as ChallengeStage,
              progressPercent: Math.max(c.progressPercent, 28),
              assignedUniversity: {
                heiId: uni.id,
                heiName: uni.name,
                heiShortName: uni.shortName,
                facultyLead: `Faculty coordinator, ${uni.shortName}`,
                teamSize: 0,
                disciplines: uni.disciplines.slice(0, 3),
                proposalSubmitted: false,
              },
            }
          : c
      )
    );
    pushPortalNote('Routed to university', `${uni.shortName} received this challenge based on domain expertise.`, `/challenge-detail?id=${id}`);
    showToast(`Routed to ${uni.shortName}.`, 'success');
  };

  const acceptChallenge = (id: string) => {
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, stage: 'In Progress' as ChallengeStage, progressPercent: Math.max(c.progressPercent, 35) } : c)));
    showToast('University accepted this challenge.', 'success');
  };

  const formProjectTeam = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              teamMembers: [
                { name: c.assignedUniversity?.facultyLead || 'Faculty mentor', role: 'Faculty mentor', discipline: c.assignedUniversity?.disciplines[0] || c.domain },
                { name: 'Ananya Kujur', role: 'Student lead', discipline: 'Computer Science' },
                { name: 'Ravi Oraon', role: 'Field researcher', discipline: 'Public Health' },
                { name: 'Meera Toppo', role: 'Prototype engineer', discipline: 'Electronics' },
              ],
              assignedUniversity: c.assignedUniversity ? { ...c.assignedUniversity, teamSize: 8 } : c.assignedUniversity,
            }
          : c
      )
    );
    showToast('Multidisciplinary student-faculty team constituted.', 'success');
  };

  const submitProposal = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              stage: 'In Progress' as ChallengeStage,
              progressPercent: Math.max(c.progressPercent, 45),
              assignedUniversity: c.assignedUniversity ? { ...c.assignedUniversity, proposalSubmitted: true } : c.assignedUniversity,
            }
          : c
      )
    );
    pushPortalNote('Solution proposal submitted', 'The HEI uploaded a research/innovation proposal for review.', `/challenge-detail?id=${id}`);
    showToast('Proposal submitted to the portal.', 'success');
  };

  const offerIndustrySupport: AppContextType['offerIndustrySupport'] = (id, partnerId, kind) => {
    const partner = INDUSTRY_PARTNERS_DATA.find((p) => p.id === partnerId) || INDUSTRY_PARTNERS_DATA[0];
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              industryPartner: {
                partnerId: partner.id,
                companyName: partner.companyName,
                type: partner.type,
                contributionType: [kind],
                fundingAmount: kind === 'Funding' ? partner.totalFundingCommitted : c.industryPartner?.fundingAmount,
              },
            }
          : c
      )
    );
    pushPortalNote('Industry joined the project', `${partner.shortName} offered ${kind.toLowerCase()}.`, `/challenge-detail?id=${id}`);
    showToast(`${partner.shortName} will ${kind.toLowerCase()}.`, 'success');
  };

  const toggleMilestone = (id: string, milestoneId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const milestones = c.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed, completedDate: !m.completed ? 'Just now' : undefined } : m
        );
        const done = milestones.filter((m) => m.completed).length;
        const progressPercent = Math.round((done / Math.max(milestones.length, 1)) * 100);
        let stage = c.stage;
        if (progressPercent >= 100) stage = 'Deployed';
        else if (progressPercent >= 70) stage = 'Pilot Testing';
        return { ...c, milestones, progressPercent, stage };
      })
    );
  };

  // Auth actions
  const loginWithMobile = (phone: string, name?: string) => {
    setUser({
      name: name || 'Sunita Devi',
      phone: phone || '+91 98351 44210',
      email: 'citizen@samadhan.org',
      communityRole: 'Citizen Member',
      district: 'Ranchi',
      block: 'Ormanjhi',
      isGuest: false,
    });
    showToast(
      language === 'hi' ? 'सफलतापूर्वक लॉगिन हो गए!' : 'Logged in successfully!',
      'success'
    );
  };

  const continueAsGuest = (name?: string, phone?: string) => {
    setUser({
      name: name || 'Guest Citizen',
      phone: phone || '+91 98000 00000',
      email: '',
      communityRole: 'Guest Community Member',
      district: 'Ranchi',
      block: 'Ranchi Sadar',
      isGuest: true,
    });
    showToast(
      language === 'hi'
        ? 'अतिथि के रूप में जारी रखा गया।'
        : 'Continuing as guest citizen.',
      'info'
    );
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    showToast(
      language === 'hi' ? 'प्रोफ़ाइल अपडेट की गई।' : 'Profile updated successfully.',
      'success'
    );
  };

  const logout = () => {
    setUser({
      name: 'Guest Citizen',
      phone: '',
      email: '',
      communityRole: 'Guest',
      district: 'Ranchi',
      block: 'Ranchi Sadar',
      isGuest: true,
    });
    showToast(
      language === 'hi' ? 'आप लॉग आउट हो गए हैं।' : 'You have logged out.',
      'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        textSize,
        setTextSize,
        fontScale,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        dataSavingMode,
        setDataSavingMode,
        voiceInputEnabled,
        setVoiceInputEnabled,
        networkStatus,
        setNetworkStatus,
        lastSyncedTime,
        syncDrafts,
        user,
        updateUserProfile,
        loginWithMobile,
        continueAsGuest,
        logout,
        userRole,
        setUserRole,
        reports,
        drafts,
        getReportById,
        submitNewReport,
        saveNewDraft,
        deleteDraft,
        supportedProblemIds,
        toggleSupportProblem,
        hasSupportedProblem,
        requestReportUpdate,
        addReportComment,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        featuredStory: FEATURED_SUCCESS_STORY,
        challenges,
        getChallengeById,
        submitChallenge,
        supportChallenge,
        addChallengeComment,
        validateChallenge,
        mergeAsDuplicate,
        assignUniversity,
        acceptChallenge,
        formProjectTeam,
        submitProposal,
        offerIndustrySupport,
        toggleMilestone,
        toast,
        showToast,
        hideToast,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
