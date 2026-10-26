import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header';
import { useApp } from '@/context/AppContext';
import {
  HEADLINE_KPIS,
  DOMAIN_STATS,
  DISTRICT_STATS,
  MONTHLY_TREND,
  HEI_PERFORMANCE,
} from '@/data/dashboard-stats';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';

export default function DashboardScreen() {
  const { language, fontScale } = useApp();
  const maxTrend = Math.max(...MONTHLY_TREND.map((m) => m.submitted));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.h1, { fontSize: 18 * fontScale }]}>
          Government analytics
        </Text>
        <Text style={styles.sub}>
          Live view of challenges, HEI participation, industry collaboration, and social outcomes.
        </Text>

        <View style={styles.kpiGrid}>
          <Kpi label="Challenges" value={HEADLINE_KPIS.totalChallenges.toLocaleString('en-IN')} />
          <Kpi label="Deployed" value={String(HEADLINE_KPIS.deployed)} />
          <Kpi label="HEIs" value={String(HEADLINE_KPIS.heiPartners)} />
          <Kpi label="Industry" value={String(HEADLINE_KPIS.industryPartners)} />
          <Kpi label="Patents" value={String(HEADLINE_KPIS.patentsApplied)} />
          <Kpi label="Startups" value={String(HEADLINE_KPIS.startupsCreated)} />
        </View>

        <Text style={styles.h2}>Monthly trend</Text>
        <View style={styles.trendRow}>
          {MONTHLY_TREND.map((m) => (
            <View key={m.month} style={styles.trendCol}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: Math.max(10, Math.round((m.submitted / maxTrend) * 88)) }]} />
              </View>
              <Text style={styles.trendLabel}>{m.month}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.h2}>Domain mix</Text>
        {DOMAIN_STATS.map((d) => (
          <View key={d.domain} style={styles.domainRow}>
            <Text style={styles.domainName}>{d.icon} {d.domain}</Text>
            <Text style={styles.domainVal}>{d.submitted}</Text>
          </View>
        ))}

        <Text style={styles.h2}>HEI performance</Text>
        {HEI_PERFORMANCE.map((h) => (
          <View key={h.heiId} style={styles.heiRow}>
            <Text style={styles.heiName}>{h.shortName}</Text>
            <Text style={styles.heiMeta}>{h.ongoing} live · {h.completed} done · {h.ipGenerated} IP</Text>
          </View>
        ))}

        <Text style={styles.h2}>District intensity</Text>
        {DISTRICT_STATS.slice(0, 10).map((d) => (
          <View key={d.district} style={styles.heiRow}>
            <Text style={styles.heiName}>{d.district}</Text>
            <Text style={styles.heiMeta}>{d.challenges} challenges · {d.resolved} resolved · {d.severity}</Text>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SamadhanColors.background },
  content: { padding: Spacing.lg },
  h1: { fontWeight: '800', color: SamadhanColors.textPrimary },
  sub: { fontSize: 13, color: SamadhanColors.textSecondary, marginTop: 4, marginBottom: Spacing.lg, lineHeight: 18 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.xl },
  kpi: {
    width: '31%',
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  kpiValue: { fontSize: 16, fontWeight: '900', color: SamadhanColors.primary },
  kpiLabel: { fontSize: 10, fontWeight: '700', color: SamadhanColors.textMuted, marginTop: 2 },
  h2: { fontSize: 15, fontWeight: '800', color: SamadhanColors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
  trendRow: { flexDirection: 'row', height: 120, gap: 8, marginBottom: Spacing.xl, alignItems: 'flex-end' },
  trendCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  barTrack: { width: '70%', height: 88, backgroundColor: '#E2E8F0', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: SamadhanColors.primary, borderRadius: 6 },
  trendLabel: { fontSize: 10, fontWeight: '700', color: SamadhanColors.textMuted, marginTop: 4 },
  domainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
  },
  domainName: { fontSize: 12, fontWeight: '700', color: SamadhanColors.textPrimary, flex: 1 },
  domainVal: { fontSize: 12, fontWeight: '800', color: SamadhanColors.primary },
  heiRow: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 8,
  },
  heiName: { fontSize: 13, fontWeight: '800', color: SamadhanColors.textPrimary },
  heiMeta: { fontSize: 11, color: SamadhanColors.textSecondary, marginTop: 2 },
});
