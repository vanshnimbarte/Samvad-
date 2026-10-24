import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useApp } from '@/context/AppContext';
import { ChallengeDomain, ChallengeStage } from '@/data/challenges';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';

const DOMAINS: Array<'All' | ChallengeDomain> = [
  'All',
  'Water & Sanitation',
  'Agriculture & Farming',
  'Healthcare',
  'Education',
  'Roads & Transport',
  'Electricity & Energy',
  'Environment',
  'Rural Livelihoods',
  'Urban Infrastructure',
  'Public Services',
];

const STAGES: Array<'All' | ChallengeStage> = [
  'All',
  'Submitted',
  'Under Review',
  'Validated',
  'Assigned',
  'In Progress',
  'Pilot Testing',
  'Deployed',
];

export default function ExploreProblemsScreen() {
  const { language, fontScale, challenges } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [domain, setDomain] = useState<(typeof DOMAINS)[number]>('All');
  const [stage, setStage] = useState<(typeof STAGES)[number]>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return challenges.filter((c) => {
      const matchQ =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.aiTags.some((tag) => tag.toLowerCase().includes(q));
      const matchD = domain === 'All' || c.domain === domain;
      const matchS = stage === 'All' || c.stage === stage;
      return matchQ && matchD && matchS;
    });
  }, [searchQuery, domain, stage, challenges]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <OfflineBanner />
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={18} color={SamadhanColors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={language === 'hi' ? 'चुनौती, जिला, AI टैग खोजें...' : 'Search challenges, district, AI tags...'}
              placeholderTextColor={SamadhanColors.textMuted}
              style={[styles.searchInput, { fontSize: 13 * fontScale }]}
            />
          </View>
          <Pressable onPress={() => setShowFilters((v) => !v)} style={[styles.filterBtn, showFilters && styles.filterBtnActive]}>
            <SlidersHorizontal size={18} color={showFilters ? '#FFFFFF' : SamadhanColors.primary} />
          </Pressable>
        </View>

        {showFilters ? (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {DOMAINS.map((item) => (
                <Pressable key={item} onPress={() => setDomain(item)} style={[styles.chip, domain === item && styles.chipActive]}>
                  <Text style={[styles.chipText, domain === item && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {STAGES.map((item) => (
                <Pressable key={item} onPress={() => setStage(item)} style={[styles.chip, stage === item && styles.chipActive]}>
                  <Text style={[styles.chipText, stage === item && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>
            {filtered.length} {language === 'hi' ? 'चुनौतियां' : 'challenges'} · AI classified
          </Text>
          {filtered.length === 0 ? (
            <EmptyState
              title={language === 'hi' ? 'कोई चुनौती नहीं मिली' : 'No challenges found'}
              description={language === 'hi' ? 'फ़िल्टर बदलकर फिर कोशिश करें।' : 'Try another domain, stage, or search term.'}
            />
          ) : (
            filtered.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: SamadhanColors.background },
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  searchInput: { flex: 1, color: SamadhanColors.textPrimary },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    backgroundColor: SamadhanColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: SamadhanColors.primary, borderColor: SamadhanColors.primary },
  chipRow: { gap: 8, paddingBottom: Spacing.sm },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
  },
  chipActive: { backgroundColor: SamadhanColors.primarySurface, borderColor: SamadhanColors.primary },
  chipText: { fontSize: 12, fontWeight: '700', color: SamadhanColors.textSecondary },
  chipTextActive: { color: SamadhanColors.primary },
  list: { paddingBottom: 110 },
  count: { fontSize: 12, fontWeight: '700', color: SamadhanColors.textMuted, marginBottom: Spacing.md },
});
