// ============================================================
//  Composant : Card
//  Surface de carte adaptative (Mode Sombre / Mode Clair)
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Radii, Spacing, Shadows } from '../constants/theme';
import { useAppTheme } from '../hooks/useAppTheme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: number;
    noShadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    padding = Spacing.md,
    noShadow = false,
}) => {
    const { colors } = useAppTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                    padding,
                },
                noShadow ? {} : Shadows.card,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Radii.lg,
        borderWidth: 1,
    },
});
