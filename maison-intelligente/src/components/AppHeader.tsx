// ============================================================
//  Composant : AppHeader
//  En-tête d'écran dynamique avec Mode Sombre/Clair & Badge Connexion
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { FontSize, FontWeight, Spacing, Radii } from '../constants/theme';
import { ConnectionBadge } from './ConnectionBadge';
import { SmartIcon } from './SmartIcon';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
    title: string;
    showBack?: boolean;
    showConnection?: boolean;
    showThemeToggle?: boolean;
    rightElement?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBack = false,
    showConnection = true,
    showThemeToggle = true,
    rightElement,
}) => {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, borderBottomColor: colors.surfaceBorder }]}>
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.backArrow, { color: colors.text }]}>‹</Text>
                    </TouchableOpacity>
                )}
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {title}
                </Text>
            </View>

            <View style={styles.right}>
                {showThemeToggle && (
                    <TouchableOpacity
                        style={[styles.themeBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={toggleTheme}
                        activeOpacity={0.7}
                        accessibilityLabel="Changer de mode d'affichage"
                    >
                        <SmartIcon name={isDark ? 'sun' : 'moon'} size={18} color={isDark ? '#F59E0B' : '#6366F1'} />
                    </TouchableOpacity>
                )}

                {showConnection && <ConnectionBadge />}

                {rightElement}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backBtn: {
        marginRight: Spacing.sm,
        width: 34,
        height: 34,
        borderRadius: Radii.full,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        fontSize: 24,
        lineHeight: 28,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        flex: 1,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    themeBtn: {
        width: 34,
        height: 34,
        borderRadius: Radii.full,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeEmoji: {
        fontSize: 16,
    },
});
