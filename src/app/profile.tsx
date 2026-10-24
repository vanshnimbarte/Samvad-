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
  Languages,
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
    language,
    setLanguage,
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

  const handleLogout = () => {
    logout();
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
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            {language === 'hi' ? 'पोर्टल भूमिका (डेमो)' : 'Portal role (demo)'}
          </Text>
          <View style={styles.settingCard}>
            <View style={styles.langPillRow}>
              {(['citizen', 'university', 'industry', 'government'] as UserRole[]).map((role) => (
                <Pressable
                  key={role}
                  onPress={() => setUserRole(role)}
                  style={[styles.choicePill, userRole === role && styles.choicePillActive]}>
                  <Text style={[styles.choicePillText, userRole === role && styles.choicePillTextActive]}>
                    {role === 'citizen' ? 'Citizen' : role === 'university' ? 'University' : role === 'industry' ? 'Industry' : 'Government'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={() => router.push(toHref('/workspace'))}
              style={styles.rowLink}>
              <Briefcase size={18} color={SamadhanColors.primary} />
              <Text style={styles.rowLinkText}>Open role workspace</Text>
              <ChevronRight size={16} color={SamadhanColors.textMuted} />
            </Pressable>
            <Pressable
              onPress={() => router.push(toHref('/dashboard'))}
              style={styles.rowLink}>
              <LayoutDashboard size={18} color={SamadhanColors.primary} />
              <Text style={styles.rowLinkText}>Open government dashboard</Text>
              <ChevronRight size={16} color={SamadhanColors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* SECTION: PREFERENCES & ACCESSIBILITY */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            {language === 'hi' ? 'ऐप सेटिंग्स एवं सुगमता (Accessibility)' : 'Preferences & Accessibility'}
          </Text>

          {/* 1. Language Toggle */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Languages size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'भाषा (Language)' : 'Language'}
                </Text>
                <Text style={styles.settingDesc}>
                  {language === 'hi'
                    ? 'वर्तमान में हिंदी चयनित है'
                    : 'Currently English is selected'}
                </Text>
              </View>
            </View>
            <View style={styles.langPillRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Switch language to English"
                onPress={() => setLanguage('en')}
                style={[
                  styles.choicePill,
                  language === 'en' && styles.choicePillActive,
                ]}>
                <Text
                  style={[
                    styles.choicePillText,
                    language === 'en' && styles.choicePillTextActive,
                  ]}>
                  English
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Switch language to Hindi"
                onPress={() => setLanguage('hi')}
                style={[
                  styles.choicePill,
                  language === 'hi' && styles.choicePillActive,
                ]}>
                <Text
                  style={[
                    styles.choicePillText,
                    language === 'hi' && styles.choicePillTextActive,
                  ]}>
                  हिन्दी (Hindi)
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 2. Text Size Selector */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Type size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'अक्षर का आकार (Text Size)' : 'Text Size'}
                </Text>
                <Text style={styles.settingDesc}>
                  {language === 'hi'
                    ? 'दृष्टि सुगमता हेतु बड़ा या सामान्य आकार चुनें'
                    : 'Adjust text size for comfortable reading'}
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
                    {sz === 'small'
                      ? language === 'hi'
                        ? 'छोटा'
                        : 'Small'
                      : sz === 'large'
                      ? language === 'hi'
                        ? 'बड़ा (120%)'
                        : 'Large (120%)'
                      : language === 'hi'
                      ? 'सामान्य'
                      : 'Normal'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 3. Voice Input Toggle */}
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Mic size={18} color={SamadhanColors.action} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'आवाज़ से दर्ज करने की सुविधा' : 'Voice Input (Mic)'}
                </Text>
                <Text style={styles.settingDesc}>
                  {language === 'hi'
                    ? 'माइक दबाकर बोलकर विवरण लिखना'
                    : 'Enable voice recording to describe problems'}
                </Text>
              </View>
            </View>
            <Switch
              value={voiceInputEnabled}
              onValueChange={setVoiceInputEnabled}
              trackColor={{ false: '#CBD5E1', true: SamadhanColors.primary }}
            />
          </View>

          {/* 4. Data-Saving Mode Toggle */}
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Zap size={18} color="#0D9488" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'डेटा-बचत मोड (Data Saver)' : 'Data-Saving Mode'}
                </Text>
                <Text style={styles.settingDesc}>
                  {language === 'hi'
                    ? '2G/3G नेटवर्क पर छवियों को भारी संकुचित करें'
                    : 'Heavy compression for slow 2G/3G networks'}
                </Text>
              </View>
            </View>
            <Switch
              value={dataSavingMode}
              onValueChange={setDataSavingMode}
              trackColor={{ false: '#CBD5E1', true: SamadhanColors.secondary }}
            />
          </View>

          {/* 5. Offline Drafts shortcut */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Manage Offline Drafts"
            onPress={() => router.push('/my-reports')}
            style={styles.clickableSettingRow}>
            <View style={styles.switchLeft}>
              <Bookmark size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'ऑफ़लाइन ड्राफ्ट्स प्रबंधक' : 'Offline Drafts Manager'}
                </Text>
                <Text style={styles.settingDesc}>
                  {drafts.length}{' '}
                  {language === 'hi'
                    ? 'ड्राफ्ट इस फोन पर सुरक्षित हैं'
                    : 'report(s) saved on this device'}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={SamadhanColors.textMuted} />
          </Pressable>

          {/* 6. Network Simulation (SIH Demo Mode) */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Wifi size={18} color={SamadhanColors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'नेटवर्क सिमुलेशन (डेमो)' : 'Network Simulator (SIH Demo)'}
                </Text>
                <Text style={styles.settingDesc}>
                  {language === 'hi'
                    ? 'ऑफ़लाइन रिपोर्टिंग और ऑटो-सिंक की प्रस्तुति के लिए'
                    : 'Demonstrate offline draft queuing & auto-sync'}
                </Text>
              </View>
            </View>
            <View style={styles.langPillRow}>
              {(['online', 'slow', 'offline'] as const).map((st) => (
                <Pressable
                  key={st}
                  accessibilityRole="button"
                  onPress={() => {
                    setNetworkStatus(st);
                    if (st === 'slow') setDataSavingMode(true);
                  }}
                  style={[
                    styles.choicePill,
                    networkStatus === st && styles.choicePillActive,
                  ]}>
                  <Text
                    style={[
                      styles.choicePillText,
                      networkStatus === st && styles.choicePillTextActive,
                    ]}>
                    {st.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
              {drafts.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  onPress={syncDrafts}
                  style={[
                    styles.choicePill,
                    { backgroundColor: SamadhanColors.secondary, borderColor: SamadhanColors.secondary },
                  ]}>
                  <Text style={[styles.choicePillText, { color: '#FFFFFF', fontWeight: '800' }]}>
                    SYNC ({drafts.length})
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* SECTION: SUPPORT & HELP */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            {language === 'hi' ? 'सहायता एवं संपर्क' : 'Help & Support'}
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
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'ऐप परिचय व निर्देश (App Tour)' : 'Welcome & User Guide'}
                </Text>
                <Text style={styles.settingDesc}>
                  {language === 'hi'
                    ? 'ऐप का उपयोग कैसे करें, दोबारा देखें'
                    : 'Review onboarding slides and instructions'}
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
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'नागरिक समाधान हेल्पलाइन' : 'Citizen Helpline (Toll-Free)'}
                </Text>
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
                <Text style={styles.settingTitle}>
                  {language === 'hi' ? 'गोपनीयता नीति एवं सहमति' : 'Privacy & Consent Policy'}
                </Text>
                <Text style={styles.settingDesc}>
                  {language === 'hi'
                    ? 'नागरिकों की व्यक्तिगत जानकारी पूर्ण सुरक्षित है'
                    : 'Personal mobile details protected under DPDP Act'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: ACCOUNT ACTIONS */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            {language === 'hi' ? 'खाता विकल्प' : 'Account Actions'}
          </Text>

          <Button
            title={language === 'hi' ? 'खाता बदलें / पुनः लॉगिन' : 'Switch Account / Login'}
            onPress={handleSwitchAccount}
            variant="outline"
            size="md"
            style={{ marginBottom: Spacing.sm }}
          />

          <Button
            title={language === 'hi' ? 'लॉग आउट' : 'Logout'}
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
