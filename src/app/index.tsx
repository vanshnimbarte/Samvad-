import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

export default function CitizenHomeScreen() {
  const router = useRouter();
  const { t, language, fontScale, userRole, challenges, user } = useApp();
  const copy = ROLE_COPY[userRole];
  const featured = challenges.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <OfflineBanner />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
