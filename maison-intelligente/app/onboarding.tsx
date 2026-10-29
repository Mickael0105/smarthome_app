// ============================================================
//  Écran : Onboarding — Première Utilisation (Style iOS 18)
//  Présentation visuelle universelle & Immersion Domotique
// ============================================================

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii, Shadows } from '../src/constants/theme';
import { SmartIcon, SmartIconName } from '../src/components/SmartIcon';
import { Haptics } from '../src/utils/haptics';

interface OnboardingSlide {
    id: string;
    icon: SmartIconName;
    badgeBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
    visualPills: { label: string; icon: SmartIconName; color: string }[];
}

const SLIDES: OnboardingSlide[] = [
    {
        id: '1',
        icon: 'light',
        badgeBg: '#FEF3C7',
        iconColor: '#D97706',
        title: 'Contrôle Visuel Intuitif',
        subtitle:
            'Chaque équipement est identifiable en un clin d’œil par son icône et sa couleur : Jaune pour allumé, Bleu pour la climatisation.',
        visualPills: [
            { label: 'Allumé', icon: 'light', color: '#F59E0B' },
            { label: 'Garage', icon: 'garage', color: '#10B981' },
            { label: 'Fenêtres', icon: 'window', color: '#0EA5E9' },
        ],
    },
    {
        id: '2',
        icon: 'security',
        badgeBg: '#DCFCE7',
        iconColor: '#16A34A',
        title: 'Sécurité & Alarme Active',
        subtitle:
            'Verrouillez l’ensemble de vos portes et suivez les capteurs de présence. En cas d’effraction, une sirène et une alerte haptique se déclenchent.',
        visualPills: [
            { label: 'Verrouillé', icon: 'security', color: '#EF4444' },
            { label: 'Détecteur PIR', icon: 'motion', color: '#8B5CF6' },
            { label: 'Acquittement', icon: 'check', color: '#10B981' },
        ],
    },
    {
        id: '3',
        icon: 'energy',
        badgeBg: '#E0F2FE',
        iconColor: '#0284C7',
        title: 'Scénarios & Éco-Énergie',
        subtitle:
            'Activez d’un seul geste les modes Nuit, Départ, Retour ou Cinéma. Visualisez votre puissance en temps réel et optimisez votre consommation.',
        visualPills: [
            { label: 'Mode Nuit', icon: 'moon', color: '#6366F1' },
            { label: 'Départ', icon: 'security', color: '#EC4899' },
            { label: 'Éco A', icon: 'eco', color: '#10B981' },
        ],
    },
];

export default function OnboardingScreen() {
    const { colors, isDark } = useAppTheme();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        Haptics.light();
        if (activeIndex < SLIDES.length - 1) {
            setActiveIndex((prev) => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        Haptics.success();
        router.replace('/(tabs)');
    };

    const handleLogin = () => {
        Haptics.light();
        router.push('/login');
    };

    const currentSlide = SLIDES[activeIndex];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            {/* Bouton Passer */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
                    <Text style={[styles.skipText, { color: colors.textSub }]}>Passer</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Grand Macaron Iconique Apple iOS */}
                <View style={styles.iconCenter}>
                    <View style={[styles.bigCircle, { backgroundColor: currentSlide.badgeBg }]}>
                        <SmartIcon
                            name={currentSlide.icon}
                            size={56}
                            color={currentSlide.iconColor}
                        />
                    </View>
                </View>

                {/* Titre & Sous-titre */}
                <View style={styles.textCenter}>
                    <Text style={[styles.title, { color: colors.text }]}>{currentSlide.title}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSub }]}>
                        {currentSlide.subtitle}
                    </Text>
                </View>

                {/* Repères Visuels Universels (Pills) */}
                <View style={styles.pillsRow}>
                    {currentSlide.visualPills.map((pill, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.surfaceBorder,
                                },
                                Shadows.card,
                            ]}
                        >
                            <View style={[styles.pillIconWrap, { backgroundColor: `${pill.color}1E` }]}>
                                <SmartIcon name={pill.icon} size={18} color={pill.color} />
                            </View>
                            <Text style={[styles.pillLabel, { color: colors.text }]}>
                                {pill.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Indicateurs de pagination (Dots iOS) */}
                <View style={styles.pagination}>
                    {SLIDES.map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                Haptics.light();
                                setActiveIndex(i);
                            }}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: i === activeIndex
                                        ? colors.primary
                                        : isDark
                                        ? 'rgba(255,255,255,0.2)'
                                        : 'rgba(0,0,0,0.15)',
                                    width: i === activeIndex ? 24 : 8,
                                },
                            ]}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Pied d'écran fixe style iOS avec actions principales */}
            <View style={[styles.bottomBar, { borderTopColor: colors.surfaceBorder }]}>
                <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: colors.primary }, Shadows.button]}
                    onPress={handleNext}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryBtnText}>
                        {activeIndex === SLIDES.length - 1 ? 'Accéder à la Maison' : 'Continuer'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryBtn, { backgroundColor: colors.surfaceAlt }]}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <SmartIcon name="admin" size={16} color={colors.text} />
                    <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
                        Connexion Propriétaire (Admin)
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.sm,
    },
    skipBtn: {
        padding: Spacing.sm,
    },
    skipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
    },
    iconCenter: {
        marginVertical: Spacing.xl,
    },
    bigCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.card,
    },
    textCenter: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: FontWeight.extrabold,
        textAlign: 'center',
        marginBottom: Spacing.sm,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: FontSize.md,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: Spacing.sm,
    },
    pillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs + 2,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radii.full,
        borderWidth: 1,
    },
    pillIconWrap: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    pagination: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        marginVertical: Spacing.md,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    bottomBar: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        gap: Spacing.sm,
    },
    primaryBtn: {
        height: 54,
        borderRadius: Radii.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    secondaryBtn: {
        height: 48,
        borderRadius: Radii.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    secondaryBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
});
