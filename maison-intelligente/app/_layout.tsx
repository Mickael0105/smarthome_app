// ============================================================
//  Layout racine — Expo Router (SDK 57)
//  Support dynamique Mode Sombre & Mode Clair
//  Guard d'authentification : redirige vers /login si déconnecté
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { AlertBanner } from '../src/components/AlertBanner';
import { useHouseStore } from '../src/store/useHouseStore';
import { getThemeColors } from '../src/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

// ─── Guard d'authentification ──────────────────────────────────
// Surveille l'état de connexion et redirige automatiquement
function AuthGuard({ fontsReady }: { fontsReady: boolean }) {
    const router = useRouter();
    const segments = useSegments();
    const isLoggedIn = useHouseStore((s) => s.isLoggedIn);
    const guarded = useRef(false);

    useEffect(() => {
        if (!fontsReady) return;

        const inLoginScreen = segments[0] === 'login';
        const inOnboarding = segments[0] === 'onboarding';

        if (!isLoggedIn && !inLoginScreen && !inOnboarding) {
            // Première fois ou déconnexion → aller au login
            if (!guarded.current) {
                guarded.current = true;
                setTimeout(() => router.replace('/login'), 80);
            }
        }

        if (isLoggedIn) {
            guarded.current = false;
        }
    }, [isLoggedIn, segments, fontsReady, router]);

    return null;
}

export default function RootLayout() {
    const startPolling = useHouseStore((s) => s.startPolling);
    const themeMode = useHouseStore((s) => s.themeMode);
    const isDark = themeMode === 'dark';
    const colors = getThemeColors(isDark);

    const [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
    });

    const fontsReady = fontsLoaded || !!fontError;

    useEffect(() => {
        if (fontsReady) {
            SplashScreen.hideAsync().catch(() => {});
        }
    }, [fontsReady]);

    useEffect(() => {
        const stopPolling = startPolling();
        return stopPolling;
    }, [startPolling]);

    if (!fontsReady) {
        return null;
    }

    return (
        <GestureHandlerRootView style={[styles.root, { backgroundColor: colors.bg }]}>
            <SafeAreaProvider>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                {/* Guard auth — surveille et redirige si déconnecté */}
                <AuthGuard fontsReady={fontsReady} />
                {/* AlertBanner global — visible sur tous les écrans */}
                <AlertBanner />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: colors.bg },
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="login"
                        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
                    />
                    <Stack.Screen
                        name="parametres"
                        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                    />
                    <Stack.Screen
                        name="simulation"
                        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                    />
                    <Stack.Screen
                        name="aide"
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name="onboarding"
                        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
                    />
                </Stack>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
