// ============================================================
//  Composant : GarageCard
//  Contrôle motorisé de la porte de garage avec simulation temps-réel
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SmartIcon } from './SmartIcon';
import type { GarageState } from '../types/house';

export const GarageCard: React.FC = () => {
    const { colors, isDark } = useAppTheme();
    const garage = useHouseStore((s) => s.status?.garage);
    const setGarageState = useHouseStore((s) => s.setGarageState);
    const garageCommand = useHouseStore((s) => s.garageCommand);
    const user = useHouseStore((s) => s.user);

    if (!garage) return null;

    const isGuest = user?.role === 'guest';
    const isLoading = garageCommand.status === 'pending' || garage.state === 'opening' || garage.state === 'closing';

    const getStatusLabel = () => {
        switch (garage.state) {
            case 'open':
                return { text: 'Ouvert', color: colors.warning, bg: colors.warningDim };
            case 'opening':
                return { text: 'En cours d’ouverture...', color: colors.secondary, bg: colors.secondaryDim };
            case 'closing':
                return { text: 'En cours de fermeture...', color: colors.secondary, bg: colors.secondaryDim };
            case 'stopped':
                return { text: 'Arrêt intermédiaire', color: colors.warning, bg: colors.warningDim };
            case 'closed':
            default:
                return { text: garage.lock === 'locked' ? 'Fermé & Sécurisé' : 'Fermé', color: colors.success, bg: colors.primaryDim };
        }
    };

    const statusInfo = getStatusLabel();

    const handleAction = (targetState: GarageState) => {
        if (isGuest || isLoading) return;
        setGarageState(targetState);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            {/* En-tête */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <View style={[styles.iconWrap, { backgroundColor: colors.primaryDim }]}>
                        <SmartIcon name="garage" size={22} color={colors.primary} />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>Garage Motorisé</Text>
                        <Text style={[styles.subtitle, { color: colors.textSub }]}>
                            {garage.name} • {garage.motorStatus === 'active' ? 'Moteur sous tension' : 'En veille'}
                        </Text>
                    </View>
                </View>

                {/* Badge d'état */}
                <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.badgeText, { color: statusInfo.color }]}>
                        {statusInfo.text}
                    </Text>
                </View>
            </View>

            {/* Illustration visuelle d'ouverture */}
            <View style={[styles.visualArea, { backgroundColor: colors.surfaceAlt, borderColor: colors.surfaceBorder }]}>
                <View style={styles.doorRails}>
                    <View
                        style={[
                            styles.doorPanel,
                            {
                                backgroundColor: isDark ? '#334155' : '#CBD5E1',
                                height: garage.state === 'open' ? 14 : garage.state === 'closed' ? 56 : 35,
                                borderColor: colors.surfaceBorder,
                            },
                        ]}
                    >
                        <View style={styles.doorHandle} />
                    </View>
                </View>
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <SmartIcon name="battery" size={13} color={colors.textSub} />
                        <Text style={[styles.metaText, { color: colors.textSub }]}>
                            Télécommande : {garage.batteryLevel ?? 95}%
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <SmartIcon name="security" size={12} color={garage.lock === 'locked' ? colors.warning : colors.textSub} />
                        <Text style={[styles.metaText, { color: colors.textSub }]}>
                            {garage.lock === 'locked' ? 'Verrou de sûreté actif' : 'Non verrouillé'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Contrôles interactifs */}
            {isGuest ? (
                <View style={[styles.guestWarning, { backgroundColor: colors.surfaceAlt }]}>
                    <SmartIcon name="security" size={14} color={colors.textSub} />
                    <Text style={[styles.guestText, { color: colors.textSub }]}>
                        Action restreinte aux rôles Membre et Administrateur.
                    </Text>
                </View>
            ) : (
                <View style={styles.controlsRow}>
                    {garage.state === 'closed' ? (
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                            onPress={() => handleAction('open')}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <>
                                    <Text style={styles.actionBtnEmoji}>▲</Text>
                                    <Text style={styles.actionBtnText}>Ouvrir le Garage</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
                            onPress={() => handleAction('closed')}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <>
                                    <Text style={styles.actionBtnEmoji}>▼</Text>
                                    <Text style={styles.actionBtnText}>Fermer le Garage</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {(garage.state === 'opening' || garage.state === 'closing') && (
                        <TouchableOpacity
                            style={[styles.stopBtn, { backgroundColor: colors.dangerDim, borderColor: colors.danger }]}
                            onPress={() => handleAction('stopped')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.stopBtnText, { color: colors.danger }]}>Arrêter</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
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
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    iconWrap: {
        width: 38,
        height: 38,
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
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.full,
    },
    badgeText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    visualArea: {
        borderRadius: Radii.md,
        borderWidth: 1,
        padding: Spacing.sm,
        marginVertical: Spacing.xs,
    },
    doorRails: {
        height: 60,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#94A3B840',
        borderRadius: Radii.sm,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.06)',
    },
    doorPanel: {
        width: '100%',
        borderBottomWidth: 3,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 4,
    },
    doorHandle: {
        width: 32,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#64748B',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.xs,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    metaText: {
        fontSize: FontSize.xs,
    },
    controlsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: 12,
        borderRadius: Radii.md,
    },
    actionBtnEmoji: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    stopBtn: {
        paddingHorizontal: Spacing.md,
        justifyContent: 'center',
        borderRadius: Radii.md,
        borderWidth: 1,
    },
    stopBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    guestWarning: {
        padding: Spacing.sm,
        borderRadius: Radii.md,
        marginTop: Spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    guestText: {
        fontSize: FontSize.xs,
        fontStyle: 'italic',
    },
});
