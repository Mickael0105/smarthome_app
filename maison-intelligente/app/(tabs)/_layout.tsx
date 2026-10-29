// ============================================================
//  Layout des onglets — Navigation Principale
//  Design Vectoriel Exclusif (SmartIcon) — Zéro Emoji
// ============================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { FontSize, FontWeight } from '../../src/constants/theme';
import { SmartIcon, type SmartIconName } from '../../src/components/SmartIcon';

const TAB_ICON_NAMES: Record<string, SmartIconName> = {
    index: 'home',
    lumieres: 'light',
    securite: 'security',
    temperature: 'climate',
    historique: 'history',
};

const TAB_LABELS: Record<string, string> = {
    index: 'Accueil',
    lumieres: 'Lumières',
    securite: 'Sécurité',
    temperature: 'Climat',
    historique: 'Journal',
};

interface TabIconProps {
    name: string;
    focused: boolean;
}

function TabIcon({ name, focused }: TabIconProps) {
    const { colors } = useAppTheme();
    const iconName = TAB_ICON_NAMES[name] ?? 'home';
    const iconColor = focused ? colors.primary : colors.textDisabled;

    return (
        <View style={[styles.tabItem, focused && styles.tabItemActive]}>
            <View style={[styles.iconWrapper, focused && { backgroundColor: `${colors.primary}18` }]}>
                <SmartIcon name={iconName} size={22} color={iconColor} />
            </View>
            <Text
                style={[
                    styles.tabLabel,
                    {
                        color: iconColor,
                        fontWeight: focused ? FontWeight.bold : FontWeight.medium,
                    },
                ]}
            >
                {TAB_LABELS[name] ?? name}
            </Text>
            {focused && <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />}
        </View>
    );
}

export default function TabsLayout() {
    const { colors } = useAppTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        backgroundColor: colors.tabBar,
                        borderTopColor: colors.tabBarBorder,
                    },
                ],
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textDisabled,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="lumieres"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="lumieres" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="securite"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="securite" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="temperature"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="temperature" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="historique"
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="historique" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: 1,
        height: 74,
        paddingBottom: 8,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 6,
        width: 64,
        position: 'relative',
    },
    tabItemActive: {},
    iconWrapper: {
        width: 38,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    tabLabel: {
        fontSize: FontSize.xs - 1,
        letterSpacing: 0.2,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: -2,
    },
});
