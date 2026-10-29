// ============================================================
//  Composant : MotionCard
//  Détecteur de mouvement PIR avec bouton de simulation (Soutenance)
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SmartIcon } from './SmartIcon';
import type { MotionSensor } from '../types/house';

interface MotionCardProps {
    sensor: MotionSensor;
}

export const MotionCard: React.FC<MotionCardProps> = ({ sensor }) => {
    const { colors } = useAppTheme();
    const simulateMotion = useHouseStore((s) => s.simulateMotion);

    const handleSimulate = () => {
        simulateMotion(sensor.id);
    };

    const isDetected = sensor.detected ?? sensor.motionDetected ?? false;

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={styles.left}>
                <View
                    style={[
                        styles.iconWrap,
                        {
                            backgroundColor: isDetected ? colors.dangerDim : colors.primaryDim,
                        },
                    ]}
                >
                    <SmartIcon
                        name={isDetected ? 'alert' : 'motion'}
                        size={20}
                        color={isDetected ? colors.danger : colors.primary}
                    />
                </View>
                <View style={styles.info}>
                    <Text style={[styles.title, { color: colors.text }]}>{sensor.name}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSub }]}>
                        {sensor.room} • {sensor.batteryLevel ?? 98}% batt.
                    </Text>
                    {sensor.lastDetected && (
                        <Text style={[styles.time, { color: colors.textSub }]}>
                            Dernier mvt : {new Date(sensor.lastDetected).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.right}>
                <View
                    style={[
                        styles.badge,
                        {
                            backgroundColor: isDetected ? colors.dangerDim : colors.surfaceAlt,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.badgeText,
                            { color: isDetected ? colors.danger : colors.textSub },
                        ]}
                    >
                        {isDetected ? 'MOUVEMENT DÉTECTÉ' : 'Calme'}
                    </Text>
                </View>

                {/* Bouton de simulation directe (très utile lors de la soutenance) */}
                <TouchableOpacity
                    style={[styles.simBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.surfaceBorder }]}
                    onPress={handleSimulate}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.simBtnText, { color: colors.text }]}>Tester</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: Radii.md,
        borderWidth: 1,
        padding: Spacing.md,
        marginVertical: 4,
        ...Shadows.card,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 20,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
    subtitle: {
        fontSize: 11,
        marginTop: 2,
    },
    time: {
        fontSize: 10,
        marginTop: 1,
    },
    right: {
        alignItems: 'flex-end',
        gap: 6,
    },
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radii.full,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
    },
    simBtn: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.sm,
        borderWidth: 1,
    },
    simBtnText: {
        fontSize: 10,
        fontWeight: FontWeight.semibold,
    },
});
