import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';

export function ToastMessage() {
  const { toast, hideToast, fontScale } = useApp();
  const insets = useSafeAreaInsets();

  if (!toast.visible) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const topOffset = Math.max(insets.top + 8, 48);

  return (
    <View style={[styles.floatingContainer, { top: topOffset }]} pointerEvents="box-none">
      <View
        style={[
          styles.toastCard,
          isSuccess && styles.successCard,
          isError && styles.errorCard,
        ]}>
        {isSuccess ? (
          <CheckCircle2 size={18} color="#16A34A" />
        ) : isError ? (
          <AlertCircle size={18} color="#DC2626" />
        ) : (
          <Info size={18} color={SamadhanColors.primary} />
        )}

        <Text style={[styles.messageText, { fontSize: 13 * fontScale }]}>
          {toast.message}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss message"
          onPress={hideToast}
          style={styles.closeBtn}>
          <X size={16} color={SamadhanColors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    top: 54,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  successCard: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  errorCard: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  messageText: {
    flex: 1,
    color: SamadhanColors.textPrimary,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
});
