// ============================================================
//  Composant : RoomCard
//  Carte de pièce avec dégradé Philips Hue + switch on/off
//  Supporte le Mode Sombre & Mode Clair
// ============================================================

import React from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Radii, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { useAppTheme } from '../hooks/useAppTheme';
import { SmartIcon, SmartIconName } from './SmartIcon';
import type { Light, CommandState } from '../types/house';

interface RoomCardProps {
    light: Light;
    commandState: CommandState;
    onToggle: (newState: 'on' | 'off') => void;
    onRetry?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
    light,
    commandState,
    onToggle,
    onRetry,
}) => {
    const { colors, isDark } = useAppTheme();

    const ROOM_GRADIENTS: Record<string, readonly [string, string]> = {
        salon: colors.rooms.salon,
        chambre: colors.rooms.chambre,
        cuisine: colors.rooms.cuisine,
        jardin: colors.rooms.jardin,
        garage: colors.rooms.garage,
    };
    const defaultGradient = colors.rooms.default;

    const gradient = ROOM_GRADIENTS[light.id] ?? defaultGradient;
    const isOn = light.state === 'on';
    const isPending = commandState.status === 'pending';
    const isError = commandState.status === 'error';

    // Icônes vectorielles architecturales sur-mesure par pièce
    const ROOM_ICONS: Record<string, SmartIconName> = {
        salon: 'sofa',
        chambre: 'bed',
        cuisine: 'kitchen',
        jardin: 'garden',
        garage: 'garage',
    };
    const iconName: SmartIconName = ROOM_ICONS[light.id] ?? 'light';

    const offColors: readonly [string, string] = isDark
        ? ['#1E2238', '#16192E']
        : ['#E2E8F0', '#CBD5E1'];

    return (
        <LinearGradient
            colors={isOn ? gradient : offColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, Shadows.card]}
        >
            {/* En-tête de la carte */}
            <View style={styles.header}>
                <View
                    style={[
                        styles.iconWrapper,
                        {
                            backgroundColor: isOn
                                ? 'rgba(255,255,255,0.22)'
                                : isDark
                                ? 'rgba(255,255,255,0.08)'
                                : 'rgba(0,0,0,0.06)',
                        },
                    ]}
                >
                    <SmartIcon
                        name={iconName}
                        size={22}
                        color={isOn ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
                    />
                </View>
                <View style={styles.info}>
                    <Text
                        style={[
                            styles.name,
                            { color: isOn ? '#FFFFFF' : colors.text },
                        ]}
                    >
                        {light.name}
                    </Text>
                    <Text
                        style={[
                            styles.sub,
                            {
                                color: isOn
                                    ? 'rgba(255,255,255,0.85)'
                                    : colors.textSub,
                            },
                        ]}
                    >
                        {isPending
                            ? 'En cours…'
                            : isError
                            ? 'Erreur'
                            : isOn
                            ? 'Allumée'
                            : 'Éteinte'}
                    </Text>
                </View>
                {isPending ? (
                    <ActivityIndicator color={isOn ? '#FFFFFF' : colors.text} size="small" />
                ) : (
                    <Switch
                        value={isOn}
                        onValueChange={(v) => onToggle(v ? 'on' : 'off')}
                        trackColor={{
                            false: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                            true: colors.primary,
                        }}
                        thumbColor="#FFFFFF"
                        disabled={isPending}
                    />
                )}
            </View>

            {/* Message d'erreur + Réessayer */}
            {isError && (
                <View style={[styles.errorRow, { backgroundColor: colors.dangerDim }]}>
                    <Text style={[styles.errorText, { color: colors.danger }]} numberOfLines={2}>
                        {commandState.errorMessage ?? 'Une erreur est survenue'}
                    </Text>
                    {onRetry && (
                        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.danger }]} onPress={onRetry}>
                            <Text style={styles.retryText}>Réessayer</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Radii.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md + 2,
        marginBottom: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 22,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    sub: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    errorRow: {
        marginTop: Spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.sm,
        borderRadius: Radii.md,
        padding: Spacing.sm,
    },
    errorText: {
        fontSize: FontSize.xs,
        flex: 1,
    },
    retryBtn: {
        paddingHorizontal: Spacing.sm + 4,
        paddingVertical: 5,
        borderRadius: Radii.sm,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
});
