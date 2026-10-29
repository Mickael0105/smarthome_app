// ============================================================
//  Composant : OpeningsSummaryCard
//  Synthèse visuelle de l'ensemble des ouvrants (Portes, Garage, Fenêtres)
//  Design Vectoriel Exclusif (SmartIcon) — Zéro Emoji
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SmartIcon } from './SmartIcon';

export const OpeningsSummaryCard: React.FC = () => {
    const { colors } = useAppTheme();
    const router = useRouter();
    const doors = useHouseStore((s) => s.status?.doors);
    const garage = useHouseStore((s) => s.status?.garage);
    const windows = useHouseStore((s) => s.status?.windows);

    const doorsArr = doors ?? [];
    const windowsArr = windows ?? [];

    const lockedDoorsCount = doorsArr.filter((d) => d.lock === 'locked').length;
    const openWindowsCount = windowsArr.filter((w) => w.open).length;
    const isGarageClosed = garage?.state === 'closed';

    const isAllSecure = lockedDoorsCount === doorsArr.length && isGarageClosed && openWindowsCount === 0;

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
            onPress={() => router.push('/securite')}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <View style={styles.titleWrap}>
                    <View
                        style={[
                            styles.shieldWrap,
                            { backgroundColor: isAllSecure ? colors.primaryDim : colors.warningDim },
                        ]}
                    >
                        <SmartIcon
                            name="security"
                            size={18}
                            color={isAllSecure ? colors.primary : colors.warning}
                        />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>Périmètre & Ouvrants</Text>
                        <Text style={[styles.subtitle, { color: colors.textSub }]}>
                            {isAllSecure ? 'Tous les accès sont sécurisés' : 'Attention : ouvrants détectés ouverts'}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.badge,
                        {
                            backgroundColor: isAllSecure ? colors.primaryDim : colors.warningDim,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.badgeText,
                            {
                                color: isAllSecure ? colors.primary : colors.warning,
                            },
                        ]}
                    >
                        {isAllSecure ? 'Sécurisé' : 'Vérifier'}
                    </Text>
                </View>
            </View>

            <View style={styles.itemsRow}>
                {/* Portes */}
                <View style={[styles.itemBox, { backgroundColor: colors.surfaceAlt }]}>
                    <SmartIcon name="security" size={18} color={lockedDoorsCount === doorsArr.length ? colors.primary : colors.warning} />
                    <Text style={[styles.itemCount, { color: colors.text, marginTop: 4 }]}>
                        {lockedDoorsCount}/{doorsArr.length}
                    </Text>
                    <Text style={[styles.itemLabel, { color: colors.textSub }]}>Portes Verr.</Text>
                </View>

                {/* Garage */}
                <View style={[styles.itemBox, { backgroundColor: colors.surfaceAlt }]}>
                    <SmartIcon name="garage" size={18} color={isGarageClosed ? colors.primary : colors.warning} />
                    <Text
                        style={[
                            styles.itemCount,
                            { color: isGarageClosed ? colors.primary : colors.warning, marginTop: 4 },
                        ]}
                    >
                        {garage ? (garage.state === 'closed' ? 'Fermé' : 'Ouvert') : 'N/A'}
                    </Text>
                    <Text style={[styles.itemLabel, { color: colors.textSub }]}>Porte Garage</Text>
                </View>

                {/* Fenêtres */}
                <View style={[styles.itemBox, { backgroundColor: colors.surfaceAlt }]}>
                    <SmartIcon name="window" size={18} color={openWindowsCount === 0 ? colors.primary : colors.warning} />
                    <Text
                        style={[
                            styles.itemCount,
                            { color: openWindowsCount === 0 ? colors.primary : colors.warning, marginTop: 4 },
                        ]}
                    >
                        {openWindowsCount > 0 ? `${openWindowsCount} ouv.` : 'Fermées'}
                    </Text>
                    <Text style={[styles.itemLabel, { color: colors.textSub }]}>Fenêtres</Text>
                </View>
            </View>
        </TouchableOpacity>
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
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    shieldWrap: {
        width: 32,
        height: 32,
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
        fontWeight: FontWeight.bold,
    },
    itemsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    itemBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: 4,
        borderRadius: Radii.md,
    },
    itemCount: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },
    itemLabel: {
        fontSize: 10,
        marginTop: 2,
    },
});
