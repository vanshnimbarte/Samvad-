import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Search,
  SlidersHorizontal,
  List,
  Map as MapIcon,
  PlusCircle,
  Clock,
  RefreshCw,
  Trash2,
  AlertCircle,
  FileQuestion,
  Layers,
  Sparkles,
} from 'lucide-react-native';

import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { ReportCard } from '@/components/common/ReportCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { ReportMapView } from '@/components/common/ReportMapView';
import { useApp } from '@/context/AppContext';
import {
  CIVIC_CATEGORIES,
  REPORT_STATUS_CONFIG,
  STATUS_STEPS,
  ReportStatus,
  SamadhanColors,
  Spacing,
  Radius,
  Shadows,
} from '@/constants/samadhan-theme';

export default function MyReportsScreen() {
  const router = useRouter();
  const {
    user,
    session,
    reports,
    drafts,
    deleteDraft,
    syncDrafts,
    language,
    fontScale,
    networkStatus,
    t,
    refreshData,
  } = useApp();

  // Active view: 'submitted' or 'drafts'
  const [activeTab, setActiveTab] = useState<'submitted' | 'drafts'>('submitted');

  // View Mode: 'list' or 'map'
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const isOffline = networkStatus === 'offline';

  // Filter submitted reports (marked isUserReport or matching user id / name)
  const mySubmittedReports = reports.filter((r) => {
    if (r.isUserReport) return true;
    if (session?.user?.id && (r as any).userId === session.user.id) return true;
    if (user?.name && r.submittedBy?.name === user.name && !r.submittedBy?.isAnonymous) return true;
    return false;
  });

  const filteredReports = mySubmittedReports.filter((r) => {
    const titleMatch =
      r.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.villageOrWard.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      selectedStatus === 'All' || r.status === selectedStatus;

    const categoryMatch =
      selectedCategory === 'All' || r.categoryId === selectedCategory;

    return titleMatch && statusMatch && categoryMatch;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <OfflineBanner />

      <View style={styles.container}>
        {/* Top Control Bar: Search & List/Map Toggle */}
        <View style={styles.topControlSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Search size={18} color={SamadhanColors.textMuted} />
              <TextInput
                accessibilityLabel="Search my reports"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by ID, title, or village..."
                placeholderTextColor={SamadhanColors.textMuted}
                style={styles.searchInput}
              />
            </View>

            {/* Filter Toggle Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Filters"
              onPress={() => setShowFilterDrawer(!showFilterDrawer)}
              style={[
                styles.iconBtn,
                (selectedStatus !== 'All' || selectedCategory !== 'All') &&
                  styles.iconBtnActive,
              ]}>
              <SlidersHorizontal
                size={18}
                color={
                  selectedStatus !== 'All' || selectedCategory !== 'All'
                    ? SamadhanColors.action
                    : SamadhanColors.textSecondary
                }
              />
            </Pressable>

            {/* List / Map Toggle */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={viewMode === 'list' ? 'Switch to Map View' : 'Switch to List View'}
              onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              style={styles.iconBtn}>
              {viewMode === 'list' ? (
                <MapIcon size={18} color={SamadhanColors.primary} />
              ) : (
                <List size={18} color={SamadhanColors.primary} />
              )}
            </Pressable>
          </View>

          {/* Filter Chips Drawer */}
          {showFilterDrawer && (
            <View style={styles.filterDrawer}>
              {/* Status Filter Row */}
              <Text style={styles.filterGroupTitle}>
                Filter by Status:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="All Statuses"
                  onPress={() => setSelectedStatus('All')}
                  style={[
                    styles.filterChip,
                    selectedStatus === 'All' && styles.filterChipActive,
                  ]}>
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedStatus === 'All' && styles.filterChipTextActive,
                    ]}>
                    All Statuses
                  </Text>
                </Pressable>

                {STATUS_STEPS.map((step) => {
                  const cfg = REPORT_STATUS_CONFIG[step];
                  const isActive = selectedStatus === step;
                  return (
                    <Pressable
                      key={step}
                      accessibilityRole="button"
                      accessibilityLabel={`Filter by ${step}`}
                      onPress={() => setSelectedStatus(step)}
                      style={[
                        styles.filterChip,
                        isActive && [
                          styles.filterChipActive,
                          { borderColor: cfg.color, backgroundColor: cfg.bg },
                        ],
                      ]}>
                      <Text
                        style={[
                          styles.filterChipText,
                          isActive && { color: cfg.color, fontWeight: '800' },
                        ]}>
                        {cfg.labelEn}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Reset Filters */}
              {(selectedStatus !== 'All' || selectedCategory !== 'All') && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reset all filters"
                  onPress={() => {
                    setSelectedStatus('All');
                    setSelectedCategory('All');
                  }}
                  style={styles.resetFilterBtn}>
                  <Text style={styles.resetFilterText}>
                    Clear Filters
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Sub-Tabs: Submitted Reports vs Offline Drafts */}
          <View style={styles.tabSwitchBar}>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'submitted' }}
              onPress={() => setActiveTab('submitted')}
              style={[
                styles.subTabButton,
                activeTab === 'submitted' && styles.subTabButtonActive,
              ]}>
              <Text
                style={[
                  styles.subTabText,
                  activeTab === 'submitted' && styles.subTabTextActive,
                ]}>
                Submitted Reports ({mySubmittedReports.length})
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'drafts' }}
              onPress={() => setActiveTab('drafts')}
              style={[
                styles.subTabButton,
                activeTab === 'drafts' && styles.subTabButtonActive,
              ]}>
              <Text
                style={[
                  styles.subTabText,
                  activeTab === 'drafts' && styles.subTabTextActive,
                ]}>
                Offline Drafts ({drafts.length})
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content Scroll View */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[SamadhanColors.primary]}
              tintColor={SamadhanColors.primary}
            />
          }>
          {/* TAB 1: SUBMITTED REPORTS */}
          {activeTab === 'submitted' && (
            <>
              {/* Real Interactive Map View */}
              {viewMode === 'map' ? (
                <View style={{ marginBottom: Spacing.xl }}>
                  <View style={styles.mapHeaderNotice}>
                    <MapIcon size={16} color={SamadhanColors.primary} />
                    <Text style={styles.mapNoticeText}>
                      Interactive Jharkhand Map: Live pins for your reported issues.
                    </Text>
                  </View>

                  <ReportMapView
                    reports={filteredReports}
                    onSelect={(id) => router.push(`/report-detail?id=${id}`)}
                    height={360}
                  />
                </View>
              ) : (
                /* List View Mode */
                <>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))
                  ) : searchQuery ? (
                    /* No Search Results State */
                    <EmptyState
                      icon={FileQuestion}
                      title="No search results"
                      description={`No reports match '${searchQuery}'. Try adjusting your search query or filters.`}
                      actionTitle="Reset Search"
                      onActionPress={() => {
                        setSearchQuery('');
                        setSelectedStatus('All');
                      }}
                    />
                  ) : (
                    /* Empty State */
                    <EmptyState
                      title="You have not submitted any reports yet."
                      description="Notice a broken handpump, flooded road, or dark street? Report it in <3 minutes."
                      actionTitle={t('reportProblem')}
                      onActionPress={() => router.push('/report-problem')}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* TAB 2: OFFLINE DRAFTS */}
          {activeTab === 'drafts' && (
            <View style={styles.draftsContainer}>
              {drafts.length > 0 ? (
                <>
                  {/* Drafts Sync Header */}
                  <View style={styles.draftsSyncCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.draftsSyncTitle}>
                        {`${drafts.length} report(s) saved on this device`}
                      </Text>
                      <Text style={styles.draftsSyncDesc}>
                        {isOffline
                          ? 'Connect to internet to synchronize with the server.'
                          : 'Internet connection is available. Sync all pending drafts now.'}
                      </Text>
                    </View>

                    {!isOffline && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Sync all drafts to server"
                        onPress={syncDrafts}
                        style={styles.syncAllBtn}>
                        <RefreshCw size={14} color="#FFFFFF" />
                        <Text style={styles.syncAllBtnText}>
                          Sync All
                        </Text>
                      </Pressable>
                    )}
                  </View>

                  {/* Draft Cards List */}
                  {drafts.map((draft) => (
                    <View key={draft.id} style={[styles.draftCard, Shadows.sm]}>
                      <View style={styles.draftHeaderRow}>
                        <View style={styles.draftBadge}>
                          <Clock size={12} color={SamadhanColors.action} />
                          <Text style={styles.draftBadgeText}>
                            Saved on Device
                          </Text>
                        </View>

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Delete this draft"
                          onPress={() => deleteDraft(draft.id)}
                          style={styles.deleteDraftBtn}>
                          <Trash2 size={16} color="#DC2626" />
                        </Pressable>
                      </View>

                      <Text style={[styles.draftTitle, { fontSize: 14 * fontScale }]}>
                        {draft.title}
                      </Text>

                      <Text style={styles.draftDesc} numberOfLines={2}>
                        {draft.description}
                      </Text>

                      <View style={styles.draftFooterRow}>
                        <Text style={styles.draftLocation}>
                          📍 {draft.villageOrWard}, {draft.block}
                        </Text>
                        <Text style={styles.draftSavedAt}>{draft.savedAt}</Text>
                      </View>

                      <View style={styles.draftActionRow}>
                        <Button
                          title="Resume & Submit"
                          onPress={() => router.push('/report-problem')}
                          variant="outline"
                          size="sm"
                          style={{ flex: 1 }}
                        />
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <EmptyState
                  title="No offline drafts found"
                  description="Reports you start without an internet connection will be safely stored here."
                  actionTitle={t('reportProblem')}
                  onActionPress={() => router.push('/report-problem')}
                />
              )}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  container: {
    flex: 1,
  },
  topControlSection: {
    backgroundColor: SamadhanColors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SamadhanColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: SamadhanColors.textPrimary,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: SamadhanColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnActive: {
    borderColor: SamadhanColors.action,
    backgroundColor: '#FFF7ED',
  },
  filterDrawer: {
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  filterGroupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    marginBottom: 6,
  },
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: SamadhanColors.primarySurface,
    borderColor: SamadhanColors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  filterChipTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  resetFilterBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  resetFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.action,
  },
  tabSwitchBar: {
    flexDirection: 'row',
    marginTop: 4,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabButtonActive: {
    borderBottomColor: SamadhanColors.primary,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  subTabTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  mapSimContainer: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    padding: Spacing.md,
  },
  mapHeaderNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  mapNoticeText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.primary,
  },
  mapMockArea: {
    height: 320,
    backgroundColor: '#E2E8F0',
    borderRadius: Radius.md,
    position: 'relative',
    overflow: 'hidden',
  },
  mapPinBubble: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 160,
  },
  mapPinTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginTop: 2,
  },
  draftsContainer: {},
  draftsSyncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  draftsSyncTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.action,
  },
  draftsSyncDesc: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  syncAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: SamadhanColors.action,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginLeft: Spacing.sm,
  },
  syncAllBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  draftCard: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  draftHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  draftBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  deleteDraftBtn: {
    padding: 6,
  },
  draftTitle: {
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 4,
  },
  draftDesc: {
    fontSize: 12,
    color: SamadhanColors.textSecondary,
    lineHeight: 17,
    marginBottom: Spacing.sm,
  },
  draftFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: Spacing.sm,
  },
  draftLocation: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    fontWeight: '500',
  },
  draftSavedAt: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
  },
  draftActionRow: {
    flexDirection: 'row',
  },
});
