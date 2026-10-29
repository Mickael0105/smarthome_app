// ============================================================
//  Composant : UnavailableState
//  Affichage "Indisponible" ou "donnée ancienne" (Règles 2 et 3)
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing, FontSize, FontWeight } from '../constants/theme';
import { SmartIcon, SmartIconName } from './SmartIcon';

type Variant = 'unavailable' | 'stale' | 'loading' | 'error';
type ConfigEntry = { icon: SmartIconName; defaultLabel: string; color: string; bg: string };

const VARIANT_CONFIG: Record<Variant, ConfigEntry> = {
    unavailable: {
        icon: 'power',
        defaultLabel: 'Indisponible',
        color: Colors.textDisabled,
        bg: Colors.surfaceBorder,
    },
    stale: {
        icon: 'history',
        defaultLabel: 'Donnée ancienne',
        color: Colors.warning,
        bg: Colors.warningDim,
    },
    loading: {
        icon: 'sync',
        defaultLabel: 'Chargement…',
        color: Colors.textSub,
        bg: Colors.surface,
    },
    error: {
        icon: 'alert',
        defaultLabel: 'Erreur de connexion',
        color: Colors.danger,
        bg: Colors.dangerDim,
    },
};

interface UnavailableStateProps {
    variant?: Variant;
    label?: string;
    /** Message d'erreur optionnel (pour variant="error") */
    errorMessage?: string;
    /** Bouton Réessayer (affiché si onRetry est défini) */
    onRetry?: () => void;
    compact?: boolean;
}

export const UnavailableState: React.FC<UnavailableStateProps> = ({
    variant = 'unavailable',
    label,
    errorMessage,
    onRetry,
    compact = false,
}) => {
    const config: ConfigEntry = VARIANT_CONFIG[variant];

    if (compact) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <SmartIcon name={config.icon} size={12} color={config.color} />
                <Text style={[styles.compactText, { color: config.color }]}>
                    {label ?? config.defaultLabel}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: config.bg }]}>
            <View style={styles.iconWrap}>
                <SmartIcon name={config.icon} size={16} color={config.color} />
            </View>
            <View style={styles.textWrapper}>
                <Text style={[styles.label, { color: config.color }]}>
                    {label ?? config.defaultLabel}
                </Text>
                {variant === 'error' && errorMessage && (
                    <Text style={styles.errorMsg}>{errorMessage}</Text>
                )}
            </View>
            {onRetry && (
                <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
        borderRadius: Radii.lg,
    },
    iconWrap: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWrapper: {
        flex: 1,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    errorMsg: {
        color: Colors.danger,
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    retryBtn: {
        backgroundColor: Colors.danger,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: Radii.md,
    },
    retryText: {
        color: Colors.text,
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    compactText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
});
