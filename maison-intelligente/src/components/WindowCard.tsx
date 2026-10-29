// ============================================================
//  Composant : WindowCard
//  Affichage et bascule des fenêtres de la maison
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SmartIcon } from './SmartIcon';
import { Haptics } from '../utils/haptics';
import type { HouseWindow } from '../types/house';

interface WindowCardProps {
    window: HouseWindow;
}

export const WindowCard: React.FC<WindowCardProps> = ({ window }) => {
    const { colors } = useAppTheme();
    const toggleWindow = useHouseStore((s) => s.toggleWindow);
    const windowCommands = useHouseStore((s) => s.windowCommands);
    const user = useHouseStore((s) => s.user);

    const isGuest = user?.role === 'guest';
    const command = windowCommands[window.id];
    const isLoading = command?.status === 'pending';
    const isOpen = window.open ?? window.isOpen ?? false;

    const handleToggle = () => {
        if (isGuest || isLoading) return;
        Haptics.toggle();
        toggleWindow(window.id);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={styles.left}>
                <View
                    style={[
                        styles.iconWrap,
                        {
                            backgroundColor: isOpen ? colors.warningDim : colors.primaryDim,
                        },
                    ]}
                >
                    <SmartIcon name="window" size={20} color={isOpen ? colors.warning : colors.primary} />
                </View>
                <View style={styles.textWrap}>
                    <Text style={[styles.title, { color: colors.text }]}>{window.name}</Text>
                    <Text style={[styles.room, { color: colors.textSub }]}>{window.room}</Text>
                </View>
            </View>

            <View style={styles.right}>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: isOpen ? colors.warningDim : colors.surfaceAlt,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            {
                                color: isOpen ? colors.warning : colors.textSub,
                            },
                        ]}
                    >
                        {isOpen ? 'Ouverte' : 'Fermée'}
                    </Text>
                </View>

                {!isGuest && (
                    <TouchableOpacity
                        style={[
                            styles.toggleBtn,
                            {
                                backgroundColor: isOpen ? colors.warning : colors.surfaceAlt,
                                borderColor: colors.surfaceBorder,
                            },
                        ]}
                        onPress={handleToggle}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={isOpen ? '#FFF' : colors.text} />
                        ) : (
                            <Text
                                style={[
                                    styles.toggleBtnText,
                                    { color: isOpen ? '#FFF' : colors.text },
                                ]}
                            >
                                {isOpen ? 'Fermer' : 'Ouvrir'}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
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
        width: 42,
        height: 42,
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 22,
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    room: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    statusBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.full,
    },
    statusText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
    },
    toggleBtn: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: Radii.sm,
        borderWidth: 1,
        minWidth: 70,
        alignItems: 'center',
    },
    toggleBtnText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
});
