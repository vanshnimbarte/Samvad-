import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Users,
  CheckCircle2,
  ThumbsUp,
  Share2,
} from 'lucide-react-native';
import { CivicReport } from '@/data/samadhan-mock-data';
import {
  CIVIC_CATEGORIES,
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';
import { StatusBadge } from './StatusBadge';
import { useApp } from '@/context/AppContext';

interface ProblemCardProps {
  report: CivicReport;
}

export function ProblemCard({ report }: ProblemCardProps) {
  const router = useRouter();
  const { language, fontScale, hasSupportedProblem, toggleSupportProblem, showToast } =
    useApp();

  const isSupported = hasSupportedProblem(report.id);

  const category =
    CIVIC_CATEGORIES.find((c) => c.id === report.categoryId) ||
    CIVIC_CATEGORIES[CIVIC_CATEGORIES.length - 1];

  const title = language === 'hi' ? report.titleHi : report.titleEn;
  const description = language === 'hi' ? report.descriptionHi : report.descriptionEn;
  const locationText = `${report.location.villageOrWard}, ${report.location.block}, ${report.location.district}`;

  const hasMedia = report.media && report.media.length > 0;
  const imageUrl = hasMedia
    ? report.media[0].url
    : 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80';

  const handleShare = () => {
    showToast(
      language === 'hi'
        ? 'समस्या लिंक क्लिपबोर्ड पर कॉपी हुआ!'
        : 'Problem link copied to clipboard!',
      'info'
    );
  };

  return (
    <View style={[styles.card, Shadows.sm]}>
      {/* Top Media Image Banner with Verified Badge */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View public details for ${title}`}
        onPress={() => router.push(`/public-problem?id=${report.id}`)}
        style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.bannerImage} />

        {/* Verified Badge Overlay */}
        <View style={styles.verifiedBadge}>
          <CheckCircle2 size={12} color="#FFFFFF" />
          <Text style={styles.verifiedBadgeText}>
            {language === 'hi' ? 'सत्यापित' : 'VERIFIED'}
          </Text>
        </View>

        {/* Status Badge in Top Right */}
        <View style={styles.statusOverlay}>
          <StatusBadge status={report.status} size="sm" />
        </View>
      </Pressable>

      {/* Content Body */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/public-problem?id=${report.id}`)}
        style={styles.contentBody}>
        {/* Category & Location */}
        <View style={styles.metaHeader}>
          <View style={[styles.categoryPill, { backgroundColor: category.badgeBg }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>
              {language === 'hi' ? category.nameHi : category.nameEn}
            </Text>
          </View>

          <View style={styles.locationWrap}>
            <MapPin size={12} color={SamadhanColors.action} />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationText}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { fontSize: 15 * fontScale }]} numberOfLines={2}>
          {title}
        </Text>

        {/* Description excerpt */}
        <Text
          style={[styles.description, { fontSize: 13 * fontScale }]}
          numberOfLines={2}>
          {description}
        </Text>

        {/* Impact stats: affected & supporters */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Users size={14} color={SamadhanColors.secondary} />
            <Text style={styles.statText}>
              <Text style={styles.statStrong}>{report.affectedCount}+</Text>{' '}
              {language === 'hi' ? 'नागरिक प्रभावित' : 'citizens affected'}
            </Text>
          </View>

          <View style={styles.statItem}>
            <ThumbsUp size={14} color={SamadhanColors.action} />
            <Text style={styles.statText}>
              <Text style={styles.statStrong}>{report.supporters}</Text>{' '}
              {language === 'hi' ? 'समर्थक' : 'supporters'}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Action Footer: Support Button & Share */}
      <View style={styles.actionFooter}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSupported ? 'Remove support' : 'Support this problem'}
          onPress={() => toggleSupportProblem(report.id)}
          style={[
            styles.supportButton,
            isSupported && styles.supportButtonActive,
          ]}>
          <ThumbsUp
            size={16}
            color={isSupported ? '#FFFFFF' : SamadhanColors.action}
            fill={isSupported ? '#FFFFFF' : 'none'}
          />
          <Text
            style={[
              styles.supportButtonText,
              isSupported && styles.supportButtonTextActive,
            ]}>
            {isSupported
              ? language === 'hi'
                ? 'समर्थित ✓'
                : 'Supported ✓'
              : language === 'hi'
              ? 'समर्थन दें'
              : 'Support Issue'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share this community problem"
          onPress={handleShare}
          style={styles.shareBtn}>
          <Share2 size={18} color={SamadhanColors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(22, 163, 74, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  contentBody: {
    padding: Spacing.md,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: '55%',
  },
  locationText: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 4,
  },
  description: {
    color: SamadhanColors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
  },
  statStrong: {
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: 10,
    borderRadius: Radius.md,
    minHeight: 44, // WCAG AA
  },
  supportButtonActive: {
    backgroundColor: SamadhanColors.action,
    borderColor: SamadhanColors.action,
  },
  supportButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.action,
  },
  supportButtonTextActive: {
    color: '#FFFFFF',
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    backgroundColor: SamadhanColors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
