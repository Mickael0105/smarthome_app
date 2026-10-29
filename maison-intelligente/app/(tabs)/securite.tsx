// ============================================================
//  Écran : Sécurité & Contrôle des Accès
//  Verrouillage central, Garage motorisé, Portes, Fenêtres & Détecteurs PIR
// ============================================================

import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHouseStore } from '../../src/store/useHouseStore';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../../src/constants/theme';
import { AppHeader } from '../../src/components/AppHeader';
import { GarageCard } from '../../src/components/GarageCard';
import { DoorCard } from '../../src/components/DoorCard';
import { WindowCard } from '../../src/components/WindowCard';
import { MotionCard } from '../../src/components/MotionCard';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { UnavailableState } from '../../src/components/UnavailableState';
import { SmartIcon } from '../../src/components/SmartIcon';

export default function SecuriteScreen() {
    const router = useRouter();
    const { colors, isDark } = useAppTheme();
    const status = useHouseStore((s) => s.status);
    const user = useHouseStore((s) => s.user);
    const isLoggedIn = useHouseStore((s) => s.isLoggedIn);
    const lock = useHouseStore((s) => s.lock);
    const unlock = useHouseStore((s) => s.unlock);
    const lockCommand = useHouseStore((s) => s.lockCommand);
    const unlockCommand = useHouseStore((s) => s.unlockCommand);
    const fetchStatus = useHouseStore((s) => s.fetchStatus);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const isGuest = user?.role === 'guest';
    const isLocked = status?.lock_mode === 'locked';
    const openDoors = status?.doors?.filter((d) => d.open) ?? [];
    const openWindows = status?.windows?.filter((w) => w.open || w.isOpen) ?? [];
    const hasOpenDoors = openDoors.length > 0;

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStatus();
        setRefreshing(false);
    };

    const handleLock = async () => {
        if (isGuest) {
            Alert.alert('Accès restreint', 'Le rôle Invité ne peut pas verrouiller ou déverrouiller la maison.');
            return;
        }
        if (hasOpenDoors) {
            const names = openDoors.map((d) => d.name).join(', ');
            Alert.alert(
                'Impossible de verrouiller',
                `${names} ${openDoors.length > 1 ? 'sont ouvertes' : 'est ouverte'}. Veuillez la fermer avant d'armer le système.`,
                [{ text: 'OK' }]
            );
            return;
        }
        await lock();
    };

    const handleUnlockPress = () => {
        if (isGuest) {
            Alert.alert('Accès restreint', 'Le rôle Invité ne peut pas déverrouiller la maison.');
            return;
        }
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        setShowUnlockModal(true);
    };

    const handleUnlockConfirm = async () => {
        setShowUnlockModal(false);
        await unlock();
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
            <AppHeader title="Sécurité & Périmètre" showConnection />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Carte de Verrouillage Centralisé */}
                <View
                    style={[
                        styles.lockCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: isLocked ? colors.warning : colors.primary,
                        },
                        Shadows.card,
                    ]}
                >
                    <View
                        style={[
                            styles.lockMedallion,
                            {
                                backgroundColor: isLocked ? colors.warningDim : colors.primaryDim,
                                borderColor: isLocked ? colors.warning : colors.primary,
                            },
                        ]}
                    >
                        <SmartIcon
                            name="security"
                            size={36}
                            color={isLocked ? colors.warning : colors.primary}
                        />
                    </View>
                    <Text style={[styles.lockTitle, { color: colors.text }]}>
                        {isLocked ? 'Système Armé & Verrouillé' : 'Système Déverrouillé'}
                    </Text>
                    <Text style={[styles.lockSub, { color: colors.textSub }]}>
                        {isLocked
                            ? 'Tous les accès périmétriques sont sous alarme active'
                            : hasOpenDoors
                            ? `Attention : ${openDoors.length} porte(s) ouverte(s)`
                            : openWindows.length > 0
                            ? `${openWindows.length} fenêtre(s) ouverte(s)`
                            : 'Maison accessible • Tous les ouvrants sont fermés'}
                    </Text>

                    <View style={styles.lockActions}>
                        {!isLocked ? (
                            <PrimaryButton
                                label={
                                    lockCommand.status === 'pending'
                                        ? 'Verrouillage…'
                                        : hasOpenDoors
                                        ? 'Impossible (porte ouverte)'
                                        : 'Verrouiller la maison'
                                }
                                onPress={handleLock}
                                loading={lockCommand.status === 'pending'}
                                disabled={hasOpenDoors || isGuest}
                                variant={hasOpenDoors ? 'ghost' : 'primary'}
                            />
                        ) : (
                            <PrimaryButton
                                label={unlockCommand.status === 'pending' ? 'Déverrouillage…' : 'Déverrouiller le domicile'}
                                onPress={handleUnlockPress}
                                loading={unlockCommand.status === 'pending'}
                                disabled={isGuest}
                                variant="danger"
                            />
                        )}
                    </View>

                    {/* Erreurs commandes */}
                    {lockCommand.status === 'error' && (
                        <UnavailableState
                            variant="error"
                            errorMessage={lockCommand.errorMessage}
                            onRetry={handleLock}
                        />
                    )}
                    {unlockCommand.status === 'error' && (
                        <UnavailableState
                            variant="error"
                            errorMessage={unlockCommand.errorMessage}
                            onRetry={handleUnlockConfirm}
                        />
                    )}
                </View>

                {/* Section : Porte de Garage Motorisée */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Porte de Garage Motorisée</Text>
                <GarageCard />

                {/* Section : Portes Principales */}
                <Text style={[styles.sectionTitle, { color: colors.textSub, marginTop: Spacing.md }]}>
                    Portes ({status?.doors?.length ?? 0})
                </Text>
                {status?.doors?.map((door) => (
                    <DoorCard key={door.id} door={door} />
                ))}

                {/* Section : Fenêtres & Baies Vitrées */}
                <Text style={[styles.sectionTitle, { color: colors.textSub, marginTop: Spacing.md }]}>
                    Fenêtres & Baies ({status?.windows?.length ?? 0})
                </Text>
                {status?.windows?.map((window) => (
                    <WindowCard key={window.id} window={window} />
                ))}

                {/* Section : Détecteurs de Mouvement (PIR) */}
                <Text style={[styles.sectionTitle, { color: colors.textSub, marginTop: Spacing.md }]}>
                    Capteurs de Présence PIR ({status?.motionSensors?.length ?? 0})
                </Text>
                {status?.motionSensors?.map((sensor) => (
                    <MotionCard key={sensor.id} sensor={sensor} />
                ))}

                {/* Bannière d'accès Invité si applicable */}
                {isGuest && (
                    <View style={[styles.loginBanner, { backgroundColor: colors.warningDim, borderColor: colors.warning, flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                        <SmartIcon name="guest" size={16} color={colors.warning} />
                        <Text style={[styles.loginBannerText, { color: colors.warning, flex: 1 }]}>
                            Rôle actuel : Invité. Les commandes de verrouillage et garage sont protégées.
                        </Text>
                    </View>
                )}

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>

            {/* Modal de confirmation de déverrouillage */}
            <Modal
                visible={showUnlockModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowUnlockModal(false)}
            >
                <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                    <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Déverrouiller le domicile ?</Text>
                        <Text style={[styles.modalSub, { color: colors.textSub }]}>
                            Toutes les gâches électriques des portes seront relâchées et l'alarme désactivée.
                        </Text>
                        <View style={styles.modalActions}>
                            <PrimaryButton
                                label="Annuler"
                                onPress={() => setShowUnlockModal(false)}
                                variant="ghost"
                                fullWidth={false}
                                style={styles.modalBtn}
                            />
                            <PrimaryButton
                                label="Déverrouiller"
                                onPress={handleUnlockConfirm}
                                variant="danger"
                                fullWidth={false}
                                style={styles.modalBtn}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { flex: 1 },
    content: { padding: Spacing.md },
    lockCard: {
        borderRadius: Radii.xxl,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: Spacing.lg,
    },
    lockMedallion: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    lockTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.extrabold,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    lockSub: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    lockActions: { width: '100%', gap: Spacing.sm },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    loginBanner: {
        borderRadius: Radii.lg,
        borderWidth: 1,
        padding: Spacing.md,
        marginTop: Spacing.md,
    },
    loginBannerText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        borderRadius: Radii.xl,
        borderWidth: 1,
        padding: Spacing.lg,
        alignItems: 'center',
        ...Shadows.card,
    },
    modalTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    modalSub: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    modalActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        width: '100%',
        justifyContent: 'center',
    },
    modalBtn: {
        flex: 1,
    },
});
