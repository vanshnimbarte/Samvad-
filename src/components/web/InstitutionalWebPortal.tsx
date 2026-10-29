import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  LayoutDashboard,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  MapPinned,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Users,
  ChevronRight,
  FileSpreadsheet,
  Download,
  Award,
  Clock,
  ArrowUpRight,
  UserCheck,
  HelpCircle,
} from 'lucide-react-native';

import { useApp, UserRole } from '@/context/AppContext';
import {
  HEADLINE_KPIS,
  MONTHLY_TREND,
  DOMAIN_STATS,
  DISTRICT_STATS,
  HEI_PERFORMANCE,
} from '@/data/dashboard-stats';
import { UNIVERSITIES_DATA } from '@/data/universities';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';
import { matchUniversities } from '@/lib/ai-engine';
import { SamadhanColors, Spacing, Radius, Shadows } from '@/constants/samadhan-theme';
import { toHref } from '@/lib/routes';

type WebPortalTab = 'government' | 'university' | 'industry' | 'analytics';

export function InstitutionalWebPortal() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const {
    userRole,
    setUserRole,
    challenges,
    validateChallenge,
    assignUniversity,
    mergeAsDuplicate,
    showToast,
    user,
  } = useApp();

  // Active Desk Tab on the web portal
  const [activeTab, setActiveTab] = useState<WebPortalTab>(
    userRole === 'university'
      ? 'university'
      : userRole === 'industry'
      ? 'industry'
      : 'government'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');

  // Filtered challenges for the validation workbench
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      const matchSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
      const matchUrgency =
        selectedUrgency === 'All' ||
        (selectedUrgency === 'High' && (c.urgency === 'High' || c.urgency === 'Critical')) ||
        (selectedUrgency === 'Medium' && c.urgency === 'Medium') ||
        (selectedUrgency === 'Low' && c.urgency === 'Low');
      return matchSearch && matchDistrict && matchUrgency;
    });
  }, [challenges, searchQuery, selectedDistrict, selectedUrgency]);

  const pendingChallenges = filteredChallenges.filter(
    (c) => c.stage === 'Submitted' || c.stage === 'Under Review'
  );
  const assignedChallenges = filteredChallenges.filter((c) => c.assignedUniversity);
  const validatedOpenChallenges = filteredChallenges.filter(
    (c) => c.stage === 'Validated' && !c.assignedUniversity
  );
  const openIndustryChallenges = filteredChallenges.filter(
    (c) => !c.industryPartner && ['Assigned', 'In Progress', 'Pilot Testing', 'Validated'].includes(c.stage)
  );

  const isWide = width >= 1024;
  const maxTrend = Math.max(...MONTHLY_TREND.map((m) => m.submitted));

  return (
    <View style={styles.webContainer}>
      {/* Top Government Navigation Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandGroup}>
          <View style={styles.govtSeal}>
            <Text style={styles.govtSealText}>झार</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>SAMVAD JHARKHAND</Text>
              <View style={styles.portalBadge}>
                <Text style={styles.portalBadgeText}>INSTITUTIONAL WEB DESK</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>
              Government of Jharkhand · Dept. of Higher, Technical Education & Skill Development
            </Text>
          </View>
        </View>

        {/* Global Node Info & User Profile */}
        <View style={styles.topBarRight}>
          <View style={styles.nodeStatusPill}>
            <View style={styles.greenDot} />
            <Text style={styles.nodeStatusText}>Gov Cloud Node #4 · Ranchi</Text>
          </View>
          <View style={styles.userBadge}>
            <UserCheck size={14} color={SamadhanColors.primary} />
            <Text style={styles.userName}>{user.name || 'Officer / Dean'}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Switch to Citizen Mobile App"
            onPress={() => {
              setUserRole('citizen');
              showToast('Switched to Citizen App view.', 'info');
              router.replace('/');
            }}
            style={styles.switchMobileBtn}>
            <Text style={styles.switchMobileText}>📱 Citizen App View</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Layout Area */}
      <View style={styles.bodyLayout}>
        {/* Left Navigation Rail (Desktop) */}
        <View style={[styles.sidebar, !isWide && { width: 220 }]}>
          <Text style={styles.sidebarSectionTitle}>COMMAND DESKS</Text>

          <Pressable
            onPress={() => {
              setActiveTab('government');
              setUserRole('government');
            }}
            style={[styles.sidebarItem, activeTab === 'government' && styles.sidebarItemActive]}>
            <ShieldCheck
              size={18}
              color={activeTab === 'government' ? SamadhanColors.primary : SamadhanColors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sidebarItemLabel,
                  activeTab === 'government' && styles.sidebarItemLabelActive,
                ]}>
                Govt Admin & Queue
              </Text>
              <Text style={styles.sidebarItemSub}>{pendingChallenges.length} pending validation</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab('university');
              setUserRole('university');
            }}
            style={[styles.sidebarItem, activeTab === 'university' && styles.sidebarItemActive]}>
            <GraduationCap
              size={18}
              color={activeTab === 'university' ? '#7C3AED' : SamadhanColors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sidebarItemLabel,
                  activeTab === 'university' && styles.sidebarItemLabelActive,
                ]}>
                University HEI Desk
              </Text>
              <Text style={styles.sidebarItemSub}>{assignedChallenges.length} assigned projects</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab('industry');
              setUserRole('industry');
            }}
            style={[styles.sidebarItem, activeTab === 'industry' && styles.sidebarItemActive]}>
            <Building2
              size={18}
              color={activeTab === 'industry' ? '#D97706' : SamadhanColors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sidebarItemLabel,
                  activeTab === 'industry' && styles.sidebarItemLabelActive,
                ]}>
                Industry & CSR Desk
              </Text>
              <Text style={styles.sidebarItemSub}>{openIndustryChallenges.length} seeking partners</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('analytics')}
            style={[styles.sidebarItem, activeTab === 'analytics' && styles.sidebarItemActive]}>
            <BarChart3
              size={18}
              color={activeTab === 'analytics' ? '#16A34A' : SamadhanColors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sidebarItemLabel,
                  activeTab === 'analytics' && styles.sidebarItemLabelActive,
                ]}>
                Statewide Analytics
              </Text>
              <Text style={styles.sidebarItemSub}>24 districts · KPIs</Text>
            </View>
          </Pressable>

          <View style={styles.sidebarDivider} />

          <Text style={styles.sidebarSectionTitle}>QUICK TOOLS</Text>
          <Pressable onPress={() => router.push(toHref('/map'))} style={styles.sidebarSubItem}>
            <MapPinned size={15} color={SamadhanColors.textSecondary} />
            <Text style={styles.sidebarSubLabel}>GIS Problem Map</Text>
          </Pressable>
          <Pressable onPress={() => router.push(toHref('/ecosystem'))} style={styles.sidebarSubItem}>
            <Layers size={15} color={SamadhanColors.textSecondary} />
            <Text style={styles.sidebarSubLabel}>Ecosystem Directory</Text>
          </Pressable>
          <Pressable
            onPress={() => showToast('Exported complete data set as CSV.', 'success')}
            style={styles.sidebarSubItem}>
            <FileSpreadsheet size={15} color={SamadhanColors.textSecondary} />
            <Text style={styles.sidebarSubLabel}>Export Data (CSV)</Text>
          </Pressable>

          <View style={styles.sidebarHelpCard}>
            <HelpCircle size={15} color={SamadhanColors.primary} />
            <Text style={styles.sidebarHelpText}>
              Need official nodal assistance? Contact Samvad Secretariat Ranchi.
            </Text>
          </View>
        </View>

        {/* Content Area */}
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.mainContentInner}>
          {/* Top KPI Banner */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiTile}>
              <Text style={[styles.kpiVal, { color: SamadhanColors.primary }]}>
                {HEADLINE_KPIS.totalChallenges.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.kpiLbl}>Total Challenges</Text>
              <Text style={styles.kpiHint}>Across all 24 districts</Text>
            </View>
            <View style={styles.kpiTile}>
              <Text style={[styles.kpiVal, { color: '#16A34A' }]}>{HEADLINE_KPIS.deployed}</Text>
              <Text style={styles.kpiLbl}>Deployed Solutions</Text>
              <Text style={styles.kpiHint}>Active ground pilots</Text>
            </View>
            <View style={styles.kpiTile}>
              <Text style={[styles.kpiVal, { color: '#7C3AED' }]}>{HEADLINE_KPIS.heiPartners}</Text>
              <Text style={styles.kpiLbl}>HEI Universities</Text>
              <Text style={styles.kpiHint}>IIT, NIT, BIT & Universities</Text>
            </View>
            <View style={styles.kpiTile}>
              <Text style={[styles.kpiVal, { color: '#D97706' }]}>{HEADLINE_KPIS.industryPartners}</Text>
              <Text style={styles.kpiLbl}>Industry Partners</Text>
              <Text style={styles.kpiHint}>CSR & MSME collaborators</Text>
            </View>
            <View style={styles.kpiTile}>
              <Text style={[styles.kpiVal, { color: '#0284C7' }]}>{HEADLINE_KPIS.patentsApplied}</Text>
              <Text style={styles.kpiLbl}>Patents Filed</Text>
              <Text style={styles.kpiHint}>Campus innovations</Text>
            </View>
          </View>

          {/* TAB 1: GOVERNMENT ADMIN WORKBENCH */}
          {activeTab === 'government' && (
            <View>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.cardTitle}>🏛️ Government Validation & Routing Workbench</Text>
                  <Text style={styles.cardSub}>
                    Review incoming civic complaints, group duplicates, and assign to premier engineering and science universities.
                  </Text>
                </View>

                {/* Filter Controls */}
                <View style={styles.filterControls}>
                  <View style={styles.searchBox}>
                    <Search size={15} color={SamadhanColors.textMuted} />
                    <TextInput
                      style={styles.searchInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search title, district, domain..."
                      placeholderTextColor={SamadhanColors.textMuted}
                    />
                  </View>

                  <View style={styles.filterPills}>
                    {(['All', 'Ranchi', 'Dhanbad', 'East Singhbhum', 'Bokaro'] as const).map((dist) => (
                      <Pressable
                        key={dist}
                        onPress={() => setSelectedDistrict(dist)}
                        style={[
                          styles.filterPill,
                          selectedDistrict === dist && styles.filterPillActive,
                        ]}>
                        <Text
                          style={[
                            styles.filterPillText,
                            selectedDistrict === dist && styles.filterPillTextActive,
                          ]}>
                          {dist}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              {/* Validation Queue Table */}
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, { flex: 2 }]}>CHALLENGE & EVIDENCE</Text>
                  <Text style={[styles.th, { flex: 1 }]}>DISTRICT / BLOCK</Text>
                  <Text style={[styles.th, { flex: 1 }]}>AI DOMAIN CLASSIFIER</Text>
                  <Text style={[styles.th, { flex: 0.8 }]}>URGENCY</Text>
                  <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>NODAL ACTIONS</Text>
                </View>

                {pendingChallenges.length === 0 ? (
                  <View style={styles.emptyTable}>
                    <CheckCircle2 size={32} color="#16A34A" />
                    <Text style={styles.emptyTableTitle}>All incoming challenges validated!</Text>
                    <Text style={styles.emptyTableSub}>No pending items match your current filter.</Text>
                  </View>
                ) : (
                  pendingChallenges.map((c) => {
                    const matchedUnis = matchUniversities(c.domain);
                    const topUni = matchedUnis[0];

                    return (
                      <View key={c.id} style={styles.tableRow}>
                        <View style={{ flex: 2, paddingRight: 12 }}>
                          <Text style={styles.rowTitle}>{c.title}</Text>
                          <Text style={styles.rowMeta}>
                            Submitted by {c.submittedBy} ({c.submitterType}) · {c.photoCount} photos attached
                          </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.cellTextBold}>{c.district}</Text>
                          <Text style={styles.cellTextMuted}>{c.location || 'Jharkhand'}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                          <View style={styles.domainTag}>
                            <Text style={styles.domainTagText}>{c.domain}</Text>
                          </View>
                          <Text style={styles.cellTextMuted}>{c.aiConfidence || 92}% match</Text>
                        </View>

                        <View style={{ flex: 0.8 }}>
                          <View
                            style={[
                              styles.urgencyBadge,
                              c.urgency === 'High' || c.urgency === 'Critical'
                                ? styles.urgencyHigh
                                : styles.urgencyMed,
                            ]}>
                            <Text style={styles.urgencyText}>
                              {c.urgency.toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        <View style={{ flex: 1.5, flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
                          <Pressable
                            onPress={() => {
                              validateChallenge(c.id);
                              showToast(`Validated challenge: "${c.title}"`, 'success');
                            }}
                            style={styles.actionBtnValidate}>
                            <CheckCircle2 size={13} color="#FFFFFF" />
                            <Text style={styles.actionBtnValidateText}>Validate</Text>
                          </Pressable>

                          {topUni ? (
                            <Pressable
                              onPress={() => {
                                assignUniversity(c.id, topUni.id);
                                showToast(`Routed to ${topUni.shortName}`, 'info');
                              }}
                              style={styles.actionBtnRoute}>
                              <GraduationCap size={13} color={SamadhanColors.primary} />
                              <Text style={styles.actionBtnRouteText}>Route to {topUni.shortName}</Text>
                            </Pressable>
                          ) : null}

                          <Pressable
                            onPress={() => router.push(toHref(`/challenge-detail?id=${c.id}`))}
                            style={styles.actionBtnDetails}>
                            <ExternalLink size={13} color={SamadhanColors.textSecondary} />
                          </Pressable>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              {/* Duplicate & Pattern Clustering Section */}
              <View style={styles.clusteringCard}>
                <View style={styles.clusterHeader}>
                  <Sparkles size={18} color="#D97706" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clusterTitle}>AI Duplicate & Community Pattern Clustering</Text>
                    <Text style={styles.clusterSub}>
                      Group repetitive individual complaints from the same watershed or ward into a single campus project.
                    </Text>
                  </View>
                </View>

                {challenges
                  .filter((c) => (c.similarChallengeIds || []).length > 0)
                  .slice(0, 2)
                  .map((c) => (
                    <View key={`cluster-${c.id}`} style={styles.clusterRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.clusterLeadTitle}>Primary Project: {c.title}</Text>
                        <Text style={styles.clusterLeadMeta}>
                          {c.similarChallengeIds?.length || 0} similar complaints detected in {c.district}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          if (c.similarChallengeIds?.[0]) {
                            mergeAsDuplicate(c.similarChallengeIds[0], c.id);
                            showToast('Grouped related reports into primary challenge.', 'success');
                          }
                        }}
                        style={styles.clusterActionBtn}>
                        <Layers size={13} color="#FFFFFF" />
                        <Text style={styles.clusterActionBtnText}>Group Into Unified Project</Text>
                      </Pressable>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {/* TAB 2: UNIVERSITY & HEI INNOVATION DESK */}
          {activeTab === 'university' && (
            <View>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.cardTitle}>🎓 Higher Education Institution (HEI) Innovation Desk</Text>
                  <Text style={styles.cardSub}>
                    Faculty mentors & student innovators: review routed community challenges, assemble project teams, and submit solutions.
                  </Text>
                </View>

                <Pressable
                  onPress={() => router.push(toHref('/submit-challenge'))}
                  style={styles.primaryActionButton}>
                  <Sparkles size={14} color="#FFFFFF" />
                  <Text style={styles.primaryActionButtonText}>Submit Campus Proposal</Text>
                </Pressable>
              </View>

              {/* Assigned Challenges to Universities */}
              <Text style={styles.sectionSubHeading}>
                Challenges Assigned to Universities ({assignedChallenges.length})
              </Text>
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, { flex: 2 }]}>CHALLENGE TITLE</Text>
                  <Text style={[styles.th, { flex: 1.2 }]}>ASSIGNED HEI</Text>
                  <Text style={[styles.th, { flex: 1 }]}>STAGE</Text>
                  <Text style={[styles.th, { flex: 1 }]}>DOMAIN</Text>
                  <Text style={[styles.th, { flex: 1.2, textAlign: 'right' }]}>TEAM MANAGEMENT</Text>
                </View>

                {assignedChallenges.map((c) => (
                  <View key={c.id} style={styles.tableRow}>
                    <View style={{ flex: 2, paddingRight: 12 }}>
                      <Text style={styles.rowTitle}>{c.title}</Text>
                      <Text style={styles.rowMeta}>District: {c.district} · Submitter: {c.submittedBy}</Text>
                    </View>

                    <View style={{ flex: 1.2 }}>
                      <Text style={styles.cellTextBold}>
                        {c.assignedUniversity?.heiShortName || c.assignedUniversity?.heiName || 'Assigned HEI'}
                      </Text>
                      <Text style={styles.cellTextMuted}>Student team in formation</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.stageTag}>
                        <Text style={styles.stageTagText}>{c.stage}</Text>
                      </View>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.cellTextBold}>{c.domain}</Text>
                    </View>

                    <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
                      <Pressable
                        onPress={() => router.push(toHref(`/challenge-detail?id=${c.id}`))}
                        style={styles.actionBtnValidate}>
                        <Users size={13} color="#FFFFFF" />
                        <Text style={styles.actionBtnValidateText}>Manage Team</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>

              {/* Open Validated Challenges for Adoption */}
              <Text style={[styles.sectionSubHeading, { marginTop: Spacing.xl }]}>
                Open Validated Challenges Seeking Campus Adoption ({validatedOpenChallenges.length})
              </Text>
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, { flex: 2.2 }]}>COMMUNITY PROBLEM</Text>
                  <Text style={[styles.th, { flex: 1 }]}>DISTRICT</Text>
                  <Text style={[styles.th, { flex: 1.2 }]}>RECOMMENDED HEI</Text>
                  <Text style={[styles.th, { flex: 1.2, textAlign: 'right' }]}>ADOPT</Text>
                </View>

                {validatedOpenChallenges.slice(0, 5).map((c) => {
                  const matchUni = matchUniversities(c.domain)[0];
                  return (
                    <View key={`adopt-${c.id}`} style={styles.tableRow}>
                      <View style={{ flex: 2.2, paddingRight: 12 }}>
                        <Text style={styles.rowTitle}>{c.title}</Text>
                        <Text style={styles.rowMeta}>{c.domain} · Urgency: {c.urgency}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cellTextBold}>{c.district}</Text>
                      </View>
                      <View style={{ flex: 1.2 }}>
                        <Text style={styles.cellTextMuted}>{matchUni ? matchUni.shortName : 'Any HEI'}</Text>
                      </View>
                      <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Pressable
                          onPress={() => {
                            if (matchUni) assignUniversity(c.id, matchUni.id);
                            showToast(`Adopted challenge: "${c.title}" for your university!`, 'success');
                          }}
                          style={styles.actionBtnRoute}>
                          <Award size={13} color={SamadhanColors.primary} />
                          <Text style={styles.actionBtnRouteText}>Adopt for Campus</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* TAB 3: INDUSTRY & CSR COLLABORATION DESK */}
          {activeTab === 'industry' && (
            <View>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.cardTitle}>🏢 Corporate CSR & Technology Transfer Hub</Text>
                  <Text style={styles.cardSub}>
                    Partner with Jharkhand universities. Co-fund civic prototypes, mentor student researchers, and deploy MSME solutions.
                  </Text>
                </View>
              </View>

              {/* Projects seeking Industry CSR Co-Funding */}
              <Text style={styles.sectionSubHeading}>
                Projects Seeking Industry & CSR Partnerships ({openIndustryChallenges.length})
              </Text>
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, { flex: 2 }]}>INNOVATION PROJECT</Text>
                  <Text style={[styles.th, { flex: 1 }]}>DOMAIN & DISTRICT</Text>
                  <Text style={[styles.th, { flex: 1.2 }]}>ESTIMATED CSR GRANT</Text>
                  <Text style={[styles.th, { flex: 1.2, textAlign: 'right' }]}>PARTNER ACTION</Text>
                </View>

                {openIndustryChallenges.slice(0, 6).map((c) => (
                  <View key={`ind-${c.id}`} style={styles.tableRow}>
                    <View style={{ flex: 2, paddingRight: 12 }}>
                      <Text style={styles.rowTitle}>{c.title}</Text>
                      <Text style={styles.rowMeta}>
                        Stage: {c.stage} · HEI:{' '}
                        {c.assignedUniversity?.heiShortName ||
                          c.assignedUniversity?.heiName ||
                          'Assigned to Lab'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cellTextBold}>{c.domain}</Text>
                      <Text style={styles.cellTextMuted}>{c.district}</Text>
                    </View>
                    <View style={{ flex: 1.2 }}>
                      <Text style={[styles.cellTextBold, { color: '#16A34A' }]}>₹ 4,50,000</Text>
                      <Text style={styles.cellTextMuted}>Sec. 135 CSR Eligible</Text>
                    </View>
                    <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
                      <Pressable
                        onPress={() => {
                          showToast(`Expressed CSR partnership interest for: "${c.title}"`, 'success');
                        }}
                        style={styles.actionBtnValidate}>
                        <ArrowUpRight size={13} color="#FFFFFF" />
                        <Text style={styles.actionBtnValidateText}>Pledge CSR Grant</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => router.push(toHref(`/challenge-detail?id=${c.id}`))}
                        style={styles.actionBtnDetails}>
                        <ExternalLink size={13} color={SamadhanColors.textSecondary} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>

              {/* Active Corporate Partners Directory */}
              <Text style={[styles.sectionSubHeading, { marginTop: Spacing.xl }]}>
                Corporate & CSR Partners Active in Jharkhand
              </Text>
              <View style={styles.partnerCardsGrid}>
                {INDUSTRY_PARTNERS_DATA.map((p) => (
                  <View key={p.id} style={styles.partnerWebCard}>
                    <Text style={styles.partnerWebEmoji}>{p.logoEmoji}</Text>
                    <Text style={styles.partnerWebName}>{p.companyName}</Text>
                    <Text style={styles.partnerWebType}>{p.type} · {p.city}</Text>
                    <View style={styles.fundingBadge}>
                      <Text style={styles.fundingBadgeText}>Committed: {p.totalFundingCommitted}</Text>
                    </View>
                    <Text style={styles.partnerWebFocus}>Focus: {p.domains.join(', ')}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 4: STATEWIDE ANALYTICS & KPIS */}
          {activeTab === 'analytics' && (
            <View>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.cardTitle}>📊 Statewide Societal Innovation Intelligence</Text>
                  <Text style={styles.cardSub}>
                    Live metrics tracking challenges, university engagement, district intensity, and real ground solutions.
                  </Text>
                </View>
              </View>

              {/* Charts & Graphs Row */}
              <View style={styles.analyticsRow}>
                {/* Monthly Submission Trend */}
                <View style={[styles.analyticsCard, { flex: 1.3 }]}>
                  <Text style={styles.analyticsCardTitle}>Monthly Submission & Resolution Trend</Text>
                  <View style={styles.chartContainer}>
                    {MONTHLY_TREND.map((m) => (
                      <View key={m.month} style={styles.chartBarCol}>
                        <View style={styles.chartBarTrack}>
                          <View
                            style={[
                              styles.chartBarFill,
                              { height: Math.max(14, Math.round((m.submitted / maxTrend) * 120)) },
                            ]}
                          />
                        </View>
                        <Text style={styles.chartBarLabel}>{m.month}</Text>
                        <Text style={styles.chartBarValue}>{m.submitted}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Domain Mix */}
                <View style={[styles.analyticsCard, { flex: 1 }]}>
                  <Text style={styles.analyticsCardTitle}>Domain Mix Distribution</Text>
                  {DOMAIN_STATS.map((d) => (
                    <View key={d.domain} style={styles.domainMixRow}>
                      <Text style={styles.domainMixName}>
                        {d.icon} {d.domain}
                      </Text>
                      <View style={styles.domainMixBarTrack}>
                        <View
                          style={[
                            styles.domainMixBarFill,
                            { width: `${Math.min(100, (d.submitted / 80) * 100)}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.domainMixCount}>{d.submitted}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* District Intensity Leaderboard */}
              <Text style={[styles.sectionSubHeading, { marginTop: Spacing.xl }]}>
                District Challenge Density & Resolution Status
              </Text>
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, { flex: 1.5 }]}>DISTRICT</Text>
                  <Text style={[styles.th, { flex: 1 }]}>SUBMITTED</Text>
                  <Text style={[styles.th, { flex: 1 }]}>RESOLVED</Text>
                  <Text style={[styles.th, { flex: 1 }]}>SEVERITY LEVEL</Text>
                  <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>RATE</Text>
                </View>
                {DISTRICT_STATS.map((d) => (
                  <View key={d.district} style={styles.tableRow}>
                    <Text style={[styles.cellTextBold, { flex: 1.5 }]}>{d.district}</Text>
                    <Text style={[styles.cellTextMuted, { flex: 1 }]}>{d.challenges}</Text>
                    <Text style={[styles.cellTextMuted, { flex: 1 }]}>{d.resolved}</Text>
                    <View style={{ flex: 1 }}>
                      <View
                        style={[
                          styles.urgencyBadge,
                          d.severity === 'high' ? styles.urgencyHigh : styles.urgencyMed,
                        ]}>
                        <Text style={styles.urgencyText}>{d.severity.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.cellTextBold,
                        { flex: 1, textAlign: 'right', color: '#16A34A' },
                      ]}>
                      {Math.round((d.resolved / d.challenges) * 100)}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },

  // Top Bar
  topBar: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    ...Shadows.sm,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  govtSeal: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  govtSealText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: SamadhanColors.textPrimary,
    letterSpacing: 0.5,
  },
  portalBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  portalBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: SamadhanColors.primary,
  },
  brandSubtitle: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    fontWeight: '500',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nodeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  nodeStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userName: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  switchMobileBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  switchMobileText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.action,
  },

  // Body Layout
  bodyLayout: {
    flex: 1,
    flexDirection: 'row',
  },

  // Sidebar
  sidebar: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    padding: Spacing.lg,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: SamadhanColors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: 4,
  },
  sidebarItemActive: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: SamadhanColors.primary,
  },
  sidebarItemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  sidebarItemLabelActive: {
    color: SamadhanColors.primary,
    fontWeight: '800',
  },
  sidebarItemSub: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
    marginTop: 2,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: Spacing.md,
  },
  sidebarSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  sidebarSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  sidebarHelpCard: {
    marginTop: 'auto',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sidebarHelpText: {
    fontSize: 10,
    color: SamadhanColors.textSecondary,
    lineHeight: 14,
    flex: 1,
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  mainContentInner: {
    padding: Spacing.xl,
  },

  // KPI Row
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.xl,
  },
  kpiTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  kpiVal: {
    fontSize: 24,
    fontWeight: '900',
  },
  kpiLbl: {
    fontSize: 12,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginTop: 2,
  },
  kpiHint: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
    marginTop: 2,
  },

  // Card Headers
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: SamadhanColors.textPrimary,
  },
  cardSub: {
    fontSize: 13,
    color: SamadhanColors.textSecondary,
    marginTop: 4,
    maxWidth: 700,
  },
  sectionSubHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.sm,
  },

  // Filter Controls
  filterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 240,
    gap: 6,
  },
  searchInput: {
    fontSize: 12,
    color: SamadhanColors.textPrimary,
    flex: 1,
    outlineStyle: 'none' as any,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 4,
  },
  filterPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterPillActive: {
    backgroundColor: SamadhanColors.primary,
    borderColor: SamadhanColors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Table Styles
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
    marginBottom: Spacing.xl,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  th: {
    fontSize: 11,
    fontWeight: '800',
    color: SamadhanColors.textMuted,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  rowMeta: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    marginTop: 3,
  },
  cellTextBold: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  cellTextMuted: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    marginTop: 2,
  },
  domainTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  domainTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  stageTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  stageTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  urgencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  urgencyHigh: {
    backgroundColor: '#FEE2E2',
  },
  urgencyMed: {
    backgroundColor: '#FEF3C7',
  },
  urgencyText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#991B1B',
  },

  // Row Action Buttons
  actionBtnValidate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SamadhanColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  actionBtnValidateText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtnRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  actionBtnRouteText: {
    fontSize: 11,
    fontWeight: '800',
    color: SamadhanColors.primary,
  },
  actionBtnDetails: {
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty state
  emptyTable: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTableTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  emptyTableSub: {
    fontSize: 12,
    color: SamadhanColors.textMuted,
  },

  // AI Clustering Card
  clusteringCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  clusterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  clusterTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  clusterSub: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },
  clusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  clusterLeadTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  clusterLeadMeta: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    marginTop: 2,
  },
  clusterActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.md,
  },
  clusterActionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Primary Action Button
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: SamadhanColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  primaryActionButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Partner Grid
  partnerCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  partnerWebCard: {
    width: '32%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  partnerWebEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  partnerWebName: {
    fontSize: 14,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
  },
  partnerWebType: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    marginTop: 2,
  },
  fundingBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  fundingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  partnerWebFocus: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 8,
  },

  // Analytics View
  analyticsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  analyticsCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 10,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarTrack: {
    height: 120,
    width: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: SamadhanColors.primary,
    borderRadius: 4,
  },
  chartBarLabel: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    fontWeight: '700',
    marginTop: 6,
  },
  chartBarValue: {
    fontSize: 10,
    color: SamadhanColors.textMuted,
    marginTop: 2,
  },
  domainMixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  domainMixName: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    width: 140,
  },
  domainMixBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  domainMixBarFill: {
    height: '100%',
    backgroundColor: SamadhanColors.primary,
    borderRadius: 6,
  },
  domainMixCount: {
    fontSize: 11,
    fontWeight: '800',
    color: SamadhanColors.textSecondary,
    width: 30,
    textAlign: 'right',
  },
});
