// ============================================================
//  Composant : ScenarioBar
//  Barre horizontale des modes de vie (Command Pattern)
//  Design Vectoriel Exclusif (SmartIcon) — Zéro Emoji
// ============================================================

import React from 'react';
import {
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { FontSize, FontWeight, Radii, Spacing, Shadows } from '../constants/theme';
import { SmartIcon, type SmartIconName } from './SmartIcon';
import { Haptics } from '../utils/haptics';
import type { ScenarioId } from '../types/house';

const SCENARIO_ICONS: Record<ScenarioId, SmartIconName> = {
    night: 'moon',
    away: 'security',
    home: 'home',
    cinema: 'cinema',
    eco: 'eco',
};

export const ScenarioBar: React.FC = () => {
    const { colors, isDark } = useAppTheme();
    const scenarios = useHouseStore((s) => s.status?.scenarios);
    const activateScenario = useHouseStore((s) => s.activateScenario);
    const scenarioCommand = useHouseStore((s) => s.scenarioCommand);
    const [activeId, setActiveId] = React.useState<ScenarioId | null>(null);

    const handlePress = async (id: ScenarioId) => {
        Haptics.success();
        setActiveId(id);
        await activateScenario(id);
        setActiveId(null);
    };

    if (!scenarios || scenarios.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: colors.textSub }]}>Modes & Scénarios</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollList}
            >
                {scenarios.map((sc) => {
                    const isPending = activeId === sc.id && scenarioCommand.status === 'pending';
                    const isActive = sc.active;
                    const iconName = SCENARIO_ICONS[sc.id] ?? 'scenario';
                    const iconColor = isActive ? '#FFFFFF' : sc.color;

                    return (
                        <TouchableOpacity
                            key={sc.id}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: isActive ? sc.color : colors.surface,
                                    borderColor: isActive ? sc.color : colors.surfaceBorder,
                                },
                                Shadows.card,
                            ]}
                            onPress={() => handlePress(sc.id)}
                            disabled={isPending}
                            activeOpacity={0.8}
                        >
                            <View
                                style={[
                                    styles.iconWrap,
                                    {
                                        backgroundColor: isActive
                                            ? 'rgba(255,255,255,0.2)'
                                            : `${sc.color}18`,
                                    },
                                ]}
                            >
                                <SmartIcon name={iconName} size={18} color={iconColor} />
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: isActive ? '#FFFFFF' : colors.text },
                                    ]}
                                >
                                    {sc.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.chipSub,
                                        { color: isActive ? 'rgba(255,255,255,0.85)' : colors.textSub },
                                    ]}
                                >
                                    {isActive ? 'Actif' : 'Activer'}
                                </Text>
                            </View>
                            {isPending && (
                                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 4 }} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    scrollList: {
        gap: Spacing.sm,
        paddingRight: Spacing.md,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        borderRadius: Radii.xl,
        borderWidth: 1,
        gap: Spacing.sm,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    chipSub: {
        fontSize: 10,
        marginTop: 1,
    },
});
