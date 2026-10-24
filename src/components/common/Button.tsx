import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';

export type ButtonVariant = 'primary' | 'action' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { fontScale } = useApp();

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return '#CBD5E1';
    switch (variant) {
      case 'action':
        return pressed ? SamadhanColors.actionHover : SamadhanColors.action;
      case 'secondary':
        return pressed ? SamadhanColors.secondaryDark : SamadhanColors.secondary;
      case 'outline':
      case 'ghost':
        return pressed ? 'rgba(30, 58, 138, 0.08)' : 'transparent';
      case 'danger':
        return pressed ? '#B91C1C' : '#DC2626';
      case 'primary':
      default:
        return pressed ? SamadhanColors.primaryDark : SamadhanColors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#64748B';
    switch (variant) {
      case 'outline':
        return SamadhanColors.primary;
      case 'ghost':
        return SamadhanColors.primary;
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 44; // Minimum accessible touch target (WCAG AA)
      case 'lg':
        return 56;
      case 'md':
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 13 * fontScale;
      case 'lg':
        return 16 * fontScale;
      case 'md':
      default:
        return 15 * fontScale;
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(pressed),
          borderColor:
            variant === 'outline'
              ? disabled
                ? '#CBD5E1'
                : SamadhanColors.primary
              : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? SamadhanColors.primary : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
              textStyle,
            ]}>
            {title}
          </Text>
          {iconRight && <View style={styles.iconRightWrapper}>{iconRight}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  iconRightWrapper: {
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
