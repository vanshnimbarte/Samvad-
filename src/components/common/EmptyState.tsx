import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon, Inbox } from 'lucide-react-native';
import { Button } from './Button';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionTitle,
  onActionPress,
}: EmptyStateProps) {
  const { fontScale } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon size={32} color={SamadhanColors.primaryLight} />
      </View>

      <Text style={[styles.title, { fontSize: 16 * fontScale }]}>{title}</Text>
      <Text style={[styles.description, { fontSize: 13 * fontScale }]}>
        {description}
      </Text>

      {actionTitle && onActionPress && (
        <View style={styles.actionWrapper}>
          <Button
            title={actionTitle}
            onPress={onActionPress}
            variant="action"
            size="md"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontWeight: '800',
    color: SamadhanColors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    color: SamadhanColors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 300,
  },
  actionWrapper: {
    marginTop: Spacing.lg,
    width: '100%',
    maxWidth: 240,
  },
});
