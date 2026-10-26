import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';

export default function PartnerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language, showToast, challenges } = useApp();
  const partner = INDUSTRY_PARTNERS_DATA.find((p) => p.id === id) ?? INDUSTRY_PARTNERS_DATA[0];
  const linked = challenges.filter((c) => c.industryPartner?.partnerId === partner.id);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={20} color={SamadhanColors.primary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.emoji}>{partner.logoEmoji}</Text>
        <Text style={styles.title}>{partner.companyName}</Text>
        <Text style={styles.meta}>{partner.type} · {partner.sector} · {partner.city}</Text>
        <Text style={styles.body}>{partner.description}</Text>
        <View style={styles.pillRow}>
          {partner.contributionTypes.map((c) => (
            <View key={c} style={styles.pill}><Text style={styles.pillText}>{c}</Text></View>
          ))}
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{partner.totalFundingCommitted}</Text>
          <Text style={styles.statLbl}>Committed · {partner.impactHighlight}</Text>
        </View>
        <Text style={styles.h2}>Linked challenges</Text>
        {linked.length ? linked.map((c) => <ChallengeCard key={c.id} challenge={c} />) : (
          <Text style={styles.meta}>Open to new university collaborations.</Text>
        )}
        <Button
          title="Express interest to co-develop"
          onPress={() => showToast('Industry interest shared with matched HEIs.', 'success')}
          variant="secondary"
          style={{ marginTop: Spacing.lg }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SamadhanColors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: Spacing.lg },
  backText: { fontWeight: '700', color: SamadhanColors.primary },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  emoji: { fontSize: 36 },
  title: { fontSize: 22, fontWeight: '800', color: SamadhanColors.textPrimary, marginTop: 8 },
  meta: { fontSize: 13, color: SamadhanColors.textSecondary, marginTop: 4 },
  body: { fontSize: 14, color: SamadhanColors.textPrimary, lineHeight: 21, marginTop: 10 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.md },
  pill: { backgroundColor: '#F0FDFA', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { fontSize: 11, fontWeight: '700', color: SamadhanColors.secondary },
  stat: {
    marginTop: Spacing.lg,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  statVal: { fontSize: 18, fontWeight: '900', color: SamadhanColors.primary },
  statLbl: { fontSize: 12, color: SamadhanColors.textSecondary, marginTop: 4 },
  h2: { marginTop: Spacing.xl, fontSize: 15, fontWeight: '800', color: SamadhanColors.textPrimary, marginBottom: Spacing.sm },
});
