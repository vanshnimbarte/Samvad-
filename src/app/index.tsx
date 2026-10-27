import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth, useSignUp } from '@clerk/expo';
import { toHref } from '@/lib/routes';
import {
  PlusCircle,
  Compass,
  GraduationCap,
  Building2,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  MapPinned,
  Bell,
  Cpu,
  ShieldCheck,
} from 'lucide-react-native';

import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { EcosystemFlow } from '@/components/common/EcosystemFlow';
import { Button } from '@/components/common/Button';
import { useApp, UserRole } from '@/context/AppContext';
import { UNIVERSITIES_DATA } from '@/data/universities';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';
import { HEADLINE_KPIS } from '@/data/dashboard-stats';
import { SamadhanColors, Spacing, Radius, Shadows } from '@/constants/samadhan-theme';

const ROLE_COPY: Record<UserRole, { badge: string; title: string; desc: string }> = {
  citizen: {
    badge: 'Citizen desk',
    title: 'Submit a societal challenge from your village, PRI, or ward',
    desc: 'Add photos, location, and evidence. AI classifies the domain and routes it to a matching university.',
  },
  university: {
    badge: 'HEI workspace',
    title: 'Review routed challenges and form multidisciplinary teams',
    desc: 'Assign faculty mentors, submit solution proposals, and track pilots with industry partners.',
  },
  industry: {
    badge: 'Industry desk',
    title: 'Mentor, fund, and co-develop deployable solutions',
    desc: 'Join university teams for prototyping, CSR funding, MSME manufacturing, and technology transfer.',
  },
  government: {
    badge: 'Department dashboard',
    title: 'Monitor challenges, HEI participation, and social outcomes',
    desc: 'Track district-wise submissions, project progress, patents, startups, and community impact.',
  },
};

function CitizenHomeScreenContent() {
  const router = useRouter();
  const { fontScale, userRole, challenges, user, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const copy = ROLE_COPY[userRole];
  const featured = challenges.slice(0, 3);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <OfflineBanner />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[SamadhanColors.primary]}
            tintColor={SamadhanColors.primary}
          />
        }>
        <View style={[styles.heroCard, Shadows.md]}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Sparkles size={13} color={SamadhanColors.action} />
              <Text style={styles.heroBadgeText}>{copy.badge}</Text>
            </View>
            <View style={styles.personaPill}>
              <Text style={styles.personaText} numberOfLines={1}>
                {user.name}
              </Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { fontSize: 20 * fontScale }]}>{copy.title}</Text>
          <Text style={[styles.heroDesc, { fontSize: 13 * fontScale }]}>{copy.desc}</Text>
          {userRole === 'citizen' ? (
            <View style={{ gap: 8 }}>
              <Button
                title="Report a local challenge (AI match)"
                onPress={() => router.push(toHref('/submit-challenge'))}
                variant="action"
                size="lg"
                icon={<PlusCircle size={20} color="#FFFFFF" />}
              />
              <Button
                title="File detailed civic report (6-step)"
                onPress={() => router.push(toHref('/report-problem'))}
                variant="outline"
                size="md"
              />
            </View>
          ) : userRole === 'government' ? (
            <View style={{ gap: 8 }}>
              <Button title="Open admin workspace" onPress={() => router.push(toHref('/workspace'))} variant="action" size="lg" icon={<LayoutDashboard size={20} color="#FFFFFF" />} />
              <Button title="Open analytics dashboard" onPress={() => router.push(toHref('/dashboard'))} variant="outline" size="md" />
            </View>
          ) : userRole === 'university' ? (
            <View style={{ gap: 8 }}>
              <Button title="Open HEI workspace" onPress={() => router.push(toHref('/workspace'))} variant="action" size="lg" icon={<GraduationCap size={20} color="#FFFFFF" />} />
              <Button title="Browse campus network" onPress={() => router.push(toHref('/ecosystem'))} variant="outline" size="md" />
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              <Button title="Open industry desk" onPress={() => router.push(toHref('/workspace'))} variant="action" size="lg" icon={<Building2 size={20} color="#FFFFFF" />} />
              <Button title="Explore CSR opportunities" onPress={() => router.push(toHref('/ecosystem'))} variant="outline" size="md" />
            </View>
          )}
        </View>

        <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginBottom: Spacing.md }]}>
          How a local report becomes a campus project
        </Text>
        <View style={styles.flowCard}>
          <EcosystemFlow />
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: SamadhanColors.primary }]}>
            <Text style={styles.statNumber}>{HEADLINE_KPIS.totalChallenges.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: SamadhanColors.secondary }]}>
            <Text style={[styles.statNumber, { color: SamadhanColors.secondary }]}>{HEADLINE_KPIS.heiPartners}</Text>
            <Text style={styles.statLabel}>HEI partners</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: SamadhanColors.action }]}>
            <Text style={[styles.statNumber, { color: SamadhanColors.action }]}>{HEADLINE_KPIS.deployed}</Text>
            <Text style={styles.statLabel}>Deployed</Text>
          </View>
        </View>

        <View style={styles.quickGrid}>
          <QuickTile icon={<Compass size={20} color={SamadhanColors.secondary} />} bg="#F0FDFA" label="Explore" onPress={() => router.push('/explore')} />
          <QuickTile icon={<MapPinned size={20} color={SamadhanColors.primary} />} bg="#EFF6FF" label="Map" onPress={() => router.push(toHref('/map'))} />
          <QuickTile icon={<Cpu size={20} color="#7C3AED" />} bg="#F5F3FF" label="Workspace" onPress={() => router.push(toHref('/workspace'))} />
          <QuickTile icon={<Bell size={20} color={SamadhanColors.action} />} bg="#FFF7ED" label="Notifications" onPress={() => router.push('/notifications')} />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Active challenges
          </Text>
          <Pressable onPress={() => router.push('/explore')} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>View all</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        {featured.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Universities & industry
          </Text>
          <Pressable onPress={() => router.push(toHref('/ecosystem'))} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Network</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {UNIVERSITIES_DATA.slice(0, 4).map((uni) => (
            <Pressable key={uni.id} onPress={() => router.push(toHref(`/university-detail?id=${uni.id}`))} style={styles.partnerMini}>
              <Text style={styles.partnerEmoji}>{uni.logoEmoji}</Text>
              <Text style={styles.partnerName} numberOfLines={2}>{uni.shortName}</Text>
              <Text style={styles.partnerMeta}>{uni.activeProjects} live</Text>
            </Pressable>
          ))}
          {INDUSTRY_PARTNERS_DATA.slice(0, 3).map((p) => (
            <Pressable key={p.id} onPress={() => router.push(toHref(`/partner-detail?id=${p.id}`))} style={styles.partnerMini}>
              <Text style={styles.partnerEmoji}>{p.logoEmoji}</Text>
              <Text style={styles.partnerName} numberOfLines={2}>{p.shortName}</Text>
              <Text style={styles.partnerMeta}>{p.type}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();
  const router = useRouter();
  const { continueAsGuest, user, showToast } = useApp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestBypass, setGuestBypass] = useState(false);

  const handleSignUp = async () => {
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      const err = 'Please enter a valid email address.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }
    if (!password || password.length < 6) {
      const err = 'Password must be at least 6 characters.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const { error } = await signUp.password({ emailAddress: emailAddress.trim(), password });
      if (error) {
        const msg = error.message || 'Sign up failed';
        setErrorMessage(msg);
        showToast(msg, 'error');
        setIsSubmitting(false);
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        const msg = sendError.message || 'Failed to send verification code';
        setErrorMessage(msg);
        showToast(msg, 'error');
        setIsSubmitting(false);
        return;
      }

      setIsVerifying(true);
      showToast('Verification code sent to your email!', 'success');
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign up';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code: code.trim() });
      if (error) {
        const msg = error.message || 'Verification failed';
        setErrorMessage(msg);
        showToast(msg, 'error');
        setIsSubmitting(false);
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        const msg = finalizeError.message || 'Failed to finalize session';
        setErrorMessage(msg);
        showToast(msg, 'error');
        setIsSubmitting(false);
        return;
      }

      showToast('Welcome to Samvad! Signed in successfully.', 'success');
    } catch (err: any) {
      const msg = err?.message || 'Verification error';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={authStyles.centerContainer}>
        <ActivityIndicator size="large" color={SamadhanColors.primary} />
      </View>
    );
  }

  // If user is authenticated via Clerk or has elected to explore as guest
  if (isSignedIn || guestBypass || (user && !user.isGuest && user.name !== 'Guest Citizen')) {
    return <CitizenHomeScreenContent />;
  }

  // Verification step for email code
  if (isVerifying) {
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={authStyles.container}>
          <View style={authStyles.headerBlock}>
            <View style={authStyles.brandBadge}>
              <Text style={authStyles.brandBadgeText}>SJ</Text>
            </View>
            <Text style={authStyles.title}>Verify your email</Text>
            <Text style={authStyles.subtitle}>
              We sent a verification code to {emailAddress}. Enter it below to activate your account.
            </Text>
          </View>

          {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}

          <TextInput
            style={authStyles.input}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor={SamadhanColors.textMuted}
            onChangeText={setCode}
            keyboardType="numeric"
            autoFocus
          />

          <Button
            title={isSubmitting ? 'Verifying...' : 'Verify'}
            onPress={handleVerify}
            disabled={isSubmitting}
            variant="action"
            size="lg"
          />

          <Pressable onPress={() => setIsVerifying(false)} style={authStyles.backBtn}>
            <Text style={authStyles.backBtnText}>Back to Sign Up</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Sign up screen
  return (
    <SafeAreaView style={authStyles.safeArea}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={authStyles.container}>
          <View style={authStyles.headerBlock}>
            <View style={authStyles.brandBadge}>
              <Text style={authStyles.brandBadgeText}>SJ</Text>
            </View>
            <Text style={authStyles.title}>Samvad Jharkhand</Text>
            <Text style={authStyles.subtitle}>
              Citizen-to-campus societal innovation portal. Authenticate with Clerk to track challenges and access universities.
            </Text>

            <View style={authStyles.clerkPill}>
              <ShieldCheck size={13} color="#2563EB" />
              <Text style={authStyles.clerkPillText}>Clerk Authentication · Supabase Data</Text>
            </View>
          </View>

          {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}

          <View style={authStyles.formBlock}>
            <Text style={authStyles.fieldLabel}>Email Address</Text>
            <TextInput
              style={authStyles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor={SamadhanColors.textMuted}
              onChangeText={setEmailAddress}
              keyboardType="email-address"
            />

            <Text style={authStyles.fieldLabel}>Password</Text>
            <TextInput
              style={authStyles.input}
              value={password}
              placeholder="Enter password (min 6 chars)"
              placeholderTextColor={SamadhanColors.textMuted}
              secureTextEntry={true}
              onChangeText={setPassword}
            />

            <Button
              title={isSubmitting ? 'Creating account...' : 'Sign up'}
              onPress={handleSignUp}
              disabled={isSubmitting}
              variant="action"
              size="lg"
            />

            <View style={authStyles.dividerRow}>
              <View style={authStyles.dividerLine} />
              <Text style={authStyles.dividerText}>or</Text>
              <View style={authStyles.dividerLine} />
            </View>

            <Button
              title="Already have an account? Sign in"
              onPress={() => router.push(toHref('/auth'))}
              variant="outline"
              size="md"
            />

            <Button
              title="Continue as Guest"
              onPress={() => {
                continueAsGuest();
                setGuestBypass(true);
              }}
              variant="ghost"
              size="md"
            />
          </View>

          {/* Required for sign-up flows on Expo web if your application uses legacy bot sign-up protection. */}
          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickTile({
  icon,
  bg,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickTile, pressed && { opacity: 0.85 }]}>
      <View style={[styles.quickIconCircle, { backgroundColor: bg }]}>{icon}</View>
      <Text style={styles.quickTileLabel}>{label}</Text>
    </Pressable>
  );
}

const authStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SamadhanColors.background,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: SamadhanColors.surface,
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    gap: 14,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: SamadhanColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  brandBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: SamadhanColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  clerkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  clerkPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  formBlock: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: -4,
  },
  input: {
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
    color: SamadhanColors.textPrimary,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: SamadhanColors.border,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: SamadhanColors.textMuted,
    fontWeight: '600',
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtnText: {
    fontSize: 13,
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: SamadhanColors.background },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  roleRow: { gap: 8, paddingBottom: Spacing.md },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
  },
  roleChipActive: { backgroundColor: SamadhanColors.primary, borderColor: SamadhanColors.primary },
  roleChipText: { fontSize: 12, fontWeight: '700', color: SamadhanColors.textSecondary },
  roleChipTextActive: { color: '#FFFFFF' },
  heroCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  personaPill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    maxWidth: '55%',
  },
  personaText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '700', color: SamadhanColors.action },
  heroTitle: { fontWeight: '800', color: SamadhanColors.textPrimary, lineHeight: 26, marginBottom: 6 },
  heroDesc: { color: SamadhanColors.textSecondary, lineHeight: 19, marginBottom: Spacing.lg },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderLeftWidth: 4,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  statNumber: { fontSize: 16, fontWeight: '900', color: SamadhanColors.primary },
  statLabel: { fontSize: 10, fontWeight: '600', color: SamadhanColors.textSecondary, textAlign: 'center', marginTop: 2 },
  quickGrid: { flexDirection: 'row', gap: 8, marginBottom: Spacing.xl },
  quickTile: {
    flex: 1,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  quickIconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickTileLabel: { fontSize: 11, fontWeight: '700', color: SamadhanColors.textPrimary, textAlign: 'center' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionHeading: { fontWeight: '800', color: SamadhanColors.textPrimary },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllText: { fontSize: 12, fontWeight: '700', color: SamadhanColors.primary },
  partnerMini: {
    width: 120,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  partnerEmoji: { fontSize: 22, marginBottom: 6 },
  partnerName: { fontSize: 12, fontWeight: '800', color: SamadhanColors.textPrimary },
  partnerMeta: { fontSize: 10, color: SamadhanColors.textMuted, marginTop: 4, fontWeight: '600' },
  flowCard: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
});
