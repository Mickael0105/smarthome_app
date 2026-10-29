// ============================================================
//  Écran : Console de Simulation Démo (Soutenance L3 GL)
//  Injecteur d'événements : Alarme, Portes, Fenêtres, Garage, Mouvements & Réseau
// ============================================================

import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHouseStore } from '../src/store/useHouseStore';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../src/constants/theme';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SmartIcon, SmartIconName } from '../src/components/SmartIcon';

interface ScenarioCardProps {
    icon: SmartIconName;
    title: string;
    description: string;
    danger?: boolean;
    onPress: () => void;
    loading?: boolean;
}

function ScenarioCard({ icon, title, description, danger, onPress, loading }: ScenarioCardProps) {
    const { colors } = useAppTheme();
    return (
        <TouchableOpacity
            style={[
                styles.scenarioCard,
                {
                    backgroundColor: colors.surface,
                    borderColor: danger ? colors.danger : colors.surfaceBorder,
                },
                danger && { backgroundColor: colors.dangerDim },
                Shadows.card,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View
                style={[
                    styles.scenarioIconWrap,
                    {
                        backgroundColor: danger ? `${colors.danger}22` : `${colors.primary}18`,
                        borderColor: danger ? `${colors.danger}44` : `${colors.primary}33`,
                    },
                ]}
            >
                <SmartIcon name={icon} size={20} color={danger ? colors.danger : colors.primary} />
            </View>
            <View style={styles.scenarioBody}>
                <Text style={[styles.scenarioTitle, { color: danger ? colors.danger : colors.text }]}>{title}</Text>
                <Text style={[styles.scenarioDesc, { color: colors.textSub }]}>{description}</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
            ) : (
                <Text style={[styles.arrowIcon, { color: colors.textSub }]}>›</Text>
            )}
        </TouchableOpacity>
    );
}

export default function SimulationScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();
    const status = useHouseStore((s) => s.status);
    const triggerIntrusionAlert = useHouseStore((s) => s.triggerIntrusionAlert);
    const acknowledgeAlert = useHouseStore((s) => s.acknowledgeAlert);
    const fetchStatus = useHouseStore((s) => s.fetchStatus);
    const simulateDoorToggle = useHouseStore((s) => s.simulateDoorToggle);
    const toggleWindow = useHouseStore((s) => s.toggleWindow);
    const setGarageState = useHouseStore((s) => s.setGarageState);
    const simulateMotion = useHouseStore((s) => s.simulateMotion);
    const toggleSimulateFailures = useHouseStore((s) => s.toggleSimulateFailures);
    const simulateFailures = useHouseStore((s) => s.simulateFailures);
    const setSetpoint = useHouseStore((s) => s.setSetpoint);

    const [loading, setLoading] = useState<string | null>(null);

    const run = async (key: string, fn: () => Promise<void> | void) => {
        setLoading(key);
        try {
            await fn();
        } catch (e) {
            Alert.alert('Erreur', String(e));
        } finally {
            setLoading(null);
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
            <View style={[styles.header, { borderBottomColor: colors.surfaceBorder }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <SmartIcon name="settings" size={20} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.text }]}>Console de Démonstration</Text>
                </View>
                <TouchableOpacity
                    style={[styles.closeBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                    onPress={() => router.back()}
                >
                    <SmartIcon name="cross" size={14} color={colors.textSub} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <View style={[styles.warnBanner, { backgroundColor: colors.primaryDim, borderColor: colors.primary }]}>
                    <Text style={[styles.warnText, { color: colors.primary }]}>
                        Cet écran permet au jury de tester en direct toutes les fonctionnalités physiques simulées
                        (Portes, Garage motorisé, Fenêtres, Mouvement PIR, Climat, Scénarios).
                    </Text>
                </View>

                {/* Section Sécurité & Alarmes */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Sécurité & Détection</Text>
                <ScenarioCard
                    icon="alert"
                    title="Déclencher Alerte Intrusion"
                    description="Simule le forçage d'une issue alors que la maison est sous alarme"
                    danger
                    loading={loading === 'intrusion'}
                    onPress={() => run('intrusion', triggerIntrusionAlert)}
                />
                <ScenarioCard
                    icon="check"
                    title="Acquitter l'Alerte"
                    description="Arrête la sirène et désactive le bandeau d'alerte global"
                    loading={loading === 'ack'}
                    onPress={() => run('ack', acknowledgeAlert)}
                />

                {/* Section Garage */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Garage Motorisé</Text>
                <ScenarioCard
                    icon="garage"
                    title={status?.garage?.state === 'closed' ? 'Ouvrir le Garage' : 'Fermer le Garage'}
                    description={`État actuel : ${status?.garage?.state ?? 'Inconnu'}. Simule le moteur 24V et les capteurs de fin de course.`}
                    loading={loading === 'garage'}
                    onPress={() =>
                        run('garage', () =>
                            setGarageState(status?.garage?.state === 'closed' ? 'open' : 'closed')
                        )
                    }
                />

                {/* Section Ouvrants (Portes & Fenêtres) */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Ouvrants & Baies Vitrées</Text>
                {status?.doors?.map((door) => (
                    <ScenarioCard
                        key={door.id}
                        icon={door.open ? 'door-open' : 'door'}
                        title={`Basculer : ${door.name}`}
                        description={`Actuellement : ${door.open ? 'Ouverte' : 'Fermée'} (${door.lock === 'locked' ? 'Verrouillée' : 'Déverrouillée'})`}
                        onPress={() => run(`door_${door.id}`, () => simulateDoorToggle(door.id))}
                    />
                ))}

                {status?.windows?.map((window) => (
                    <ScenarioCard
                        key={window.id}
                        icon="window"
                        title={`Basculer : ${window.name}`}
                        description={`Actuellement : ${window.open ? 'Ouverte' : 'Fermée'} (${window.room})`}
                        onPress={() => run(`win_${window.id}`, () => toggleWindow(window.id))}
                    />
                ))}

                {/* Section Capteurs de Mouvement PIR */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Capteurs PIR (Présence)</Text>
                {status?.motionSensors?.map((sensor) => (
                    <ScenarioCard
                        key={sensor.id}
                        icon="motion"
                        title={`Détecter Présence : ${sensor.name}`}
                        description={`Pièce : ${sensor.room} • Déclenche événement et allumage automatique`}
                        onPress={() => run(`pir_${sensor.id}`, () => simulateMotion(sensor.id))}
                    />
                ))}

                {/* Section Résilience & Réseau */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Résilience Réseau & Outbox</Text>
                <ScenarioCard
                    icon="wifi"
                    title={simulateFailures ? 'Désactiver Pannes Réseau' : 'Simuler Pannes & Erreurs Réseau'}
                    description="Simule des déconnexions aléatoires pour tester la file d'attente Outbox"
                    loading={loading === 'network'}
                    onPress={() => toggleSimulateFailures()}
                />

                <ScenarioCard
                    icon="sync"
                    title="Forcer un rafraîchissement complet"
                    description="Synchronise les capteurs et l'état de l'habitat"
                    loading={loading === 'refresh'}
                    onPress={() => run('refresh', fetchStatus)}
                />

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
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
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
    content: { padding: Spacing.md, gap: Spacing.xs },
    warnBanner: {
        borderRadius: Radii.lg,
        borderWidth: 1,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    warnText: { fontSize: FontSize.xs, lineHeight: 18, fontWeight: FontWeight.medium },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },
    scenarioCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        borderRadius: Radii.xl,
        padding: Spacing.md,
        borderWidth: 1,
        marginBottom: Spacing.xs,
    },
    scenarioIconWrap: {
        width: 38,
        height: 38,
        borderRadius: Radii.md,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scenarioBody: { flex: 1 },
    scenarioTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    scenarioDesc: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    arrowIcon: { fontSize: 14 },
});
