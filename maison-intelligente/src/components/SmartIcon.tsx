// ============================================================
//  Composant : SmartIcon — Émojis 3D style iOS
//  Rendu comme les émojis du clavier iPhone (colorés, 3D, vivants)
//  Compatible iOS & Android — Zéro SVG, Zéro dépendance externe
// ============================================================

import React from 'react';
import { Text, View, ViewStyle, TextStyle, Platform } from 'react-native';

export type SmartIconName =
    | 'home'
    | 'light'
    | 'security'
    | 'climate'
    | 'garage'
    | 'window'
    | 'motion'
    | 'energy'
    | 'scenario'
    | 'history'
    | 'sun'
    | 'moon'
    | 'admin'
    | 'user'
    | 'guest'
    | 'wifi'
    | 'alert'
    | 'check'
    | 'settings'
    | 'power'
    | 'door'
    | 'door-open'
    | 'humidity'
    | 'heat'
    | 'cool'
    | 'eco'
    | 'cinema'
    | 'bed'
    | 'sofa'
    | 'kitchen'
    | 'garden'
    | 'battery'
    | 'warning'
    | 'sync'
    | 'cross'
    | 'eye'
    | 'eye-off'
    | 'shield'
    | 'logout';

// ─── Mapping complet icône → émoji ────────────────────────────
const EMOJI_MAP: Record<SmartIconName, string> = {
    'home':       '🏠',
    'light':      '💡',
    'security':   '🔒',
    'climate':    '🌡️',
    'garage':     '🚗',
    'window':     '🪟',
    'motion':     '🚶',
    'energy':     '⚡',
    'scenario':   '✨',
    'history':    '🕐',
    'sun':        '☀️',
    'moon':       '🌙',
    'admin':      '👑',
    'user':       '👤',
    'guest':      '👋',
    'wifi':       '📶',
    'alert':      '🚨',
    'check':      '✅',
    'settings':   '⚙️',
    'power':      '🔌',
    'door':       '🚪',
    'door-open':  '🔓',
    'humidity':   '💧',
    'heat':       '🔥',
    'cool':       '❄️',
    'eco':        '🌿',
    'cinema':     '🎬',
    'bed':        '🛏️',
    'sofa':       '🛋️',
    'kitchen':    '🍳',
    'garden':     '🌱',
    'battery':    '🔋',
    'warning':    '⚠️',
    'sync':       '🔄',
    'cross':      '✖️',
    'eye':        '👁️',
    'eye-off':    '🙈',
    'shield':     '🛡️',
    'logout':     '🚪',
};

interface SmartIconProps {
    name: SmartIconName;
    size?: number;
    color?: string;          // ignoré — les émojis ont leurs propres couleurs
    secondaryColor?: string; // ignoré
    style?: ViewStyle;
}

export const SmartIcon: React.FC<SmartIconProps> = ({
    name,
    size = 24,
    style,
}) => {
    const emoji = EMOJI_MAP[name] ?? '●';

    // Taille du texte calibrée pour que l'émoji remplisse bien le carré
    const fontSize = size * 0.85;

    // Ombre iOS-like pour effet 3D (shadow sous le glyphe)
    const textStyle: TextStyle = {
        fontSize,
        lineHeight: size * 1.1,
        includeFontPadding: false,
        textAlignVertical: 'center',
        textAlign: 'center',
        // Ombre portée style iOS pour l'effet 3D
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.18,
                shadowRadius: 1,
            },
            android: {
                // Sur Android les émojis sont déjà naturellement 3D
            },
        }),
    };

    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style,
            ]}
        >
            <Text style={textStyle} allowFontScaling={false}>
                {emoji}
            </Text>
        </View>
    );
};

export default SmartIcon;
