// ============================================================
//  Layout racine — Expo Router (SDK 57)
//  Support dynamique Mode Sombre & Mode Clair
// ============================================================

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
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

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync().catch(() => {});
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        const stopPolling = startPolling();
        return stopPolling;
    }, [startPolling]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <GestureHandlerRootView style={[styles.root, { backgroundColor: colors.bg }]}>
            <SafeAreaProvider>
                <StatusBar style={isDark ? 'light' : 'dark'} />
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
                        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
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
