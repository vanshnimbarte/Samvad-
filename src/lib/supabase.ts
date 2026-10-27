import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { Challenge } from '@/data/challenges';
import type { CivicReport } from '@/data/samadhan-mock-data';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://iajpmeoqtuqrwwesuvgq.supabase.co';
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_z_aMo4DrPG3vSQLcPPGrOg_pW2jZsSK';


const ExpoStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('Supabase storage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('Supabase storage setItem error:', error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn('Supabase storage removeItem error:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface SupabaseUserProfile {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: 'citizen' | 'university' | 'industry' | 'government';
  district?: string;
  block?: string;
  community_role?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

const USER_SESSION_KEY = 'SAMVAD_SAVED_USER_SESSION_V2';

export async function saveLocalUserProfile(profile: any, role: string): Promise<void> {
  try {
    const jsonStr = JSON.stringify({ profile, role, savedAt: Date.now() });
    await ExpoStorageAdapter.setItem(USER_SESSION_KEY, jsonStr);
  } catch (err) {
    console.warn('Failed to save local user profile:', err);
  }
}

export async function getLocalUserProfile(): Promise<{ profile: any; role: string } | null> {
  try {
    const str = await ExpoStorageAdapter.getItem(USER_SESSION_KEY);
    if (!str) return null;
    return JSON.parse(str);
  } catch (err) {
    console.warn('Failed to get local user profile:', err);
    return null;
  }
}

export async function clearLocalUserProfile(): Promise<void> {
  try {
    await ExpoStorageAdapter.removeItem(USER_SESSION_KEY);
  } catch (err) {
    console.warn('Failed to clear local user profile:', err);
  }
}

export type AuthProfilePayload = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  role?: 'citizen' | 'university' | 'industry' | 'government' | string;
  district?: string | null;
  block?: string | null;
  community_role?: string | null;
};

export function clerkIdToUUID(clerkId: string): string {
  if (!clerkId) return '00000000-0000-4000-8000-000000000000';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clerkId)) {
    return clerkId;
  }
  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c6ce57;
  for (let i = 0; i < clerkId.length; i++) {
    const ch = clerkId.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
  const p1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const p2 = ((hash2 >>> 16) & 0xffff).toString(16).padStart(4, '0');
  const p3 = '4' + ((hash2 >>> 4) & 0x0fff).toString(16).padStart(3, '0');
  const p4 = 'a' + ((hash1 >>> 4) & 0x0fff).toString(16).padStart(3, '0');
  const p5 =
    ((((hash2 & 0xffff) << 16) | (hash1 & 0xffff)) >>> 0).toString(16).padStart(8, '0') +
    (((hash1 >>> 8) & 0xffff) >>> 0).toString(16).padStart(4, '0');
  return `${p1}-${p2}-${p3}-${p4}-${p5.slice(0, 12)}`;
}

export async function saveAuthProfile(
  profile: AuthProfilePayload
): Promise<{ saved: boolean; error?: string }> {
  if (!profile.id) {
    return { saved: false, error: 'Missing authenticated user id' };
  }

  const cleanId = clerkIdToUUID(profile.id);

  const row = {
    id: cleanId,
    email: profile.email || null,
    full_name: profile.full_name || null,
    phone: profile.phone || null,
    role: profile.role || 'citizen',
    district: profile.district || 'Ranchi',
    block: profile.block || 'Ranchi Sadar',
    community_role: profile.community_role || 'Citizen Member',
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'id' });
  if (!error) {
    return { saved: true };
  }

  console.warn('saveAuthProfile error:', error.message);
  return {
    saved: false,
    error: error.message,
  };
}





export async function fetchChallengesFromSupabase(currentUserId?: string): Promise<Challenge[] | null> {
  try {
    const formattedUserId = currentUserId ? clerkIdToUUID(currentUserId) : null;
    const [challengesRes, commentsRes] = await Promise.all([
      supabase.from('challenges').select('*').order('created_at', { ascending: false }),
      supabase.from('challenge_comments').select('*').order('created_at', { ascending: true }),
    ]);

    if (challengesRes.error || !challengesRes.data || challengesRes.data.length === 0) {
      return null;
    }

    const commentsMap: Record<string, any[]> = {};
    if (commentsRes.data) {
      commentsRes.data.forEach((c: any) => {
        if (!commentsMap[c.challenge_id]) commentsMap[c.challenge_id] = [];
        commentsMap[c.challenge_id].push({
          id: c.id,
          author: c.author_name || 'Contributor',
          role: c.author_role || 'citizen',
          text: c.comment_text || '',
          at: c.created_at
            ? new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Recently',
        });
      });
    }

    return challengesRes.data.map((row: any) => {
      const isMine = !!(
        formattedUserId &&
        row.user_id &&
        row.user_id.toLowerCase() === formattedUserId.toLowerCase()
      );
      const rowComments = commentsMap[row.id] || [];
      return {
        id: row.id,
        title: row.title,
        domain: row.domain,
        domainIcon: row.domain_icon || 'Sparkles',
        domainColor: row.domain_color || '#16A34A',
        district: row.district,
        location: row.location,
        description: row.description,
        stage: row.stage,
        urgency: row.urgency,
        impactLevel: row.impact_level || 'Medium',
        submitterType: row.submitter_type || 'Citizen',
        submittedBy: row.submitted_by,
        submittedAt: row.submitted_at || new Date(row.created_at).toISOString().slice(0, 10),
        timeAgo: 'Recently',
        beneficiaries: row.beneficiaries || 100,
        upvotes: row.upvotes || 0,
        comments: rowComments.length > 0 ? rowComments.length : (row.comments || 0),
        photoCount: row.photo_count || 0,
        aiTags: Array.isArray(row.ai_tags) ? row.ai_tags : [],
        milestones: Array.isArray(row.milestones) ? row.milestones : [],
        assignedUniversity: row.assigned_university || undefined,
        industryPartner: row.industry_partner || undefined,
        progressPercent: row.progress_percent || 0,
        imageUrl: row.image_url || undefined,
        requiredSkills: Array.isArray(row.required_skills) ? row.required_skills : [],
        fundingAvailable: row.funding_available || undefined,
        applications: row.applications || 0,
        deadline: row.deadline || undefined,
        department: row.department || undefined,
        aiConfidence: row.ai_confidence || 85,
        commentsFeed: rowComments,
        isUserChallenge: isMine,
      };
    });
  } catch (e) {
    console.warn('fetchChallengesFromSupabase error:', e);
    return null;
  }
}

export async function uploadFileToSupabaseStorage(
  uri: string,
  folder: string = 'evidence'
): Promise<string> {
  if (!uri || uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  try {
    const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanExt = ['png', 'jpg', 'jpeg', 'webp', 'mp4'].includes(ext) ? ext : 'jpg';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${cleanExt}`;
    const contentType = cleanExt === 'mp4' ? 'video/mp4' : `image/${cleanExt === 'png' ? 'png' : 'jpeg'}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const { error } = await supabase.storage.from('media').upload(fileName, blob, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return uri;
    }

    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
    return publicUrlData?.publicUrl || uri;
  } catch (err) {
    console.warn('uploadFileToSupabaseStorage exception:', err);
    return uri;
  }
}

export async function insertChallengeToSupabase(challenge: Challenge, userId?: string): Promise<boolean> {
  try {
    const formattedUserId = userId ? clerkIdToUUID(userId) : null;
    const rawUrgency = challenge.urgency || 'Medium';
    const safeUrgency =
      rawUrgency.toLowerCase() === 'emergency'
        ? 'Critical'
        : ['Low', 'Medium', 'High', 'Critical'].includes(rawUrgency)
        ? rawUrgency
        : rawUrgency.charAt(0).toUpperCase() + rawUrgency.slice(1).toLowerCase();

    let finalImageUrl = challenge.imageUrl;
    if (finalImageUrl && !finalImageUrl.startsWith('http')) {
      finalImageUrl = await uploadFileToSupabaseStorage(finalImageUrl, 'challenges');
    }

    const { error } = await supabase.from('challenges').upsert({
      id: challenge.id,
      user_id: formattedUserId,
      title: challenge.title,
      domain: challenge.domain,
      domain_icon: challenge.domainIcon,
      domain_color: challenge.domainColor,
      district: challenge.district,
      location: challenge.location,
      description: challenge.description,
      stage: challenge.stage,
      urgency: safeUrgency,
      impact_level: challenge.impactLevel,
      submitter_type: challenge.submitterType,
      submitted_by: challenge.submittedBy,
      submitted_at: challenge.submittedAt,
      beneficiaries: challenge.beneficiaries,
      upvotes: challenge.upvotes,
      comments: challenge.comments,
      photo_count: challenge.photoCount,
      ai_tags: challenge.aiTags,
      milestones: challenge.milestones,
      assigned_university: challenge.assignedUniversity || null,
      industry_partner: challenge.industryPartner || null,
      progress_percent: challenge.progressPercent,
      image_url: finalImageUrl || null,
      required_skills: challenge.requiredSkills || [],
      funding_available: challenge.fundingAvailable || null,
      applications: challenge.applications || 0,
      deadline: challenge.deadline || null,
      department: challenge.department || null,
      ai_confidence: challenge.aiConfidence || 85,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('insertChallengeToSupabase error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('insertChallengeToSupabase exception:', e);
    return false;
  }
}





export async function fetchReportsFromSupabase(currentUserId?: string): Promise<CivicReport[] | null> {
  try {
    const formattedUserId = currentUserId ? clerkIdToUUID(currentUserId) : null;
    const [reportsRes, commentsRes] = await Promise.all([
      supabase.from('civic_reports').select('*').order('created_at', { ascending: false }),
      supabase.from('report_comments').select('*').order('created_at', { ascending: true }),
    ]);

    if (reportsRes.error || !reportsRes.data || reportsRes.data.length === 0) {
      return null;
    }

    const commentsMap: Record<string, any[]> = {};
    if (commentsRes.data) {
      commentsRes.data.forEach((c: any) => {
        if (!commentsMap[c.report_id]) commentsMap[c.report_id] = [];
        commentsMap[c.report_id].push({
          id: c.id,
          author: c.author_name || 'Citizen',
          role: c.author_role || 'Citizen Member',
          comment: c.comment_text || '',
          date: c.created_at
            ? new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Recently',
        });
      });
    }

    return reportsRes.data.map((row: any) => {
      const isMine = !!(
        formattedUserId &&
        row.user_id &&
        row.user_id.toLowerCase() === formattedUserId.toLowerCase()
      );
      return {
        id: row.id,
        titleEn: row.title_en,
        titleHi: row.title_hi || row.title_en,
        descriptionEn: row.description_en,
        descriptionHi: row.description_hi || row.description_en,
        categoryId: row.category_id,
        status: row.status,
        urgency: row.urgency,
        location: row.location,
        submittedAt: new Date(row.created_at).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        submittedBy: row.submitted_by,
        affectedCount: row.affected_count || 1,
        affectedGroups: Array.isArray(row.affected_groups) ? row.affected_groups : [],
        recurring: row.recurring || false,
        supporters: row.supporters || 1,
        isUserReport: isMine,
        media: Array.isArray(row.media) ? row.media : [],
        timeline: Array.isArray(row.timeline) ? row.timeline : [],
        responsibleOrg: row.responsible_org || undefined,
        nextExpectedAction: row.next_expected_action || undefined,
        moderatedComments: commentsMap[row.id] || [],
      };
    });
  } catch (e) {
    console.warn('fetchReportsFromSupabase error:', e);
    return null;
  }
}

export async function fetchUserSupportedProblemIds(userId: string): Promise<Record<string, boolean>> {
  try {
    const formattedUserId = clerkIdToUUID(userId);
    const { data, error } = await supabase
      .from('report_supports')
      .select('report_id')
      .eq('user_id', formattedUserId);

    if (error || !data) return {};
    const map: Record<string, boolean> = {};
    data.forEach((row: any) => {
      if (row.report_id) {
        map[row.report_id] = true;
      }
    });
    return map;
  } catch (e) {
    return {};
  }
}

export async function insertReportToSupabase(report: CivicReport, userId?: string): Promise<boolean> {
  try {
    const formattedUserId = userId ? clerkIdToUUID(userId) : null;
    const rawUrgency = String(report.urgency || 'medium').toLowerCase();
    const safeUrgency = ['low', 'medium', 'high', 'emergency'].includes(rawUrgency)
      ? rawUrgency
      : rawUrgency === 'critical'
      ? 'emergency'
      : 'medium';

    let finalMedia = report.media || [];
    if (finalMedia.length > 0) {
      finalMedia = await Promise.all(
        finalMedia.map(async (m) => {
          if (m.url && !m.url.startsWith('http')) {
            const uploadedUrl = await uploadFileToSupabaseStorage(m.url, 'reports');
            return { ...m, url: uploadedUrl };
          }
          return m;
        })
      );
    }

    const { error } = await supabase.from('civic_reports').upsert({
      id: report.id,
      user_id: formattedUserId,
      title_en: report.titleEn,
      title_hi: report.titleHi,
      description_en: report.descriptionEn,
      description_hi: report.descriptionHi,
      category_id: report.categoryId,
      status: report.status,
      urgency: safeUrgency,
      location: report.location,
      submitted_by: report.submittedBy,
      affected_count: report.affectedCount,
      affected_groups: report.affectedGroups,
      recurring: report.recurring,
      supporters: report.supporters,
      media: finalMedia,
      timeline: report.timeline,
      responsible_org: report.responsibleOrg || null,
      next_expected_action: report.nextExpectedAction || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('insertReportToSupabase error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('insertReportToSupabase exception:', e);
    return false;
  }
}

export async function insertChallengeCommentToSupabase(
  challengeId: string,
  commentText: string,
  authorName: string,
  authorRole: string,
  userId?: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('challenge_comments').insert({
      challenge_id: challengeId,
      user_id: userId ? clerkIdToUUID(userId) : null,
      author_name: authorName,
      author_role: authorRole,
      comment_text: commentText,
    });
    return !error;
  } catch (e) {
    return false;
  }
}

export async function insertReportCommentToSupabase(
  reportId: string,
  commentText: string,
  authorName: string,
  authorRole: string,
  userId?: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('report_comments').insert({
      report_id: reportId,
      user_id: userId ? clerkIdToUUID(userId) : null,
      author_name: authorName,
      author_role: authorRole,
      comment_text: commentText,
    });
    return !error;
  } catch (e) {
    return false;
  }
}

export async function toggleChallengeUpvoteInSupabase(
  challengeId: string,
  userId: string,
  isCurrentlyUpvoted: boolean,
  newUpvoteCount: number
): Promise<boolean> {
  try {
    const formattedUserId = clerkIdToUUID(userId);
    if (isCurrentlyUpvoted) {
      await supabase
        .from('challenge_upvotes')
        .delete()
        .eq('challenge_id', challengeId)
        .eq('user_id', formattedUserId);
    } else {
      await supabase.from('challenge_upvotes').upsert({
        challenge_id: challengeId,
        user_id: formattedUserId,
      });
    }

    await supabase
      .from('challenges')
      .update({ upvotes: Math.max(0, newUpvoteCount) })
      .eq('id', challengeId);

    return true;
  } catch (e) {
    console.warn('toggleChallengeUpvoteInSupabase error:', e);
    return false;
  }
}

export async function toggleReportSupportInSupabase(
  reportId: string,
  userId: string,
  isCurrentlySupported: boolean,
  newSupportCount: number
): Promise<boolean> {
  try {
    const formattedUserId = clerkIdToUUID(userId);
    if (isCurrentlySupported) {
      await supabase
        .from('report_supports')
        .delete()
        .eq('report_id', reportId)
        .eq('user_id', formattedUserId);
    } else {
      await supabase.from('report_supports').upsert({
        report_id: reportId,
        user_id: formattedUserId,
      });
    }

    await supabase
      .from('civic_reports')
      .update({ supporters: Math.max(0, newSupportCount) })
      .eq('id', reportId);

    return true;
  } catch (e) {
    console.warn('toggleReportSupportInSupabase error:', e);
    return false;
  }
}

export async function updateChallengeInSupabase(
  challengeId: string,
  updates: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('challenges')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', challengeId);
    return !error;
  } catch (e) {
    console.warn('updateChallengeInSupabase error:', e);
    return false;
  }
}
