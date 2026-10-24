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
            <ThemedText type="small" themeColor="textSecondary" style={styles.headerSubtitle}>
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
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  liveText: {
    color: '#22c55e',
    fontWeight: '700',
    fontSize: 11,
  },
});
