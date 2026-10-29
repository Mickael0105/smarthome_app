// ============================================================
//  Écran : Confort Thermique & Climat
//  Thermostat, Courbe 24h, Humidité & Modes CVC
// ============================================================

import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHouseStore } from '../../src/store/useHouseStore';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../../src/constants/theme';
import { AppHeader } from '../../src/components/AppHeader';
import { ThermostatControl } from '../../src/components/ThermostatControl';
import { TempChartWidget } from '../../src/components/TempChartWidget';
import { UnavailableState } from '../../src/components/UnavailableState';
import { SmartIcon, SmartIconName } from '../../src/components/SmartIcon';

type HvacMode = 'heat' | 'cool' | 'eco' | 'off';

export default function TemperatureScreen() {
    const { colors } = useAppTheme();
    const status = useHouseStore((s) => s.status);
    const pendingSetpoint = useHouseStore((s) => s.pendingSetpoint);
    const setPendingSetpoint = useHouseStore((s) => s.setPendingSetpoint);
    const setSetpoint = useHouseStore((s) => s.setSetpoint);
    const setpointCommand = useHouseStore((s) => s.setpointCommand);
    const fetchStatus = useHouseStore((s) => s.fetchStatus);
    const [hvacMode, setHvacMode] = useState<HvacMode>('heat');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStatus();
        setRefreshing(false);
    };

    // Extraction robuste de la température
    const rawTemp = status?.temperature;
    const tempValue = typeof rawTemp === 'number' ? rawTemp : (rawTemp as any)?.value ?? 21.5;
    const currentSetpoint = status?.setpoint ?? 20;
    const humidity = status?.humidity?.value ?? status?.humidity?.current ?? 48;

    const getComfortStatus = (temp: number) => {
        if (temp < 18) return { label: 'Atmosphère fraîche', color: colors.secondary };
        if (temp > 24) return { label: 'Atmosphère chaude', color: colors.danger };
        return { label: 'Zone de confort idéale', color: colors.primary };
    };

    const comfort = getComfortStatus(tempValue);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
            <AppHeader title="Climat & Thermostat" showConnection />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Carte Principale de Mesure Ambiante */}
                <View style={[styles.measuredCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, Shadows.card]}>
                    <View style={styles.cardTop}>
                        <View>
                            <Text style={[styles.measuredLabel, { color: colors.textSub }]}>Température ambiante</Text>
                            <Text style={[styles.comfortBadge, { color: comfort.color }]}>● {comfort.label}</Text>
                        </View>
                        <View style={[styles.hvacPill, { backgroundColor: colors.surfaceAlt, flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                            <SmartIcon
                                name={hvacMode === 'heat' ? 'heat' : hvacMode === 'cool' ? 'cool' : hvacMode === 'eco' ? 'eco' : 'power'}
                                size={13}
                                color={colors.primary}
                            />
                            <Text style={[styles.hvacPillText, { color: colors.primary }]}>
                                {hvacMode === 'heat' ? 'Chauffage' : hvacMode === 'cool' ? 'Clim' : hvacMode === 'eco' ? 'Éco' : 'Veille'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tempDisplayRow}>
                        <Text style={[styles.measuredValue, { color: colors.text }]}>{tempValue.toFixed(1)}</Text>
                        <Text style={[styles.degreeSign, { color: colors.textSub }]}>°C</Text>
                    </View>

                    {/* Jauge linéaire de température */}
                    <View style={[styles.gaugeTrack, { backgroundColor: colors.surfaceAlt }]}>
                        <View
                            style={[
                                styles.gaugeFill,
                                {
                                    width: `${Math.min(100, Math.max(0, ((tempValue - 10) / 25) * 100))}%`,
                                    backgroundColor: comfort.color,
                                },
                            ]}
                        />
                    </View>
                    <View style={styles.gaugeLabels}>
                        <Text style={[styles.gaugeLabelText, { color: colors.textSub }]}>10°C Min</Text>
                        <Text style={[styles.gaugeLabelText, { color: colors.textSub }]}>35°C Max</Text>
                    </View>

                    {/* Ligne météo intérieure (Humidité & Qualité d'air) */}
                    <View style={[styles.metricsRow, { borderTopColor: colors.surfaceBorder }]}>
                        <View style={styles.metricItem}>
                            <Text style={[styles.metricLabel, { color: colors.textSub }]}>Humidité relative</Text>
                            <View style={styles.metricValRow}>
                                <SmartIcon name="humidity" size={13} color="#06B6D4" />
                                <Text style={[styles.metricVal, { color: colors.text }]}>{humidity}%</Text>
                            </View>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricItem}>
                            <Text style={[styles.metricLabel, { color: colors.textSub }]}>Qualité de l'air</Text>
                            <View style={styles.metricValRow}>
                                <SmartIcon name="eco" size={13} color={colors.primary} />
                                <Text style={[styles.metricVal, { color: colors.primary }]}>Excellente</Text>
                            </View>
                        </View>
                        <View style={styles.metricDivider} />
                        <View style={styles.metricItem}>
                            <Text style={[styles.metricLabel, { color: colors.textSub }]}>Point de rosée</Text>
                            <Text style={[styles.metricVal, { color: colors.text }]}>12.1 °C</Text>
                        </View>
                    </View>
                </View>

                {/* Sélecteur de Mode CVC (Chauffage / Clim / Éco / Arrêt) */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Mode du Système CVC</Text>
                <View style={[styles.modeRow, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    {(
                        [
                            { id: 'heat', label: 'Chauffage', icon: 'heat' as SmartIconName },
                            { id: 'cool', label: 'Climatisation', icon: 'cool' as SmartIconName },
                            { id: 'eco', label: 'Éco Auto', icon: 'eco' as SmartIconName },
                            { id: 'off', label: 'Arrêt', icon: 'power' as SmartIconName },
                        ] as const
                    ).map((m) => {
                        const isSelected = hvacMode === m.id;
                        return (
                            <TouchableOpacity
                                key={m.id}
                                style={[
                                    styles.modeBtn,
                                    isSelected && { backgroundColor: colors.primaryDim, borderColor: colors.primary },
                                ]}
                                onPress={() => setHvacMode(m.id)}
                                activeOpacity={0.7}
                            >
                                <SmartIcon
                                    name={m.icon}
                                    size={20}
                                    color={isSelected ? colors.primary : colors.textSub}
                                />
                                <Text
                                    style={[
                                        styles.modeLabel,
                                        { color: isSelected ? colors.primary : colors.textSub },
                                    ]}
                                >
                                    {m.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Graphique d'historique 24h (Polyline / Barres pures React Native) */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Analytique Thermique</Text>
                <TempChartWidget />

                {/* Contrôle de la consigne */}
                <Text style={[styles.sectionTitle, { color: colors.textSub, marginTop: Spacing.md }]}>
                    Réglage de la Consigne
                </Text>
                <View style={styles.controlCard}>
                    <ThermostatControl
                        setpoint={currentSetpoint}
                        pendingSetpoint={pendingSetpoint ?? currentSetpoint}
                        onSetpointChange={setPendingSetpoint}
                        onConfirm={() => {
                            if (pendingSetpoint !== null) {
                                setSetpoint(pendingSetpoint);
                            }
                        }}
                        isPending={setpointCommand.status === 'pending'}
                        isError={setpointCommand.status === 'error'}
                        errorMessage={setpointCommand.errorMessage}
                        onRetry={() => {
                            if (pendingSetpoint !== null) {
                                setSetpoint(pendingSetpoint);
                            }
                        }}
                    />
                </View>

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { flex: 1 },
    content: { padding: Spacing.md },
    measuredCard: {
        borderRadius: Radii.xxl,
        borderWidth: 1,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    measuredLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    comfortBadge: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        marginTop: 2,
    },
    hvacPill: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.full,
    },
    hvacPillText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    tempDisplayRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginVertical: Spacing.sm,
    },
    measuredValue: {
        fontSize: 64,
        fontWeight: FontWeight.extrabold,
        lineHeight: 70,
    },
    degreeSign: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.medium,
        marginTop: 8,
        marginLeft: 4,
    },
    gaugeTrack: {
        height: 8,
        borderRadius: Radii.full,
        overflow: 'hidden',
        marginTop: Spacing.xs,
    },
    gaugeFill: {
        height: '100%',
        borderRadius: Radii.full,
    },
    gaugeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: Spacing.sm,
    },
    gaugeLabelText: {
        fontSize: 10,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: Spacing.sm,
        marginTop: Spacing.xs,
    },
    metricItem: {
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        fontSize: 10,
        marginBottom: 2,
    },
    metricValRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    metricVal: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    metricDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#94A3B830',
    },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: Spacing.xs,
        marginTop: Spacing.sm,
    },
    modeRow: {
        flexDirection: 'row',
        borderRadius: Radii.lg,
        borderWidth: 1,
        padding: 4,
        marginBottom: Spacing.md,
    },
    modeBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderRadius: Radii.md,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    modeIcon: {
        fontSize: 18,
        marginBottom: 2,
    },
    modeLabel: {
        fontSize: 11,
        fontWeight: FontWeight.medium,
    },
    controlCard: {
        marginBottom: Spacing.md,
    },
});
