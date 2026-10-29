import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { MediaUploader, UploadedMediaItem } from '@/components/common/MediaUploader';
import { LocationPicker, SelectedLocation } from '@/components/common/LocationPicker';
import { useApp } from '@/context/AppContext';
import { classifyChallenge } from '@/lib/ai-engine';
import { Challenge, DOMAIN_EVIDENCE_IMAGES } from '@/data/challenges';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { toHref } from '@/lib/routes';

import { VoiceInputButton } from '@/components/common/VoiceInputButton';

const SUBMITTERS: Challenge['submitterType'][] = ['Citizen', 'Community Org', 'PRI', 'ULB', 'Govt Dept'];

export default function SubmitChallengeScreen() {
  const router = useRouter();
  const { language, user, submitChallenge, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affected, setAffected] = useState('');
  const [submitterType, setSubmitterType] = useState<Challenge['submitterType']>('Citizen');
  const [media, setMedia] = useState<UploadedMediaItem[]>([]);
  const [location, setLocation] = useState<SelectedLocation>({
    district: user.district || 'Ranchi',
    block: user.block || 'Ranchi Sadar',
    villageOrWard: '',
    address: '',
    latitude: 23.3441,
    longitude: 85.3096,
    isGps: true,
  });

  const preview = useMemo(() => {
    if (title.trim().length < 3 && description.trim().length < 5) return null;
    return classifyChallenge(title, description);
  }, [title, description]);

  const handleSubmit = () => {
    if (title.trim().length < 8) {
      showToast(
        language === 'hi'
          ? 'कृपया कम से कम 8 अक्षरों का शीर्षक दर्ज करें।'
          : 'Please enter a title of at least 8 characters.',
        'error'
      );
      return;
    }
    if (description.trim().length < 20) {
      showToast(
        language === 'hi'
          ? 'कृपया समस्या का विवरण कम से कम 20 अक्षरों में लिखें।'
          : 'Please describe the problem in more detail (min 20 chars).',
        'error'
      );
      return;
    }
    const result = submitChallenge({
      title: title.trim(),
      description: description.trim(),
      district: location.district,
      location: location.villageOrWard
        ? `${location.villageOrWard}, ${location.block}, ${location.district}`
        : `${location.block}, ${location.district}`,
      affectedCount: Number(affected) || 100,
      submitterType,
      imageUrl: media[0]?.uri || (preview ? DOMAIN_EVIDENCE_IMAGES[preview.domain] : undefined),
    });
    router.replace(toHref(`/challenge-detail?id=${result.id}`));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}
        style={styles.back}>
        <ArrowLeft size={20} color={SamadhanColors.primary} />
        <Text style={styles.backText}>{language === 'hi' ? 'वापस' : 'Back'}</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>{language === 'hi' ? 'स्थानीय चुनौती दर्ज करें' : 'Report a local challenge'}</Text>
        <Text style={styles.sub}>Photo → location → submit. AI classifies domain and finds similar nearby reports.</Text>

        <Text style={styles.label}>Challenge title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Contaminated drinking water in Gumla" placeholderTextColor={SamadhanColors.textMuted} />

        <Text style={styles.label}>Describe the problem *</Text>
        <TextInput
          style={[styles.input, styles.area]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Who is affected, since when, and what evidence do you have?"
          placeholderTextColor={SamadhanColors.textMuted}
        />

        <VoiceInputButton
          onTranscriptionAvailable={(text) => {
            setDescription((prev) => (prev ? `${prev} ${text}` : text));
          }}
        />

        <Text style={styles.label}>Who is submitting?</Text>
        <View style={styles.chips}>
          {SUBMITTERS.map((item) => (
            <Pressable key={item} onPress={() => setSubmitterType(item)} style={[styles.chip, submitterType === item && styles.chipOn]}>
              <Text style={[styles.chipText, submitterType === item && styles.chipTextOn]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>How many people are affected?</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={affected} onChangeText={setAffected} />

        <Text style={styles.label}>Photos / video / documents</Text>
        <MediaUploader mediaList={media} onChange={setMedia} />

        <Text style={styles.label}>Location (map GPS on Android & iOS)</Text>
        <LocationPicker value={location} onChange={setLocation} />

        {preview ? (
          <View style={styles.aiBox}>
            <Sparkles size={16} color="#7C3AED" />
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Live AI preview</Text>
              <Text style={styles.aiBody}>
                Domain: {preview.domain} · Confidence {preview.confidence}% · Urgency {preview.urgency}
              </Text>
              <Text style={styles.aiBody}>Skills needed: {preview.skills.slice(0, 3).join(', ')}</Text>
            </View>
          </View>
        ) : null}

        <Button title="Submit challenge" onPress={handleSubmit} variant="action" size="lg" />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SamadhanColors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  backText: { fontWeight: '700', color: SamadhanColors.primary },
  content: { padding: Spacing.lg, maxWidth: 720, width: '100%', alignSelf: 'center' },
  h1: { fontSize: 22, fontWeight: '800', color: SamadhanColors.textPrimary },
  sub: { marginTop: 6, marginBottom: Spacing.lg, color: SamadhanColors.textSecondary, fontSize: 13, lineHeight: 18 },
  label: { marginTop: Spacing.md, marginBottom: 6, fontSize: 12, fontWeight: '800', color: SamadhanColors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: SamadhanColors.textPrimary,
  },
  area: { minHeight: 110, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1, borderColor: SamadhanColors.border, backgroundColor: '#FFFFFF' },
  chipOn: { backgroundColor: SamadhanColors.primary, borderColor: SamadhanColors.primary },
  chipText: { fontSize: 12, fontWeight: '700', color: SamadhanColors.textSecondary },
  chipTextOn: { color: '#FFFFFF' },
  aiBox: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  aiTitle: { fontWeight: '800', color: '#6D28D9' },
  aiBody: { marginTop: 2, fontSize: 12, color: '#5B21B6' },
});
