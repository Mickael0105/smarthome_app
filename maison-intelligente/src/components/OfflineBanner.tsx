// ============================================================
//  Composant : OfflineBanner
//  Affiche la file d'attente hors-ligne (Outbox Pattern) et synchronise
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useHouseStore } from '../store/useHouseStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { Spacing, Radii, FontSize, FontWeight } from '../constants/theme';
import { SmartIcon } from './SmartIcon';

export const OfflineBanner: React.FC = () => {
    const { colors } = useAppTheme();
    const offlineQueue = useHouseStore((s) => s.offlineQueue);
    const flushOfflineQueue = useHouseStore((s) => s.flushOfflineQueue);
    const connectionStatus = useHouseStore((s) => s.connectionStatus);
    const [isSyncing, setIsSyncing] = useState(false);

    if (offlineQueue.length === 0 && connectionStatus === 'connected') {
        return null;
    }

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await flushOfflineQueue();
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.warningDim, borderColor: colors.warning }]}>
            <View style={styles.textWrap}>
                <View style={styles.iconBox}>
                    <SmartIcon name="wifi" size={18} color={colors.warning} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.warning }]}>
                        {offlineQueue.length > 0
                            ? `${offlineQueue.length} commande(s) hors-ligne en attente`
                            : 'Connexion réseau instable'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSub }]}>
                        {offlineQueue.length > 0
                            ? 'File Outbox active : commandes prêtes pour envoi'
                            : 'Données en cache local (Résilience Offline-First)'}
                    </Text>
                </View>
            </View>

            {offlineQueue.length > 0 && (
                <TouchableOpacity
                    style={[styles.syncBtn, { backgroundColor: colors.warning }]}
                    onPress={handleSync}
                    disabled={isSyncing}
                >
                    {isSyncing ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.syncBtnText}>Envoyer</Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    textWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    iconBox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    subtitle: {
        fontSize: 10,
        marginTop: 1,
    },
    syncBtn: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 5,
        borderRadius: Radii.sm,
        marginLeft: Spacing.sm,
    },
    syncBtnText: {
        color: '#FFF',
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
});
