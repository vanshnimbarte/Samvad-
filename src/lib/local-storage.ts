import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { DraftReport } from '@/context/AppContext';

const DRAFTS_STORAGE_KEY = 'samvad_local_drafts_v1';
const UPVOTES_STORAGE_KEY = 'samvad_local_upvotes_v1';
const SUPPORTS_STORAGE_KEY = 'samvad_local_supports_v1';

async function getStorageItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return null;
  }
}

async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

// ==============================================================================
// DRAFTS PERSISTENCE
// ==============================================================================

export async function loadSavedDrafts(): Promise<DraftReport[]> {
  try {
    const raw = await getStorageItem(DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('loadSavedDrafts parse error:', e);
    return [];
  }
}

export async function persistDrafts(drafts: DraftReport[]): Promise<void> {
  try {
    await setStorageItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.warn('persistDrafts error:', e);
  }
}

// ==============================================================================
// UPVOTES & SUPPORTS PERSISTENCE
// ==============================================================================

export async function loadSupportedProblems(): Promise<Record<string, boolean>> {
  try {
    const raw = await getStorageItem(SUPPORTS_STORAGE_KEY);
    if (!raw) return { 'SC-JH-84920': true, 'SC-JH-84924': true };
    return JSON.parse(raw) || {};
  } catch (e) {
    return { 'SC-JH-84920': true, 'SC-JH-84924': true };
  }
}

export async function persistSupportedProblems(supports: Record<string, boolean>): Promise<void> {
  try {
    await setStorageItem(SUPPORTS_STORAGE_KEY, JSON.stringify(supports));
  } catch (e) {
    console.warn('persistSupportedProblems error:', e);
  }
}

export async function loadChallengeUpvotes(): Promise<Record<string, boolean>> {
  try {
    const raw = await getStorageItem(UPVOTES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

export async function persistChallengeUpvotes(upvotes: Record<string, boolean>): Promise<void> {
  try {
    await setStorageItem(UPVOTES_STORAGE_KEY, JSON.stringify(upvotes));
  } catch (e) {
    console.warn('persistChallengeUpvotes error:', e);
  }
}
