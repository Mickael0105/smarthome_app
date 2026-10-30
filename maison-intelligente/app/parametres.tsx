// ============================================================
//  Écran : Paramètres Système & Soutenance
//  Mode Sombre/Clair, Profils RBAC, Résilience & Mode Développeur
// ============================================================

import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHouseStore } from '../src/store/useHouseStore';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../src/constants/theme';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SmartIcon, SmartIconName } from '../src/components/SmartIcon';
import { Haptics } from '../src/utils/haptics';
import type { UserRole } from '../src/types/house';

interface SettingRowProps {
    label: string;
    description?: string;
    right?: React.ReactNode;
    onPress?: () => void;
}

function SettingRow({ label, description, right, onPress }: SettingRowProps) {
    const { colors } = useAppTheme();
    return (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            disabled={!onPress && !right}
        >
            <View style={styles.settingLeft}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
                {description && <Text style={[styles.settingDesc, { color: colors.textSub }]}>{description}</Text>}
            </View>
            {right && <View style={styles.settingRight}>{right}</View>}
        </TouchableOpacity>
    );
}

export default function ParametresScreen() {
    const router = useRouter();
    const { colors, isDark, themeMode, setThemeMode } = useAppTheme();
    const isLoggedIn = useHouseStore((s) => s.isLoggedIn);
    const user = useHouseStore((s) => s.user);
    const switchRole = useHouseStore((s) => s.switchRole);
    const devMode = useHouseStore((s) => s.devMode);
    const toggleDevMode = useHouseStore((s) => s.toggleDevMode);
    const simulateFailures = useHouseStore((s) => s.simulateFailures);
    const toggleSimulateFailures = useHouseStore((s) => s.toggleSimulateFailures);
    const offlineQueue = useHouseStore((s) => s.offlineQueue);
    const flushOfflineQueue = useHouseStore((s) => s.flushOfflineQueue);
    const logout = useHouseStore((s) => s.logout);
    const connectionStatus = useHouseStore((s) => s.connectionStatus);

    const statusColor =
        connectionStatus === 'connected'
            ? colors.primary
            : connectionStatus === 'connecting'
            ? colors.warning
            : colors.danger;

    const statusLabel =
        connectionStatus === 'connected'
            ? 'Connecté'
            : connectionStatus === 'connecting'
            ? 'Connexion…'
            : 'Hors ligne';

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
            <View style={[styles.header, { borderBottomColor: colors.surfaceBorder }]}>
                <Text style={[styles.title, { color: colors.text }]}>Paramètres</Text>
                <TouchableOpacity
                    style={[styles.closeBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                    onPress={() => router.back()}
                >
                    <SmartIcon name="cross" size={14} color={colors.textSub} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                {/* Apparence : Mode Sombre & Mode Clair */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Apparence & Thème</Text>
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <SettingRow
                        label="Thème Visuel"
                        description={isDark ? 'Mode Sombre actif (OLED)' : 'Mode Clair actif'}
                        right={
                            <View style={styles.themeSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.themeChoice,
                                        isDark && { backgroundColor: colors.primary },
                                        { flexDirection: 'row', alignItems: 'center', gap: 6 },
                                    ]}
                                    onPress={() => setThemeMode('dark')}
                                >
                                    <SmartIcon name="moon" size={13} color={isDark ? '#FFF' : colors.textSub} />
                                    <Text style={[styles.themeChoiceText, isDark && { color: '#FFF' }]}>Sombre</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.themeChoice,
                                        !isDark && { backgroundColor: colors.primary },
                                        { flexDirection: 'row', alignItems: 'center', gap: 6 },
                                    ]}
                                    onPress={() => setThemeMode('light')}
                                >
                                    <SmartIcon name="sun" size={13} color={!isDark ? '#FFF' : colors.textSub} />
                                    <Text style={[styles.themeChoiceText, !isDark && { color: '#FFF' }]}>Clair</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </View>

                {/* Profil & RBAC (Soutenance) */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Contrôle d'Accès (RBAC)</Text>
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <SettingRow
                        label={`Profil actif : ${user?.name ?? 'Utilisateur'}`}
                        description={`Rôle actuel : ${user?.role === 'admin' ? 'Administrateur (Tous droits)' : user?.role === 'member' ? 'Membre (Usage quotidien)' : 'Invité (Restreint)'}`}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                    <View style={styles.rolesRow}>
                        {(
                            [
                                { id: 'admin', label: 'Admin', icon: 'admin' as SmartIconName, desc: 'Tous droits' },
                                { id: 'member', label: 'Membre', icon: 'user' as SmartIconName, desc: 'Climat & lampes' },
                                { id: 'guest', label: 'Invité', icon: 'guest' as SmartIconName, desc: 'Lecture seule' },
                            ] as const
                        ).map((r) => {
                            const isSelected = user?.role === r.id;
                            return (
                                <TouchableOpacity
                                    key={r.id}
                                    style={[
                                        styles.roleBtn,
                                        {
                                            backgroundColor: isSelected ? colors.primaryDim : colors.surfaceAlt,
                                            borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                                        },
                                    ]}
                                    onPress={() => switchRole(r.id)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                                        <SmartIcon
                                            name={r.icon}
                                            size={14}
                                            color={isSelected ? colors.primary : colors.text}
                                        />
                                        <Text style={[styles.roleBtnLabel, { color: isSelected ? colors.primary : colors.text }]}>
                                            {r.label}
                                        </Text>
                                    </View>
                                    <Text style={[styles.roleBtnDesc, { color: colors.textSub }]}>{r.desc}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Résilience & File Hors-ligne (Outbox) */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Résilience & Offline-First</Text>
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <SettingRow
                        label="File d'attente Outbox"
                        description={`${offlineQueue.length} action(s) stockée(s) localement`}
                        right={
                            offlineQueue.length > 0 ? (
                                <TouchableOpacity
                                    style={[styles.flushBtn, { backgroundColor: colors.warning }]}
                                    onPress={() => flushOfflineQueue()}
                                >
                                    <Text style={styles.flushBtnText}>Envoyer</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <SmartIcon name="check" size={12} color={colors.primary} />
                                    <Text style={[styles.badgeText, { color: colors.primary }]}>À jour</Text>
                                </View>
                            )
                        }
                    />
                    <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                    <SettingRow
                        label="Statut Réseau"
                        right={
                            <View style={[styles.statusDot, { backgroundColor: statusColor }]}>
                                <Text style={styles.statusText}>{statusLabel}</Text>
                            </View>
                        }
                    />
                    <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                    <SettingRow
                        label="Architecture de communication"
                        description="Mode Hybride (Simulation Mock actuelle / Prêt pour ESP32 MQTT & REST)"
                        right={<Text style={[styles.badgeText, { color: colors.textSub }]}>Hybride</Text>}
                    />
                </View>

                {/* Outils Développeur & Simulation */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Outils de Démonstration</Text>
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <SettingRow
                        label="Mode développeur"
                        description="Active les fonctions d'injection d'événements"
                        right={
                            <Switch
                                value={devMode}
                                onValueChange={toggleDevMode}
                                trackColor={{ false: colors.surfaceBorder, true: colors.primaryDim }}
                                thumbColor={devMode ? colors.primary : colors.textDisabled}
                            />
                        }
                    />
                    <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                    <SettingRow
                        label="Console de simulation de soutenance"
                        description="Déclencher alarme, mouvement PIR, coupure réseau"
                        onPress={() => router.push('/simulation')}
                        right={<Text style={{ color: colors.primary, fontSize: 18 }}>›</Text>}
                    />
                    {devMode && (
                        <>
                            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                            <SettingRow
                                label="Simulation de pannes réseau"
                                description="Injecte 10% d'erreurs pour tester la résilience"
                                right={
                                    <Switch
                                        value={simulateFailures}
                                        onValueChange={toggleSimulateFailures}
                                        trackColor={{ false: colors.surfaceBorder, true: colors.warningDim }}
                                        thumbColor={simulateFailures ? colors.warning : colors.textDisabled}
                                    />
                                }
                            />
                        </>
                    )}
                </View>

                {/* À propos & Découverte */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Découverte & Projet</Text>
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <SettingRow
                        label="Guide de Première Utilisation (Onboarding)"
                        description="Revoir la présentation visuelle et les repères"
                        onPress={() => router.push('/onboarding' as any)}
                        right={<Text style={{ color: colors.primary, fontSize: 18 }}>›</Text>}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                    <SettingRow
                        label="Documentation Technique"
                        description="Spécification des composants et diagrammes"
                        onPress={() => router.push('/aide')}
                        right={<Text style={{ color: colors.textSub }}>›</Text>}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                    <SettingRow label="Projet de Soutenance" right={<Text style={[styles.badgeText, { color: colors.textSub }]}>Licence 3 GL</Text>} />
                    <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
                    <SettingRow label="Architecture" right={<Text style={[styles.badgeText, { color: colors.primary }]}>Clean Arch. + Outbox</Text>} />
                </View>

                {/* Déconnexion */}
                {isLoggedIn && (
                    <PrimaryButton
                        label="Se déconnecter"
                        onPress={() => {
                            Haptics.warning();
                            Alert.alert(
                                'Déconnexion',
                                'Voulez-vous vraiment vous déconnecter de AM\'NAY ?',
                                [
                                    { text: 'Annuler', style: 'cancel' },
                                    {
                                        text: 'Se déconnecter',
                                        style: 'destructive',
                                        onPress: async () => {
                                            await logout();
                                            router.replace('/login');
                                        },
                                    },
                                ],
                            );
                        }}
                        variant="ghost"
                        style={{ marginTop: Spacing.md }}
                    />
                )}

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: Radii.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    closeIcon: { fontSize: 16 },
    scroll: { flex: 1 },
    content: { padding: Spacing.md },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: Spacing.xs,
        marginTop: Spacing.lg,
    },
    section: {
        borderRadius: Radii.xl,
        borderWidth: 1,
        overflow: 'hidden',
        ...Shadows.card,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    settingLeft: { flex: 1 },
    settingLabel: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
    settingDesc: { fontSize: FontSize.xs, marginTop: 2 },
    settingRight: { marginLeft: Spacing.sm },
    divider: { height: 1, marginLeft: Spacing.md },
    themeSelector: {
        flexDirection: 'row',
        gap: 4,
    },
    themeChoice: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 5,
        borderRadius: Radii.full,
    },
    themeChoiceText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    rolesRow: {
        padding: Spacing.sm,
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    roleBtn: {
        flex: 1,
        padding: Spacing.sm,
        borderRadius: Radii.md,
        borderWidth: 1,
        alignItems: 'center',
    },
    roleBtnLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    roleBtnDesc: {
        fontSize: 9,
        marginTop: 2,
        textAlign: 'center',
    },
    flushBtn: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.sm,
    },
    flushBtnText: {
        color: '#FFFFFF',
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    statusDot: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radii.full,
    },
    statusText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    badgeText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
});
