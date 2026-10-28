import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';
import {
  Home,
  Compass,
  MapPinned,
  Briefcase,
  User,
} from 'lucide-react-native';
import { SamadhanColors } from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';
import { toHref } from '@/lib/routes';

export default function BottomNavBar() {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, fontScale } = useApp();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const normalizedPath = pathname ? pathname.split('?')[0].replace(/\/+$/, '') || '/' : '/';
  const MAIN_TABS = ['/', '/explore', '/map', '/workspace', '/profile'];
  const isMainTab = MAIN_TABS.includes(normalizedPath);

  if (!isMainTab) {
    return null;
  }

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 8);

  const tabs = [
    {
      key: 'home',
      path: '/',
      label: 'Home',
      icon: Home,
      isActive: normalizedPath === '/',
    },
    {
      key: 'explore',
      path: '/explore',
      label: 'Challenges',
      icon: Compass,
      isActive: normalizedPath === '/explore',
    },
    {
      key: 'map',
      path: '/map',
      label: 'Map',
      icon: MapPinned,
      isActive: normalizedPath === '/map',
    },
    {
      key: 'workspace',
      path: '/workspace',
      label: 'Workspace',
      icon: Briefcase,
      isActive: normalizedPath === '/workspace',
    },
    {
      key: 'profile',
      path: '/profile',
      label: 'Profile',
      icon: User,
      isActive: normalizedPath === '/profile',
    },
  ];

  return (
    <View style={styles.navWrapper} pointerEvents="box-none">
      <View style={[styles.navBar, { paddingBottom: bottomInset }]}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const color = tab.isActive ? SamadhanColors.primary : SamadhanColors.textMuted;
          const strokeWidth = tab.isActive ? 2.5 : 1.9;

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: tab.isActive }}
              hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
              onPress={() => {
                if (!tab.isActive) {
                  try {
                    router.navigate(tab.path as any);
                  } catch {
                    router.replace(tab.path as any);
                  }
                }
              }}
              style={({ pressed }) => [
                styles.tabButton,
                pressed && styles.tabButtonPressed,
              ]}>
              <Icon size={20} color={color} strokeWidth={strokeWidth} />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color,
                    fontSize: 11 * fontScale,
                    fontWeight: tab.isActive ? '800' : '600',
                  },
                ]}>
                {tab.label}
              </Text>
              {tab.isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  navBar: {
    width: '100%',
    maxWidth: 640,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 48,
    position: 'relative',
  },
  tabButtonPressed: {
    opacity: 0.7,
  },
  tabLabel: {
    marginTop: 3,
    letterSpacing: 0.2,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 28,
    height: 3,
    backgroundColor: SamadhanColors.action,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
