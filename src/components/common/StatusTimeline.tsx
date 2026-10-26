import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Check,
  Clock,
  Inbox,
  CheckCircle2,
  UserCheck,
  Wrench,
  FlaskConical,
  CheckCheck,
  Archive,
  Building,
  ArrowRightCircle,
} from 'lucide-react-native';
import {
  ReportStatus,
  REPORT_STATUS_CONFIG,
  STATUS_STEPS,
  SamadhanColors,
  Spacing,
  Radius,
} from '@/constants/samadhan-theme';
import { TimelineEvent } from '@/data/samadhan-mock-data';
import { useApp } from '@/context/AppContext';

interface StatusTimelineProps {
  currentStatus: ReportStatus;
  timelineEvents: TimelineEvent[];
  responsibleOrg?: {
    name: string;
    department: string;
    officer: string;
  };
  nextExpectedAction?: {
    labelEn: string;
    labelHi: string;
    estimatedDate: string;
  };
}

export function StatusTimeline({
  currentStatus,
  timelineEvents,
  responsibleOrg,
  nextExpectedAction,
}: StatusTimelineProps) {
  const { language, fontScale } = useApp();

  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  const getStatusIcon = (status: ReportStatus, size: number, color: string) => {
    switch (status) {
      case 'Received':
        return <Inbox size={size} color={color} />;
      case 'Validated':
        return <CheckCircle2 size={size} color={color} />;
      case 'Assigned':
        return <UserCheck size={size} color={color} />;
      case 'In Progress':
        return <Wrench size={size} color={color} />;
      case 'Pilot':
        return <FlaskConical size={size} color={color} />;
      case 'Deployed':
        return <CheckCheck size={size} color={color} />;
      case 'Closed':
        return <Archive size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
        Resolution Progress Timeline (7 Stages)
      </Text>

      <View style={styles.timelineList}>
        {STATUS_STEPS.map((step, idx) => {
          const config = REPORT_STATUS_CONFIG[step];
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          const matchedEvent = timelineEvents.find((e) => e.status === step);
          const timestamp = matchedEvent ? matchedEvent.timestamp : 'Upcoming';
          const explanation =
            matchedEvent
              ? matchedEvent.descriptionEn
              : config.explanationEn;

          const isLast = idx === STATUS_STEPS.length - 1;

          return (
            <View key={step} style={styles.timelineRow}>
              <View style={styles.indicatorCol}>
                <View
                  style={[
                    styles.nodeCircle,
                    isCompleted && { backgroundColor: config.color, borderColor: config.color },
                    isCurrent && {
                      backgroundColor: config.bg,
                      borderColor: config.color,
                      borderWidth: 2.5,
                    },
                    isUpcoming && styles.upcomingNode,
                  ]}>
                  {isCompleted ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  ) : isCurrent ? (
                    getStatusIcon(step, 15, config.color)
                  ) : (
                    <View style={styles.dot} />
                  )}
                </View>

                {!isLast && (
                  <View
                    style={[
                      styles.connectorLine,
                      isCompleted ? { backgroundColor: config.color } : styles.upcomingLine,
                    ]}
                  />
                )}
              </View>

              <View
                style={[
                  styles.contentCard,
                  isCurrent && [
                    styles.currentCardHighlight,
                    { borderColor: config.borderColor, backgroundColor: config.bg },
                  ],
                ]}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[
                        styles.stageName,
                        { fontSize: 14 * fontScale },
                        isCompleted && { color: config.color },
                        isCurrent && { color: config.color, fontWeight: '800' },
                        isUpcoming && { color: SamadhanColors.textMuted },
                      ]}>
                      {config.labelEn}
                    </Text>

                    {isCurrent && (
                      <View
                        style={[
                          styles.currentPill,
                          { backgroundColor: config.color },
                        ]}>
                        <Text style={styles.currentPillText}>
                          ACTIVE
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.timeRow}>
                    <Clock size={11} color={SamadhanColors.textMuted} />
                    <Text style={styles.timestampText}>{timestamp}</Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.explanationText,
                    { fontSize: 13 * fontScale },
                    isUpcoming && { color: SamadhanColors.textMuted },
                  ]}>
                  {explanation}
                </Text>

                {isCurrent && (step === 'Assigned' || step === 'In Progress') && responsibleOrg && (
                  <View style={styles.orgBox}>
                    <Building size={13} color={SamadhanColors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.orgTitle}>{responsibleOrg.name}</Text>
                      <Text style={styles.orgDetail}>{responsibleOrg.officer}</Text>
                    </View>
                  </View>
                )}

                {isCurrent && nextExpectedAction && (
                  <View style={styles.nextActionBox}>
                    <ArrowRightCircle size={14} color={SamadhanColors.action} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.nextActionLabel}>
                        Next Expected Action:
                      </Text>
                      <Text style={styles.nextActionText}>
                        {nextExpectedAction.labelEn}
                      </Text>
                      <Text style={styles.targetDateText}>
                        Target: {nextExpectedAction.estimatedDate}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SamadhanColors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  indicatorCol: {
    width: 32,
    alignItems: 'center',
  },
  nodeCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 2,
  },
  upcomingNode: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: '#94A3B8',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 3,
  },
  upcomingLine: {
    backgroundColor: '#E2E8F0',
  },
  contentCard: {
    flex: 1,
    marginLeft: Spacing.md,
    backgroundColor: '#FAFAFA',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.xs,
  },
  currentCardHighlight: {
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stageName: {
    fontWeight: '700',
  },
  currentPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  currentPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timestampText: {
    fontSize: 11,
    color: SamadhanColors.textMuted,
    fontWeight: '500',
  },
  explanationText: {
    color: SamadhanColors.textSecondary,
    lineHeight: 18,
  },
  orgBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  orgTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.primary,
  },
  orgDetail: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 1,
  },
  nextActionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: '#FFF7ED',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  nextActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.action,
  },
  nextActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textPrimary,
    marginTop: 2,
  },
  targetDateText: {
    fontSize: 11,
    color: '#9A3412',
    marginTop: 2,
  },
});
