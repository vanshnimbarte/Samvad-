import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle2,
  Copy,
  Share2,
  ArrowRight,
  PlusCircle,
  Home,
  Clock,
  ShieldCheck,
  Search,
  Building,
  BellRing,
} from 'lucide-react-native';

import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/context/AppContext';
import {
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function ReportSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const reportId = params.id || 'SC-JH-84920';

  const { language, fontScale, showToast } = useApp();

  const handleCopyId = () => {
    showToast(
      language === 'hi'
        ? `ट्रैकिंग आईडी #${reportId} कॉपी की गई!`
        : `Tracking ID #${reportId} copied to clipboard!`,
      'success'
    );
  };

  const handleShareId = () => {
    showToast(
      language === 'hi'
        ? `रिपोर्ट #${reportId} साझा करने के लिए तैयार!`
        : `Report #${reportId} ready to share with community members!`,
      'info'
    );
  };

  const nextSteps = [
    {
      num: '1',
      titleEn: 'We review your report',
      titleHi: 'रिपोर्ट की प्रारंभिक समीक्षा',
      descEn: 'Community coordinators verify language and assign preliminary priority.',
      descHi: 'स्थानीय समन्वयक विवरण की समीक्षा कर प्रारंभिक प्राथमिकता तय करेंगे।',
      icon: Search,
    },
    {
      num: '2',
      titleEn: 'We verify the details',
      titleHi: 'मौके पर स्थल सत्यापन',
      descEn: 'Ground coordinator inspects the location and confirms impact on citizens.',
      descHi: 'ज़मीनी समन्वयक स्थल का मुआयना कर प्रभावित नागरिकों से पुष्टि करेंगे।',
      icon: ShieldCheck,
    },
    {
      num: '3',
      titleEn: 'Connect with relevant organizations',
      titleHi: 'संबंधित विभाग/संस्था से समन्वय',
      descEn: 'Issue routed to district administration, panchayat, or partner agency.',
      descHi: 'समस्या को ज़िला प्रशासन, संबंधित सरकारी विभाग अथवा एजेंसी को भेजा जाएगा।',
      icon: Building,
    },
    {
      num: '4',
      titleEn: 'You receive progress updates',
      titleHi: 'हर चरण पर आपको प्रगति सूचना',
      descEn: 'Get SMS and in-app alerts at every stage until verified resolution.',
      descHi: 'समाधान होने तक आपको प्रत्येक चरण पर ऐप व एसएमएस द्वारा सूचना प्राप्त होगी।',
      icon: BellRing,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Success Icon & Heading */}
        <View style={styles.celebrationBox}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <CheckCircle2 size={42} color="#FFFFFF" strokeWidth={2.8} />
            </View>
          </View>

          <Text style={[styles.heading, { fontSize: 20 * fontScale }]}>
            {language === 'hi'
              ? 'आपकी रिपोर्ट दर्ज कर ली गई है'
              : 'Your report has been submitted'}
          </Text>

          <Text style={styles.subheading}>
            {language === 'hi'
              ? 'स्थानीय समस्या को सामने लाने और समुदाय को बेहतर बनाने में सहयोग के लिए धन्यवाद।'
              : 'Thank you for stepping up for your community. Your report has been officially logged.'}
          </Text>
        </View>

        {/* Tracking Card */}
        <View style={[styles.trackingCard, Shadows.md]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>
              {language === 'hi' ? 'आधिकारिक ट्रैकिंग आईडी' : 'Official Report Tracking ID'}
            </Text>
            <StatusBadge status="Received" size="sm" />
          </View>

          <View style={styles.idRow}>
            <Text style={styles.idValue}>#{reportId}</Text>

            <View style={styles.idActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Copy Report ID"
                onPress={handleCopyId}
                style={styles.smallActionBtn}>
                <Copy size={15} color={SamadhanColors.primary} />
                <Text style={styles.smallActionText}>
                  {language === 'hi' ? 'कॉपी' : 'Copy'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share Report ID"
                onPress={handleShareId}
                style={styles.smallActionBtn}>
                <Share2 size={15} color={SamadhanColors.primary} />
                <Text style={styles.smallActionText}>
                  {language === 'hi' ? 'साझा' : 'Share'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.timestampRow}>
            <Clock size={12} color={SamadhanColors.textMuted} />
            <Text style={styles.timestampText}>
              {language === 'hi'
                ? 'प्रविष्टि समय: आज, 14 सितम्बर 2026, 11:45 AM'
                : 'Submitted: Today, 14 Sep 2026, 11:45 AM'}
            </Text>
          </View>
        </View>

        {/* What Happens Next Section */}
        <View style={styles.nextStepsSection}>
          <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
            {language === 'hi' ? 'आगे क्या होगा? (Next Steps)' : 'What happens next?'}
          </Text>

          <View style={styles.stepsList}>
            {nextSteps.map((step) => {
              const IconComp = step.icon;
              return (
                <View key={step.num} style={styles.stepItem}>
                  <View style={styles.stepNumCircle}>
                    <IconComp size={16} color={SamadhanColors.primary} />
                  </View>
                  <View style={styles.stepTextContent}>
                    <Text style={[styles.stepTitle, { fontSize: 13 * fontScale }]}>
                      {language === 'hi' ? step.titleHi : step.titleEn}
                    </Text>
                    <Text style={styles.stepDesc}>
                      {language === 'hi' ? step.descHi : step.descEn}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Primary CTA: Track This Report */}
          <Button
            title={language === 'hi' ? 'इस रिपोर्ट को ट्रैक करें' : 'Track This Report'}
            onPress={() => router.push(`/report-detail?id=${reportId}`)}
            variant="action"
            size="lg"
            iconRight={<ArrowRight size={18} color="#FFFFFF" />}
            style={styles.mainBtn}
          />

          {/* Submit Another Report */}
          <Button
            title={language === 'hi' ? 'दूसरी समस्या दर्ज करें' : 'Submit Another Report'}
            onPress={() => router.push('/report-problem')}
            variant="outline"
            size="md"
            icon={<PlusCircle size={18} color={SamadhanColors.primary} />}
            style={{ marginTop: Spacing.sm }}
          />

          {/* Return Home */}
          <Button
            title={language === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Return to Home'}
            onPress={() => router.replace('/')}
            variant="ghost"
            size="md"
            icon={<Home size={18} color={SamadhanColors.primary} />}
            style={{ marginTop: Spacing.xs }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  celebrationBox: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  successIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  successIconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: '900',
    color: SamadhanColors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    color: SamadhanColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },
  trackingCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    textTransform: 'uppercase',
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idValue: {
    fontSize: 22,
    fontWeight: '900',
    color: SamadhanColors.primary,
    letterSpacing: 0.5,
  },
  idActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SamadhanColors.primarySurface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  smallActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timestampText: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
  },
  nextStepsSection: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.md,
  },
  stepsList: {
    gap: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.primarySurface,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepTextContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  stepDesc: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  actionsContainer: {
    width: '100%',
  },
  mainBtn: {
    width: '100%',
  },
});
