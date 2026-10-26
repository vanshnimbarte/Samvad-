import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, ArrowRight, ThumbsUp } from 'lucide-react-native';
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

interface ReportCardProps {
  report: CivicReport;
}

export function ReportCard({ report }: ReportCardProps) {
  const router = useRouter();
  const { language, fontScale } = useApp();

  const category =
    CIVIC_CATEGORIES.find((c) => c.id === report.categoryId) ||
    CIVIC_CATEGORIES[CIVIC_CATEGORIES.length - 1];

  const title = language === 'hi' ? report.titleHi : report.titleEn;
  const locationText = `${report.location.villageOrWard}, ${report.location.block}`;

  const hasMedia = report.media && report.media.length > 0;
  const thumbnailUrl = hasMedia ? report.media[0].url : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View report: ${title}, Status: ${report.status}`}
      onPress={() => router.push(`/report-detail?id=${report.id}`)}
      style={({ pressed }) => [
        styles.card,
        Shadows.sm,
        pressed && styles.cardPressed,
      ]}>
      
      <View style={styles.topRow}>
        <View style={[styles.categoryChip, { backgroundColor: category.badgeBg }]}>
          <Text style={[styles.categoryText, { color: category.color }]}>
            {language === 'hi' ? category.nameHi : category.nameEn}
          </Text>
        </View>

        <StatusBadge status={report.status} size="sm" />
      </View>

      
      <View style={styles.bodyRow}>
        <View style={styles.textCol}>
          <Text
            style={[styles.title, { fontSize: 14 * fontScale }]}
            numberOfLines={2}>
            {title}
          </Text>

          
          <View style={styles.metaRow}>
            <MapPin size={13} color={SamadhanColors.action} />
            <Text style={styles.metaText} numberOfLines={1}>
              {locationText}
            </Text>
          </View>

          
          <View style={styles.subMetaRow}>
            <View style={styles.metaItem}>
              <Calendar size={12} color={SamadhanColors.textMuted} />
              <Text style={styles.subMetaText}>{report.submittedAt}</Text>
            </View>

            <View style={styles.metaItem}>
              <ThumbsUp size={12} color={SamadhanColors.secondary} />
              <Text style={styles.subMetaText}>
                {report.supporters} supporters
              </Text>
            </View>
          </View>
        </View>

        {thumbnailUrl && (
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        )}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.reportIdText}>ID: #{report.id}</Text>

        <View style={styles.viewAction}>
          <Text style={styles.viewActionText}>
            Track Details
          </Text>
          <ArrowRight size={13} color={SamadhanColors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.md,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#FAFBFD',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    fontWeight: '500',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subMetaText: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: '#E2E8F0',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  reportIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    fontFamily: 'monospace',
  },
  viewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
});
