import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Inbox,
  CheckCircle2,
  UserCheck,
  Wrench,
  FlaskConical,
  CheckCheck,
  Archive,
} from 'lucide-react-native';
import {
  ReportStatus,
  REPORT_STATUS_CONFIG,
  Radius,
} from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const { language, fontScale } = useApp();
  const config = REPORT_STATUS_CONFIG[status] || REPORT_STATUS_CONFIG.Received;

  const label = language === 'hi' ? config.labelHi : config.labelEn;

  const renderIcon = (color: string, iconSize: number) => {
    switch (status) {
      case 'Received':
        return <Inbox size={iconSize} color={color} />;
      case 'Validated':
        return <CheckCircle2 size={iconSize} color={color} />;
      case 'Assigned':
        return <UserCheck size={iconSize} color={color} />;
      case 'In Progress':
        return <Wrench size={iconSize} color={color} />;
      case 'Pilot':
        return <FlaskConical size={iconSize} color={color} />;
      case 'Deployed':
        return <CheckCheck size={iconSize} color={color} />;
      case 'Closed':
        return <Archive size={iconSize} color={color} />;
      default:
        return <Inbox size={iconSize} color={color} />;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 3, paddingHorizontal: 8 };
      case 'lg':
        return { paddingVertical: 6, paddingHorizontal: 14 };
      case 'md':
      default:
        return { paddingVertical: 4, paddingHorizontal: 10 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 11 * fontScale;
      case 'lg':
        return 13 * fontScale;
      case 'md':
      default:
        return 12 * fontScale;
    }
  };

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <View
      accessibilityLabel={`Status: ${label}`}
      style={[
        styles.badge,
        getPadding(),
        {
          backgroundColor: config.bg,
          borderColor: config.borderColor,
        },
      ]}>
      {showIcon && <View style={styles.iconContainer}>{renderIcon(config.color, iconSize)}</View>}
      <Text
        style={[
          styles.label,
          {
            color: config.color,
            fontSize: getFontSize(),
          },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
