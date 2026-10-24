import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { matchUniversities } from '@/lib/ai-engine';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { useRouter } from 'expo-router';
import { toHref } from '@/lib/routes';

export default function WorkspaceScreen() {
  const router = useRouter();
  const {
    userRole,
    challenges,
    language,
    validateChallenge,
    assignUniversity,
    mergeAsDuplicate,
    user,
  } = useApp();

  const mine = challenges.filter((c) => c.isUserChallenge || c.submittedBy === user.name);
  const pending = challenges.filter((c) => c.stage === 'Submitted' || c.stage === 'Under Review');
  const duplicates = challenges.filter((c) => (c.similarChallengeIds || []).length > 0 && (c.stage === 'Submitted' || c.stage === 'Under Review'));
  const assigned = challenges.filter((c) => c.assignedUniversity);
  const openIndustry = challenges.filter((c) => !c.industryPartner && ['Assigned', 'In Progress', 'Pilot Testing', 'Validated'].includes(c.stage));

  const title =
    userRole === 'citizen'
      ? language === 'hi' ? 'मेरी चुनौतियां' : 'My challenges'
      : userRole === 'government'
      ? language === 'hi' ? 'प्रशासक कतार' : 'Admin validation queue'
      : userRole === 'university'
      ? language === 'hi' ? 'HEI कार्यक्षेत्र' : 'University workspace'
      : language === 'hi' ? 'उद्योग डेस्क' : 'Industry / CSR desk';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>{title}</Text>
        <Text style={styles.sub}>
          {userRole === 'citizen' && 'Track submissions from photo + GPS through university pilots.'}
          {userRole === 'government' && 'Validate reports, group duplicates, and route to matching HEIs.'}
          {userRole === 'university' && 'Accept routed challenges, form teams, and submit proposals.'}
          {userRole === 'industry' && 'Fund, mentor, or join a live campus project.'}
        </Text>

        {userRole === 'citizen' ? (
          <>
            <Button title="Report a local challenge" onPress={() => router.push(toHref('/submit-challenge'))} variant="action" />
            <View style={{ height: Spacing.lg }} />
            {(mine.length ? mine : challenges.filter((c) => c.submitterType === 'Citizen').slice(0, 4)).map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </>
        ) : null}

        {userRole === 'government' ? (
          <>
            <Text style={styles.h2}>Pending validation ({pending.length})</Text>
            {pending.map((c) => (
              <AdminRow
                key={c.id}
                title={c.title}
                meta={`AI ${c.domain} · ${c.aiConfidence}% · ${c.district}`}
                onOpen={() => router.push(toHref(`/challenge-detail?id=${c.id}`))}
                primary="Validate"
                onPrimary={() => validateChallenge(c.id)}
                secondary={matchUniversities(c.domain)[0] ? `Route ${matchUniversities(c.domain)[0].shortName}` : undefined}
                onSecondary={() => {
                  const uni = matchUniversities(c.domain)[0];
                  if (uni) assignUniversity(c.id, uni.id);
                }}
              />
            ))}
            <Text style={styles.h2}>Community patterns / duplicates</Text>
            {duplicates.map((c) => (
              <AdminRow
                key={`d-${c.id}`}
                title={c.title}
                meta={`${c.similarChallengeIds?.length || 0} similar nearby reports`}
                onOpen={() => router.push(toHref(`/challenge-detail?id=${c.id}`))}
                primary="Group pattern"
                onPrimary={() => c.similarChallengeIds?.[0] && mergeAsDuplicate(c.similarChallengeIds[0], c.id)}
              />
            ))}
            <Button title="Open analytics dashboard" onPress={() => router.push(toHref('/dashboard'))} variant="outline" style={{ marginTop: Spacing.md }} />
          </>
        ) : null}

        {userRole === 'university' ? (
          <>
            <Text style={styles.h2}>Assigned to HEIs</Text>
            {assigned.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
            <Text style={styles.h2}>Open validated challenges</Text>
            {challenges.filter((c) => c.stage === 'Validated' && !c.assignedUniversity).map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </>
        ) : null}

        {userRole === 'industry' ? (
          <>
            <Text style={styles.h2}>Projects seeking partners</Text>
            {openIndustry.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
            <Text style={styles.h2}>Your organisation types on this portal</Text>
            {INDUSTRY_PARTNERS_DATA.slice(0, 4).map((p) => (
              <Pressable key={p.id} style={styles.partner} onPress={() => router.push(toHref(`/partner-detail?id=${p.id}`))}>
                <Text style={styles.partnerTitle}>{p.logoEmoji} {p.companyName}</Text>
                <Text style={styles.meta}>{p.contributionTypes.join(' · ')} · {p.totalFundingCommitted}</Text>
              </Pressable>
            ))}
          </>
        ) : null}
        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SamadhanColors.background },
  content: { padding: Spacing.lg, paddingBottom: 110 },
  h1: { fontSize: 20, fontWeight: '800', color: SamadhanColors.textPrimary },
  sub: { marginTop: 4, marginBottom: Spacing.lg, color: SamadhanColors.textSecondary, fontSize: 13, lineHeight: 18 },
  h2: { marginTop: Spacing.lg, marginBottom: Spacing.sm, fontSize: 14, fontWeight: '800', color: SamadhanColors.textPrimary },
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
  primaryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  secondaryBtn: { backgroundColor: '#EFF6FF', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 8 },
  secondaryText: { color: SamadhanColors.primary, fontSize: 12, fontWeight: '800' },
  partner: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 8,
  },
  partnerTitle: { fontWeight: '800', color: SamadhanColors.textPrimary },
});
