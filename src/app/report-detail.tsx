import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  ThumbsUp,
  MessageSquare,
  Send,
  Building,
  CheckCircle2,
  ExternalLink,
  Flag,
  FilePlus,
  RefreshCw,
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

export default function ReportDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const reportId = params.id || 'SC-JH-84920';

  const {
    getReportById,
    language,
    fontScale,
    requestReportUpdate,
    addReportComment,
    hasSupportedProblem,
    toggleSupportProblem,
    showToast,
  } = useApp();

  const report = getReportById(reportId) || {
    id: reportId,
    titleEn: 'Broken handpump near Ormanjhi Primary School',
    titleHi: 'ओरमांझी प्राथमिक विद्यालय के निकट खराब हैंडपंप',
    descriptionEn:
      'The solitary drinking water handpump on school grounds has been leaking sand and non-functional for 3 weeks.',
    descriptionHi:
      'स्कूल परिसर में एकमात्र पेयजल हैंडपंप 3 सप्ताह से रेत फेंक रहा है और बंद पड़ा है।',
    categoryId: 'water',
    status: 'In Progress' as const,
    urgency: 'high' as const,
    location: {
      district: 'Ranchi',
      block: 'Ormanjhi',
      villageOrWard: 'Chutupalu Panchayat',
      address: 'Near Govt. Middle School, NH-33 junction, Ormanjhi',
      latitude: 23.4789,
      longitude: 85.4789,
    },
    submittedAt: '10 Sep 2026, 09:30 AM',
    submittedBy: {
      name: 'Community Citizen',
      role: 'Mahila Kalyan SHG Secretary',
      isAnonymous: false,
      contactMethod: 'Phone' as const,
    },
    affectedCount: 240,
    affectedGroups: ['Children', 'Women', 'Entire community'],
    recurring: true,
    supporters: 48,
    media: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        captionEn: 'Damaged riser pipe',
        captionHi: 'क्षतिग्रस्त पाइप',
      },
    ],
    responsibleOrg: {
      name: 'Drinking Water & Sanitation Dept (DWSD)',
      department: 'Sub-Divisional Office, Ormanjhi',
      officer: 'Er. R. K. Soren (Junior Engineer)',
    },
    nextExpectedAction: {
      labelEn: 'Cylinder replacement and deep flushing by mobile borewell rig',
      labelHi: 'सिलेंडर प्रतिस्थापन और मोबाइल रिग द्वारा गहरी सफाई',
      estimatedDate: '18 Sep 2026',
    },
    timeline: [],
    moderatedComments: [],
  };

  const isSupported = hasSupportedProblem(report.id);
  const [commentText, setCommentText] = useState('');
  const [showAddInfoModal, setShowAddInfoModal] = useState(false);

  const category =
    CIVIC_CATEGORIES.find((c) => c.id === report.categoryId) ||
    CIVIC_CATEGORIES[0];

  const title = language === 'hi' ? report.titleHi : report.titleEn;
  const description = language === 'hi' ? report.descriptionHi : report.descriptionEn;

  const handleShare = () => {
    showToast(
      language === 'hi'
        ? 'रिपोर्ट लिंक कॉपी हो गया है।'
        : 'Report tracking link copied to clipboard.',
      'info'
    );
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    addReportComment(report.id, commentText);
    setCommentText('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.iconBtn}>
          <ArrowLeft size={22} color={SamadhanColors.textPrimary} />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.reportIdHeader}>#{report.id}</Text>
          <Text style={styles.reportCategorySubtitle}>
            {language === 'hi' ? category.nameHi : category.nameEn}
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share report"
            onPress={handleShare}
            style={styles.iconBtn}>
            <Share2 size={19} color={SamadhanColors.textPrimary} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Report concern or flag duplicate"
            onPress={() =>
              showToast(
                language === 'hi'
                  ? 'चिंता दर्ज करने का विकल्प खोला गया।'
                  : 'Concern reporting menu opened.',
                'info'
              )
            }
            style={styles.iconBtn}>
            <MoreVertical size={19} color={SamadhanColors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Title & Status Card */}
        <View style={[styles.mainCard, Shadows.sm]}>
          <View style={styles.statusBadgeRow}>
            <StatusBadge status={report.status} size="md" />
            <View
              style={[
                styles.urgencyBadge,
                {
                  backgroundColor:
                    report.urgency === 'emergency'
                      ? '#FEF2F2'
                      : report.urgency === 'high'
                      ? '#FFF7ED'
                      : '#F0F9FF',
                },
              ]}>
              <AlertTriangle
                size={12}
                color={
                  report.urgency === 'emergency'
                    ? '#DC2626'
                    : report.urgency === 'high'
                    ? '#EA580C'
                    : '#0284C7'
                }
              />
              <Text
                style={[
                  styles.urgencyBadgeText,
                  {
                    color:
                      report.urgency === 'emergency'
                        ? '#DC2626'
                        : report.urgency === 'high'
                        ? '#EA580C'
                        : '#0284C7',
                  },
                ]}>
                {report.urgency.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { fontSize: 18 * fontScale }]}>
            {title}
          </Text>

          <View style={styles.metaRow}>
            <MapPin size={14} color={SamadhanColors.action} />
            <Text style={styles.metaText}>
              {report.location.villageOrWard}, {report.location.block},{' '}
              {report.location.district}
            </Text>
          </View>

          <View style={styles.subMetaRow}>
            <View style={styles.metaItem}>
              <Calendar size={13} color={SamadhanColors.textMuted} />
              <Text style={styles.subMetaText}>{report.submittedAt}</Text>
            </View>

            <View style={styles.metaItem}>
              <Users size={13} color={SamadhanColors.textMuted} />
              <Text style={styles.subMetaText}>
                {report.affectedCount}+ {language === 'hi' ? 'प्रभावित' : 'affected'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.description, { fontSize: 13 * fontScale }]}>
            {description}
          </Text>

          {/* Location Detailed Landmark */}
          {report.location.address && (
            <View style={styles.landmarkBox}>
              <Text style={styles.landmarkLabel}>
                {language === 'hi' ? 'पहचान चिह्न (Landmark):' : 'Landmark / Specific Address:'}
              </Text>
              <Text style={styles.landmarkValue}>{report.location.address}</Text>
            </View>
          )}

          {/* Interactive Support Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSupported ? 'Remove support' : 'Support this issue'}
            onPress={() => toggleSupportProblem(report.id)}
            style={[
              styles.supportBar,
              isSupported && styles.supportBarActive,
            ]}>
            <ThumbsUp
              size={16}
              color={isSupported ? '#FFFFFF' : SamadhanColors.action}
              fill={isSupported ? '#FFFFFF' : 'none'}
            />
            <Text
              style={[
                styles.supportBarText,
                isSupported && styles.supportBarTextActive,
              ]}>
              {isSupported
                ? language === 'hi'
                  ? `आप और अन्य ${report.supporters} नागरिक समर्थन कर रहे हैं`
                  : `You and ${report.supporters} others are supporting this`
                : language === 'hi'
                ? `इस समस्या का समर्थन करें (${report.supporters} समर्थक)`
                : `Support this problem (${report.supporters} supporters)`}
            </Text>
          </Pressable>
        </View>

        {/* Evidence Media Gallery */}
        {report.media && report.media.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={[styles.sectionTitle, { fontSize: 15 * fontScale }]}>
              {language === 'hi' ? 'संलग्न साक्ष्य एवं तस्वीरें' : 'Evidence Photos & Videos'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
              {report.media.map((med, i) => (
                <View key={i} style={styles.mediaItem}>
                  <Image source={{ uri: med.url }} style={styles.mediaImg} />
                  <Text style={styles.mediaCaption}>
                    {language === 'hi' ? med.captionHi : med.captionEn}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Before & After Section (if available) */}
        {report.beforeAfter && (
          <View style={styles.beforeAfterSection}>
            <Text style={[styles.sectionTitle, { fontSize: 15 * fontScale }]}>
              {language === 'hi' ? 'समाधान तुलना (Before & After)' : 'Solution Progress (Before & After)'}
            </Text>

            <View style={styles.comparisonGrid}>
              <View style={styles.compHalf}>
                <Image
                  source={{ uri: report.beforeAfter.beforeUrl }}
                  style={styles.compImg}
                />
                <View style={styles.compLabelBefore}>
                  <Text style={styles.compLabelText}>BEFORE (पहले)</Text>
                </View>
              </View>

              <View style={styles.compHalf}>
                <Image
                  source={{ uri: report.beforeAfter.afterUrl }}
                  style={styles.compImg}
                />
                <View style={styles.compLabelAfter}>
                  <Text style={styles.compLabelText}>AFTER (बाद में)</Text>
                </View>
              </View>
            </View>

            <Text style={styles.beforeAfterNote}>
              {language === 'hi'
                ? report.beforeAfter.noteHi
                : report.beforeAfter.noteEn}
            </Text>
          </View>
        )}

        {/* 7-STAGE STATUS TIMELINE */}
        <StatusTimeline
          currentStatus={report.status}
          timelineEvents={report.timeline}
          responsibleOrg={report.responsibleOrg}
          nextExpectedAction={report.nextExpectedAction}
        />

        {/* Quick Citizen Actions Toolbar */}
        <View style={styles.citizenActionsCard}>
          <Text style={[styles.sectionTitle, { fontSize: 15 * fontScale }]}>
            {language === 'hi' ? 'नागरिक कार्रवाई' : 'Citizen Actions'}
          </Text>

          <View style={styles.actionButtonsCol}>
            {/* Request Update */}
            <Button
              title={language === 'hi' ? 'अधिकारियों से अपडेट का अनुरोध करें' : 'Request Status Update'}
              onPress={() => requestReportUpdate(report.id)}
              variant="outline"
              size="md"
              icon={<RefreshCw size={16} color={SamadhanColors.primary} />}
            />

            {/* Add Additional Info */}
            <Button
              title={language === 'hi' ? 'अतिरिक्त जानकारी जोड़ें' : 'Add Additional Information'}
              onPress={() =>
                showToast(
                  language === 'hi'
                    ? 'अतिरिक्त जानकारी प्रविष्टि बॉक्स सक्रिय।'
                    : 'Additional information field active.',
                  'info'
                )
              }
              variant="outline"
              size="md"
              icon={<FilePlus size={16} color={SamadhanColors.primary} />}
              style={{ marginTop: Spacing.sm }}
            />

            {/* Report a Concern */}
            <Button
              title={language === 'hi' ? 'गलत सूचना या चिंता दर्ज करें' : 'Report Concern or Duplicate'}
              onPress={() =>
                showToast(
                  language === 'hi'
                    ? 'आपकी चिंता मॉडरेटर को भेज दी गई है।'
                    : 'Concern flagged for community moderator review.',
                  'info'
                )
              }
              variant="ghost"
              size="sm"
              icon={<Flag size={14} color={SamadhanColors.textMuted} />}
              style={{ marginTop: Spacing.xs }}
            />
          </View>
        </View>

        {/* Moderated Community Comments */}
        <View style={styles.commentsSection}>
          <Text style={[styles.sectionTitle, { fontSize: 15 * fontScale }]}>
            {language === 'hi' ? 'आधिकारिक एवं नागरिक टिप्पणियां' : 'Official & Citizen Updates'} (
            {report.moderatedComments ? report.moderatedComments.length : 0})
          </Text>

          {report.moderatedComments && report.moderatedComments.length > 0 ? (
            report.moderatedComments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>{comment.role}</Text>
                  </View>
                </View>
                <Text style={styles.commentBody}>{comment.comment}</Text>
                <Text style={styles.commentDate}>{comment.date}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>
              {language === 'hi'
                ? 'अभी तक कोई टिप्पणी नहीं है। पहली टिप्पणी जोड़ें।'
                : 'No comments yet. Community and official notes appear here.'}
            </Text>
          )}

          {/* Add Comment Input Bar */}
          <View style={styles.commentInputRow}>
            <TextInput
              accessibilityLabel="Add comment to report"
              value={commentText}
              onChangeText={setCommentText}
              placeholder={
                language === 'hi'
                  ? 'टिप्पणी या स्थिति प्रश्न लिखें...'
                  : 'Add a community update or inquiry...'
              }
              placeholderTextColor={SamadhanColors.textMuted}
              style={styles.commentInput}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send comment"
              onPress={handleSendComment}
              style={styles.sendCommentBtn}>
              <Send size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={{ height: 100 }} />
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
  headerTitleWrap: {
    alignItems: 'center',
  },
  reportIdHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  reportCategorySubtitle: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  mainCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.lg,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  urgencyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    lineHeight: 24,
    marginBottom: 6,
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
    gap: Spacing.lg,
    marginTop: 2,
    marginBottom: Spacing.md,
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
  description: {
    color: SamadhanColors.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  landmarkBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.md,
  },
  landmarkLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    textTransform: 'uppercase',
  },
  landmarkValue: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    marginTop: 2,
  },
  supportBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: 10,
    borderRadius: Radius.md,
    minHeight: 44,
  },
  supportBarActive: {
    backgroundColor: SamadhanColors.action,
    borderColor: SamadhanColors.action,
  },
  supportBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.action,
  },
  supportBarTextActive: {
    color: '#FFFFFF',
  },
  mediaSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  mediaRow: {
    flexDirection: 'row',
  },
  mediaItem: {
    marginRight: Spacing.md,
    width: 200,
  },
  mediaImg: {
    width: 200,
    height: 120,
    borderRadius: Radius.md,
    backgroundColor: '#E2E8F0',
  },
  mediaCaption: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 4,
    lineHeight: 14,
  },
  beforeAfterSection: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.lg,
  },
  comparisonGrid: {
    flexDirection: 'row',
    height: 120,
    gap: 8,
    marginVertical: Spacing.sm,
  },
  compHalf: {
    flex: 1,
    position: 'relative',
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  compImg: {
    width: '100%',
    height: '100%',
  },
  compLabelBefore: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  compLabelAfter: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  compLabelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  beforeAfterNote: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    lineHeight: 16,
    marginTop: 4,
  },
  citizenActionsCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.lg,
  },
  actionButtonsCol: {
    gap: 4,
  },
  commentsSection: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginBottom: Spacing.lg,
  },
  commentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  roleBadge: {
    backgroundColor: SamadhanColors.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  commentBody: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    lineHeight: 16,
  },
  commentDate: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
    marginTop: 4,
  },
  noCommentsText: {
    fontSize: 12,
    color: SamadhanColors.textMuted,
    marginBottom: Spacing.md,
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: 13,
    color: SamadhanColors.textPrimary,
    minHeight: 44,
  },
  sendCommentBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: SamadhanColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
