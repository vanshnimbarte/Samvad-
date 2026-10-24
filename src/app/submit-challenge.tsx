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

const DEMO_PRESETS = [
  {
    label: '💧 Arsenic in Gumla',
    title: 'High arsenic and iron contamination in drinking water wells',
    description: 'Groundwater testing shows arsenic levels 4x above WHO safe limits across three hamlets in Bishunpur block. Community members and school students face health issues and need low-cost community filtration.',
    district: 'Gumla',
    block: 'Bishunpur',
    villageOrWard: 'Bishunpur Tola 2',
    address: 'Near Gram Panchayat Bhawan, Bishunpur',
    affected: '1850',
    submitterType: 'Community Org' as const,
    lat: 23.043,
    lng: 84.542,
  },
  {
    label: '⚡ Solar Storage in Latehar',
    title: 'Solar cold storage and microgrid failure for forest produce',
    description: 'Mahua flower and forest produce harvesting season causes immense spoilage due to lack of localized solar microgrid cold storage. Tribal SHGs are forced to sell produce at distress rates.',
    district: 'Latehar',
    block: 'Mahuadanr',
    villageOrWard: 'Orsa Gram',
    address: 'Van Samiti Yard, Mahuadanr',
    affected: '3200',
    submitterType: 'PRI' as const,
    lat: 23.385,
    lng: 84.108,
  },
  {
    label: '🌾 Lac Harvesting in Khunti',
    title: 'Mechanized scraping and pest control for Kusmi lac growers',
    description: 'Kusmi lac host trees are experiencing heavy pest infestation, and manual sticklac processing causes 30% yield loss. Low-cost mechanical processing and biological pest management needed.',
    district: 'Khunti',
    block: 'Torpa',
    villageOrWard: 'Dorma Panchayat',
    address: 'Kisan Seva Kendra, Dorma',
    affected: '950',
    submitterType: 'Citizen' as const,
    lat: 22.984,
    lng: 85.056,
  },
];

export default function SubmitChallengeScreen() {
  const router = useRouter();
  const { language, user, submitChallenge, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affected, setAffected] = useState('1200');
  const [submitterType, setSubmitterType] = useState<Challenge['submitterType']>('Citizen');
  const [media, setMedia] = useState<UploadedMediaItem[]>([]);
  const [location, setLocation] = useState<SelectedLocation>({
    district: user.district || 'Gumla',
    block: user.block || 'Gumla',
    villageOrWard: 'Bishunpur',
    address: 'Near village handpump, Bishunpur',
    latitude: 23.043,
    longitude: 84.542,
    isGps: true,
  });

  const preview = useMemo(() => classifyChallenge(title || 'water quality gumla', description || 'contaminated drinking water'), [title, description]);

  const applyPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setAffected(preset.affected);
    setSubmitterType(preset.submitterType);
    setLocation({
      district: preset.district,
      block: preset.block,
      villageOrWard: preset.villageOrWard,
      address: preset.address,
      latitude: preset.lat,
      longitude: preset.lng,
      isGps: true,
    });
    showToast(`Loaded preset: ${preset.label}`, 'info');
  };

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
      location: `${location.villageOrWard}, ${location.block}, ${location.district}`,
      affectedCount: Number(affected) || 100,
      submitterType,
      imageUrl: media[0]?.uri || DOMAIN_EVIDENCE_IMAGES[preview.domain],
    });
    router.replace(toHref(`/challenge-detail?id=${result.id}`));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={20} color={SamadhanColors.primary} />
        <Text style={styles.backText}>{language === 'hi' ? 'वापस' : 'Back'}</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>{language === 'hi' ? 'स्थानीय चुनौती दर्ज करें' : 'Report a local challenge'}</Text>
        <Text style={styles.sub}>Photo → location → submit. AI classifies domain and finds similar nearby reports.</Text>

        {/* Demo Autofill Banner for SIH Video Presentation */}
        <View style={styles.presetBox}>
          <View style={styles.presetHeader}>
            <Sparkles size={14} color={SamadhanColors.action} />
            <Text style={styles.presetTitle}>
              {language === 'hi' ? 'त्वरित डेमो चुनौतियां (1-क्लिक भरें)' : 'One-Tap Demo Scenarios (SIH Video)'}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
            {DEMO_PRESETS.map((p, idx) => (
              <Pressable key={idx} onPress={() => applyPreset(p)} style={styles.presetChip}>
                <Text style={styles.presetChipText}>{p.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

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
  content: { padding: Spacing.lg },
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
  presetBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: SamadhanColors.action,
  },
  presetRow: {
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
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
