// ============================================================
//  Composant : AlertBanner
//  Bandeau rouge d'alerte intrusion — visible sur tous les écrans
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, Radii } from '../constants/theme';
import { useHouseStore } from '../store/useHouseStore';
import { SmartIcon } from './SmartIcon';
import { SoundAlert } from '../utils/soundAlert';
import { Haptics } from '../utils/haptics';

export const AlertBanner: React.FC = () => {
    const alert = useHouseStore((s) => s.status?.alert);
    const acknowledgeAlert = useHouseStore((s) => s.acknowledgeAlert);
    const alertAckCommand = useHouseStore((s) => s.alertAckCommand);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (alert?.active) {
            SoundAlert.startIntrusionAlarm();
            // Animation de clignotement d'urgence
            const loop = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.7,
                        duration: 350,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 350,
                        useNativeDriver: true,
                    }),
                ])
            );
            loop.start();
            return () => {
                loop.stop();
                SoundAlert.stop();
            };
        } else {
            SoundAlert.stop();
        }
    }, [alert?.active]);

    if (!alert?.active) return null;

    const handleAck = () => {
        Haptics.success();
        acknowledgeAlert();
    };

    return (
        <Animated.View style={[styles.banner, { opacity: pulseAnim }]}>
            <View style={styles.left}>
                <View style={styles.iconBox}>
                    <SmartIcon name="alert" size={22} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>ALERTE INTRUSION EN COURS</Text>
                    <Text style={styles.sub}>
                        {alert.message || "Effraction détectée en mode verrouillé !"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={[
                    styles.ackBtn,
                    alertAckCommand.status === 'pending' && styles.ackBtnDisabled,
                ]}
                onPress={handleAck}
                disabled={alertAckCommand.status === 'pending'}
                activeOpacity={0.8}
            >
                <Text style={styles.ackText}>
                    {alertAckCommand.status === 'pending' ? '…' : 'Acquitter'}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: Colors.danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        gap: Spacing.sm,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: Colors.text,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.8,
    },
    sub: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: FontSize.xs,
        marginTop: 1,
    },
    ackBtn: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs + 2,
        borderRadius: Radii.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    ackBtnDisabled: {
        opacity: 0.5,
    },
    ackText: {
        color: Colors.text,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
});
