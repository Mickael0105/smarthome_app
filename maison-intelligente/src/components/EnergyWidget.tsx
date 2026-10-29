// ============================================================
//  Composant : EnergyWidget
//  Suivi énergétique en temps réel, éco-score et puissance (W/kWh)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SmartIcon } from './SmartIcon';

export const EnergyWidget: React.FC = () => {
    const { colors } = useAppTheme();
    const energy = useHouseStore((s) => s.status?.energy);

    if (!energy) return null;

    const getScoreBadgeColor = (score: string) => {
        if (score.startsWith('A')) return colors.primary;
        if (score.startsWith('B')) return colors.secondary;
        if (score.startsWith('C')) return colors.warning;
        return colors.danger;
    };

    const scoreColor = getScoreBadgeColor(energy.ecoScore);

    const currentWatts = energy.currentWatts ?? energy.currentPowerW ?? 420;
    const dailyKWh = energy.dailyKWh ?? energy.dailyKwh ?? 3.4;
    const estimatedCost = energy.estimatedCostEur ?? dailyKWh * 0.25;

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            {/* Titre et Score */}
            <View style={styles.header}>
                <View style={styles.titleWrap}>
                    <View style={[styles.iconWrap, { backgroundColor: colors.primaryDim }]}>
                        <SmartIcon name="energy" size={20} color={colors.primary} />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>Gestion Énergétique</Text>
                        <Text style={[styles.subtitle, { color: colors.textSub }]}>
                            Temps réel & Bilan journalier
                        </Text>
                    </View>
                </View>

                <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '25', borderColor: scoreColor }]}>
                    <Text style={[styles.scoreLabel, { color: colors.textSub }]}>Score</Text>
                    <Text style={[styles.scoreValue, { color: scoreColor }]}>{energy.ecoScore}</Text>
                </View>
            </View>

            {/* Chiffres clés */}
            <View style={styles.statsGrid}>
                <View style={[styles.statBox, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.statLabel, { color: colors.textSub }]}>Puissance instantanée</Text>
                    <View style={styles.valRow}>
                        <Text style={[styles.statVal, { color: colors.text }]}>{currentWatts}</Text>
                        <Text style={[styles.unit, { color: colors.primary }]}>W</Text>
                    </View>
                </View>

                <View style={[styles.statBox, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.statLabel, { color: colors.textSub }]}>Consommation du jour</Text>
                    <View style={styles.valRow}>
                        <Text style={[styles.statVal, { color: colors.text }]}>{dailyKWh.toFixed(2)}</Text>
                        <Text style={[styles.unit, { color: colors.secondary }]}>kWh</Text>
                    </View>
                </View>

                <View style={[styles.statBox, { backgroundColor: colors.surfaceAlt }]}>
                    <Text style={[styles.statLabel, { color: colors.textSub }]}>Coût estimé (jour)</Text>
                    <View style={styles.valRow}>
                        <Text style={[styles.statVal, { color: colors.text }]}>{estimatedCost.toFixed(2)}</Text>
                        <Text style={[styles.unit, { color: colors.warning }]}>€</Text>
                    </View>
                </View>
            </View>

            {/* Jauge visuelle de charge */}
            <View style={styles.gaugeContainer}>
                <View style={styles.gaugeHeader}>
                    <Text style={[styles.gaugeTitle, { color: colors.textSub }]}>Charge actuelle du réseau domestique</Text>
                    <Text style={[styles.gaugePercent, { color: colors.text }]}>
                        {Math.min(100, Math.round((currentWatts / 3000) * 100))}% (max 3 kW)
                    </Text>
                </View>
                <View style={[styles.gaugeTrack, { backgroundColor: colors.surfaceAlt }]}>
                    <View
                        style={[
                            styles.gaugeFill,
                            {
                                width: `${Math.min(100, Math.round((currentWatts / 3000) * 100))}%`,
                                backgroundColor: currentWatts > 2000 ? colors.danger : colors.primary,
                            },
                        ]}
                    />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    subtitle: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    scoreBadge: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.md,
        borderWidth: 1,
    },
    scoreLabel: {
        fontSize: 9,
        textTransform: 'uppercase',
        fontWeight: FontWeight.semibold,
    },
    scoreValue: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.extrabold,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: Spacing.xs,
        marginVertical: Spacing.xs,
    },
    statBox: {
        flex: 1,
        padding: Spacing.sm,
        borderRadius: Radii.md,
    },
    statLabel: {
        fontSize: 10,
        marginBottom: 4,
    },
    valRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 3,
    },
    statVal: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.extrabold,
    },
    unit: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    gaugeContainer: {
        marginTop: Spacing.xs,
    },
    gaugeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    gaugeTitle: {
        fontSize: 11,
    },
    gaugePercent: {
        fontSize: 11,
        fontWeight: FontWeight.semibold,
    },
    gaugeTrack: {
        height: 6,
        borderRadius: Radii.full,
        overflow: 'hidden',
    },
    gaugeFill: {
        height: '100%',
        borderRadius: Radii.full,
    },
});
