// ============================================================
//  Composant : EventItem
//  Ligne d'historique d'événement avec icône et sévérité adaptative
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Radii, Spacing, FontSize, FontWeight } from '../constants/theme';
import { useAppTheme } from '../hooks/useAppTheme';
import { SmartIcon, SmartIconName } from './SmartIcon';
import type { HouseEvent } from '../types/house';
import { formatDate } from '../utils/helpers';

const EVENT_SMART_ICONS: Record<string, SmartIconName> = {
    light_on: 'light',
    light_off: 'light',
    lock: 'security',
    unlock: 'security',
    alert: 'alert',
    alert_ack: 'check',
    login: 'user',
    logout: 'logout',
    setpoint_change: 'climate',
    door_open: 'door-open',
    door_close: 'door',
    garage: 'garage',
    window: 'window',
    motion: 'motion',
    scenario: 'scenario',
};

interface EventItemProps {
    event: HouseEvent;
}

export const EventItem: React.FC<EventItemProps> = ({ event }) => {
    const { colors, isDark } = useAppTheme();
    const iconName: SmartIconName = EVENT_SMART_ICONS[event.type] ?? 'history';

    const severityColor =
        event.severity === 'critical'
            ? colors.danger
            : event.severity === 'warning'
            ? colors.warning
            : colors.primary;

    return (
        <View
            style={[
                styles.row,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                },
            ]}
        >
            {/* Barre de sévérité */}
            <View style={[styles.severityBar, { backgroundColor: severityColor }]} />

            {/* Icône vectorielle */}
            <View
                style={[
                    styles.iconWrapper,
                    {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        borderColor: `${severityColor}33`,
                    },
                ]}
            >
                <SmartIcon name={iconName} size={18} color={severityColor} />
            </View>

            {/* Contenu */}
            <View style={styles.content}>
                <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
                    {event.description ?? event.message}
                </Text>
                <Text style={[styles.date, { color: colors.textSub }]}>{formatDate(event.created_at ?? event.timestamp)}</Text>
            </View>

            {/* Badge sévérité */}
            {event.severity !== 'info' && (
                <View
                    style={[
                        styles.badge,
                        {
                            backgroundColor:
                                event.severity === 'critical' ? colors.dangerDim : colors.warningDim,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.badgeText,
                            { color: event.severity === 'critical' ? colors.danger : colors.warning },
                        ]}
                    >
                        {event.severity === 'critical' ? 'Critique' : 'Attention'}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Radii.lg,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        overflow: 'hidden',
    },
    severityBar: {
        width: 4,
        alignSelf: 'stretch',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.sm,
    },
    icon: {
        fontSize: 18,
    },
    content: {
        flex: 1,
        paddingVertical: Spacing.sm,
    },
    description: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },
    date: {
        fontSize: 11,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radii.full,
        marginRight: Spacing.sm,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
    },
});
