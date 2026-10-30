// ============================================================
//  Écran : Tableau de bord (Accueil)
//  Design complet haut de gamme : Scénarios, Ouvrants, Climat, Énergie
// ============================================================

import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHouseStore } from '../../src/store/useHouseStore';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../../src/constants/theme';
import { ConnectionBadge } from '../../src/components/ConnectionBadge';
import { RoleBadge } from '../../src/components/RoleBadge';
import { OfflineBanner } from '../../src/components/OfflineBanner';
import { ScenarioBar } from '../../src/components/ScenarioBar';
import { OpeningsSummaryCard } from '../../src/components/OpeningsSummaryCard';
import { EnergyWidget } from '../../src/components/EnergyWidget';
import { UnavailableState } from '../../src/components/UnavailableState';
import { SmartIcon } from '../../src/components/SmartIcon';
import { formatDate } from '../../src/utils/helpers';
import { Haptics } from '../../src/utils/haptics';

export default function TableauDeBordScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useAppTheme();
    const status = useHouseStore((s) => s.status);
    const connectionStatus = useHouseStore((s) => s.connectionStatus);
    const fetchStatus = useHouseStore((s) => s.fetchStatus);
    const setLight = useHouseStore((s) => s.setLight);
    const lightCommands = useHouseStore((s) => s.lightCommands);
    const events = useHouseStore((s) => s.events);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStatus();
        setRefreshing(false);
    };

    const lightsOn = status?.lights?.filter((l) => l.state === 'on').length ?? 0;
    const totalLights = status?.lights?.length ?? 0;
    const rawTemp = status?.temperature;
    const currentTemp = typeof rawTemp === 'number' ? rawTemp : (rawTemp?.value ?? 21.4);
    const currentHumidity = status?.humidity?.value ?? status?.humidity?.current ?? 48;
    const currentLux = status?.luminosity?.value ?? status?.luminosity?.currentLux ?? 420;

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
            {/* Bannière hors-ligne si requêtes en file d'attente */}
            <OfflineBanner />

            {/* En-tête supérieur */}
            <View style={[styles.header, { borderBottomColor: colors.surfaceBorder }]}>
                <View style={styles.headerLeft}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Image
                            source={require('../../assets/amnay-logo.png')}
                            style={{ width: 28, height: 28, borderRadius: 14 }}
                            resizeMode="contain"
                        />
                        <Text style={[styles.greeting, { color: colors.text }]}>AM'NAY</Text>
                    </View>
                    <Text style={[styles.subGreeting, { color: colors.textSub }]}>
                        {formatDate(status?.timestamp ?? new Date().toISOString())}
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    {/* Sélecteur de rôle RBAC */}
                    <RoleBadge />

                    {/* Bouton bascule Sombre / Clair */}
                    <TouchableOpacity
                        style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={toggleTheme}
                        activeOpacity={0.7}
                    >
                        <SmartIcon name={isDark ? 'sun' : 'moon'} size={18} color={isDark ? '#F59E0B' : '#6366F1'} />
                    </TouchableOpacity>

                    {/* Bouton Guide Visuel / Onboarding */}
                    <TouchableOpacity
                        style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={() => {
                            Haptics.light();
                            router.push('/onboarding' as any);
                        }}
                        activeOpacity={0.7}
                        accessibilityLabel="Guide Visuel"
                    >
                        <SmartIcon name="eye" size={18} color={colors.primary} />
                    </TouchableOpacity>

                    {/* Bouton Paramètres */}
                    <TouchableOpacity
                        style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={() => {
                            Haptics.light();
                            router.push('/parametres');
                        }}
                        activeOpacity={0.7}
                    >
                        <SmartIcon name="settings" size={18} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Barre de statut réseau & mode */}
                <View style={styles.metaRow}>
                    <ConnectionBadge />
                    <TouchableOpacity
                        style={[styles.simBadge, { backgroundColor: colors.surfaceAlt, borderColor: colors.surfaceBorder }]}
                        onPress={() => router.push('/simulation')}
                    >
                        <SmartIcon name="settings" size={13} color={colors.primary} />
                        <Text style={[styles.simBadgeText, { color: colors.primary }]}>
                            Console Simulation
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Scénarios de vie (Modes rapides) */}
                <ScenarioBar />

                {/* Synthèse environnementale (Temp, Humidité, Lux) */}
                <View style={styles.envGrid}>
                    {/* Température */}
                    <TouchableOpacity
                        style={[styles.envCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={() => router.push('/temperature')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.envHeader}>
                            <SmartIcon name="climate" size={20} color={colors.primary} />
                            <Text style={[styles.envUnit, { color: colors.primary }]}>{status?.setpoint ?? 20}° consigne</Text>
                        </View>
                        <Text style={[styles.envVal, { color: colors.text }]}>{currentTemp.toFixed(1)}°C</Text>
                        <Text style={[styles.envLabel, { color: colors.textSub }]}>Intérieur confort</Text>
                    </TouchableOpacity>

                    {/* Humidité */}
                    <TouchableOpacity
                        style={[styles.envCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={() => router.push('/temperature')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.envHeader}>
                            <SmartIcon name="humidity" size={20} color="#06B6D4" />
                            <Text style={[styles.envUnit, { color: colors.secondary }]}>Air sain</Text>
                        </View>
                        <Text style={[styles.envVal, { color: colors.text }]}>{currentHumidity}%</Text>
                        <Text style={[styles.envLabel, { color: colors.textSub }]}>Humidité relative</Text>
                    </TouchableOpacity>

                    {/* Luminosité */}
                    <TouchableOpacity
                        style={[styles.envCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                        onPress={() => router.push('/lumieres')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.envHeader}>
                            <SmartIcon name="sun" size={20} color="#F59E0B" />
                            <Text style={[styles.envUnit, { color: colors.warning }]}>{lightsOn} allumée(s)</Text>
                        </View>
                        <Text style={[styles.envVal, { color: colors.text }]}>{currentLux} lx</Text>
                        <Text style={[styles.envLabel, { color: colors.textSub }]}>Lumière naturelle</Text>
                    </TouchableOpacity>
                </View>

                {/* Synthèse Sécurité & Ouvrants (Portes + Garage + Fenêtres) */}
                <OpeningsSummaryCard />

                {/* Suivi Énergétique & Puissance (Watts / kWh) */}
                <EnergyWidget />

                {/* Contrôle rapide des pièces */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Lumières par pièce</Text>
                    <TouchableOpacity onPress={() => router.push('/lumieres')}>
                        <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout ({totalLights}) →</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.lightsGrid}>
                    {status?.lights?.slice(0, 4).map((light) => {
                        const isOn = light.state === 'on';
                        const isPending = lightCommands[light.id]?.status === 'pending';
                        return (
                            <TouchableOpacity
                                key={light.id}
                                style={[
                                    styles.lightMiniCard,
                                    {
                                        backgroundColor: isOn ? colors.primaryDim : colors.surface,
                                        borderColor: isOn ? colors.primary : colors.surfaceBorder,
                                    },
                                ]}
                                onPress={() => setLight(light.id, isOn ? 'off' : 'on')}
                                disabled={isPending}
                                activeOpacity={0.7}
                            >
                                <View style={styles.miniCardTop}>
                                    <SmartIcon name="light" size={20} color={isOn ? colors.primary : colors.textSub} />
                                    <View
                                        style={[
                                            styles.miniDot,
                                            { backgroundColor: isOn ? colors.primary : colors.textDisabled },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.miniCardName, { color: colors.text }]} numberOfLines={1}>
                                    {light.name}
                                </Text>
                                <Text style={[styles.miniCardState, { color: isOn ? colors.primary : colors.textSub }]}>
                                    {isPending ? 'Action...' : isOn ? 'Allumée' : 'Éteinte'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Derniers événements récents */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Journal d'activité récent</Text>
                    <TouchableOpacity onPress={() => router.push('/historique')}>
                        <Text style={[styles.seeAllText, { color: colors.primary }]}>Historique →</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.eventsBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    {events.slice(0, 3).map((ev) => (
                        <View key={ev.id} style={[styles.eventRow, { borderBottomColor: colors.surfaceBorder }]}>
                            <View style={[styles.eventBadgeWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                                <SmartIcon
                                    name={ev.type.includes('alert') ? 'alert' : ev.type.includes('door') ? 'door' : ev.type.includes('setpoint') ? 'climate' : 'energy'}
                                    size={15}
                                    color={ev.type.includes('alert') ? colors.danger : colors.primary}
                                />
                            </View>
                            <View style={styles.eventTextWrap}>
                                <Text style={[styles.eventMsg, { color: colors.text }]}>{ev.description ?? ev.message}</Text>
                                <Text style={[styles.eventTime, { color: colors.textSub }]}>
                                    {new Date(ev.created_at ?? ev.timestamp ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: Spacing.xl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
    subGreeting: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: Radii.full,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBtnText: {
        fontSize: 16,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xxl,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    simBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radii.full,
    },
    simBadgeText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    envGrid: {
        flexDirection: 'row',
        gap: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    envCard: {
        flex: 1,
        borderRadius: Radii.lg,
        borderWidth: 1,
        padding: Spacing.sm,
        ...Shadows.card,
    },
    envHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    envEmoji: {
        fontSize: 16,
    },
    envUnit: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
    },
    envVal: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.extrabold,
    },
    envLabel: {
        fontSize: 10,
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    seeAllText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    lightsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    lightMiniCard: {
        width: '48.5%',
        borderRadius: Radii.md,
        borderWidth: 1,
        padding: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    miniCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    miniCardEmoji: {
        fontSize: 20,
    },
    miniDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    miniCardName: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        marginTop: 6,
    },
    miniCardState: {
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    eventsBox: {
        borderRadius: Radii.lg,
        borderWidth: 1,
        overflow: 'hidden',
        marginTop: Spacing.xs,
        ...Shadows.card,
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm + 2,
        borderBottomWidth: 1,
        gap: Spacing.sm,
    },
    eventBadgeWrap: {
        width: 30,
        height: 30,
        borderRadius: Radii.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventTextWrap: {
        flex: 1,
    },
    eventMsg: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
    },
    eventTime: {
        fontSize: 10,
        marginTop: 2,
    },
});
