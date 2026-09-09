import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLiveBadge?: boolean;
}

export function AppHeader({
  title = 'Samvad',
  subtitle = 'Live Community Map',
  showLiveBadge = true,
}: AppHeaderProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={[styles.brandIconContainer, { backgroundColor: theme.text }]}>
          <ThemedText style={[styles.brandIconText, { color: theme.background }]}>
            S
          </ThemedText>
        </View>
        <View>
          <ThemedText style={styles.headerTitle}>{title}</ThemedText>
          {subtitle ? (
            <ThemedText type="small" themeColor="textSecondary">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
      </View>

      {showLiveBadge && (
        <View style={styles.headerRight}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <ThemedText type="small" style={styles.liveText}>
              Live
            </ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    marginTop: Spacing.two,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  brandIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIconText: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  liveText: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 12,
  },
});
