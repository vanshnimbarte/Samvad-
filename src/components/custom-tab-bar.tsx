import React, { useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
} from 'expo-router/ui';
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

export default function CustomAppTabs() {
  const showMapTab = true;
  const pathname = usePathname();
  const router = useRouter();

  // Android hardware back button handler
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      const current = pathname ? pathname.split('?')[0].replace(/\/+$/, '') || '/' : '/';
      // If we are not on home screen, navigate back cleanly
      if (current !== '/') {
        if (router.canGoBack()) {
          router.back();
          return true;
        } else {
          router.replace('/');
          return true;
        }
      }
      return false; // Let OS handle back on root home
    };

    const backSub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSub.remove();
  }, [pathname, router]);

  // Normalized path check for main tab routes
  const normalizedPath = pathname ? pathname.split('?')[0].replace(/\/+$/, '') || '/' : '/';
  const isMainTab = ['/', '/explore', '/map', '/workspace', '/profile'].includes(normalizedPath);

  return (
    <Tabs style={styles.tabsContainer}>
      <TabSlot style={styles.tabSlot} />
      <TabList asChild>
        <AccessibleBottomNav isVisible={isMainTab}>
          <TabTrigger name="index" href="/" asChild>
            <NavTabButton type="home" />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <NavTabButton type="explore" />
          </TabTrigger>
          {showMapTab ? (
            <TabTrigger name="map" href={toHref('/map')} asChild>
              <NavTabButton type="map" />
            </TabTrigger>
          ) : null}
          <TabTrigger name="workspace" href={toHref('/workspace')} asChild>
            <NavTabButton type="workspace" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <NavTabButton type="profile" />
          </TabTrigger>
        </AccessibleBottomNav>
      </TabList>
    </Tabs>
  );
}

interface AccessibleBottomNavProps {
  children?: React.ReactNode;
  isVisible?: boolean;
}

export function AccessibleBottomNav({ children, isVisible = true }: AccessibleBottomNavProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 8);

  if (!isVisible) {
    return <View style={styles.hiddenNav} pointerEvents="none" />;
  }

  return (
    <View style={styles.navWrapper} pointerEvents="box-none">
      <View style={[styles.navBar, { paddingBottom: bottomInset }]}>
        {children}
      </View>
    </View>
  );
}

function NavTabButton({
  type,
  isFocused,
  ...props
}: TabTriggerSlotProps & {
  type: 'home' | 'explore' | 'map' | 'workspace' | 'profile';
}) {
  const { language, fontScale } = useApp();

  const labels = {
    home: language === 'hi' ? 'होम' : 'Home',
    explore: language === 'hi' ? 'चुनौतियां' : 'Challenges',
    map: language === 'hi' ? 'मानचित्र' : 'Map',
    workspace: language === 'hi' ? 'कार्यक्षेत्र' : 'Workspace',
    profile: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile',
  };

  const label = labels[type];
  const color = isFocused ? SamadhanColors.primary : SamadhanColors.textMuted;

  const renderIcon = () => {
    const size = 20;
    const strokeWidth = isFocused ? 2.5 : 1.9;
    switch (type) {
      case 'home':
        return <Home size={size} color={color} strokeWidth={strokeWidth} />;
      case 'explore':
        return <Compass size={size} color={color} strokeWidth={strokeWidth} />;
      case 'map':
        return <MapPinned size={size} color={color} strokeWidth={strokeWidth} />;
      case 'workspace':
        return <Briefcase size={size} color={color} strokeWidth={strokeWidth} />;
      case 'profile':
        return <User size={size} color={color} strokeWidth={strokeWidth} />;
    }
  };

  const router = useRouter();
  const tabRoutes: Record<string, string> = {
    home: '/',
    explore: '/explore',
    map: '/map',
    workspace: '/workspace',
    profile: '/profile',
  };

  return (
    <Pressable
      {...props}
      onPress={(e) => {
        props.onPress?.(e);
        const target = tabRoutes[type];
        if (target) {
          router.push(toHref(target as any));
        }
      }}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [
        styles.tabButton,
        pressed && styles.tabButtonPressed,
      ]}>
      {renderIcon()}
      <Text
        style={[
          styles.tabLabel,
          {
            color,
            fontSize: 11 * fontScale,
            fontWeight: isFocused ? '800' : '600',
          },
        ]}>
        {label}
      </Text>
      {isFocused && <View style={styles.activeIndicator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
    backgroundColor: SamadhanColors.background,
  },
  tabSlot: {
    flex: 1,
  },
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
  hiddenNav: {
    height: 0,
    width: 0,
    opacity: 0,
    overflow: 'hidden',
  },
});
