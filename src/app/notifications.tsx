import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Inbox,
  CheckCircle2,
  HelpCircle,
  UserCheck,
  Wrench,
  RefreshCw,
  FlaskConical,
  CheckCheck,
  Sparkles,
  Megaphone,
  Check,
  BellOff,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react-native';

import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { useApp } from '@/context/AppContext';
import { CivicNotification } from '@/data/samadhan-mock-data';
import {
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    language,
    fontScale,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type: CivicNotification['type']) => {
    const size = 18;
    switch (type) {
      case 'report_received':
        return <Inbox size={size} color="#2563EB" />;
      case 'report_validated':
        return <CheckCircle2 size={size} color="#7C3AED" />;
      case 'info_requested':
        return <HelpCircle size={size} color="#DC2626" />;
      case 'report_assigned':
        return <UserCheck size={size} color="#4F46E5" />;
      case 'project_started':
        return <Wrench size={size} color="#EA580C" />;
      case 'status_updated':
        return <RefreshCw size={size} color="#0D9488" />;
      case 'pilot_started':
        return <FlaskConical size={size} color="#0D9488" />;
      case 'solution_deployed':
        return <CheckCheck size={size} color="#16A34A" />;
      case 'success_story':
        return <Sparkles size={size} color="#D97706" />;
      case 'announcement':
      default:
        return <Megaphone size={size} color={SamadhanColors.primary} />;
    }
  };

  const handleNotificationPress = (notif: CivicNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.actionRoute) {
      router.push(notif.actionRoute as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <OfflineBanner />

      <View style={styles.container}>
        {/* Top Notification Bar */}
        <View style={styles.topToolbar}>
          <View style={styles.tabPillsRow}>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeFilter === 'all' }}
              onPress={() => setActiveFilter('all')}
              style={[
                styles.tabPill,
                activeFilter === 'all' && styles.tabPillActive,
              ]}>
              <Text
                style={[
                  styles.tabPillText,
                  activeFilter === 'all' && styles.tabPillTextActive,
                ]}>
                {language === 'hi' ? 'सभी सूचनाएं' : 'All Alerts'} (
                {notifications.length})
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeFilter === 'unread' }}
              onPress={() => setActiveFilter('unread')}
              style={[
                styles.tabPill,
                activeFilter === 'unread' && styles.tabPillActive,
              ]}>
              <Text
                style={[
                  styles.tabPillText,
                  activeFilter === 'unread' && styles.tabPillTextActive,
                ]}>
                {language === 'hi' ? 'अपठित' : 'Unread'} (
                {unreadNotificationCount})
              </Text>
            </Pressable>
          </View>

          {unreadNotificationCount > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
              onPress={markAllNotificationsAsRead}
              style={styles.markReadBtn}>
              <Check size={14} color={SamadhanColors.primary} />
              <Text style={styles.markReadText}>
                {language === 'hi' ? 'सब पढ़ा चिह्नित करें' : 'Mark all read'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const title = language === 'hi' ? item.titleHi : item.titleEn;
              const message = language === 'hi' ? item.messageHi : item.messageEn;

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Notification: ${title}`}
                  onPress={() => handleNotificationPress(item)}
                  style={({ pressed }) => [
                    styles.notificationCard,
                    !item.isRead && styles.unreadCard,
                    pressed && styles.cardPressed,
                  ]}>
                  {/* Unread indicator dot */}
                  {!item.isRead && <View style={styles.unreadDot} />}

                  {/* Left Icon */}
                  <View style={styles.iconCircle}>
                    {getNotificationIcon(item.type)}
                  </View>

                  {/* Middle Content */}
                  <View style={styles.textContent}>
                    <Text
                      style={[
                        styles.notifTitle,
                        { fontSize: 13 * fontScale },
                        !item.isRead && styles.unreadTitle,
                      ]}>
                      {title}
                    </Text>

                    <Text style={[styles.notifMessage, { fontSize: 12 * fontScale }]}>
                      {message}
                    </Text>

                    <Text style={styles.timestampText}>{item.timestamp}</Text>
                  </View>

                  {/* Chevron Right */}
                  {item.actionRoute && (
                    <ChevronRight size={16} color={SamadhanColors.textMuted} />
                  )}
                </Pressable>
              );
            })
          ) : (
            <EmptyState
              icon={BellOff}
              title={
                activeFilter === 'unread'
                  ? language === 'hi'
                    ? 'कोई अपठित सूचना नहीं है'
                    : 'No unread notifications'
                  : language === 'hi'
                  ? 'कोई सूचना उपलब्ध नहीं है'
                  : 'No notifications available'
              }
              description={
                language === 'hi'
                  ? 'जब आपकी दर्ज रिपोर्ट पर कोई प्रगति या नया अपडेट होगा, तो सूचना यहां दिखेगी।'
                  : 'Milestone progress updates and alerts will appear here.'
              }
              actionTitle={activeFilter === 'unread' ? 'सभी सूचनाएं देखें' : undefined}
              onActionPress={() => setActiveFilter('all')}
            />
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  container: {
    flex: 1,
  },
  topToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: SamadhanColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
  },
  tabPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tabPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillActive: {
    backgroundColor: SamadhanColors.primarySurface,
    borderColor: SamadhanColors.primary,
  },
  tabPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  tabPillTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '800',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#F8FAFF',
    borderColor: '#BFDBFE',
  },
  cardPressed: {
    opacity: 0.8,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    left: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: SamadhanColors.action,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContent: {
    flex: 1,
  },
  notifTitle: {
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: '800',
    color: SamadhanColors.primary,
  },
  notifMessage: {
    color: SamadhanColors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
    fontWeight: '500',
  },
});
