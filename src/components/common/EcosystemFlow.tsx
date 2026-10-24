import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ECOSYSTEM_STEPS } from '@/lib/ai-engine';
import type { ChallengeStage } from '@/data/challenges';
import { SamadhanColors, Radius, Spacing } from '@/constants/samadhan-theme';

const STAGE_INDEX: Record<ChallengeStage, number> = {
  Submitted: 0,
  'Under Review': 2,
  Validated: 3,
  Assigned: 4,
  'In Progress': 5,
  'Pilot Testing': 6,
  Deployed: 7,
};

export function EcosystemFlow({ activeStage }: { activeStage?: ChallengeStage }) {
  const active = activeStage ? STAGE_INDEX[activeStage] : -1;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ECOSYSTEM_STEPS.map((step, index) => {
        const done = active >= 0 && index <= active;
        const current = index === active;
        return (
          <View key={step.key} style={styles.item}>
            <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]}>
              <Text style={[styles.num, (done || current) && styles.numOn]}>{index + 1}</Text>
            </View>
            {index < ECOSYSTEM_STEPS.length - 1 ? <View style={[styles.line, done && styles.lineDone]} /> : null}
            <Text style={[styles.label, current && styles.labelCurrent]}>{step.label}</Text>
            <Text style={styles.detail}>{step.detail}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: Spacing.sm, paddingRight: Spacing.lg },
  item: { width: 132, marginRight: 4 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotDone: { backgroundColor: SamadhanColors.secondary },
  dotCurrent: { backgroundColor: SamadhanColors.action },
  num: { fontSize: 11, fontWeight: '800', color: SamadhanColors.textMuted },
  numOn: { color: '#FFFFFF' },
  line: {
    position: 'absolute',
    top: 13,
    left: 28,
    width: 108,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  lineDone: { backgroundColor: SamadhanColors.secondary },
  label: { marginTop: 8, fontSize: 11, fontWeight: '800', color: SamadhanColors.textPrimary },
  labelCurrent: { color: SamadhanColors.action },
  detail: { marginTop: 2, fontSize: 10, color: SamadhanColors.textMuted, lineHeight: 13 },
});
