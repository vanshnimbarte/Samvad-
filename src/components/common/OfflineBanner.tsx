import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  WifiOff,
  RefreshCw,
  Zap,
  SlidersHorizontal,
  CheckCircle,
} from 'lucide-react-native';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { useApp, NetworkStatus } from '@/context/AppContext';

export function OfflineBanner() {
  const {
    networkStatus,
    setNetworkStatus,
    drafts,
    syncDrafts,
    lastSyncedTime,
    dataSavingMode,
    setDataSavingMode,
    language,
    fontScale,
  } = useApp();

  const [showSimulator, setShowSimulator] = useState(false);

  const isOffline = networkStatus === 'offline';
  const isSlow = networkStatus === 'slow';
  const isSyncing = networkStatus === 'syncing';

  // Only show banner if there is an active offline/slow/sync state or user toggled simulator
  if (!isOffline && !isSlow && !isSyncing && !showSimulator) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      {/* Active Status Alert (when not online or syncing) */}
      {(isOffline || isSlow || isSyncing) && (
        <View
          style={[
            styles.bannerContainer,
            isOffline && styles.offlineBg,
            isSlow && styles.slowBg,
            isSyncing && styles.syncingBg,
          ]}>
          <View style={styles.iconRow}>
            {isOffline ? (
              <WifiOff size={18} color="#DC2626" />
            ) : isSlow ? (
              <Zap size={18} color="#D97706" />
            ) : (
              <RefreshCw size={18} color={SamadhanColors.primary} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { fontSize: 13 * fontScale }]}>
                {isOffline
                  ? language === 'hi'
                    ? 'आप ऑफ़लाइन हैं'
                    : 'You are offline'
                  : isSlow
                  ? language === 'hi'
                    ? 'धीमा इंटरनेट कनेक्शन'
                    : 'Slow or unstable connection'
                  : language === 'hi'
                  ? 'सर्वर से सिंक हो रहा है...'
                  : 'Syncing drafts with server...'}
              </Text>

              <Text style={styles.bannerMessage}>
                {isOffline
                  ? language === 'hi'
                    ? 'आपके सहेजे गए ड्राफ्ट इंटरनेट लौटने पर अपने-आप सिंक होंगे।'
                    : 'Your saved drafts will sync automatically when connection returns.'
                  : isSlow
                  ? language === 'hi'
                    ? 'डेटा-बचत मोड सक्रिय है (कम बैंडविड्थ पर छवियां संकुचित हैं)।'
                    : 'Data-saving mode active. Media compressed for 2G/3G.'
                  : `${drafts.length} ${
                      language === 'hi'
                        ? 'ड्राफ्ट सर्वर में भेजे जा रहे हैं...'
                        : 'report(s) syncing to state registry...'
                    }`}
              </Text>
            </View>

            {/* Sync Now Action */}
            {drafts.length > 0 && !isOffline && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sync pending drafts now"
                onPress={syncDrafts}
                style={styles.syncBtn}>
                <RefreshCw size={13} color="#FFFFFF" />
                <Text style={styles.syncBtnText}>
                  {language === 'hi' ? 'सिंक करें' : 'Sync'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Network Simulator Quick Control when toggled */}
      {showSimulator && (
        <View style={styles.simulatorBar}>
          <View style={styles.simulatorOptionsRow}>
            {(['online', 'slow', 'offline'] as NetworkStatus[]).map((st) => (
              <Pressable
                key={st}
                accessibilityRole="button"
                accessibilityLabel={`Switch network simulator to ${st}`}
                onPress={() => {
                  setNetworkStatus(st);
                  if (st === 'slow') setDataSavingMode(true);
                  if (st === 'online') setShowSimulator(false);
                }}
                style={[
                  styles.optionPill,
                  networkStatus === st && styles.optionPillActive,
                ]}>
                <Text
                  style={[
                    styles.optionPillText,
                    networkStatus === st && styles.optionPillTextActive,
                  ]}>
                  {st.toUpperCase()}
                </Text>
              </Pressable>
            ))}

            {drafts.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sync drafts"
                onPress={syncDrafts}
                style={[styles.optionPill, { backgroundColor: SamadhanColors.secondary }]}>
                <Text style={[styles.optionPillText, { color: '#FFFFFF' }]}>
                  ⚡ SYNC DRAFTS ({drafts.length})
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8FAFC',
  },
  bannerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
  },
  offlineBg: {
    backgroundColor: '#FEF2F2',
    borderBottomColor: '#FECACA',
  },
  slowBg: {
    backgroundColor: '#FFFBEB',
    borderBottomColor: '#FDE68A',
  },
  syncingBg: {
    backgroundColor: '#EFF6FF',
    borderBottomColor: '#BFDBFE',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerTitle: {
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  bannerMessage: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SamadhanColors.action,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.md,
    minHeight: 36,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  simulatorBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  simulatorToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simulatorToggleText: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    fontWeight: '600',
  },
  simulatorOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  optionPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionPillActive: {
    backgroundColor: SamadhanColors.primary,
    borderColor: SamadhanColors.primary,
  },
  optionPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
  optionPillTextActive: {
    color: '#FFFFFF',
  },
});
