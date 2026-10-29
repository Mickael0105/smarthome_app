// ============================================================
//  Composant : TempChartWidget
//  Graphique 24h de température et consigne (Pur React Native)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';

export const TempChartWidget: React.FC = () => {
    const { colors, isDark } = useAppTheme();
    const history = useHouseStore((s) => s.status?.tempHistory ?? s.status?.temperatureHistory);
    const rawTemp = useHouseStore((s) => s.status?.temperature);
    const currentTemp = typeof rawTemp === 'number' ? rawTemp : (rawTemp?.value ?? 21.5);
    const setpoint = useHouseStore((s) => s.status?.setpoint) ?? 20;

    if (!history || history.length === 0) return null;

    // Calculs statistiques
    const temps: number[] = history.map((h: any) => h.temp);
    const minTemp = temps.length > 0 ? Math.min(...temps) : 18;
    const maxTemp = temps.length > 0 ? Math.max(...temps) : 24;
    const avgTemp = temps.length > 0 ? (temps.reduce((a: number, b: number) => a + b, 0) / temps.length).toFixed(1) : '21.0';

    // Échelle visuelle pour les barres (plage normalisée entre 15°C et 30°C)
    const scaleBase = 15;
    const scaleMax = 30;
    const calcHeightPercent = (val: number) => {
        const clamped = Math.max(scaleBase, Math.min(scaleMax, val));
        return Math.round(((clamped - scaleBase) / (scaleMax - scaleBase)) * 100);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            {/* En-tête */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>Historique Thermique 24h</Text>
                    <Text style={[styles.subtitle, { color: colors.textSub }]}>
                        Évolution de la température intérieure vs consigne ({setpoint}°C)
                    </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.primaryDim }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{currentTemp.toFixed(1)}°C actuel</Text>
                </View>
            </View>

            {/* Statistiques rapides */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSub }]}>Min</Text>
                    <Text style={[styles.statValue, { color: colors.secondary }]}>{minTemp}°C</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSub }]}>Moyenne</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{avgTemp}°C</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSub }]}>Max</Text>
                    <Text style={[styles.statValue, { color: colors.danger }]}>{maxTemp}°C</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSub }]}>Consigne</Text>
                    <Text style={[styles.statValue, { color: colors.primary }]}>{setpoint}°C</Text>
                </View>
            </View>

            {/* Zone graphique à barres stylisées */}
            <View style={[styles.chartContainer, { backgroundColor: colors.surfaceAlt }]}>
                {/* Ligne repère de la consigne */}
                <View
                    style={[
                        styles.targetLine,
                        {
                            bottom: `${calcHeightPercent(setpoint)}%`,
                            borderColor: colors.primary,
                        },
                    ]}
                >
                    <Text style={[styles.targetLabel, { color: colors.primary }]}>Cible {setpoint}°</Text>
                </View>

                {/* Barres par heure */}
                <View style={styles.barsArea}>
                    {history.map((item: any, idx: number) => {
                        const heightPct = calcHeightPercent(item.temp);
                        const isCloseToTarget = Math.abs(item.temp - setpoint) <= 0.5;
                        const isHotter = item.temp > setpoint;

                        return (
                            <View key={idx} style={styles.barCol}>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${heightPct}%`,
                                                backgroundColor: isCloseToTarget
                                                    ? colors.primary
                                                    : isHotter
                                                    ? colors.warning
                                                    : colors.secondary,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.hourLabel, { color: colors.textSub }]}>{item.time}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Légende */}
            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.legendText, { color: colors.textSub }]}>Conforme consigne</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                    <Text style={[styles.legendText, { color: colors.textSub }]}>Frais</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                    <Text style={[styles.legendText, { color: colors.textSub }]}>Chaud</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Radii.lg,
        borderWidth: 1,
        padding: Spacing.md,
        marginVertical: Spacing.xs,
        ...Shadows.card,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    title: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    subtitle: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.full,
    },
    badgeText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#94A3B825',
    },
    chartContainer: {
        height: 150,
        borderRadius: Radii.md,
        paddingHorizontal: Spacing.xs,
        paddingTop: Spacing.sm,
        position: 'relative',
        justifyContent: 'flex-end',
    },
    targetLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        zIndex: 2,
        alignItems: 'flex-end',
        paddingRight: 6,
    },
    targetLabel: {
        fontSize: 9,
        fontWeight: FontWeight.bold,
        top: -12,
    },
    barsArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '85%',
        zIndex: 1,
    },
    barCol: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
    },
    barWrapper: {
        width: '100%',
        alignItems: 'center',
        height: '85%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '55%',
        minWidth: 8,
        maxWidth: 16,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    hourLabel: {
        fontSize: 9,
        marginTop: 4,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 11,
    },
});
