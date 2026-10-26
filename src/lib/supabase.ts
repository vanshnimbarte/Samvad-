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

// Custom storage adapter that handles Native (SecureStore) and Web (localStorage)
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
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// ==============================================================================
// DATABASE HELPERS FOR CHALLENGES
// ==============================================================================

export async function fetchChallengesFromSupabase(): Promise<Challenge[] | null> {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((row: any) => ({
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
      comments: row.comments || 0,
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
    }));
  } catch (e) {
    console.warn('fetchChallengesFromSupabase error:', e);
    return null;
  }
}

export async function insertChallengeToSupabase(challenge: Challenge, userId?: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('challenges').upsert({
      id: challenge.id,
      user_id: userId || null,
      title: challenge.title,
      domain: challenge.domain,
      domain_icon: challenge.domainIcon,
      domain_color: challenge.domainColor,
      district: challenge.district,
      location: challenge.location,
      description: challenge.description,
      stage: challenge.stage,
      urgency: challenge.urgency,
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
      image_url: challenge.imageUrl || null,
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

// ==============================================================================
// DATABASE HELPERS FOR CIVIC REPORTS
// ==============================================================================

export async function fetchReportsFromSupabase(): Promise<CivicReport[] | null> {
  try {
    const { data, error } = await supabase
      .from('civic_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((row: any) => ({
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
      media: Array.isArray(row.media) ? row.media : [],
      timeline: Array.isArray(row.timeline) ? row.timeline : [],
      responsibleOrg: row.responsible_org || undefined,
      nextExpectedAction: row.next_expected_action || undefined,
      moderatedComments: [],
    }));
  } catch (e) {
    console.warn('fetchReportsFromSupabase error:', e);
    return null;
  }
}

export async function insertReportToSupabase(report: CivicReport, userId?: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('civic_reports').upsert({
      id: report.id,
      user_id: userId || null,
      title_en: report.titleEn,
      title_hi: report.titleHi,
      description_en: report.descriptionEn,
      description_hi: report.descriptionHi,
      category_id: report.categoryId,
      status: report.status,
      urgency: report.urgency,
      location: report.location,
      submitted_by: report.submittedBy,
      affected_count: report.affectedCount,
      affected_groups: report.affectedGroups,
      recurring: report.recurring,
      supporters: report.supporters,
      media: report.media,
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

// ==============================================================================
// COMMENTS & UPVOTES HELPERS
// ==============================================================================

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
      user_id: userId || null,
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
      user_id: userId || null,
      author_name: authorName,
      author_role: authorRole,
      comment_text: commentText,
    });
    return !error;
  } catch (e) {
    return false;
  }
}
