import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { toHref } from '@/lib/routes';
import { GraduationCap, MapPin, Users, Banknote, Clock } from 'lucide-react-native';
import type { Challenge } from '@/data/challenges';
import { getChallengeImage } from '@/data/challenges';
import {
  CHALLENGE_STAGE_CONFIG,
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const { language, fontScale } = useApp();
  const stage = CHALLENGE_STAGE_CONFIG[challenge.stage];
  const openForProposals = ['Submitted', 'Under Review', 'Validated', 'Assigned'].includes(challenge.stage);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={challenge.title}
      onPress={() => router.push(toHref(`/challenge-detail?id=${challenge.id}`))}
      style={({ pressed }) => [styles.card, Shadows.sm, pressed && styles.pressed]}>
      <Image source={{ uri: getChallengeImage(challenge) }} style={styles.cover} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.domainChip, { backgroundColor: `${challenge.domainColor}18` }]}>
            <Text style={styles.domainEmoji}>{challenge.domainIcon}</Text>
            <Text style={[styles.domainText, { color: challenge.domainColor }]} numberOfLines={1}>
              {challenge.domain}
            </Text>
          </View>
          <View style={[styles.stageChip, { backgroundColor: stage.bg, borderColor: stage.border }]}>
            <Text style={[styles.stageText, { color: stage.color }]}>
              {openForProposals ? 'Open for proposals' : stage.labelEn}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { fontSize: 15 * fontScale }]} numberOfLines={2}>
          {challenge.title}
        </Text>
        <Text style={styles.dept} numberOfLines={1}>
          {challenge.department || challenge.domain} · {challenge.district}
        </Text>

        <View style={styles.metaRow}>
          <MapPin size={13} color={SamadhanColors.action} />
          <Text style={styles.metaText}>{challenge.location}</Text>
        </View>

        <View style={styles.skillRow}>
          {(challenge.requiredSkills || []).slice(0, 3).map((skill) => (
            <View key={skill} style={styles.skill}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Users size={13} color={SamadhanColors.textMuted} />
            <Text style={styles.footerText}>{challenge.beneficiaries.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.footerItem}>
            <Banknote size={13} color={SamadhanColors.secondary} />
            <Text style={[styles.footerText, { color: SamadhanColors.secondary }]} numberOfLines={1}>
              {challenge.fundingAvailable || 'CSR open'}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Clock size={13} color={SamadhanColors.textMuted} />
            <Text style={styles.footerText}>{challenge.deadline || '15 Oct 2026'}</Text>
          </View>
        </View>
        {challenge.assignedUniversity ? (
          <View style={styles.hei}>
            <GraduationCap size={13} color={SamadhanColors.primary} />
            <Text style={styles.heiText}>{challenge.assignedUniversity.heiShortName} · {challenge.applications ?? 0} applications</Text>
          </View>
        ) : (
          <Text style={styles.aiHint}>AI routing · {challenge.aiConfidence ?? 80}% match confidence · {challenge.applications ?? 0} applications</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  pressed: { opacity: 0.94 },
  cover: { width: '100%', height: 128, backgroundColor: '#E2E8F0' },
  body: { padding: Spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 },
  domainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    flexShrink: 1,
  },
  domainEmoji: { fontSize: 12 },
  domainText: { fontSize: 11, fontWeight: '700' },
  stageChip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  stageText: { fontSize: 10, fontWeight: '800' },
  title: { fontWeight: '800', color: SamadhanColors.textPrimary, lineHeight: 20 },
  dept: { marginTop: 4, fontSize: 11, fontWeight: '700', color: SamadhanColors.textMuted },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  metaText: { fontSize: 12, fontWeight: '600', color: SamadhanColors.textPrimary, flex: 1 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  skill: { backgroundColor: '#EFF6FF', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  skillText: { fontSize: 10, fontWeight: '700', color: '#2563EB' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: SamadhanColors.border },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  footerText: { fontSize: 10, fontWeight: '700', color: SamadhanColors.textMuted },
  hei: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  heiText: { fontSize: 11, fontWeight: '700', color: SamadhanColors.primary },
  aiHint: { marginTop: 8, fontSize: 11, fontWeight: '700', color: '#7C3AED' },
});
