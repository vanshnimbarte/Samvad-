import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Bell,
  Languages,
  WifiOff,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

export function Header({ title, subtitle, showBack = false, onBackPress }: HeaderProps) {
  const router = useRouter();
  const {
    user,
    language,
    setLanguage,
    t,
    fontScale,
    unreadNotificationCount,
    networkStatus,
  } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const isOffline = networkStatus === 'offline';
  const isSlow = networkStatus === 'slow';

  return (
    <View style={styles.container}>
      {/* Offline Mini Alert Bar if disconnected */}
      {(isOffline || isSlow) && (
        <View
          style={[
            styles.networkBadge,
            { backgroundColor: isOffline ? '#FEE2E2' : '#FEF3C7' },
          ]}>
          <WifiOff size={14} color={isOffline ? '#DC2626' : '#D97706'} />
          <Text
            style={[
              styles.networkBadgeText,
              { color: isOffline ? '#991B1B' : '#92400E' },
            ]}>
            {isOffline
              ? language === 'hi'
                ? 'ऑफ़लाइन मोड (ड्राफ्ट फोन में सुरक्षित रहेंगे)'
                : 'Offline Mode (Drafts saved locally)'
              : language === 'hi'
              ? 'धीमा इंटरनेट कनेक्शन (डेटा बचत सक्रिय)'
              : 'Slow Connection (Data-saver active)'}
          </Text>
        </View>
      )}

      <View style={styles.headerRow}>
        {/* Left Side: Greeting & Location */}
        <View style={styles.leftCol}>
          <Text style={[styles.greetingText, { fontSize: 13 * fontScale }]}>
            {t('greeting')},{' '}
            <Text style={styles.userName}>{user.isGuest ? (language === 'hi' ? 'नागरिक' : 'Citizen') : user.name.split(' ')[0]}</Text>
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={14} color={SamadhanColors.action} />
            <Text
              style={[styles.locationText, { fontSize: 12 * fontScale }]}
              numberOfLines={1}>
              {t('appName')} · {user.block ? `${user.block}, ${user.district}` : 'Jharkhand'}
            </Text>
          </View>
        </View>

        {/* Right Side: Language Toggle & Notification Bell */}
        <View style={styles.rightCol}>
          {/* Language Switcher Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Switch Language"
            onPress={toggleLanguage}
            style={({ pressed }) => [
              styles.langButton,
              pressed && styles.buttonPressed,
            ]}>
            <Languages size={15} color={SamadhanColors.primary} />
            <Text style={styles.langButtonText}>
              {language === 'en' ? 'हिन्दी' : 'English'}
            </Text>
          </Pressable>

          {/* Notifications Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.buttonPressed,
            ]}>
            <Bell size={20} color={SamadhanColors.textPrimary} />
            {unreadNotificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SamadhanColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  networkBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCol: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingText: {
    color: SamadhanColors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    color: SamadhanColors.textPrimary,
    fontWeight: '600',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.primarySurface,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    minHeight: 44, // WCAG AA Touch target
    minWidth: 44,
    justifyContent: 'center',
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: SamadhanColors.action,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: SamadhanColors.surface,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
