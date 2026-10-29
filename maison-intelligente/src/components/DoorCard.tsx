// ============================================================
//  Composant : DoorCard
//  Affiche l'état d'une porte (verrou + ouverte/fermée)
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Radii, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { useAppTheme } from '../hooks/useAppTheme';
import { useHouseStore } from '../store/useHouseStore';
import { SmartIcon } from './SmartIcon';
import type { Door } from '../types/house';

interface DoorCardProps {
    door: Door;
}

export const DoorCard: React.FC<DoorCardProps> = ({ door }) => {
    const { colors } = useAppTheme();
    const simulateDoorToggle = useHouseStore((s) => s.simulateDoorToggle);
    const isOpen = door.open;
    const isLocked = door.lock === 'locked';

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                },
                Shadows.card,
            ]}
        >
            {/* Icône + nom */}
            <View style={styles.left}>
                <View
                    style={[
                        styles.iconBadge,
                        {
                            backgroundColor: isOpen ? colors.dangerDim : colors.primaryDim,
                            borderColor: isOpen ? `${colors.danger}44` : `${colors.primary}44`,
                        },
                    ]}
                >
                    <SmartIcon
                        name={isOpen ? 'door-open' : 'door'}
                        size={24}
                        color={isOpen ? colors.danger : colors.primary}
                    />
                </View>
                <View style={styles.nameWrap}>
                    <Text style={[styles.name, { color: colors.text }]}>{door.name}</Text>
                    <View style={styles.badges}>
                        {/* Badge ouvert / fermé */}
                        <View
                            style={[
                                styles.badge,
                                { backgroundColor: isOpen ? colors.dangerDim : colors.primaryDim },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.badgeText,
                                    { color: isOpen ? colors.danger : colors.primary },
                                ]}
                            >
                                {isOpen ? 'Ouverte' : 'Fermée'}
                            </Text>
                        </View>

                        {/* Badge verrouillé / déverrouillé */}
                        <View
                            style={[
                                styles.badge,
                                {
                                    backgroundColor: isLocked
                                        ? colors.warningDim
                                        : colors.secondaryDim,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                },
                            ]}
                        >
                            <SmartIcon
                                name="security"
                                size={11}
                                color={isLocked ? colors.warning : colors.secondary}
                            />
                            <Text
                                style={[
                                    styles.badgeText,
                                    {
                                        color: isLocked ? colors.warning : colors.secondary,
                                    },
                                ]}
                            >
                                {isLocked ? 'Verrouillée' : 'Déverrouillée'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bouton de simulation d'ouverture/fermeture */}
            <View style={styles.right}>
                <TouchableOpacity
                    style={[
                        styles.toggleBtn,
                        {
                            backgroundColor: colors.surfaceAlt,
                            borderColor: colors.surfaceBorder,
                        },
                    ]}
                    onPress={() => simulateDoorToggle(door.id)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.toggleBtnText, { color: colors.textSub }]}>
                        {isOpen ? 'Fermer' : 'Ouvrir'}
                    </Text>
                </TouchableOpacity>

                {/* Indicateur d'état global */}
                <View
                    style={[
                        styles.statusDot,
                        {
                            backgroundColor: isOpen
                                ? colors.danger
                                : isLocked
                                ? colors.warning
                                : colors.primary,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Radii.lg,
        borderWidth: 1,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        flex: 1,
    },
    iconBadge: {
        width: 44,
        height: 44,
        borderRadius: Radii.md,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameWrap: {
        flex: 1,
    },
    name: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    badges: {
        flexDirection: 'row',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
        flexWrap: 'wrap',
    },
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radii.full,
    },
    badgeText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    toggleBtn: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 5,
        borderRadius: Radii.sm,
        borderWidth: 1,
    },
    toggleBtnText: {
        fontSize: 11,
        fontWeight: FontWeight.medium,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: Radii.full,
    },
});
