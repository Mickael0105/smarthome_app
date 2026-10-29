// ============================================================
//  Composant : RoomCard — Style Apple HomeKit (iOS 18)
//  Animation progressive d'allumage, lueur ambiante, retour haptique
//  Icônes et repères visuels compréhensibles sans lire de texte
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Radii, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { useAppTheme } from '../hooks/useAppTheme';
import { SmartIcon, SmartIconName } from './SmartIcon';
import { Haptics } from '../utils/haptics';
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
    const isOn = light.state === 'on';
    const isPending = commandState.status === 'pending';
    const isError = commandState.status === 'error';

    // Animation progressive de l'éclairage (0 = éteint, 1 = allumé à 100%)
    const glowAnim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
    // Animation de press tactile (rebond iOS)
    const pressScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(glowAnim, {
            toValue: isOn ? 1 : 0,
            duration: 380,
            useNativeDriver: false,
        }).start();
    }, [isOn]);

    const handlePress = () => {
        if (isPending) return;
        Haptics.toggle();
        onToggle(isOn ? 'off' : 'on');
    };

    const handlePressIn = () => {
        Animated.spring(pressScale, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    // Icône spécifique selon la pièce
    const ROOM_ICONS: Record<string, SmartIconName> = {
        salon: 'sofa',
        chambre: 'bed',
        cuisine: 'kitchen',
        jardin: 'garden',
        garage: 'garage',
    };
    const roomIcon: SmartIconName = ROOM_ICONS[light.id] ?? 'light';

    // Interpolation des couleurs de carte pour l'effet d'allumage progressif
    const cardBgColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            isDark ? '#141829' : '#FFFFFF',
            isDark ? '#261F12' : '#FFFBEB',
        ],
    });

    const cardBorderColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            'rgba(245, 158, 11, 0.45)',
        ],
    });

    const iconBadgeBg = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
            '#F59E0B',
        ],
    });

    return (
        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                disabled={isPending}
            >
                <Animated.View
                    style={[
                        styles.card,
                        Shadows.card,
                        {
                            backgroundColor: cardBgColor,
                            borderColor: cardBorderColor,
                        },
                    ]}
                >
                    {/* Halo de diffusion lumineuse en arrière-plan (quand allumé) */}
                    <Animated.View
                        style={[
                            styles.ambientGlow,
                            {
                                opacity: glowAnim,
                                transform: [
                                    {
                                        scale: glowAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1.15],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />

                    <View style={styles.contentRow}>
                        {/* Badge Circulaire Iconique (Compréhensible sans savoir lire) */}
                        <Animated.View
                            style={[
                                styles.iconCircle,
                                {
                                    backgroundColor: iconBadgeBg,
                                },
                            ]}
                        >
                            {/* Ampoule éclatante ou icône de pièce */}
                            <SmartIcon
                                name={isOn ? 'light' : roomIcon}
                                size={26}
                                color={isOn ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                            />
                        </Animated.View>

                        {/* Informations texte (pour ceux qui lisent) & repères visuels */}
                        <View style={styles.textColumn}>
                            <View style={styles.titleRow}>
                                <Text
                                    style={[
                                        styles.roomTitle,
                                        { color: colors.text },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {light.name}
                                </Text>
                            </View>

                            {/* Repères visuels universels (Point lumineux vert/ambre ou éteint) */}
                            <View style={styles.statusIndicatorRow}>
                                <View
                                    style={[
                                        styles.statusDot,
                                        {
                                            backgroundColor: isPending
                                                ? colors.secondary
                                                : isError
                                                ? colors.danger
                                                : isOn
                                                ? '#F59E0B'
                                                : isDark
                                                ? '#475569'
                                                : '#94A3B8',
                                        },
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.statusLabel,
                                        {
                                            color: isOn
                                                ? '#D97706'
                                                : colors.textSub,
                                            fontWeight: isOn ? '700' : '500',
                                        },
                                    ]}
                                >
                                    {isPending
                                        ? 'Commande en cours…'
                                        : isError
                                        ? 'Erreur de liaison'
                                        : isOn
                                        ? `Allumé • ${light.powerWatts ?? 50} W`
                                        : 'Éteint'}
                                </Text>
                            </View>
                        </View>

                        {/* Bouton d'action / Switch visuel iOS */}
                        <View style={styles.switchWrapper}>
                            {isPending ? (
                                <ActivityIndicator color={colors.primary} size="small" />
                            ) : (
                                <View
                                    style={[
                                        styles.iosSwitchPill,
                                        {
                                            backgroundColor: isOn
                                                ? '#F59E0B'
                                                : isDark
                                                ? 'rgba(255,255,255,0.14)'
                                                : 'rgba(0,0,0,0.12)',
                                            borderColor: isOn
                                                ? '#D97706'
                                                : 'transparent',
                                        },
                                    ]}
                                >
                                    {/* Glyphe visuel universel de bouton Power ON/OFF */}
                                    <View
                                        style={[
                                            styles.switchThumb,
                                            {
                                                transform: [{ translateX: isOn ? 18 : 0 }],
                                                backgroundColor: '#FFFFFF',
                                            },
                                            Shadows.button,
                                        ]}
                                    >
                                        <SmartIcon
                                            name="power"
                                            size={12}
                                            color={isOn ? '#F59E0B' : '#94A3B8'}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Ligne d'erreur et tentative */}
                    {isError && (
                        <View style={[styles.errorBox, { backgroundColor: colors.dangerDim }]}>
                            <Text style={[styles.errorMsg, { color: colors.danger }]} numberOfLines={1}>
                                {commandState.errorMessage || 'Échec de transmission'}
                            </Text>
                            {onRetry && (
                                <TouchableOpacity
                                    style={[styles.retryPill, { backgroundColor: colors.danger }]}
                                    onPress={onRetry}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.retryText}>Réessayer</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 22,
        paddingHorizontal: Spacing.md + 2,
        paddingVertical: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1.5,
        overflow: 'hidden',
        position: 'relative',
    },
    ambientGlow: {
        position: 'absolute',
        top: -30,
        left: -30,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(245, 158, 11, 0.16)',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textColumn: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        letterSpacing: -0.2,
    },
    statusIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusLabel: {
        fontSize: FontSize.sm,
    },
    switchWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iosSwitchPill: {
        width: 52,
        height: 32,
        borderRadius: 16,
        padding: 3,
        justifyContent: 'center',
        borderWidth: 1,
    },
    switchThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorBox: {
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.sm + 4,
        paddingVertical: Spacing.xs + 2,
        borderRadius: Radii.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    errorMsg: {
        fontSize: FontSize.xs,
        flex: 1,
    },
    retryPill: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radii.sm,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
});
