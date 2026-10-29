// ============================================================
//  Composant : PrimaryButton
//  Bouton principal arrondi avec état pending / disabled / danger
// ============================================================

import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors, Radii, FontSize, FontWeight, Spacing, Shadows } from '../constants/theme';

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    label,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    style,
    textStyle,
    fullWidth = true,
}) => {
    const isDisabled = disabled || loading;

    const bgColor = () => {
        if (isDisabled) return Colors.surfaceBorder;
        switch (variant) {
            case 'primary': return Colors.primary;
            case 'secondary': return Colors.secondary;
            case 'danger': return Colors.danger;
            case 'ghost': return Colors.transparent;
        }
    };

    const textColor = () => {
        if (isDisabled) return Colors.textDisabled;
        switch (variant) {
            case 'ghost': return Colors.primary;
            default: return Colors.text;
        }
    };

    const shadow = variant === 'danger' ? Shadows.danger
        : variant === 'primary' ? Shadows.button
            : {};

    return (
        <TouchableOpacity
            style={[
                styles.base,
                { backgroundColor: bgColor(), width: fullWidth ? '100%' : 'auto' },
                isDisabled ? {} : shadow,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={Colors.text} size="small" />
            ) : (
                <Text style={[styles.label, { color: textColor() }, textStyle]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radii.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    label: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        letterSpacing: 0.3,
    },
});
