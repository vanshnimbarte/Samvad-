import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { toHref } from '@/lib/routes';
import { InstitutionalWebPortal } from '@/components/web/InstitutionalWebPortal';
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
  BarChart3,
  Layers,
} from 'lucide-react-native';

import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { EcosystemFlow } from '@/components/common/EcosystemFlow';
import { Button } from '@/components/common/Button';
import { useApp, UserRole } from '@/context/AppContext';
import { UNIVERSITIES_DATA } from '@/data/universities';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';
import {
  HEADLINE_KPIS,
  MONTHLY_TREND,
  DISTRICT_STATS,
} from '@/data/dashboard-stats';
import { matchUniversities } from '@/lib/ai-engine';
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

/**
 * Top active role indicator & quick workspace switcher
 */
function RoleIndicatorBar() {
  const { userRole, setUserRole, user } = useApp();
  const roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'citizen', label: 'Citizen', icon: '👤' },
    { role: 'government', label: 'Admin', icon: '🏛️' },
    { role: 'university', label: 'University', icon: '🎓' },
    { role: 'industry', label: 'Industry', icon: '🏢' },
  ];

  return (
    <View style={styles.roleBarCard}>
      <View style={styles.roleBarTop}>
        <View style={styles.roleBarActiveTag}>
          <Text style={styles.roleBarActiveTagText}>
            {userRole === 'citizen'
              ? '👤 Citizen Dashboard'
              : userRole === 'government'
              ? '🏛️ Government Dashboard'
              : userRole === 'university'
              ? '🎓 University Dashboard'
              : '🏢 Industry Dashboard'}
          </Text>
        </View>
        <Text style={styles.roleBarUser} numberOfLines={1}>
          {user.name || 'User'}
        </Text>
      </View>
      <View style={styles.roleChipsRow}>
        {roles.map((r) => {
          const isActive = userRole === r.role;
          return (
            <Pressable
              key={r.role}
              onPress={() => setUserRole(r.role)}
              style={[styles.roleChip, isActive && styles.roleChipActive]}>
              <Text style={[styles.roleChipText, isActive && styles.roleChipTextActive]}>
                {r.icon} {r.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/**
 * KPI Metric Item for Government Dashboard
 */
function KpiCard({
  label,
  value,
  color = SamadhanColors.primary,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.kpiCard}>
      <Text style={[styles.kpiCardVal, { color }]}>{value}</Text>
      <Text style={styles.kpiCardLbl}>{label}</Text>
    </View>
  );
}

/**
 * Single Row for Admin Validation Queue
 */
function AdminRow({
  title,
  meta,
  onOpen,
  primary,
  onPrimary,
  secondary,
  onSecondary,
}: {
  title: string;
  meta: string;
  onOpen: () => void;
  primary: string;
  onPrimary: () => void;
  secondary?: string;
  onSecondary?: () => void;
}) {
  return (
    <View style={styles.admin}>
      <Pressable onPress={onOpen}>
        <Text style={styles.adminTitle}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </Pressable>
      <View style={styles.adminActions}>
        <Pressable onPress={onPrimary} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>{primary}</Text>
        </Pressable>
        {secondary && onSecondary ? (
          <Pressable onPress={onSecondary} style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>{secondary}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/**
 * 1. Citizen Dashboard
 */
function CitizenHomeScreenContent() {
  const router = useRouter();
  const { fontScale, userRole, challenges, user, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const copy = ROLE_COPY[userRole] || ROLE_COPY.citizen;
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
          <QuickTile icon={<Bell size={20} color={SamadhanColors.action} />} bg="#FFF7ED" label="Alerts" onPress={() => router.push('/notifications')} />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Active civic challenges
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
            Universities & industry partners
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

/**
 * 2. Government / Department Dashboard
 */
function GovernmentDashboardContent() {
  const router = useRouter();
  const { fontScale, challenges, refreshData, validateChallenge, assignUniversity } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const maxTrend = Math.max(...MONTHLY_TREND.map((m) => m.submitted));
  const pending = challenges.filter((c) => c.stage === 'Submitted' || c.stage === 'Under Review');

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
        <RoleIndicatorBar />

        {/* Hero Card */}
        <View style={[styles.heroCard, Shadows.md]}>
          <View style={styles.heroTopRow}>
            <View style={[styles.heroBadge, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <ShieldCheck size={13} color="#16A34A" />
              <Text style={[styles.heroBadgeText, { color: '#16A34A' }]}>Department Administration</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { fontSize: 20 * fontScale }]}>
            Jharkhand Governance & Validation Hub
          </Text>
          <Text style={[styles.heroDesc, { fontSize: 13 * fontScale }]}>
            Monitor district-level challenges, validate incoming citizen reports, and route to premier universities across Jharkhand.
          </Text>
          <View style={{ gap: 8 }}>
            <Button
              title="Open validation queue & workspace"
              onPress={() => router.push(toHref('/workspace'))}
              variant="action"
              size="lg"
              icon={<LayoutDashboard size={20} color="#FFFFFF" />}
            />
            <Button
              title="View full governance analytics"
              onPress={() => router.push(toHref('/dashboard'))}
              variant="outline"
              size="md"
              icon={<BarChart3 size={18} color={SamadhanColors.primary} />}
            />
          </View>
        </View>

        {/* Headline KPIs */}
        <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginBottom: Spacing.sm }]}>
          Statewide Impact & Resolution Metrics
        </Text>
        <View style={styles.kpiGrid}>
          <KpiCard label="Challenges" value={HEADLINE_KPIS.totalChallenges.toLocaleString('en-IN')} color={SamadhanColors.primary} />
          <KpiCard label="Deployed" value={String(HEADLINE_KPIS.deployed)} color="#16A34A" />
          <KpiCard label="HEIs" value={String(HEADLINE_KPIS.heiPartners)} color="#7C3AED" />
          <KpiCard label="Industry" value={String(HEADLINE_KPIS.industryPartners)} color="#D97706" />
          <KpiCard label="Patents" value={String(HEADLINE_KPIS.patentsApplied)} color="#0284C7" />
          <KpiCard label="Startups" value={String(HEADLINE_KPIS.startupsCreated)} color="#E11D48" />
        </View>

        {/* Quick Management Nav */}
        <View style={styles.quickGrid}>
          <QuickTile icon={<LayoutDashboard size={20} color={SamadhanColors.primary} />} bg="#EFF6FF" label="Workspace" onPress={() => router.push(toHref('/workspace'))} />
          <QuickTile icon={<BarChart3 size={20} color="#16A34A" />} bg="#F0FDF4" label="Analytics" onPress={() => router.push(toHref('/dashboard'))} />
          <QuickTile icon={<MapPinned size={20} color="#D97706" />} bg="#FFFBEB" label="GIS Map" onPress={() => router.push(toHref('/map'))} />
          <QuickTile icon={<Bell size={20} color="#7C3AED" />} bg="#FAF5FF" label="Alerts" onPress={() => router.push('/notifications')} />
        </View>

        {/* Validation Queue Preview */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Pending validation queue ({pending.length})
          </Text>
          <Pressable onPress={() => router.push(toHref('/workspace'))} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Open queue</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        {pending.slice(0, 3).map((c) => (
          <AdminRow
            key={c.id}
            title={c.title}
            meta={`AI ${c.domain} · ${c.aiConfidence}% confidence · ${c.district}`}
            onOpen={() => router.push(toHref(`/challenge-detail?id=${c.id}`))}
            primary="Validate"
            onPrimary={() => validateChallenge(c.id)}
            secondary={matchUniversities(c.domain)[0] ? `Route to ${matchUniversities(c.domain)[0].shortName}` : undefined}
            onSecondary={() => {
              const uni = matchUniversities(c.domain)[0];
              if (uni) assignUniversity(c.id, uni.id);
            }}
          />
        ))}

        {/* Monthly Submission Trend */}
        <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginTop: Spacing.md, marginBottom: Spacing.sm }]}>
          Monthly Submission Trends
        </Text>
        <View style={styles.trendBox}>
          <View style={styles.trendRow}>
            {MONTHLY_TREND.map((m) => (
              <View key={m.month} style={styles.trendCol}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: Math.max(12, Math.round((m.submitted / maxTrend) * 75)) }]} />
                </View>
                <Text style={styles.trendLabel}>{m.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Districts */}
        <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginTop: Spacing.md, marginBottom: Spacing.sm }]}>
          District Intensity & Resolution Status
        </Text>
        {DISTRICT_STATS.slice(0, 4).map((d) => (
          <View key={d.district} style={styles.districtRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.districtName}>{d.district}</Text>
              <Text style={styles.districtMeta}>{d.challenges} challenges · {d.resolved} resolved</Text>
            </View>
            <View style={[styles.severityBadge, d.severity === 'high' ? styles.sevHigh : styles.sevMed]}>
              <Text style={styles.severityText}>{d.severity.toUpperCase()}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 3. University / HEI Dashboard
 */
function UniversityDashboardContent() {
  const router = useRouter();
  const { fontScale, challenges, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const assigned = challenges.filter((c) => c.assignedUniversity);
  const validatedOpen = challenges.filter((c) => c.stage === 'Validated' && !c.assignedUniversity);

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
        <RoleIndicatorBar />

        {/* Hero Card */}
        <View style={[styles.heroCard, Shadows.md]}>
          <View style={styles.heroTopRow}>
            <View style={[styles.heroBadge, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
              <GraduationCap size={13} color="#7C3AED" />
              <Text style={[styles.heroBadgeText, { color: '#7C3AED' }]}>HEI Innovation Desk</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { fontSize: 20 * fontScale }]}>
            Campus Challenge Adoption & R&D Hub
          </Text>
          <Text style={[styles.heroDesc, { fontSize: 13 * fontScale }]}>
            Review civic challenges routed to your faculty and students. Form cross-disciplinary project teams and deploy pilot prototypes.
          </Text>
          <View style={{ gap: 8 }}>
            <Button
              title="Open HEI workspace"
              onPress={() => router.push(toHref('/workspace'))}
              variant="action"
              size="lg"
              icon={<GraduationCap size={20} color="#FFFFFF" />}
            />
            <Button
              title="Browse open civic challenges to solve"
              onPress={() => router.push('/explore')}
              variant="outline"
              size="md"
              icon={<Compass size={18} color={SamadhanColors.primary} />}
            />
          </View>
        </View>

        {/* Academic KPIs */}
        <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginBottom: Spacing.sm }]}>
          Campus Research & Innovation Metrics
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: '#7C3AED' }]}>
            <Text style={[styles.statNumber, { color: '#7C3AED' }]}>{assigned.length}</Text>
            <Text style={styles.statLabel}>Assigned HEI Projects</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: SamadhanColors.primary }]}>
            <Text style={styles.statNumber}>{validatedOpen.length}</Text>
            <Text style={styles.statLabel}>Open Challenges</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#16A34A' }]}>
            <Text style={[styles.statNumber, { color: '#16A34A' }]}>12</Text>
            <Text style={styles.statLabel}>Live Pilots</Text>
          </View>
        </View>

        {/* Quick Tiles */}
        <View style={styles.quickGrid}>
          <QuickTile icon={<GraduationCap size={20} color="#7C3AED" />} bg="#F5F3FF" label="Workspace" onPress={() => router.push(toHref('/workspace'))} />
          <QuickTile icon={<Compass size={20} color={SamadhanColors.secondary} />} bg="#F0FDFA" label="Challenges" onPress={() => router.push('/explore')} />
          <QuickTile icon={<Layers size={20} color="#D97706" />} bg="#FFFBEB" label="Network" onPress={() => router.push(toHref('/ecosystem'))} />
          <QuickTile icon={<Bell size={20} color={SamadhanColors.action} />} bg="#FFF7ED" label="Alerts" onPress={() => router.push('/notifications')} />
        </View>

        {/* Assigned Challenges */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Challenges routed to universities ({assigned.length})
          </Text>
          <Pressable onPress={() => router.push(toHref('/workspace'))} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Manage teams</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        {(assigned.length ? assigned : challenges.slice(0, 3)).map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}

        {/* Open Validated Challenges */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginTop: Spacing.md }]}>
            Open validated challenges seeking campus teams
          </Text>
          <Pressable onPress={() => router.push('/explore')} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Explore</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        {(validatedOpen.length ? validatedOpen.slice(0, 3) : challenges.slice(3, 6)).map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}

        {/* Campus Network */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginTop: Spacing.md }]}>
            Jharkhand university innovation network
          </Text>
          <Pressable onPress={() => router.push(toHref('/ecosystem'))} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>All HEIs</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {UNIVERSITIES_DATA.slice(0, 4).map((uni) => (
            <Pressable key={uni.id} onPress={() => router.push(toHref(`/university-detail?id=${uni.id}`))} style={styles.partnerMini}>
              <Text style={styles.partnerEmoji}>{uni.logoEmoji}</Text>
              <Text style={styles.partnerName} numberOfLines={2}>{uni.shortName}</Text>
              <Text style={styles.partnerMeta}>{uni.activeProjects} active projects</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 4. Industry & CSR Dashboard
 */
function IndustryDashboardContent() {
  const router = useRouter();
  const { fontScale, challenges, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const openIndustry = challenges.filter(
    (c) => !c.industryPartner && ['Assigned', 'In Progress', 'Pilot Testing', 'Validated'].includes(c.stage)
  );

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
        <RoleIndicatorBar />

        {/* Hero Card */}
        <View style={[styles.heroCard, Shadows.md]}>
          <View style={styles.heroTopRow}>
            <View style={[styles.heroBadge, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <Building2 size={13} color="#D97706" />
              <Text style={[styles.heroBadgeText, { color: '#D97706' }]}>Industry & CSR Desk</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { fontSize: 20 * fontScale }]}>
            Corporate CSR & Technology Transfer Hub
          </Text>
          <Text style={[styles.heroDesc, { fontSize: 13 * fontScale }]}>
            Partner with premier student and faculty teams. Co-fund civic pilots, mentor innovators, and scale MSME manufacturing solutions.
          </Text>
          <View style={{ gap: 8 }}>
            <Button
              title="Browse projects seeking partners"
              onPress={() => router.push(toHref('/workspace'))}
              variant="action"
              size="lg"
              icon={<Building2 size={20} color="#FFFFFF" />}
            />
            <Button
              title="Explore CSR co-development network"
              onPress={() => router.push(toHref('/ecosystem'))}
              variant="outline"
              size="md"
              icon={<Layers size={18} color={SamadhanColors.primary} />}
            />
          </View>
        </View>

        {/* Corporate KPIs */}
        <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginBottom: Spacing.sm }]}>
          Industry & CSR Collaboration Metrics
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: '#D97706' }]}>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>{openIndustry.length}</Text>
            <Text style={styles.statLabel}>Seeking Partners</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#16A34A' }]}>
            <Text style={[styles.statNumber, { color: '#16A34A' }]}>₹3.4 Cr</Text>
            <Text style={styles.statLabel}>CSR Committed</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: SamadhanColors.primary }]}>
            <Text style={styles.statNumber}>{HEADLINE_KPIS.industryPartners}</Text>
            <Text style={styles.statLabel}>Industry Partners</Text>
          </View>
        </View>

        {/* Quick Tiles */}
        <View style={styles.quickGrid}>
          <QuickTile icon={<Building2 size={20} color="#D97706" />} bg="#FFFBEB" label="Industry Desk" onPress={() => router.push(toHref('/workspace'))} />
          <QuickTile icon={<Layers size={20} color={SamadhanColors.secondary} />} bg="#F0FDFA" label="Ecosystem" onPress={() => router.push(toHref('/ecosystem'))} />
          <QuickTile icon={<MapPinned size={20} color={SamadhanColors.primary} />} bg="#EFF6FF" label="GIS Map" onPress={() => router.push(toHref('/map'))} />
          <QuickTile icon={<Bell size={20} color={SamadhanColors.action} />} bg="#FFF7ED" label="Alerts" onPress={() => router.push('/notifications')} />
        </View>

        {/* High impact projects seeking partners */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Projects seeking industry & CSR partners ({openIndustry.length})
          </Text>
          <Pressable onPress={() => router.push(toHref('/workspace'))} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>View all</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        {(openIndustry.length ? openIndustry.slice(0, 3) : challenges.slice(0, 3)).map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}

        {/* Active Industry Partners in Jharkhand */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale, marginTop: Spacing.md }]}>
            Active corporate & CSR partners
          </Text>
          <Pressable onPress={() => router.push(toHref('/ecosystem'))} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Explore</Text>
            <ArrowRight size={14} color={SamadhanColors.primary} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {INDUSTRY_PARTNERS_DATA.slice(0, 4).map((p) => (
            <Pressable key={p.id} onPress={() => router.push(toHref(`/partner-detail?id=${p.id}`))} style={styles.partnerMini}>
              <Text style={styles.partnerEmoji}>{p.logoEmoji}</Text>
              <Text style={styles.partnerName} numberOfLines={2}>{p.shortName}</Text>
              <Text style={styles.partnerMeta}>{p.totalFundingCommitted}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * MainScreen — Master Dispatcher
 * Directly opens the dedicated Dashboard based on the authenticated user's role and device platform:
 * - On Web/Desktop OR for Institutional Roles (Admin / Govt, University, Industry):
 *   Renders the dedicated desktop-class InstitutionalWebPortal!
 * - On Mobile Devices for Citizens:
 *   Renders the clean, native CitizenHomeScreenContent!
 */
export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { userRole } = useApp();
  const { width } = useWindowDimensions();

  if (!isLoaded) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={SamadhanColors.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/auth" />;
  }

  // Institutional stakeholders (Govt Admin, University, Industry) or Web Desktop users:
  // Render the high-productivity Institutional Web Desk!
  if (Platform.OS === 'web' || width >= 768 || userRole !== 'citizen') {
    return <InstitutionalWebPortal />;
  }

  // Default for citizens on mobile devices: Pure, distraction-free citizen app
  return <CitizenHomeScreenContent />;
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
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SamadhanColors.background,
  },
  safeArea: { flex: 1, backgroundColor: SamadhanColors.background },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg, maxWidth: 960, width: '100%', alignSelf: 'center' },

  // Role switcher bar
  roleBarCard: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  roleBarTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleBarActiveTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  roleBarActiveTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: SamadhanColors.primary,
  },
  roleBarUser: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
    maxWidth: '45%',
  },
  roleChipsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
  },
  roleChipActive: {
    backgroundColor: SamadhanColors.primary,
    borderColor: SamadhanColors.primary,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },

  // Hero Card
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

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  kpiCard: {
    width: '31%',
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  kpiCardVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  kpiCardLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // Stats Row
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

  // Quick Nav Tiles
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

  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionHeading: { fontWeight: '800', color: SamadhanColors.textPrimary },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllText: { fontSize: 12, fontWeight: '700', color: SamadhanColors.primary },

  // Admin Validation Rows
  admin: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  adminTitle: { fontSize: 14, fontWeight: '800', color: SamadhanColors.textPrimary },
  meta: { fontSize: 12, color: SamadhanColors.textSecondary, marginTop: 4 },
  adminActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  primaryBtn: { backgroundColor: SamadhanColors.primary, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 8 },
  primaryText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  secondaryBtn: { borderWidth: 1, borderColor: SamadhanColors.primary, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 8 },
  secondaryText: { color: SamadhanColors.primary, fontWeight: '800', fontSize: 12 },

  // Monthly Trend Chart Box
  trendBox: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  trendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  trendCol: { alignItems: 'center', flex: 1 },
  barTrack: { height: 80, width: 14, backgroundColor: '#E2E8F0', borderRadius: 4, justifyContent: 'flex-end' },
  barFill: { width: '100%', backgroundColor: SamadhanColors.primary, borderRadius: 4 },
  trendLabel: { fontSize: 10, color: SamadhanColors.textSecondary, marginTop: 4, fontWeight: '600' },

  // District rows
  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 6,
  },
  districtName: { fontSize: 13, fontWeight: '800', color: SamadhanColors.textPrimary },
  districtMeta: { fontSize: 11, color: SamadhanColors.textSecondary, marginTop: 2 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  sevHigh: { backgroundColor: '#FEE2E2' },
  sevMed: { backgroundColor: '#FEF3C7' },
  severityText: { fontSize: 10, fontWeight: '800', color: '#991B1B' },

  // Partners & ecosystem
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
