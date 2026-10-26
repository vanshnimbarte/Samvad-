import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { UNIVERSITIES_DATA } from '@/data/universities';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';

export default function UniversityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language, showToast, challenges } = useApp();
  const uni = UNIVERSITIES_DATA.find((u) => u.id === id) ?? UNIVERSITIES_DATA[0];
  const assigned = challenges.filter((c) => c.assignedUniversity?.heiId === uni.id);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={20} color={SamadhanColors.primary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.emoji}>{uni.logoEmoji}</Text>
        <Text style={styles.title}>{uni.name}</Text>
        <Text style={styles.meta}>{uni.type} · {uni.city} · Est. {uni.established}</Text>
        <Text style={styles.body}>
          Research centres: {uni.researchCentres.join(', ')}. Incubation {uni.incubationFacility ? 'available' : 'not listed'}.
        </Text>
        <View style={styles.row}>
          <Stat label="Faculty" value={String(uni.facultyCount)} />
          <Stat label="Researchers" value={String(uni.studentResearchers)} />
          <Stat label="Startups" value={String(uni.startupsIncubated)} />
        </View>
        <Text style={styles.h2}>Disciplines</Text>
        <Text style={styles.body}>{uni.disciplines.join(' · ')}</Text>
        <Text style={styles.h2}>Assigned challenges</Text>
        {assigned.length ? assigned.map((c) => <ChallengeCard key={c.id} challenge={c} />) : (
          <Text style={styles.meta}>No live assignments in the demo set.</Text>
        )}
        <Button
          title="Constitute project team"
          onPress={() => showToast('Team workspace created for this HEI.', 'success')}
          variant="action"
          style={{ marginTop: Spacing.lg }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
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
  row: { flexDirection: 'row', gap: 8, marginTop: Spacing.lg },
  stat: {
    flex: 1,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  statVal: { fontSize: 16, fontWeight: '900', color: SamadhanColors.primary },
  statLbl: { fontSize: 11, color: SamadhanColors.textMuted, fontWeight: '700' },
  h2: { marginTop: Spacing.xl, fontSize: 15, fontWeight: '800', color: SamadhanColors.textPrimary },
});
