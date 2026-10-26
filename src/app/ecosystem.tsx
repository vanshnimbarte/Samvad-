import { Header } from '@/components/common/Header';
import { Radius, SamadhanColors, Shadows, Spacing } from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';
import { UNIVERSITIES_DATA } from '@/data/universities';
import { toHref } from '@/lib/routes';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EcosystemScreen() {
  const router = useRouter();
  const { language, fontScale } = useApp();
  const [tab, setTab] = useState<'hei' | 'industry'>('hei');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header />
      <View style={styles.toggle}>
        <Pressable onPress={() => setTab('hei')} style={[styles.toggleBtn, tab === 'hei' && styles.toggleActive]}>
          <Text style={[styles.toggleText, tab === 'hei' && styles.toggleTextActive]}>
            Universities
          </Text>
        </Pressable>
        <Pressable onPress={() => setTab('industry')} style={[styles.toggleBtn, tab === 'industry' && styles.toggleActive]}>
          <Text style={[styles.toggleText, tab === 'industry' && styles.toggleTextActive]}>
            Industry partners
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'hei'
          ? UNIVERSITIES_DATA.map((uni) => (
              <Pressable
                key={uni.id}
                onPress={() => router.push(toHref(`/university-detail?id=${uni.id}`))}
                style={[styles.card, Shadows.sm]}>
                <Text style={styles.emoji}>{uni.logoEmoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { fontSize: 15 * fontScale }]}>{uni.name}</Text>
                  <Text style={styles.meta}>{uni.type} · {uni.city}</Text>
                  <Text style={styles.domains} numberOfLines={2}>{uni.domains.join(' · ')}</Text>
                  <View style={styles.stats}>
                    <Text style={styles.stat}>{uni.assignedChallenges} assigned</Text>
                    <Text style={styles.stat}>{uni.activeProjects} live</Text>
                    <Text style={styles.stat}>{uni.ipGenerated} IP</Text>
                  </View>
                </View>
              </Pressable>
            ))
          : INDUSTRY_PARTNERS_DATA.map((partner) => (
              <Pressable
                key={partner.id}
                onPress={() => router.push(toHref(`/partner-detail?id=${partner.id}`))}
                style={[styles.card, Shadows.sm]}>
                <Text style={styles.emoji}>{partner.logoEmoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { fontSize: 15 * fontScale }]}>{partner.companyName}</Text>
                  <Text style={styles.meta}>{partner.type} · {partner.city}</Text>
                  <Text style={styles.domains} numberOfLines={2}>{partner.contributionTypes.join(' · ')}</Text>
                  <View style={styles.stats}>
                    <Text style={styles.stat}>{partner.totalFundingCommitted}</Text>
                    <Text style={styles.stat}>{partner.activeProjects} live</Text>
                  </View>
                </View>
              </Pressable>
            ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SamadhanColors.background },
  toggle: {
    flexDirection: 'row',
    margin: Spacing.lg,
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.lg,
    padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.md },
  toggleActive: { backgroundColor: '#FFFFFF' },
  toggleText: { fontSize: 13, fontWeight: '700', color: SamadhanColors.textSecondary },
  toggleTextActive: { color: SamadhanColors.primary },
  content: { paddingHorizontal: Spacing.lg },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  emoji: { fontSize: 28 },
  title: { fontWeight: '800', color: SamadhanColors.textPrimary },
  meta: { fontSize: 12, color: SamadhanColors.textMuted, marginTop: 2 },
  domains: { fontSize: 12, color: SamadhanColors.textSecondary, marginTop: 6 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 8 },
  stat: { fontSize: 11, fontWeight: '700', color: SamadhanColors.primary },
});
