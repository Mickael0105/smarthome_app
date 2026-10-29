// ============================================================
//  Composant : GarageCard — Contrôle Motorisé iOS 18
//  Animation réaliste de porte sectionnelle montante/descendante
//  Repères visuels universels (voiture, lattes, flèches montantes)
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Easing,
} from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SmartIcon } from './SmartIcon';
import { Haptics } from '../utils/haptics';
import type { GarageState } from '../types/house';

export const GarageCard: React.FC = () => {
    const { colors, isDark } = useAppTheme();
    const garage = useHouseStore((s) => s.status?.garage);
    const setGarageState = useHouseStore((s) => s.setGarageState);
    const garageCommand = useHouseStore((s) => s.garageCommand);
    const user = useHouseStore((s) => s.user);

    // Animation de position de la porte : 0 = totalement fermée (hauteur max), 1 = totalement ouverte (enroulée)
    const doorOpenProgress = useRef(new Animated.Value(garage?.state === 'open' ? 1 : 0)).current;
    // Animation du moteur actif (pulsation des flèches)
    const motorPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!garage) return;

        if (garage.state === 'opening') {
            // Animation progressive de montée (2.5 secondes)
            Animated.timing(doorOpenProgress, {
                toValue: 1,
                duration: 2500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: false,
            }).start();
        } else if (garage.state === 'closing') {
            // Animation progressive de descente
            Animated.timing(doorOpenProgress, {
                toValue: 0,
                duration: 2500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: false,
            }).start();
        } else if (garage.state === 'open') {
            doorOpenProgress.setValue(1);
        } else if (garage.state === 'closed') {
            doorOpenProgress.setValue(0);
        }
    }, [garage?.state]);

    // Pulsation moteur quand actif
    useEffect(() => {
        if (garage?.motorStatus === 'active') {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(motorPulse, {
                        toValue: 1.25,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(motorPulse, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [garage?.motorStatus]);

    if (!garage) return null;

    const isGuest = user?.role === 'guest';
    const isMoving = garage.state === 'opening' || garage.state === 'closing';
    const isLoading = garageCommand.status === 'pending' || isMoving;

    const handleAction = (targetState: GarageState) => {
        if (isGuest) {
            Haptics.warning();
            return;
        }
        Haptics.toggle();
        setGarageState(targetState);
    };

    // Hauteur de la porte animée (80px fermé -> 12px ouvert)
    const doorHeight = doorOpenProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [78, 12],
    });

    return (
        <View style={[styles.card, Shadows.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            {/* En-tête iOS avec badge d'icône parlant */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.iconBadge,
                            {
                                backgroundColor: garage.state === 'open'
                                    ? '#F59E0B'
                                    : garage.state === 'closed'
                                    ? colors.primary
                                    : colors.secondary,
                            },
                        ]}
                    >
                        <SmartIcon name="garage" size={26} color="#FFFFFF" />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>Porte de Garage</Text>
                        <Text style={[styles.subtitle, { color: colors.textSub }]}>
                            {garage.state === 'closed'
                                ? 'Fermé et sécurisé'
                                : garage.state === 'open'
                                ? 'Ouvert — Passage libre'
                                : garage.state === 'opening'
                                ? 'Ouverture motorisée en cours…'
                                : 'Fermeture en cours…'}
                        </Text>
                    </View>
                </View>

                {/* État visuel très coloré (Vert, Orange ou Bleu) */}
                <View
                    style={[
                        styles.statusPill,
                        {
                            backgroundColor: garage.state === 'closed'
                                ? colors.primaryDim
                                : garage.state === 'open'
                                ? colors.warningDim
                                : colors.secondaryDim,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusPillText,
                            {
                                color: garage.state === 'closed'
                                    ? colors.primary
                                    : garage.state === 'open'
                                    ? colors.warning
                                    : colors.secondary,
                            },
                        ]}
                    >
                        {garage.state === 'closed'
                            ? 'SÉCURISÉ'
                            : garage.state === 'open'
                            ? 'OUVERT'
                            : 'MOTEUR ACTIF'}
                    </Text>
                </View>
            </View>

            {/* Animation Visuelle 3D de la Baie de Garage (Compréhensible sans texte) */}
            <View style={[styles.garageViewport, { backgroundColor: isDark ? '#0A0D18' : '#E2E8F0', borderColor: colors.surfaceBorder }]}>
                {/* Silhouette de voiture garée à l'intérieur (visible quand la porte monte) */}
                <View style={styles.interiorView}>
                    <View style={styles.carSilhouette}>
                        <View style={[styles.carRoof, { backgroundColor: isDark ? '#334155' : '#94A3B8' }]} />
                        <View style={[styles.carBody, { backgroundColor: isDark ? '#1E293B' : '#64748B' }]}>
                            <View style={styles.carHeadlightLeft} />
                            <View style={styles.carHeadlightRight} />
                        </View>
                    </View>
                </View>

                {/* Rails latéraux */}
                <View style={[styles.railLeft, { backgroundColor: isDark ? '#1E293B' : '#CBD5E1' }]} />
                <View style={[styles.railRight, { backgroundColor: isDark ? '#1E293B' : '#CBD5E1' }]} />

                {/* Porte sectionnelle qui monte / descend physiquement */}
                <Animated.View
                    style={[
                        styles.animatedDoor,
                        {
                            height: doorHeight,
                            backgroundColor: isDark ? '#334155' : '#CBD5E1',
                            borderColor: isDark ? '#475569' : '#94A3B8',
                        },
                    ]}
                >
                    {/* Lattes horizontales de la porte de garage */}
                    <View style={[styles.slat, { borderBottomColor: isDark ? '#1E293B' : '#94A3B8' }]} />
                    <View style={[styles.slat, { borderBottomColor: isDark ? '#1E293B' : '#94A3B8' }]} />
                    <View style={[styles.slat, { borderBottomColor: isDark ? '#1E293B' : '#94A3B8' }]} />
                    <View style={styles.doorHandleBar} />
                </Animated.View>

                {/* Indicateur dynamique de flèche montante si le garage s'ouvre */}
                {garage.state === 'opening' && (
                    <Animated.View style={[styles.motionOverlay, { transform: [{ scale: motorPulse }] }]}>
                        <Text style={styles.arrowBig}>▲</Text>
                    </Animated.View>
                )}
                {garage.state === 'closing' && (
                    <Animated.View style={[styles.motionOverlay, { transform: [{ scale: motorPulse }] }]}>
                        <Text style={styles.arrowBig}>▼</Text>
                    </Animated.View>
                )}
            </View>

            {/* Boutons d'Action Clairs et Immédiats (Grosses icônes universelles) */}
            {isGuest ? (
                <View style={[styles.lockWarning, { backgroundColor: colors.surfaceAlt }]}>
                    <SmartIcon name="security" size={16} color={colors.textSub} />
                    <Text style={[styles.lockWarningText, { color: colors.textSub }]}>
                        Commande réservée aux membres et administrateurs.
                    </Text>
                </View>
            ) : (
                <View style={styles.buttonsRow}>
                    {garage.state === 'closed' ? (
                        <TouchableOpacity
                            style={[styles.bigButton, { backgroundColor: colors.primary }]}
                            onPress={() => handleAction('open')}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <View style={styles.buttonContent}>
                                    <View style={styles.actionIconCircle}>
                                        <Text style={styles.buttonArrow}>▲</Text>
                                    </View>
                                    <Text style={styles.buttonLabel}>Ouvrir le Garage</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.bigButton, { backgroundColor: colors.secondary }]}
                            onPress={() => handleAction('closed')}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <View style={styles.buttonContent}>
                                    <View style={styles.actionIconCircle}>
                                        <Text style={styles.buttonArrow}>▼</Text>
                                    </View>
                                    <Text style={styles.buttonLabel}>Fermer le Garage</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* Bouton Arrêt d'urgence si en mouvement */}
                    {isMoving && (
                        <TouchableOpacity
                            style={[styles.stopButton, { backgroundColor: colors.dangerDim, borderColor: colors.danger }]}
                            onPress={() => handleAction('stopped')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.stopText, { color: colors.danger }]}>STOP</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: Spacing.md + 2,
        marginBottom: Spacing.md,
        borderWidth: 1.5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        flex: 1,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        letterSpacing: -0.2,
    },
    subtitle: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    statusPill: {
        paddingHorizontal: Spacing.sm + 4,
        paddingVertical: 5,
        borderRadius: Radii.full,
    },
    statusPillText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.8,
    },
    garageViewport: {
        height: 100,
        borderRadius: Radii.lg,
        borderWidth: 1.5,
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    interiorView: {
        position: 'absolute',
        bottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    carSilhouette: {
        alignItems: 'center',
    },
    carRoof: {
        width: 48,
        height: 18,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    carBody: {
        width: 80,
        height: 24,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    carHeadlightLeft: {
        width: 8,
        height: 6,
        borderRadius: 2,
        backgroundColor: '#FDE047',
    },
    carHeadlightRight: {
        width: 8,
        height: 6,
        borderRadius: 2,
        backgroundColor: '#FDE047',
    },
    railLeft: {
        position: 'absolute',
        left: 10,
        top: 0,
        bottom: 0,
        width: 4,
    },
    railRight: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        width: 4,
    },
    animatedDoor: {
        width: '88%',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderWidth: 1,
        borderTopWidth: 0,
        overflow: 'hidden',
    },
    slat: {
        height: 18,
        borderBottomWidth: 1,
    },
    doorHandleBar: {
        position: 'absolute',
        bottom: 3,
        alignSelf: 'center',
        width: 28,
        height: 3,
        backgroundColor: '#0F172A',
        borderRadius: 2,
    },
    motionOverlay: {
        position: 'absolute',
        top: 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowBig: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    bigButton: {
        flex: 1,
        height: 52,
        borderRadius: Radii.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    actionIconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonArrow: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    buttonLabel: {
        color: '#FFFFFF',
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    stopButton: {
        width: 75,
        height: 52,
        borderRadius: Radii.lg,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stopText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    lockWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.sm,
        borderRadius: Radii.md,
    },
    lockWarningText: {
        fontSize: FontSize.xs,
    },
});
