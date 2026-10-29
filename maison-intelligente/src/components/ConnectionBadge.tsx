// ============================================================
//  Composant : ConnectionBadge
//  Indicateur d'état réseau et connexion (Connecté / Déconnecté / En cours)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontSize, FontWeight, Radii, Spacing } from '../constants/theme';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';

export const ConnectionBadge: React.FC = () => {
    const { colors } = useAppTheme();
    const connectionStatus = useHouseStore((s) => s.connectionStatus);

    const config = {
        connected: {
            label: 'En ligne',
            dot: colors.primary,
            bg: colors.primaryDim,
            text: colors.primary,
        },
        disconnected: {
            label: 'Hors-ligne',
            dot: colors.danger,
            bg: colors.dangerDim,
            text: colors.danger,
        },
        connecting: {
            label: 'Connexion…',
            dot: colors.warning,
            bg: colors.warningDim,
            text: colors.warning,
        },
    }[connectionStatus];

    return (
        <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <View style={[styles.dot, { backgroundColor: config.dot }]} />
            <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.full,
        gap: 5,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: Radii.full,
    },
    label: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        letterSpacing: 0.2,
    },
});
