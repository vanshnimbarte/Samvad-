import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Type,
  Mic,
  Zap,
  Bookmark,
  Bell,
  Lock,
  HelpCircle,
  PhoneCall,
  AlertOctagon,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Check,
  LayoutDashboard,
  Briefcase,
  Wifi,
  RefreshCw,
} from 'lucide-react-native';

import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { Button } from '@/components/common/Button';
import { useApp, TextSize, Language, UserRole } from '@/context/AppContext';
import { toHref } from '@/lib/routes';
import {
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    session,
    textSize,
    setTextSize,
    fontScale,
    highContrast,
    setHighContrast,
    dataSavingMode,
    setDataSavingMode,
    voiceInputEnabled,
    setVoiceInputEnabled,
    drafts,
    networkStatus,
    setNetworkStatus,
    syncDrafts,
    logout,
    showToast,
    userRole,
    setUserRole,
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationPermGranted, setLocationPermGranted] = useState(true);

  const handleSwitchAccount = () => {
    router.push('/auth');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <OfflineBanner />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, Shadows.sm]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <User size={36} color="#FFFFFF" />
            </View>
            <View style={styles.avatarInfo}>
              <Text style={[styles.userName, { fontSize: 18 * fontScale }]}>
                {user.name}
              </Text>
              <View style={styles.orgRow}>
                <Building size={13} color={SamadhanColors.primary} />
                <Text style={styles.userOrg}>{user.communityRole}</Text>
              </View>
              <View style={styles.locRow}>
                <MapPin size={13} color={SamadhanColors.action} />
                <Text style={styles.userLocation}>
                  {user.block}, {user.district}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Details */}
          <View style={styles.contactDetails}>
            <View style={styles.detailRow}>
              <Phone size={14} color={SamadhanColors.textMuted} />
              <Text style={styles.detailText}>{user.phone || '+91 98351 44210'}</Text>
            </View>
            {user.email ? (
              <View style={styles.detailRow}>
                <Mail size={14} color={SamadhanColors.textMuted} />
                <Text style={styles.detailText}>{user.email}</Text>
              </View>
            ) : null}
            {session?.user ? (
              <View style={[styles.detailRow, { marginTop: 4 }]}>
                <ShieldCheck size={14} color="#16A34A" />
                <Text style={[styles.detailText, { color: '#16A34A', fontWeight: '700' }]}>
                  Supabase Authenticated (ID: {session.user.id.substring(0, 8)}...)
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Verified Role & Organization
          </Text>
          <View style={styles.settingCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: SamadhanColors.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: SamadhanColors.primary }}>
                    {userRole === 'citizen' ? '👤 Citizen' : null}
                    {userRole === 'university' ? '🎓 University' : null}
                    {userRole === 'industry' ? '🏢 Industry / CSR' : null}
                    {userRole === 'government' ? '🏛️ Government' : null}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: SamadhanColors.textMuted, fontWeight: '600' }}>
                Active session
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: SamadhanColors.textSecondary, marginBottom: Spacing.md }}>
              {user.communityRole}
            </Text>

            <Pressable
              onPress={() => router.push(toHref('/workspace'))}
              style={styles.rowLink}>
              <Briefcase size={18} color={SamadhanColors.primary} />
              <Text style={styles.rowLinkText}>Open authorized workspace</Text>
              <ChevronRight size={16} color={SamadhanColors.textMuted} />
            </Pressable>

            {userRole === 'government' ? (
              <Pressable
                onPress={() => router.push(toHref('/dashboard'))}
                style={styles.rowLink}>
                <LayoutDashboard size={18} color={SamadhanColors.primary} />
                <Text style={styles.rowLinkText}>Open government dashboard</Text>
                <ChevronRight size={16} color={SamadhanColors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* SECTION: PREFERENCES & ACCESSIBILITY */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Preferences & Accessibility
          </Text>

          {/* 1. Text Size Selector */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Type size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Text Size</Text>
                <Text style={styles.settingDesc}>
                  Adjust text size for comfortable reading
                </Text>
              </View>
            </View>
            <View style={styles.langPillRow}>
              {(['small', 'normal', 'large'] as TextSize[]).map((sz) => (
                <Pressable
                  key={sz}
                  accessibilityRole="button"
                  accessibilityLabel={`Select text size ${sz}`}
                  onPress={() => setTextSize(sz)}
                  style={[
                    styles.choicePill,
                    textSize === sz && styles.choicePillActive,
                  ]}>
                  <Text
                    style={[
                      styles.choicePillText,
                      textSize === sz && styles.choicePillTextActive,
                    ]}>
                    {sz === 'small' ? 'Small' : sz === 'large' ? 'Large (120%)' : 'Normal'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 2. Voice Input Toggle */}
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Mic size={18} color={SamadhanColors.action} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Voice Input (Mic)</Text>
                <Text style={styles.settingDesc}>
                  Enable voice recording to describe problems
                </Text>
              </View>
            </View>
            <Switch
              value={voiceInputEnabled}
              onValueChange={setVoiceInputEnabled}
              trackColor={{ false: '#CBD5E1', true: SamadhanColors.primary }}
            />
          </View>

          {/* 3. Data-Saving Mode Toggle */}
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Zap size={18} color="#0D9488" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Data-Saving Mode</Text>
                <Text style={styles.settingDesc}>
                  Heavy compression for slow 2G/3G networks
                </Text>
              </View>
            </View>
            <Switch
              value={dataSavingMode}
              onValueChange={setDataSavingMode}
              trackColor={{ false: '#CBD5E1', true: SamadhanColors.secondary }}
            />
          </View>

          {/* 4. Offline Drafts shortcut */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Manage Offline Drafts"
            onPress={() => router.push('/my-reports')}
            style={styles.clickableSettingRow}>
            <View style={styles.switchLeft}>
              <Bookmark size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Offline Drafts Manager</Text>
                <Text style={styles.settingDesc}>
                  {drafts.length} report(s) saved on this device
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={SamadhanColors.textMuted} />
          </Pressable>

          {/* 5. Network & Cloud Sync */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Wifi size={18} color={networkStatus === 'offline' ? '#DC2626' : '#16A34A'} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Network & Data Sync</Text>
                <Text style={styles.settingDesc}>
                  {networkStatus === 'offline'
                    ? 'Offline mode (drafts saved locally)'
                    : 'Connected to server (Real-time sync active)'}
                </Text>
              </View>
            </View>
            {drafts.length > 0 && (
              <View style={{ marginTop: Spacing.sm }}>
                <Button
                  title={`Sync Pending Reports (${drafts.length})`}
                  onPress={syncDrafts}
                  variant="primary"
                  size="sm"
                />
              </View>
            )}
          </View>
        </View>

        {/* SECTION: SUPPORT & HELP */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Help & Support
          </Text>

          {/* Onboarding Tour */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View Welcome Tour"
            onPress={() => router.push('/onboarding')}
            style={styles.clickableSettingRow}>
            <View style={styles.switchLeft}>
              <HelpCircle size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Welcome & User Guide</Text>
                <Text style={styles.settingDesc}>
                  Review onboarding slides and instructions
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={SamadhanColors.textMuted} />
          </Pressable>

          {/* Toll Free Helpline */}
          <View style={styles.clickableSettingRow}>
            <View style={styles.switchLeft}>
              <PhoneCall size={18} color="#16A34A" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Citizen Helpline (Toll-Free)</Text>
                <Text style={[styles.settingDesc, { color: '#16A34A', fontWeight: '700' }]}>
                  1800-345-6578 (08:00 AM - 08:00 PM)
                </Text>
              </View>
            </View>
          </View>

          {/* Privacy & Terms */}
          <View style={styles.clickableSettingRow}>
            <View style={styles.switchLeft}>
              <ShieldCheck size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>Privacy & Consent Policy</Text>
                <Text style={styles.settingDesc}>
                  Personal mobile details protected under DPDP Act
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: ACCOUNT ACTIONS */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Account Actions
          </Text>

          <Button
            title="Switch Account / Login"
            onPress={handleSwitchAccount}
            variant="outline"
            size="md"
            style={{ marginBottom: Spacing.sm }}
          />

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="ghost"
            size="md"
            icon={<LogOut size={16} color={SamadhanColors.textPrimary} />}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  profileCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.xl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: SamadhanColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userOrg: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.primary,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userLocation: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
  },
  contactDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
  },
  settingsSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.md,
  },
  settingCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  settingDesc: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 1,
  },
  langPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rowLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: SamadhanColors.border,
  },
  rowLinkText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  choicePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  choicePillActive: {
    backgroundColor: SamadhanColors.primarySurface,
    borderColor: SamadhanColors.primary,
  },
  choicePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  choicePillTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.sm,
  },
  clickableSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: 56,
  },
});
