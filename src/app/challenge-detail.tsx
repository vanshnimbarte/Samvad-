import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, GraduationCap, Building2, ThumbsUp } from 'lucide-react-native';
import { getChallengeImage } from '@/data/challenges';
import { CHALLENGE_STAGE_CONFIG, SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { Button } from '@/components/common/Button';
import { EcosystemFlow } from '@/components/common/EcosystemFlow';
import { useApp } from '@/context/AppContext';
import { toHref } from '@/lib/routes';
import { matchUniversities } from '@/lib/ai-engine';
import { INDUSTRY_PARTNERS_DATA } from '@/data/partners';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    language,
    fontScale,
    userRole,
    user,
    getChallengeById,
    challenges,
    supportChallenge,
    addChallengeComment,
    validateChallenge,
    assignUniversity,
    acceptChallenge,
    formProjectTeam,
    submitProposal,
    offerIndustrySupport,
    toggleMilestone,
  } = useApp();
  const [comment, setComment] = useState('');
  const challenge = getChallengeById(id || '') || challenges[0];
  const stage = CHALLENGE_STAGE_CONFIG[challenge.stage];
  const similar = challenges.filter((c) => (challenge.similarChallengeIds || []).includes(c.id));
  const suggestedHeis = matchUniversities(challenge.domain);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.topNavRow}>
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
        <View style={styles.viewerBadge}>
          <Text style={styles.viewerBadgeText} numberOfLines={1}>
            {userRole === 'citizen' ? '👤 Citizen' : userRole === 'government' ? '🏛️ Admin' : userRole === 'university' ? '🎓 University' : '🏢 Industry'} · {user.name}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: getChallengeImage(challenge) }} style={styles.cover} />
        <View style={[styles.stage, { backgroundColor: stage.bg, borderColor: stage.border }]}>
          <Text style={[styles.stageText, { color: stage.color }]}>{language === 'hi' ? stage.labelHi : stage.labelEn}</Text>
        </View>
        <Text style={[styles.title, { fontSize: 20 * fontScale }]}>{challenge.title}</Text>
        <Text style={styles.meta}>
          {challenge.department} · {challenge.location} · {challenge.id}
        </Text>
        <Text style={styles.meta}>
          Submitted by {challenge.submittedBy} ({challenge.submitterType}) · Affected ~{challenge.beneficiaries.toLocaleString('en-IN')}
        </Text>
        <Text style={styles.body}>{challenge.description}</Text>

        <Text style={styles.h2}>Innovation pathway</Text>
        <EcosystemFlow activeStage={challenge.stage} />

        <View style={styles.box}>
          <View style={styles.boxHead}>
            <Sparkles size={16} color="#7C3AED" />
            <Text style={styles.boxTitle}>AI classification, priority and routing</Text>
          </View>
          <Text style={styles.meta}>Domain {challenge.domain} · Confidence {challenge.aiConfidence}% · Urgency {challenge.urgency}</Text>
          <Text style={styles.meta}>Expected solution: {challenge.expectedSolution}</Text>
          <View style={styles.tags}>
            {(challenge.requiredSkills || challenge.aiTags).map((tag) => (
              <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
            ))}
          </View>
        </View>

        {similar.length ? (
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Nearby similar reports (deduplication)</Text>
            {similar.map((item) => (
              <Pressable key={item.id} onPress={() => router.push(toHref(`/challenge-detail?id=${item.id}`))}>
                <Text style={styles.link}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {challenge.assignedUniversity ? (
          <Pressable style={styles.box} onPress={() => router.push(toHref(`/university-detail?id=${challenge.assignedUniversity?.heiId}`))}>
            <View style={styles.boxHead}>
              <GraduationCap size={16} color={SamadhanColors.primary} />
              <Text style={styles.boxTitle}>{challenge.assignedUniversity.heiName}</Text>
            </View>
            <Text style={styles.meta}>
              Lead: {challenge.assignedUniversity.facultyLead} · Team size: {challenge.assignedUniversity.teamSize || challenge.teamMembers?.length || 4} · Proposal: {challenge.assignedUniversity.proposalSubmitted ? 'Submitted (Under Review)' : 'Drafting'}
            </Text>
            {(challenge.teamMembers || []).map((m) => (
              <Text key={m.name} style={styles.meta}>{m.role}: {m.name} ({m.discipline})</Text>
            ))}
          </Pressable>
        ) : (
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Suggested HEIs matching domain</Text>
            {suggestedHeis.map((uni) => (
              <Text key={uni.id} style={styles.meta}>{uni.logoEmoji} {uni.name} · {uni.domains.join(', ')}</Text>
            ))}
          </View>
        )}

        {challenge.industryPartner ? (
          <Pressable style={styles.box} onPress={() => router.push(toHref(`/partner-detail?id=${challenge.industryPartner?.partnerId}`))}>
            <View style={styles.boxHead}>
              <Building2 size={16} color={SamadhanColors.secondary} />
              <Text style={styles.boxTitle}>{challenge.industryPartner.companyName}</Text>
            </View>
            <Text style={styles.meta}>
              Support: {challenge.industryPartner.contributionType.join(', ')} {challenge.industryPartner.fundingAmount ? `· ${challenge.industryPartner.fundingAmount}` : ''}
            </Text>
          </Pressable>
        ) : null}

        <Text style={styles.h2}>Project lifecycle & milestones</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${challenge.progressPercent}%` }]} />
        </View>
        <Text style={styles.meta}>{challenge.progressPercent}% complete · Funding: {challenge.fundingAvailable} · Target: {challenge.deadline}</Text>
        {challenge.milestones.map((m) => (
          <Pressable key={m.id} style={styles.mile} onPress={() => toggleMilestone(challenge.id, m.id)}>
            <View style={[styles.dot, m.completed && styles.dotDone]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.mileTitle, m.completed && { textDecorationLine: 'line-through', color: SamadhanColors.textSecondary }]}>{m.title}</Text>
              <Text style={styles.meta}>{m.completed ? `Completed ${m.completedDate}` : `Due ${m.dueDate}`}</Text>
            </View>
          </Pressable>
        ))}

        <Text style={styles.h2}>Community discussion thread</Text>
        {(challenge.commentsFeed || []).map((c) => (
          <View key={c.id} style={styles.comment}>
            <Text style={styles.commentAuthor}>{c.author} · {c.role}</Text>
            <Text style={styles.commentText}>{c.text}</Text>
            <Text style={styles.meta}>{c.at}</Text>
          </View>
        ))}
        <TextInput style={styles.input} value={comment} onChangeText={setComment} placeholder="Add a public comment or field update" placeholderTextColor={SamadhanColors.textMuted} />
        <View style={styles.row}>
          <Button title="Post comment" onPress={() => { addChallengeComment(challenge.id, comment); setComment(''); }} variant="outline" size="sm" />
          <Pressable onPress={() => supportChallenge(challenge.id)} style={styles.support}>
            <ThumbsUp size={14} color={SamadhanColors.primary} />
            <Text style={styles.supportText}>Support ({challenge.upvotes})</Text>
          </Pressable>
        </View>

        {/* Stakeholder Action Panels */}
        <View style={styles.roleActionBox}>
          <Text style={styles.roleActionHeading}>
            {userRole === 'government' ? '🏛️ Administrator Actions (Department / Nodal)' : null}
            {userRole === 'university' ? '🎓 University Actions (Faculty & Students)' : null}
            {userRole === 'industry' ? '🏢 Industry / CSR Desk Actions' : null}
            {userRole === 'citizen' ? '👤 Citizen Reporter Actions' : null}
          </Text>

          {userRole === 'government' ? (
            <View style={styles.actions}>
              {challenge.stage === 'Submitted' || challenge.stage === 'Under Review' ? (
                <Button title="✓ Validate Challenge as Genuine Need" onPress={() => validateChallenge(challenge.id)} variant="primary" />
              ) : null}
              <Text style={[styles.meta, { fontWeight: '700', marginTop: 4 }]}>Route to Jharkhand University:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {suggestedHeis.map((uni) => (
                  <Pressable
                    key={uni.id}
                    onPress={() => assignUniversity(challenge.id, uni.id)}
                    style={[styles.uniRouteChip, challenge.assignedUniversity?.heiId === uni.id && styles.uniRouteChipActive]}>
                    <Text style={styles.uniRouteText}>
                      {uni.logoEmoji} {uni.shortName}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {userRole === 'university' ? (
            <View style={styles.actions}>
              {challenge.stage !== 'In Progress' && challenge.stage !== 'Pilot Testing' && challenge.stage !== 'Deployed' ? (
                <Button title="Accept Challenge for Campus Project" onPress={() => acceptChallenge(challenge.id)} variant="primary" />
              ) : null}
              <Button title="Form Multidisciplinary Project Team" onPress={() => formProjectTeam(challenge.id)} variant="outline" />
              <Button title="Submit Research & Solution Proposal" onPress={() => submitProposal(challenge.id)} variant="action" />
            </View>
          ) : null}

          {userRole === 'industry' ? (
            <View style={styles.actions}>
              <Button title="Pledge CSR Funding (₹2,50,000)" onPress={() => offerIndustrySupport(challenge.id, INDUSTRY_PARTNERS_DATA[0].id, 'Funding')} variant="action" />
              <Button title="Assign Technical & Prototyping Mentor" onPress={() => offerIndustrySupport(challenge.id, INDUSTRY_PARTNERS_DATA[1]?.id || INDUSTRY_PARTNERS_DATA[0].id, 'Mentoring')} variant="outline" />
              <Button title="Offer Testing Lab & MSME Manufacturing" onPress={() => offerIndustrySupport(challenge.id, INDUSTRY_PARTNERS_DATA[3]?.id || INDUSTRY_PARTNERS_DATA[0].id, 'Prototyping')} variant="secondary" />
            </View>
          ) : null}

          {userRole === 'citizen' ? (
            <View style={styles.actions}>
              <Button title="Request Progress Verification" onPress={() => supportChallenge(challenge.id)} variant="outline" />
            </View>
          ) : null}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SamadhanColors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm },
  backText: { fontWeight: '700', color: SamadhanColors.primary },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: SamadhanColors.border,
  },
  viewerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: '65%',
  },
  viewerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
  roleActionBox: {
    marginTop: Spacing.xl,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  roleActionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  uniRouteChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  uniRouteChipActive: {
    backgroundColor: SamadhanColors.primarySurface,
    borderColor: SamadhanColors.primary,
  },
  uniRouteText: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  cover: { width: '100%', height: 180, borderRadius: Radius.lg, backgroundColor: '#E2E8F0', marginBottom: Spacing.md },
  stage: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  stageText: { fontSize: 11, fontWeight: '800' },
  title: { fontWeight: '800', color: SamadhanColors.textPrimary, marginTop: 10, lineHeight: 26 },
  meta: { fontSize: 12, color: SamadhanColors.textSecondary, marginTop: 4 },
  body: { fontSize: 14, color: SamadhanColors.textPrimary, lineHeight: 21, marginTop: 12 },
  h2: { marginTop: Spacing.xl, marginBottom: Spacing.sm, fontSize: 15, fontWeight: '800', color: SamadhanColors.textPrimary },
  box: {
    marginTop: Spacing.lg,
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  boxHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  boxTitle: { fontSize: 14, fontWeight: '800', color: SamadhanColors.textPrimary, flex: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { backgroundColor: '#F5F3FF', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 11, fontWeight: '700', color: '#7C3AED' },
  link: { marginTop: 6, fontSize: 13, fontWeight: '700', color: SamadhanColors.primary },
  progressTrack: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: SamadhanColors.secondary },
  mile: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#CBD5E1', marginTop: 4 },
  dotDone: { backgroundColor: '#16A34A' },
  mileTitle: { fontSize: 13, fontWeight: '700', color: SamadhanColors.textPrimary },
  comment: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: SamadhanColors.border, borderRadius: Radius.md, padding: Spacing.md, marginBottom: 8 },
  commentAuthor: { fontSize: 12, fontWeight: '800', color: SamadhanColors.primary },
  commentText: { fontSize: 13, color: SamadhanColors.textPrimary, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 10,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.lg },
  support: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: '#EFF6FF' },
  supportText: { fontWeight: '800', color: SamadhanColors.primary, fontSize: 12 },
  actions: { gap: 10, marginTop: Spacing.md },
});
