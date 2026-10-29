// ============================================================
//  Écran : Lumières
//  Contrôle par pièce, actions globales (Tout allumer / Tout éteindre)
// ============================================================

import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHouseStore } from '../../src/store/useHouseStore';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii } from '../../src/constants/theme';
import { AppHeader } from '../../src/components/AppHeader';
import { RoomCard } from '../../src/components/RoomCard';
import { UnavailableState } from '../../src/components/UnavailableState';

export default function LumieresScreen() {
    const { colors } = useAppTheme();
    const status = useHouseStore((s) => s.status);
    const setLight = useHouseStore((s) => s.setLight);
    const lightCommands = useHouseStore((s) => s.lightCommands);
    const fetchStatus = useHouseStore((s) => s.fetchStatus);
    const connectionStatus = useHouseStore((s) => s.connectionStatus);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStatus();
        setRefreshing(false);
    };

    const lights = status?.lights ?? [];
    const lightsOn = lights.filter((l) => l.state === 'on').length;

    const handleTurnAll = async (state: 'on' | 'off') => {
        for (const light of lights) {
            if (light.state !== state) {
                setLight(light.id, state);
            }
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
            <AppHeader title="Éclairage & Pièces" showConnection />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Actions globales */}
                <View style={[styles.actionBanner, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <View>
                        <Text style={[styles.bannerTitle, { color: colors.text }]}>Contrôle Global</Text>
                        <Text style={[styles.summaryText, { color: colors.textSub }]}>
                            {lightsOn} sur {lights.length} allumée{lightsOn > 1 ? 's' : ''}
                        </Text>
                    </View>

                    <View style={styles.btnRow}>
                        <TouchableOpacity
                            style={[styles.globalBtn, { backgroundColor: colors.primary }]}
                            onPress={() => handleTurnAll('on')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.globalBtnText}>Tout Allumer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.globalBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.surfaceBorder, borderWidth: 1 }]}
                            onPress={() => handleTurnAll('off')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.globalBtnText, { color: colors.text }]}>Tout Éteindre</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Erreur réseau */}
                {connectionStatus === 'disconnected' && (
                    <UnavailableState
                        variant="error"
                        errorMessage="Impossible de joindre la maison"
                        onRetry={fetchStatus}
                    />
                )}

                {/* Cartes par pièce */}
                {lights.map((light) => {
                    const cmd = lightCommands[light.id] ?? { status: 'idle' };
                    return (
                        <RoomCard
                            key={light.id}
                            light={light}
                            commandState={cmd}
                            onToggle={(newState) => setLight(light.id, newState)}
                            onRetry={() => setLight(light.id, light.state === 'on' ? 'off' : 'on')}
                        />
                    );
                })}

                {status && lights.length === 0 && (
                    <UnavailableState
                        variant="unavailable"
                        label="Aucune lumière configurée"
                    />
                )}

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { flex: 1 },
    content: { padding: Spacing.md },
    actionBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radii.lg,
        borderWidth: 1,
        marginBottom: Spacing.md,
    },
    bannerTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    summaryText: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    btnRow: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    globalBtn: {
        paddingHorizontal: Spacing.sm + 2,
        paddingVertical: 7,
        borderRadius: Radii.sm,
    },
    globalBtnText: {
        color: '#FFFFFF',
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
});
