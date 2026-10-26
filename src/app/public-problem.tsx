import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  MapPin,
  Users,
  ThumbsUp,
  Bell,
  BellRing,
  Flag,
  Copy,
  Building,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react-native';

import { StatusBadge } from '@/components/common/StatusBadge';
import { StatusTimeline } from '@/components/common/StatusTimeline';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import {
  CIVIC_CATEGORIES,
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function PublicProblemDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const reportId = params.id || 'SC-JH-84920';

  const {
    getReportById,
    language,
    fontScale,
    hasSupportedProblem,
    toggleSupportProblem,
    showToast,
    reports,
  } = useApp();

  const report = getReportById(reportId) || reports[0];
  const isSupported = hasSupportedProblem(report.id);
  const [isFollowing, setIsFollowing] = useState(false);

  const category =
    CIVIC_CATEGORIES.find((c) => c.id === report.categoryId) ||
    CIVIC_CATEGORIES[0];

  const title = report.titleEn;
  const description = report.descriptionEn;

  const handleShare = () => {
    showToast(
      'Public problem link copied to clipboard.',
      'info'
    );
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    showToast(
      !isFollowing
        ? 'You are now following updates for this problem.'
        : 'Unfollowed updates.',
      'success'
    );
  };

  const relatedProblems = reports
    .filter((r) => r.id !== report.id && r.categoryId === report.categoryId)
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to explore"
          onPress={() => router.back()}
          style={styles.iconBtn}>
          <ArrowLeft size={22} color={SamadhanColors.textPrimary} />
        </Pressable>

        <View style={styles.verifiedBadge}>
          <CheckCircle2 size={13} color="#FFFFFF" />
          <Text style={styles.verifiedBadgeText}>
            VERIFIED COMMUNITY ISSUE
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share this problem"
          onPress={handleShare}
          style={styles.iconBtn}>
          <Share2 size={19} color={SamadhanColors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        {report.media && report.media.length > 0 && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: report.media[0].url }} style={styles.mainImage} />
            <View style={styles.statusFloat}>
              <StatusBadge status={report.status} size="md" />
            </View>
          </View>
        )}

        {/* Content Card */}
        <View style={[styles.mainCard, Shadows.sm]}>
          <View style={[styles.categoryPill, { backgroundColor: category.badgeBg }]}>
            <Text style={[styles.categoryPillText, { color: category.color }]}>
              {category.nameEn}
            </Text>
          </View>

          <Text style={[styles.title, { fontSize: 18 * fontScale }]}>{title}</Text>

          <View style={styles.locationRow}>
            <MapPin size={14} color={SamadhanColors.action} />
            <Text style={styles.locationText}>
              {report.location.villageOrWard}, {report.location.block},{' '}
              {report.location.district}
            </Text>
          </View>

          {/* Supporters & Affected Banner */}
          <View style={styles.impactStatsRow}>
            <View style={styles.impactCol}>
              <Text style={styles.impactNumber}>{report.supporters}</Text>
              <Text style={styles.impactLabel}>
                Supporters
              </Text>
            </View>
            <View style={styles.dividerV} />
            <View style={styles.impactCol}>
              <Text style={styles.impactNumber}>{report.affectedCount}+</Text>
              <Text style={styles.impactLabel}>
                Citizens Affected
              </Text>
            </View>
            <View style={styles.dividerV} />
            <View style={styles.impactCol}>
              <Text style={[styles.impactNumber, { color: SamadhanColors.action }]}>
                {report.urgency.toUpperCase()}
              </Text>
              <Text style={styles.impactLabel}>
                Priority
              </Text>
            </View>
          </View>

          {/* Why Support Note */}
          <View style={styles.supportExplanationBox}>
            <Text style={styles.supportExplanationText}>
              💡{' '}
              <Text style={{ fontWeight: '700' }}>
                Community Impact:
              </Text>{' '}
              Supporting a problem helps organizations understand community priorities and act faster.
            </Text>
          </View>

          {/* Big Support CTA Button */}
          <Button
            title={
              isSupported
                ? 'You Supported This Issue ✓'
                : 'Support This Problem'
            }
            onPress={() => toggleSupportProblem(report.id)}
            variant={isSupported ? 'secondary' : 'action'}
            size="lg"
            icon={<ThumbsUp size={18} color="#FFFFFF" fill={isSupported ? '#FFFFFF' : 'none'} />}
            style={{ marginTop: Spacing.md }}
          />

          {/* Follow Updates CTA */}
          <Button
            title={
              isFollowing
                ? 'Following (Alerts On)'
                : 'Follow Progress Updates'
            }
            onPress={handleToggleFollow}
            variant="outline"
            size="md"
            icon={
              isFollowing ? (
                <BellRing size={16} color={SamadhanColors.primary} />
              ) : (
                <Bell size={16} color={SamadhanColors.primary} />
              )
            }
            style={{ marginTop: Spacing.sm }}
          />

          {/* Description */}
          <Text style={[styles.secHeading, { fontSize: 15 * fontScale, marginTop: Spacing.lg }]}>
            Detailed Description
          </Text>
          <Text style={[styles.descriptionText, { fontSize: 13 * fontScale }]}>
            {description}
          </Text>

          {/* Responsible Body Info */}
          {report.responsibleOrg && (
            <View style={styles.responsibleBox}>
              <Building size={16} color={SamadhanColors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.responsibleLabel}>
                  Responsible Nodal Agency:
                </Text>
                <Text style={styles.responsibleOrgName}>{report.responsibleOrg.name}</Text>
                <Text style={styles.responsibleDept}>
                  {report.responsibleOrg.department} • {report.responsibleOrg.officer}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 7-STAGE STATUS TIMELINE */}
        <StatusTimeline
          currentStatus={report.status}
          timelineEvents={report.timeline}
          responsibleOrg={report.responsibleOrg}
          nextExpectedAction={report.nextExpectedAction}
        />

        {/* Flag Concerns Toolbar */}
        <View style={styles.flagBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Report duplicate issue"
            onPress={() =>
              showToast(
                'Duplicate report notice sent to coordinators.',
                'info'
              )
            }
            style={styles.flagBtn}>
            <Flag size={14} color={SamadhanColors.textMuted} />
            <Text style={styles.flagText}>
              Report Duplicate
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Report inaccurate info"
            onPress={() =>
              showToast(
                'Inaccurate info flag sent for review.',
                'info'
              )
            }
            style={styles.flagBtn}>
            <AlertTriangle size={14} color={SamadhanColors.textMuted} />
            <Text style={styles.flagText}>
              Inaccurate Info
            </Text>
          </Pressable>
        </View>

        {/* Related Problems */}
        {relatedProblems.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={[styles.secHeading, { fontSize: 15 * fontScale }]}>
              Related Community Issues
            </Text>
            {relatedProblems.map((rel) => (
              <Pressable
                key={rel.id}
                accessibilityRole="button"
                accessibilityLabel={`View related problem ${rel.titleEn}`}
                onPress={() => router.push(`/public-problem?id=${rel.id}`)}
                style={styles.relatedCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.relatedTitle} numberOfLines={1}>
                    {rel.titleEn}
                  </Text>
                  <Text style={styles.relatedLocation}>
                    📍 {rel.location.villageOrWard}, {rel.location.block}
                  </Text>
                </View>
                <ArrowRight size={16} color={SamadhanColors.primary} />
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: SamadhanColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  imageContainer: {
    height: 180,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.md,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  statusFloat: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  mainCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.lg,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    marginBottom: 6,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    lineHeight: 24,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  locationText: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    fontWeight: '500',
  },
  impactStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.md,
  },
  impactCol: {
    alignItems: 'center',
    flex: 1,
  },
  impactNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: SamadhanColors.primary,
  },
  impactLabel: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  dividerV: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  supportExplanationBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  supportExplanationText: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 16,
  },
  secHeading: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: 6,
  },
  descriptionText: {
    color: SamadhanColors.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  responsibleBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: Spacing.sm,
  },
  responsibleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    textTransform: 'uppercase',
  },
  responsibleOrgName: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.primary,
    marginTop: 1,
  },
  responsibleDept: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 1,
  },
  flagBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: Spacing.md,
  },
  flagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 6,
  },
  flagText: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    fontWeight: '600',
  },
  relatedSection: {
    marginTop: Spacing.sm,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SamadhanColors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.sm,
  },
  relatedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  relatedLocation: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    marginTop: 2,
  },
});
