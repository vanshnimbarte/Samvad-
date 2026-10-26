import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  supabase,
  fetchChallengesFromSupabase,
  insertChallengeToSupabase,
  fetchReportsFromSupabase,
  insertReportToSupabase,
  insertChallengeCommentToSupabase,
  insertReportCommentToSupabase,
  toggleChallengeUpvoteInSupabase,
  toggleReportSupportInSupabase,
  updateChallengeInSupabase,
  saveLocalUserProfile,
  getLocalUserProfile,
  clearLocalUserProfile,
  saveRegisteredAccount,
  findRegisteredAccount,
} from '@/lib/supabase';
import {
  loadSavedDrafts,
  persistDrafts,
  loadSupportedProblems,
  persistSupportedProblems,
} from '@/lib/local-storage';
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

  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;


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


  networkStatus: NetworkStatus;
  setNetworkStatus: (status: NetworkStatus) => void;
  lastSyncedTime: string;
  syncDrafts: () => Promise<void>;


  user: UserProfile;
  session: Session | null;
  isLoadingAuth: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loginWithMobile: (
    phone: string,
    name?: string,
    role?: UserRole,
    organization?: string,
    district?: string,
    block?: string
  ) => Promise<void>;
  signInWithEmail: (
    email: string,
    password: string,
    metadata?: {
      fullName?: string;
      role?: UserRole;
      organization?: string;
      district?: string;
      block?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata: {
      fullName: string;
      phone?: string;
      role: UserRole;
      organization?: string;
      district?: string;
      block?: string;
    }
  ) => Promise<{ success: boolean; requiresEmailConfirmation: boolean; error?: string }>;
  continueAsGuest: (name?: string, phone?: string) => void;
  logout: () => Promise<void>;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;


  reports: CivicReport[];
  drafts: DraftReport[];
  getReportById: (id: string) => CivicReport | undefined;
  submitNewReport: (reportData: Partial<CivicReport>) => string;
  saveNewDraft: (draftData: Partial<DraftReport>) => string;
  deleteDraft: (draftId: string) => void;


  supportedProblemIds: Record<string, boolean>;
  toggleSupportProblem: (reportId: string) => void;
  hasSupportedProblem: (reportId: string) => boolean;


  requestReportUpdate: (reportId: string) => void;
  addReportComment: (reportId: string, comment: string) => void;


  notifications: CivicNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;


  featuredStory: SuccessStory;


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


  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
}

const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  citizen: {
    name: 'Citizen Member',
    phone: '',
    email: '',
    communityRole: 'Citizen Member',
    district: 'Ranchi',
    block: 'Ormanjhi',
    isGuest: false,
  },
  university: {
    name: 'University Faculty / Student',
    phone: '',
    email: '',
    communityRole: 'Faculty / Student (Jharkhand University)',
    district: 'Ranchi',
    block: 'Ranchi Sadar',
    isGuest: false,
  },
  industry: {
    name: 'Industry Partner',
    phone: '',
    email: '',
    communityRole: 'CSR / Innovation Partner',
    district: 'East Singhbhum',
    block: 'Jamshedpur',
    isGuest: false,
  },
  government: {
    name: 'District Administration',
    phone: '',
    email: '',
    communityRole: 'District Nodal Officer',
    district: 'Ranchi',
    block: 'Ranchi Sadar',
    isGuest: false,
  },
};

const DEFAULT_USER = ROLE_PROFILES.citizen;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {

  const [language, setLanguage] = useState<Language>('en');


  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [dataSavingMode, setDataSavingMode] = useState<boolean>(false);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState<boolean>(true);


  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');


  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [userRole, setUserRoleState] = useState<UserRole>('citizen');
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const syncUserFromSupabase = useCallback(async (sbUser: User | null) => {
    if (!sbUser) return;

    try {
      const meta = sbUser.user_metadata || {};
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      const role: UserRole = (profileData?.role || meta.role || 'citizen') as UserRole;
      const name =
        profileData?.full_name ||
        meta.full_name ||
        meta.name ||
        (sbUser.email ? sbUser.email.split('@')[0] : 'Citizen');
      const phone = profileData?.phone || meta.phone || sbUser.phone || '';
      const district = profileData?.district || meta.district || 'Ranchi';
      const block = profileData?.block || meta.block || 'Ranchi Sadar';
      const communityRole =
        profileData?.community_role ||
        meta.community_role ||
        (role === 'citizen'
          ? 'Citizen Member'
          : role === 'university'
          ? 'Faculty Lead'
          : role === 'industry'
          ? 'CSR Lead'
          : 'District Nodal Officer');

      setUserRoleState(role);
      setUser({
        name,
        phone,
        email: sbUser.email || '',
        communityRole,
        district,
        block,
        isGuest: false,
      });


      if (!profileData) {
        try {
          await supabase.from('profiles').upsert({
            id: sbUser.id,
            email: sbUser.email,
            full_name: name,
            phone,
            role,
            district,
            block,
            community_role: communityRole,
          });
        } catch (_) {}
      }
    } catch (e) {
      console.warn('Error syncing profile from Supabase:', e);
      const meta = sbUser.user_metadata || {};
      const role: UserRole = (meta.role || 'citizen') as UserRole;
      setUserRoleState(role);
      setUser({
        name: meta.full_name || meta.name || (sbUser.email ? sbUser.email.split('@')[0] : 'Citizen'),
        phone: meta.phone || sbUser.phone || '',
        email: sbUser.email || '',
        communityRole: meta.community_role || 'Citizen Member',
        district: meta.district || 'Ranchi',
        block: meta.block || 'Ranchi Sadar',
        isGuest: false,
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;


    supabase.auth
      .getSession()
      .then(async ({ data: { session: existingSession } }) => {
        if (!mounted) return;
        setSession(existingSession);
        if (existingSession?.user) {
          await syncUserFromSupabase(existingSession.user);
        } else {

          const localStored = await getLocalUserProfile();
          if (localStored?.profile && mounted) {
            setUser(localStored.profile);
            setUserRoleState((localStored.role || 'citizen') as UserRole);
          }
        }
        setIsLoadingAuth(false);
      })
      .catch(async (err) => {
        console.warn('Supabase getSession error:', err);
        const localStored = await getLocalUserProfile();
        if (localStored?.profile && mounted) {
          setUser(localStored.profile);
          setUserRoleState((localStored.role || 'citizen') as UserRole);
        }
        if (mounted) setIsLoadingAuth(false);
      });


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        await syncUserFromSupabase(newSession.user);
      } else if (_event === 'SIGNED_OUT') {
        setUser({
          name: 'Guest Citizen',
          phone: '',
          email: '',
          communityRole: 'Guest',
          district: 'Ranchi',
          block: 'Ranchi Sadar',
          isGuest: true,
        });
        setUserRoleState('citizen');
      }
    });


    fetchChallengesFromSupabase().then((sbChallenges) => {
      if (!mounted || !sbChallenges || sbChallenges.length === 0) return;
      setChallenges((prev) => {
        const ids = new Set(sbChallenges.map((c) => c.id));
        const filteredPrev = prev.filter((p) => !ids.has(p.id));
        return [...sbChallenges, ...filteredPrev];
      });
    });

    fetchReportsFromSupabase().then((sbReports) => {
      if (!mounted || !sbReports || sbReports.length === 0) return;
      setReports((prev) => {
        const ids = new Set(sbReports.map((r) => r.id));
        const filteredPrev = prev.filter((p) => !ids.has(p.id));
        return [...sbReports, ...filteredPrev];
      });
    });


    loadSavedDrafts().then((savedDrafts) => {
      if (!mounted || !savedDrafts || savedDrafts.length === 0) return;
      setDrafts((prev) => {
        const ids = new Set(savedDrafts.map((d) => d.id));
        const filtered = prev.filter((d) => !ids.has(d.id));
        return [...savedDrafts, ...filtered];
      });
    });


    loadSupportedProblems().then((savedSupports) => {
      if (!mounted || !savedSupports) return;
      setSupportedProblemIds((prev) => ({ ...prev, ...savedSupports }));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncUserFromSupabase]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    setUser((prev) => {
      if (prev && prev.name && prev.name !== 'Guest Citizen' && !prev.isGuest) {
        const updated = {
          ...prev,
          communityRole:
            role === 'university'
              ? (prev.communityRole?.includes('University') || prev.communityRole?.includes('Faculty') || prev.communityRole?.includes('BIT') || prev.communityRole?.includes('IIT')
                  ? prev.communityRole
                  : 'Faculty / Student')
              : role === 'citizen'
              ? 'Citizen Member'
              : role === 'industry'
              ? 'CSR Lead'
              : 'District Nodal Officer',
        };
        saveLocalUserProfile(updated, role);
        return updated;
      }
      return ROLE_PROFILES[role] || prev;
    });
  };
  const [challenges, setChallenges] = useState<Challenge[]>(() => enrichChallenges(CHALLENGES_DATA));


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


  const [supportedProblemIds, setSupportedProblemIds] = useState<Record<string, boolean>>({
    'SC-JH-84920': true,
    'SC-JH-84924': true,
  });


  const [notifications, setNotifications] = useState<CivicNotification[]>(INITIAL_NOTIFICATIONS);


  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });


  const fontScale = textSize === 'small' ? 0.9 : textSize === 'large' ? 1.18 : 1.0;


  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || '';
  };


  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));


  const toggleSupportProblem = (reportId: string) => {
    const currentlySupported = !!supportedProblemIds[reportId];
    const newSupports = {
      ...supportedProblemIds,
      [reportId]: !currentlySupported,
    };
    setSupportedProblemIds(newSupports);
    persistSupportedProblems(newSupports);

    let updatedSupporters = 0;
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          updatedSupporters = currentlySupported ? Math.max(0, r.supporters - 1) : r.supporters + 1;
          return {
            ...r,
            supporters: updatedSupporters,
          };
        }
        return r;
      })
    );

    if (session?.user?.id) {
      toggleReportSupportInSupabase(reportId, session.user.id, currentlySupported, updatedSupporters);
    }

    showToast(
      currentlySupported
        ? 'Support removed'
        : 'You supported this problem!',
      'success'
    );
  };

  const hasSupportedProblem = (reportId: string): boolean => {
    return !!supportedProblemIds[reportId];
  };


  const submitNewReport = (reportData: Partial<CivicReport>): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `SC-JH-${randomNum}`;

    const newReport: CivicReport = {
      id: newId,
      titleEn: reportData.titleEn || 'New Community Issue',
      titleHi: reportData.titleEn || 'New Community Issue',
      descriptionEn: reportData.descriptionEn || '',
      descriptionHi: reportData.descriptionEn || '',
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
          captionHi: 'Attached field photograph',
        },
      ],
      nextExpectedAction: {
        labelEn: 'Community coordinator validation within 24-48 hours',
        labelHi: 'Community coordinator validation within 24-48 hours',
        estimatedDate: 'Tomorrow, 05:00 PM',
      },
      timeline: [
        {
          status: 'Received',
          timestamp: 'Just now',
          titleEn: 'Report Lodged Successfully',
          titleHi: 'Report Lodged Successfully',
          descriptionEn: 'Your grievance has been logged and assigned tracking ID.',
          descriptionHi: 'Your grievance has been logged and assigned tracking ID.',
          actor: user.name || 'Citizen',
          completed: true,
          current: true,
        },
        {
          status: 'Validated',
          timestamp: 'Upcoming (24h)',
          titleEn: 'Coordination Check',
          titleHi: 'Coordination Check',
          descriptionEn: 'Local coordinator will inspect site details.',
          descriptionHi: 'Local coordinator will inspect site details.',
          actor: 'Block Coordinator',
          completed: false,
        },
        {
          status: 'Assigned',
          timestamp: 'Upcoming',
          titleEn: 'Routing to Nodal Agency',
          titleHi: 'Routing to Nodal Agency',
          descriptionEn: 'Report forwarded to line department.',
          descriptionHi: 'Report forwarded to line department.',
          actor: 'District Administration',
          completed: false,
        },
        {
          status: 'In Progress',
          timestamp: 'Upcoming',
          titleEn: 'Remedial Action Started',
          titleHi: 'Remedial Action Started',
          descriptionEn: 'Field team commences work on ground.',
          descriptionHi: 'Field team commences work on ground.',
          actor: 'Field Operations Team',
          completed: false,
        },
        {
          status: 'Pilot',
          timestamp: 'Upcoming',
          titleEn: 'Community Trial',
          titleHi: 'Community Trial',
          descriptionEn: 'Testing solution with affected citizens.',
          descriptionHi: 'Testing solution with affected citizens.',
          actor: 'User Committee',
          completed: false,
        },
        {
          status: 'Deployed',
          timestamp: 'Upcoming',
          titleEn: 'Permanent Implementation',
          titleHi: 'Permanent Implementation',
          descriptionEn: 'Solution fully operational on site.',
          descriptionHi: 'Solution fully operational on site.',
          actor: 'Implementing Agency',
          completed: false,
        },
        {
          status: 'Closed',
          timestamp: 'Upcoming',
          titleEn: 'Citizen Confirmation & Close',
          titleHi: 'Citizen Confirmation & Close',
          descriptionEn: 'Verified by citizen reporter.',
          descriptionHi: 'Verified by citizen reporter.',
          actor: 'Samadhan Community Lead',
          completed: false,
        },
      ],
      moderatedComments: [],
    };

    setReports((prev) => [newReport, ...prev]);

    insertReportToSupabase(newReport, session?.user?.id);

    const newNotif: CivicNotification = {
      id: `n-${Date.now()}`,
      type: 'report_received',
      reportId: newId,
      titleEn: `Report Logged (#${newId})`,
      titleHi: `Report Logged (#${newId})`,
      messageEn: `Your report has been received and scheduled for validation.`,
      messageHi: `Your report has been received and scheduled for validation.`,
      timestamp: 'Just now',
      isRead: false,
      actionRoute: `/report-detail?id=${newId}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newId;
  };


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

    setDrafts((prev) => {
      const updated = [newDraft, ...prev];
      persistDrafts(updated);
      return updated;
    });
    showToast('Draft saved securely on this device.', 'info');
    return draftId;
  };

  const deleteDraft = (draftId: string) => {
    setDrafts((prev) => {
      const updated = prev.filter((d) => d.id !== draftId);
      persistDrafts(updated);
      return updated;
    });
    showToast('Draft deleted.', 'info');
  };


  const syncDrafts = async () => {
    if (drafts.length === 0) {
      showToast('No pending drafts to sync.', 'info');
      return;
    }

    setNetworkStatus('syncing');
    showToast('Syncing drafts with server...', 'info');


    await new Promise((r) => setTimeout(r, 2000));


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
    showToast('All drafts synchronized successfully!', 'success');
  };

  const getReportById = (id: string): CivicReport | undefined => {
    return reports.find((r) => r.id === id);
  };

  const requestReportUpdate = (reportId: string) => {
    showToast('Update request sent to nodal field team.', 'success');
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
    insertReportCommentToSupabase(
      reportId,
      comment.trim(),
      user.name,
      user.isGuest ? 'Community Member' : user.communityRole,
      session?.user?.id
    );
    showToast('Your comment was posted.', 'success');
  };


  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'info');
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


    insertChallengeToSupabase(created, session?.user?.id);

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
    let newUpvotes = 1;
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          newUpvotes = c.upvotes + 1;
          return { ...c, upvotes: newUpvotes };
        }
        return c;
      })
    );
    if (session?.user?.id) {
      toggleChallengeUpvoteInSupabase(id, session.user.id, false, newUpvotes);
    }
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
    insertChallengeCommentToSupabase(id, text.trim(), user.name, userRole, session?.user?.id);
    showToast('Comment posted to the public challenge thread.', 'success');
  };

  const validateChallenge = (id: string) => {
    let updatedProgress = 18;
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updatedProgress = Math.max(c.progressPercent, 18);
          return { ...c, stage: 'Validated' as ChallengeStage, progressPercent: updatedProgress };
        }
        return c;
      })
    );
    updateChallengeInSupabase(id, { stage: 'Validated', progress_percent: updatedProgress });
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
    const assignment = {
      heiId: uni.id,
      heiName: uni.name,
      heiShortName: uni.shortName,
      facultyLead: `Faculty coordinator, ${uni.shortName}`,
      teamSize: 0,
      disciplines: uni.disciplines.slice(0, 3),
      proposalSubmitted: false,
    };
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              stage: 'Assigned' as ChallengeStage,
              progressPercent: Math.max(c.progressPercent, 28),
              assignedUniversity: assignment,
            }
          : c
      )
    );
    updateChallengeInSupabase(id, {
      assigned_university: assignment,
      stage: 'Assigned',
      progress_percent: 28,
    });
    pushPortalNote('Routed to university', `${uni.shortName} received this challenge based on domain expertise.`, `/challenge-detail?id=${id}`);
    showToast(`Routed to ${uni.shortName}.`, 'success');
  };

  const acceptChallenge = (id: string) => {
    let assignedData: any = null;
    const userOrg = user.communityRole || '';
    const defaultUni =
      UNIVERSITIES_DATA.find(
        (u) =>
          userOrg.toLowerCase().includes(u.shortName.toLowerCase()) ||
          userOrg.toLowerCase().includes(u.name.toLowerCase())
      ) || UNIVERSITIES_DATA[0];

    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        assignedData = c.assignedUniversity || {
          heiId: defaultUni.id,
          heiName: defaultUni.name,
          shortName: defaultUni.shortName,
          facultyLead: user.name || 'University Faculty Lead',
          disciplines: defaultUni.disciplines.slice(0, 3),
          proposalSubmitted: false,
          teamSize: 4,
        };
        return {
          ...c,
          stage: 'In Progress' as ChallengeStage,
          progressPercent: Math.max(c.progressPercent, 35),
          assignedUniversity: assignedData,
        };
      })
    );
    updateChallengeInSupabase(id, {
      stage: 'In Progress',
      progress_percent: 35,
      ...(assignedData ? { assigned_university: assignedData } : {}),
    });
    showToast('University accepted this challenge.', 'success');
  };

  const formProjectTeam = (id: string) => {
    let assignedData: any = null;
    const userOrg = user.communityRole || '';
    const defaultUni =
      UNIVERSITIES_DATA.find(
        (u) =>
          userOrg.toLowerCase().includes(u.shortName.toLowerCase()) ||
          userOrg.toLowerCase().includes(u.name.toLowerCase())
      ) || UNIVERSITIES_DATA[0];

    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const lead = user.name || c.assignedUniversity?.facultyLead || 'University Faculty Lead';
        assignedData = {
          ...(c.assignedUniversity || {
            heiId: defaultUni.id,
            heiName: defaultUni.name,
            shortName: defaultUni.shortName,
            disciplines: defaultUni.disciplines.slice(0, 3),
            proposalSubmitted: false,
          }),
          facultyLead: lead,
          teamSize: 8,
        };
        return {
          ...c,
          assignedUniversity: assignedData,
          teamMembers: [
            { name: lead, role: 'Faculty Mentor / Project Lead', discipline: assignedData.disciplines?.[0] || c.domain },
            { name: 'Research Scholar', role: 'Student Lead', discipline: 'Engineering' },
            { name: 'Field Investigator', role: 'Field Researcher', discipline: 'Community Engagement' },
            { name: 'Technical Associate', role: 'Prototype Engineer', discipline: 'Applied Technology' },
          ],
        };
      })
    );
    if (assignedData) {
      updateChallengeInSupabase(id, { assigned_university: assignedData });
    }
    showToast('Project team constituted.', 'success');
  };

  const submitProposal = (id: string) => {
    let assignedData: any = null;
    const userOrg = user.communityRole || '';
    const defaultUni =
      UNIVERSITIES_DATA.find(
        (u) =>
          userOrg.toLowerCase().includes(u.shortName.toLowerCase()) ||
          userOrg.toLowerCase().includes(u.name.toLowerCase())
      ) || UNIVERSITIES_DATA[0];

    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        assignedData = {
          ...(c.assignedUniversity || {
            heiId: defaultUni.id,
            heiName: defaultUni.name,
            shortName: defaultUni.shortName,
            facultyLead: user.name || 'University Faculty Lead',
            disciplines: defaultUni.disciplines.slice(0, 3),
            teamSize: 8,
          }),
          proposalSubmitted: true,
        };
        return {
          ...c,
          stage: 'In Progress' as ChallengeStage,
          progressPercent: Math.max(c.progressPercent, 45),
          assignedUniversity: assignedData,
        };
      })
    );
    updateChallengeInSupabase(id, {
      stage: 'In Progress',
      progress_percent: 45,
      ...(assignedData ? { assigned_university: assignedData } : {}),
    });
    pushPortalNote('Solution proposal submitted', 'The HEI uploaded an innovation proposal for review.', `/challenge-detail?id=${id}`);
    showToast('Proposal submitted to the portal.', 'success');
  };

  const offerIndustrySupport: AppContextType['offerIndustrySupport'] = (id, partnerId, kind) => {
    const partner = INDUSTRY_PARTNERS_DATA.find((p) => p.id === partnerId) || INDUSTRY_PARTNERS_DATA[0];
    const partnerData = {
      partnerId: partner.id,
      companyName: partner.companyName,
      type: partner.type,
      contributionType: [kind],
      fundingAmount: kind === 'Funding' ? partner.totalFundingCommitted : undefined,
    };
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              industryPartner: {
                ...partnerData,
                fundingAmount: kind === 'Funding' ? partner.totalFundingCommitted : c.industryPartner?.fundingAmount,
              },
            }
          : c
      )
    );
    updateChallengeInSupabase(id, { industry_partner: partnerData });
    pushPortalNote('Industry joined the project', `${partner.shortName} offered ${kind.toLowerCase()}.`, `/challenge-detail?id=${id}`);
    showToast(`${partner.shortName} will ${kind.toLowerCase()}.`, 'success');
  };

  const toggleMilestone = (id: string, milestoneId: string) => {
    let updatedMilestones: any[] = [];
    let updatedProgress = 0;
    let updatedStage = 'Submitted';

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

        updatedMilestones = milestones;
        updatedProgress = progressPercent;
        updatedStage = stage;

        return { ...c, milestones, progressPercent, stage };
      })
    );

    updateChallengeInSupabase(id, {
      milestones: updatedMilestones,
      progress_percent: updatedProgress,
      stage: updatedStage,
    });
  };


  const signInWithEmail = async (
    email: string,
    password: string,
    metadata?: {
      fullName?: string;
      role?: UserRole;
      organization?: string;
      district?: string;
      block?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const targetRole = metadata?.role || userRole || 'citizen';
      const fallbackName = metadata?.fullName?.trim() || cleanEmail.split('@')[0] || 'User';
      const targetOrg =
        metadata?.organization ||
        (targetRole === 'university'
          ? 'Faculty / Student'
          : targetRole === 'industry'
          ? 'CSR Lead'
          : targetRole === 'government'
          ? 'District Nodal Officer'
          : 'Citizen Member');

      let authenticatedWithCloud = false;

      try {
        const { data } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (data?.session && data?.user) {
          setSession(data.session);
          await syncUserFromSupabase(data.user);
          authenticatedWithCloud = true;
        }
      } catch (_) {}

      if (!authenticatedWithCloud) {
        const registered = await findRegisteredAccount(cleanEmail);
        const resolvedName = registered?.fullName || fallbackName;
        const resolvedRole = (registered?.role || targetRole) as UserRole;
        const resolvedOrg = registered?.organization || targetOrg;
        const resolvedDistrict = registered?.district || metadata?.district || 'Ranchi';
        const resolvedBlock = registered?.block || metadata?.block || 'Ranchi Sadar';

        const userObj: UserProfile = {
          name: resolvedName,
          phone: registered?.phone || '',
          email: cleanEmail,
          communityRole: resolvedOrg,
          district: resolvedDistrict,
          block: resolvedBlock,
          isGuest: false,
        };

        setUser(userObj);
        setUserRoleState(resolvedRole);
        await saveLocalUserProfile(userObj, resolvedRole);
        await saveRegisteredAccount({
          email: cleanEmail,
          password: cleanPassword,
          fullName: resolvedName,
          role: resolvedRole,
          organization: resolvedOrg,
          district: resolvedDistrict,
          block: resolvedBlock,
        });
      }

      showToast(`Welcome! Logged in successfully.`, 'success');
      return { success: true };
    } catch (e: any) {
      const msg = e?.message || 'Login failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata: {
      fullName: string;
      phone?: string;
      role: UserRole;
      organization?: string;
      district?: string;
      block?: string;
    }
  ): Promise<{ success: boolean; requiresEmailConfirmation: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const role = metadata.role || 'citizen';
      const cleanName = metadata.fullName.trim();
      const communityRole =
        metadata.organization ||
        (role === 'citizen'
          ? 'Citizen Member'
          : role === 'university'
          ? 'Faculty / Student'
          : role === 'industry'
          ? 'CSR Lead'
          : 'District Nodal Officer');

      try {
        const { data } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              name: cleanName,
              phone: metadata.phone || '',
              role,
              district: metadata.district || 'Ranchi',
              block: metadata.block || 'Ranchi Sadar',
            },
          },
        });
        if (data?.session) {
          setSession(data.session);
        }
      } catch (_) {}

      const userObj: UserProfile = {
        name: cleanName,
        phone: metadata.phone || '',
        email: cleanEmail,
        communityRole,
        district: metadata.district || 'Ranchi',
        block: metadata.block || 'Ranchi Sadar',
        isGuest: false,
      };

      setUser(userObj);
      setUserRoleState(role);
      await saveLocalUserProfile(userObj, role);
      await saveRegisteredAccount({
        email: cleanEmail,
        password: cleanPassword,
        fullName: cleanName,
        phone: metadata.phone || '',
        role,
        organization: communityRole,
        district: metadata.district || 'Ranchi',
        block: metadata.block || 'Ranchi Sadar',
      });

      showToast(`Account created for ${cleanName}!`, 'success');
      return { success: true, requiresEmailConfirmation: false };
    } catch (e: any) {
      const msg = e?.message || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, requiresEmailConfirmation: false, error: msg };
    }
  };

  const loginWithMobile = async (
    phone: string,
    name?: string,
    role?: UserRole,
    organization?: string,
    district?: string,
    block?: string
  ) => {
    const activeRole = role || userRole;
    const cleanPhone = phone.trim();
    const cleanName = name?.trim() || (activeRole === 'university' ? 'University Faculty' : 'Citizen');
    const cleanOrg = organization?.trim() || (activeRole === 'university' ? 'Faculty / Student' : 'Citizen Member');
    const cleanDistrict = district || 'Ranchi';
    const cleanBlock = block || 'Ranchi Sadar';

    const userObj: UserProfile = {
      name: cleanName,
      phone: cleanPhone,
      email: '',
      communityRole: cleanOrg,
      district: cleanDistrict,
      block: cleanBlock,
      isGuest: false,
    };

    setUser(userObj);
    setUserRoleState(activeRole);
    await saveLocalUserProfile(userObj, activeRole);
    await saveRegisteredAccount({
      phone: cleanPhone,
      fullName: cleanName,
      role: activeRole,
      organization: cleanOrg,
      district: cleanDistrict,
      block: cleanBlock,
    });
    showToast(`Logged in as ${cleanName}!`, 'success');
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
    showToast('Continuing as guest citizen.', 'info');
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...profile };
      saveLocalUserProfile(updated, userRole);
      return updated;
    });

    try {
      if (session?.user) {
        await supabase.auth.updateUser({
          data: {
            full_name: profile.name,
            phone: profile.phone,
            district: profile.district,
            block: profile.block,
            community_role: profile.communityRole,
          },
        });

        await supabase
          .from('profiles')
          .update({
            full_name: profile.name,
            phone: profile.phone,
            district: profile.district,
            block: profile.block,
            community_role: profile.communityRole,
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.user.id);
      }
    } catch (e) {
      console.warn('Error updating profile in Supabase:', e);
    }

    showToast('Profile updated successfully.', 'success');
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error signing out of Supabase:', e);
    }
    await clearLocalUserProfile();
    setSession(null);
    setUser({
      name: 'Guest Citizen',
      phone: '',
      email: '',
      communityRole: 'Guest',
      district: 'Ranchi',
      block: 'Ranchi Sadar',
      isGuest: true,
    });
    setUserRoleState('citizen');
    showToast(
      'You have logged out.',
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
        session,
        isLoadingAuth,
        signInWithEmail,
        signUpWithEmail,
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
