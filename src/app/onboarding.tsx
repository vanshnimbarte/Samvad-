import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MessageSquarePlus,
  Activity,
  HeartHandshake,
  ArrowRight,
  Languages,
  Check,
  Sparkles,
} from 'lucide-react-native';

import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import {
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { fontScale } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: MessageSquarePlus,
      color: SamadhanColors.action,
      bg: '#FFF7ED',
      title: 'Report problems in your community',
      desc: 'Tell us about issues affecting your village, town, or neighborhood in less than three minutes.',
    },
    {
      icon: Activity,
      color: SamadhanColors.primary,
      bg: '#EFF6FF',
      title: 'Track every update',
      desc: 'Follow your report across 7 transparent resolution milestones from submission to verified completion.',
    },
    {
      icon: HeartHandshake,
      color: SamadhanColors.secondary,
      bg: '#F0FDFA',
      title: 'Help create real impact',
      desc: 'Connect communities with people, departments, and organizations working on solutions.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/auth');
    }
  };

  const handleSkip = () => {
    router.replace('/auth');
  };

  const activeSlideData = slides[currentSlide];
  const IconComp = activeSlideData.icon;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Controls: Skip */}
      <View style={styles.topRow}>
        <View />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          onPress={handleSkip}
          style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Main Slide Card */}
      <View style={styles.slideArea}>
        <View style={[styles.illustrationCard, { backgroundColor: activeSlideData.bg }]}>
          <View style={[styles.iconCircle, { backgroundColor: activeSlideData.color }]}>
            <IconComp size={48} color="#FFFFFF" strokeWidth={2.4} />
          </View>

          {/* Micro community badge */}
          <View style={styles.communityTag}>
            <Sparkles size={12} color={activeSlideData.color} />
            <Text style={[styles.communityTagText, { color: activeSlideData.color }]}>
              Citizen Empowerment
            </Text>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.slideTitle, { fontSize: 22 * fontScale }]}>
            {activeSlideData.title}
          </Text>

          <Text style={[styles.slideDesc, { fontSize: 14 * fontScale }]}>
            {activeSlideData.desc}
          </Text>
        </View>

        {/* Dots Indicator */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom CTA Button */}
      <View style={styles.footer}>
        <Button
          title={currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="action"
          size="lg"
          iconRight={<ArrowRight size={18} color="#FFFFFF" />}
          style={styles.mainBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  langPills: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#F1F5F9',
    padding: 3,
    borderRadius: Radius.full,
  },
  langPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    minHeight: 34,
    justifyContent: 'center',
  },
  langPillActive: {
    backgroundColor: SamadhanColors.primary,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  langPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  skipBtn: {
    padding: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 13,
    color: SamadhanColors.textSecondary,
    fontWeight: '700',
  },
  slideArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  illustrationCard: {
    width: 220,
    height: 220,
    borderRadius: Radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  communityTag: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  communityTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  slideTitle: {
    fontWeight: '900',
    color: SamadhanColors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: Spacing.sm,
  },
  slideDesc: {
    color: SamadhanColors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    width: 24,
    backgroundColor: SamadhanColors.action,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  mainBtn: {
    width: '100%',
  },
});
