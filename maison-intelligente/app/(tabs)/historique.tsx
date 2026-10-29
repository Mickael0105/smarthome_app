// ============================================================
//  Écran : Historique / Journal d'audit
//  Journal chronologique des événements avec filtres par gravité
// ============================================================

import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHouseStore } from '../../src/store/useHouseStore';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { Spacing, FontSize, FontWeight, Radii } from '../../src/constants/theme';
import { AppHeader } from '../../src/components/AppHeader';
import { EventItem } from '../../src/components/EventItem';
import { UnavailableState } from '../../src/components/UnavailableState';
import type { EventSeverity } from '../../src/types/house';

type Filter = 'all' | EventSeverity;

const FILTERS: { key: Filter; label: string; dotColor?: string }[] = [
    { key: 'all', label: 'Tout' },
    { key: 'critical', label: 'Critique', dotColor: '#EF4444' },
    { key: 'warning', label: 'Alerte', dotColor: '#F59E0B' },
    { key: 'info', label: 'Normal', dotColor: '#10B981' },
];

export default function HistoriqueScreen() {
    const { colors } = useAppTheme();
    const events = useHouseStore((s) => s.events);
    const fetchEvents = useHouseStore((s) => s.fetchEvents);
    const [filter, setFilter] = useState<Filter>('all');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    };

    const filtered = filter === 'all' ? events : events.filter((e) => e.severity === filter);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
            <AppHeader title="Journal des Événements" showConnection />

            {/* Rangée de Filtres */}
            <View style={[styles.filterRow, { borderBottomColor: colors.surfaceBorder }]}>
                {FILTERS.map((f) => {
                    const isActive = filter === f.key;
                    return (
                        <TouchableOpacity
                            key={f.key}
                            style={[
                                styles.filterBtn,
                                {
                                    backgroundColor: isActive ? colors.primary : colors.surface,
                                    borderColor: isActive ? colors.primary : colors.surfaceBorder,
                                },
                            ]}
                            onPress={() => setFilter(f.key)}
                        >
                            {f.dotColor && (
                                <View
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: isActive ? '#FFFFFF' : f.dotColor,
                                        marginRight: 6,
                                    }}
                                />
                            )}
                            <Text
                                style={[
                                    styles.filterLabel,
                                    { color: isActive ? '#FFFFFF' : colors.textSub },
                                ]}
                            >
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {filtered.length === 0 ? (
                    <UnavailableState
                        variant="unavailable"
                        label={filter === 'all' ? 'Aucun événement enregistré' : 'Aucun événement dans cette catégorie'}
                    />
                ) : (
                    filtered.map((event) => <EventItem key={event.id} event={event} />)
                )}

                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    filterRow: {
        flexDirection: 'row',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    filterBtn: {
        paddingHorizontal: Spacing.sm + 2,
        paddingVertical: 6,
        borderRadius: Radii.full,
        borderWidth: 1,
    },
    filterLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
    scroll: { flex: 1 },
    content: { padding: Spacing.md },
});
