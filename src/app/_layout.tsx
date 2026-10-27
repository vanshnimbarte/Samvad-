import React, { useEffect } from 'react';
import { useColorScheme, View, StyleSheet, Platform, BackHandler } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ObserveRoot, Observe } from '@/lib/observe';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';

import { AppProvider } from '@/context/AppContext';
import { ToastMessage } from '@/components/common/ToastMessage';
import BottomNavBar from '@/components/bottom-nav-bar';

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_bG95YWwtcXVhZ2dhLTI3MTEuY2xlcmsuYWNjb3VudHMuZGV2JA';

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

function RootNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      const current = pathname ? pathname.split('?')[0].replace(/\/+$/, '') || '/' : '/';
      if (current !== '/') {
        if (router.canGoBack()) {
          router.back();
          return true;
        } else {
          router.replace('/');
          return true;
        }
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [pathname, router]);

  return (
    <View style={styles.rootContainer}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      <BottomNavBar />
      <ToastMessage />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    // Mark the app as interactive once the root layout is mounted and ready
    Observe.markInteractive();
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ObserveRoot>
        <SafeAreaProvider>
          <AppProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <RootNavigation />
            </ThemeProvider>
          </AppProvider>
        </SafeAreaProvider>
      </ObserveRoot>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
