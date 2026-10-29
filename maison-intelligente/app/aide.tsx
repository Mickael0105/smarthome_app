// ============================================================
//  Écran : Aide, Documentation Technique & Soutenance L3 GL
//  Règles métier, Architecture logicielle, Diagrammes
// ============================================================

import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../src/constants/theme';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { SmartIcon, SmartIconName } from '../src/components/SmartIcon';

interface RuleItem {
    id: string;
    icon: SmartIconName;
    title: string;
    content: string;
}

const RULES: RuleItem[] = [
    {
        id: '01',
        icon: 'wifi',
        title: 'Acquittement & États Transitoires',
        content:
            'Toute commande (lumière, garage, verrouillage) transite par : idle → pending → success | error. Le composant graphique reflète l\'état réel acquitté par le matériel ou le simulateur.',
    },
    {
        id: '02',
        icon: 'garage',
        title: 'Porte de Garage Motorisée',
        content:
            'Le garage dispose d\'un moteur piloté en temps réel avec états d\'ouverture, de fermeture et de verrouillage mécanique de sécurité. Les commandes sont protégées par le système de permissions RBAC.',
    },
    {
        id: '03',
        icon: 'window',
        title: 'Ouvrants & Fenêtres Intelligentes',
        content:
            'Les fenêtres et baies vitrées sont suivies individuellement. Elles s\'intègrent au bilan de sécurité périmétrique et signalent toute ouverture en cas d\'armement du domicile ou de pluie.',
    },
    {
        id: '04',
        icon: 'admin',
        title: 'Contrôle d\'Accès Basé sur les Rôles (RBAC)',
        content:
            '3 niveaux de privilèges : Administrateur (accès total, déverrouillage, garage, configuration), Membre (lumières, thermostat, confort), Invité (lecture seule et éclairage autorisé).',
    },
    {
        id: '05',
        icon: 'sync',
        title: 'Résilience & File Hors-ligne (Outbox Pattern)',
        content:
            'En cas de déconnexion réseau ou coupure Wi-Fi, les commandes sont mises en mémoire dans la file Outbox. Dès que la liaison est rétablie, les actions sont synchronisées automatiquement.',
    },
    {
        id: '06',
        icon: 'scenario',
        title: 'Scénarios de Vie (Command Pattern)',
        content:
            'Les modes Départ, Retour, Nuit, Cinéma et Éco permettent d\'exécuter des séquences automatisées globales (ex: éteindre toutes les pièces, fermer le garage et verrouiller les portes).',
    },
    {
        id: '07',
        icon: 'energy',
        title: 'Suivi Énergétique & Éco-Score',
        content:
            'Calcul de la puissance instantanée en Watts, cumul journalier en kWh, estimation de coût et notation d\'efficacité énergétique (Éco-Score A+ à D).',
    },
];

function Accordion({ id, icon, title, content }: RuleItem) {
    const { colors } = useAppTheme();
    const [open, setOpen] = useState(false);
    return (
        <View style={[styles.accordion, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <TouchableOpacity style={styles.accordionHeader} onPress={() => setOpen((v) => !v)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View style={[styles.ruleIconBox, { backgroundColor: colors.primaryDim, borderColor: `${colors.primary}33` }]}>
                        <SmartIcon name={icon} size={15} color={colors.primary} />
                    </View>
                    <Text style={[styles.accordionTitle, { color: colors.text, flex: 1 }]}>
                        {id} • {title}
                    </Text>
                </View>
                <Text style={[styles.accordionArrow, { color: colors.textSub }, open && styles.accordionArrowOpen]}>›</Text>
            </TouchableOpacity>
            {open && <Text style={[styles.accordionContent, { color: colors.textSub }]}>{content}</Text>}
        </View>
    );
}

export default function AideScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
            <View style={[styles.header, { borderBottomColor: colors.surfaceBorder }]}>
                <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                    onPress={() => router.back()}
                >
                    <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Dossier Technique</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                {/* Présentation */}
                <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, Shadows.card]}>
                    <View style={[styles.heroBadgeBox, { backgroundColor: colors.primaryDim, borderColor: `${colors.primary}44` }]}>
                        <SmartIcon name="home" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.heroTitle, { color: colors.text }]}>Maison Intelligente</Text>
                    <Text style={[styles.heroSub, { color: colors.textSub }]}>
                        Projet de Soutenance en Licence Génie Logiciel
                    </Text>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: colors.primaryDim }]}>
                            <Text style={[styles.badgeText, { color: colors.primary }]}>Licence 3 GL</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: colors.secondaryDim }]}>
                            <Text style={[styles.badgeText, { color: colors.secondary }]}>Clean Architecture</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: colors.warningDim }]}>
                            <Text style={[styles.badgeText, { color: colors.warning }]}>Prêt pour ESP32</Text>
                        </View>
                    </View>
                </View>

                {/* Règles métier & Spécifications */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Règles Métier & Algorithmes</Text>
                {RULES.map((r) => (
                    <Accordion key={r.id} {...r} />
                ))}

                {/* Architecture */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Patrons de Conception (Design Patterns)</Text>
                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, Shadows.card]}>
                    {[
                        ['Repository & Service Pattern', 'Abstraction complète entre l\'interface et le matériel'],
                        ['Outbox Pattern', 'Résilience Offline-First et synchronisation différée'],
                        ['Command Pattern', 'Scénarios de vie multi-action idempotents'],
                        ['RBAC (Role-Based Access)', 'Sécurisation des opérations critiques (Admin/Membre/Invité)'],
                        ['State Pattern', 'Machine à états pour le garage (open/opening/closed/closing)'],
                        ['Zustand Centralized Store', 'Gestion réactive de l\'état global avec hooks sélecteurs'],
                    ].map(([pattern, desc]) => (
                        <View key={pattern} style={[styles.archRow, { borderBottomColor: colors.surfaceBorder }]}>
                            <Text style={[styles.archFile, { color: colors.primary }]}>{pattern}</Text>
                            <Text style={[styles.archDesc, { color: colors.textSub }]}>{desc}</Text>
                        </View>
                    ))}
                </View>

                {/* Connexions Matérielles Futures (ESP32) */}
                <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Passerelle Matérielle Future (ESP32)</Text>
                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, Shadows.card]}>
                    {[
                        ['Phase 1 (Actuelle)', 'Simulation riche en mémoire avec simulateur temps réel'],
                        ['Phase 2 (Matériel)', 'Connexion Wi-Fi directe à l\'ESP32 via HTTP REST / WebSocket'],
                        ['Phase 3 (Cloud)', 'Broker MQTT distant pour accès sécurisé hors du domicile'],
                    ].map(([phase, desc]) => (
                        <View key={phase} style={[styles.archRow, { borderBottomColor: colors.surfaceBorder }]}>
                            <Text style={[styles.archFile, { color: colors.secondary }]}>{phase}</Text>
                            <Text style={[styles.archDesc, { color: colors.textSub }]}>{desc}</Text>
                        </View>
                    ))}
                </View>

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
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: Radii.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    backIcon: { fontSize: 24, lineHeight: 28 },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    scroll: { flex: 1 },
    content: { padding: Spacing.md, gap: Spacing.xs },
    heroCard: {
        borderRadius: Radii.xxl,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: Spacing.sm,
    },
    heroBadgeBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    heroTitle: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.extrabold,
        marginBottom: Spacing.xs,
    },
    heroSub: {
        fontSize: FontSize.sm,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    badgeRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap', justifyContent: 'center' },
    badge: {
        borderRadius: Radii.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
    },
    badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
    },
    accordion: {
        borderRadius: Radii.xl,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: Spacing.xs,
    },
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    ruleIconBox: {
        width: 28,
        height: 28,
        borderRadius: Radii.sm,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    accordionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
    accordionArrow: {
        fontSize: 22,
        transform: [{ rotate: '0deg' }],
    },
    accordionArrowOpen: {
        transform: [{ rotate: '90deg' }],
    },
    accordionContent: {
        fontSize: FontSize.sm,
        lineHeight: 20,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
    },
    infoCard: {
        borderRadius: Radii.xl,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
    },
    archRow: {
        padding: Spacing.md,
        borderBottomWidth: 1,
    },
    archFile: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        marginBottom: 2,
    },
    archDesc: {
        fontSize: FontSize.xs,
    },
});
