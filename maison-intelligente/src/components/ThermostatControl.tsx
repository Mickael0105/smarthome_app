// ============================================================
//  Composant : ThermostatControl
//  Consigne de température avec ajustement +/- et confirmation
//  Mode Sombre & Mode Clair
// ============================================================

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Radii, Spacing, FontSize, FontWeight, Shadows } from '../constants/theme';
import { SETPOINT_MIN, SETPOINT_MAX, SETPOINT_STEP } from '../config/app.config';
import { clamp, roundToStep } from '../utils/helpers';
import { useAppTheme } from '../hooks/useAppTheme';

interface ThermostatControlProps {
    setpoint: number | null;
    pendingSetpoint: number;
    onSetpointChange: (value: number) => void;
    onConfirm: () => void;
    isPending: boolean;
    isError: boolean;
    errorMessage?: string;
    onRetry?: () => void;
}

export const ThermostatControl: React.FC<ThermostatControlProps> = ({
    setpoint,
    pendingSetpoint,
    onSetpointChange,
    onConfirm,
    isPending,
    isError,
    errorMessage,
    onRetry,
}) => {
    const { colors } = useAppTheme();

    const increment = () => {
        const next = clamp(roundToStep(pendingSetpoint + SETPOINT_STEP, SETPOINT_STEP), SETPOINT_MIN, SETPOINT_MAX);
        onSetpointChange(next);
    };

    const decrement = () => {
        const next = clamp(roundToStep(pendingSetpoint - SETPOINT_STEP, SETPOINT_STEP), SETPOINT_MIN, SETPOINT_MAX);
        onSetpointChange(next);
    };

    const hasChanged = setpoint !== null && pendingSetpoint !== setpoint;

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                },
                Shadows.card,
            ]}
        >
            <Text style={[styles.label, { color: colors.textSub }]}>Consigne de température</Text>

            {/* Contrôle +/- */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[
                        styles.stepBtn,
                        {
                            backgroundColor: colors.surfaceAlt,
                            borderColor: colors.primary,
                        },
                        pendingSetpoint <= SETPOINT_MIN && { borderColor: colors.textDisabled, opacity: 0.4 },
                    ]}
                    onPress={decrement}
                    disabled={pendingSetpoint <= SETPOINT_MIN || isPending}
                >
                    <Text style={[styles.stepBtnText, { color: colors.primary }]}>−</Text>
                </TouchableOpacity>

                <View style={styles.valueContainer}>
                    <Text style={[styles.value, { color: colors.text }]}>{pendingSetpoint.toFixed(1)}</Text>
                    <Text style={[styles.unit, { color: colors.textSub }]}>°C</Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.stepBtn,
                        {
                            backgroundColor: colors.surfaceAlt,
                            borderColor: colors.primary,
                        },
                        pendingSetpoint >= SETPOINT_MAX && { borderColor: colors.textDisabled, opacity: 0.4 },
                    ]}
                    onPress={increment}
                    disabled={pendingSetpoint >= SETPOINT_MAX || isPending}
                >
                    <Text style={[styles.stepBtnText, { color: colors.primary }]}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Bornes info */}
            <Text style={[styles.bounds, { color: colors.textDisabled }]}>
                Limites : {SETPOINT_MIN} °C — {SETPOINT_MAX} °C · Pas : {SETPOINT_STEP} °C
            </Text>

            {/* Valeur confirmée */}
            <Text style={[styles.confirmed, { color: colors.textSub }]}>
                {setpoint !== null
                    ? `Consigne active enregistrée : ${setpoint.toFixed(1)} °C`
                    : 'Consigne : Indisponible'}
            </Text>

            {/* Bouton confirmer */}
            {hasChanged && !isError && (
                <TouchableOpacity
                    style={[
                        styles.confirmBtn,
                        { backgroundColor: colors.primary },
                        isPending && styles.confirmBtnDisabled,
                    ]}
                    onPress={onConfirm}
                    disabled={isPending}
                >
                    {isPending ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.confirmText}>Appliquer la consigne</Text>
                    )}
                </TouchableOpacity>
            )}

            {/* Erreur + Réessayer */}
            {isError && (
                <View style={[styles.errorRow, { backgroundColor: colors.dangerDim }]}>
                    <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage ?? 'Erreur'}</Text>
                    {onRetry && (
                        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.danger }]} onPress={onRetry}>
                            <Text style={styles.retryText}>Réessayer</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Radii.xl,
        borderWidth: 1,
        padding: Spacing.lg,
        alignItems: 'center',
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginBottom: Spacing.lg,
        letterSpacing: 0.4,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xl,
    },
    stepBtn: {
        width: 56,
        height: 56,
        borderRadius: Radii.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    stepBtnText: {
        fontSize: 28,
        lineHeight: 32,
        fontWeight: FontWeight.bold,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
    },
    value: {
        fontSize: 52,
        fontWeight: FontWeight.extrabold,
        lineHeight: 58,
    },
    unit: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.medium,
        marginBottom: 8,
    },
    bounds: {
        fontSize: FontSize.xs,
        marginTop: Spacing.md,
    },
    confirmed: {
        fontSize: FontSize.sm,
        marginTop: Spacing.xs,
    },
    confirmBtn: {
        marginTop: Spacing.lg,
        paddingVertical: Spacing.sm + 4,
        paddingHorizontal: Spacing.xl,
        borderRadius: Radii.lg,
        ...Shadows.button,
    },
    confirmBtnDisabled: {
        opacity: 0.6,
    },
    confirmText: {
        color: '#FFFFFF',
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
    },
    errorRow: {
        marginTop: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.sm,
        borderRadius: Radii.md,
        width: '100%',
    },
    errorText: {
        fontSize: FontSize.xs,
        flex: 1,
    },
    retryBtn: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 5,
        borderRadius: Radii.sm,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
});
