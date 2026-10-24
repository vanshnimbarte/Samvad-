import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '@/components/common/Header';
import { ChallengeMapView } from '@/components/common/ChallengeMapView';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { useApp } from '@/context/AppContext';
import { SamadhanColors, Spacing } from '@/constants/samadhan-theme';
import { toHref } from '@/lib/routes';

export default function ChallengeMapScreen() {
  const router = useRouter();
  const { language, challenges } = useApp();
  const [selectedId, setSelectedId] = useState(challenges[0]?.id);
  const selected = challenges.find((c) => c.id === selectedId) ?? challenges[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>
          {language === 'hi' ? 'झारखंड चुनौती मानचित्र' : 'Jharkhand challenge map'}
        </Text>
        <Text style={styles.hint}>
          {language === 'hi'
            ? 'नक्शे पर किसी भी पिन को दबाकर समस्या की जांच करें व समाधान ट्रैक करें।'
            : 'Tap any district pin on the map to inspect challenges and track innovation solutions.'}
        </Text>
        <ChallengeMapView
          challenges={challenges}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          height={Platform.OS === 'web' ? 240 : 360}
        />
        {selected ? (
          <View style={styles.sheet}>
            <Pressable onPress={() => router.push(toHref(`/challenge-detail?id=${selected.id}`))}>
              <ChallengeCard challenge={selected} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SamadhanColors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 120 },
  kicker: { fontSize: 16, fontWeight: '800', color: SamadhanColors.textPrimary, marginBottom: 4 },
  hint: { fontSize: 12, color: SamadhanColors.textSecondary, marginBottom: Spacing.md },
  sheet: { marginTop: Spacing.md },
});
