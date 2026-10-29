// ============================================================
//  Composant : SmartIcon (Design Exclusif — Zéro Emoji)
//  Glyphes vectoriels géométriques sur-mesure (Pur React Native)
//  Rendu ultra-net, haute fidélité, compatible iOS & Android
// ============================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

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

interface SmartIconProps {
    name: SmartIconName;
    size?: number;
    color?: string;
    secondaryColor?: string;
    style?: ViewStyle;
}

export const SmartIcon: React.FC<SmartIconProps> = ({
    name,
    size = 24,
    color = '#10B981',
    secondaryColor,
    style,
}) => {
    const sec = secondaryColor ?? `${color}33`;
    const s = size;

    switch (name) {
        // --- 1. MAISON (Home) ---
        case 'home':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Toit biseauté */}
                    <View
                        style={{
                            width: s * 0.72,
                            height: s * 0.42,
                            borderTopWidth: 2.2,
                            borderLeftWidth: 2.2,
                            borderColor: color,
                            transform: [{ rotate: '45deg' }],
                            position: 'absolute',
                            top: s * 0.12,
                            borderTopLeftRadius: 3,
                        }}
                    />
                    {/* Cheminée */}
                    <View
                        style={{
                            width: s * 0.12,
                            height: s * 0.2,
                            backgroundColor: color,
                            position: 'absolute',
                            top: s * 0.12,
                            right: s * 0.18,
                            borderRadius: 1,
                        }}
                    />
                    {/* Corps de maison */}
                    <View
                        style={{
                            width: s * 0.65,
                            height: s * 0.45,
                            borderWidth: 2,
                            borderTopWidth: 0,
                            borderColor: color,
                            position: 'absolute',
                            bottom: s * 0.1,
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        {/* Porte centrale */}
                        <View
                            style={{
                                width: s * 0.22,
                                height: s * 0.26,
                                backgroundColor: color,
                                borderTopLeftRadius: 3,
                                borderTopRightRadius: 3,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 2. LUMIÈRE (Lightbulb) ---
        case 'light':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Ampoule goutte */}
                    <View
                        style={{
                            width: s * 0.55,
                            height: s * 0.55,
                            borderRadius: (s * 0.55) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            alignItems: 'center',
                            justifyContent: 'center',
                            top: -s * 0.1,
                        }}
                    >
                        {/* Filament interne */}
                        <View
                            style={{
                                width: s * 0.15,
                                height: s * 0.15,
                                borderRadius: s * 0.08,
                                backgroundColor: color,
                            }}
                        />
                    </View>
                    {/* Culot vissé */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: s * 0.15,
                            width: s * 0.28,
                            height: s * 0.18,
                            borderWidth: 1.8,
                            borderColor: color,
                            borderRadius: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ width: '70%', height: 1.5, backgroundColor: color }} />
                    </View>
                    {/* Point de contact */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: s * 0.08,
                            width: s * 0.12,
                            height: s * 0.06,
                            backgroundColor: color,
                            borderBottomLeftRadius: 2,
                            borderBottomRightRadius: 2,
                        }}
                    />
                </View>
            );

        // --- 3. SÉCURITÉ / SERRURE (Shield Lock) ---
        case 'security':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Anse du cadenas */}
                    <View
                        style={{
                            width: s * 0.36,
                            height: s * 0.36,
                            borderTopWidth: 2.2,
                            borderLeftWidth: 2.2,
                            borderRightWidth: 2.2,
                            borderColor: color,
                            borderTopLeftRadius: s * 0.18,
                            borderTopRightRadius: s * 0.18,
                            position: 'absolute',
                            top: s * 0.12,
                        }}
                    />
                    {/* Corps blindé */}
                    <View
                        style={{
                            width: s * 0.62,
                            height: s * 0.48,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            borderRadius: 6,
                            position: 'absolute',
                            bottom: s * 0.12,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Trou de serrure */}
                        <View
                            style={{
                                width: s * 0.14,
                                height: s * 0.14,
                                borderRadius: s * 0.07,
                                backgroundColor: color,
                            }}
                        />
                        <View
                            style={{
                                width: s * 0.08,
                                height: s * 0.12,
                                backgroundColor: color,
                                marginTop: -1,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 4. CLIMAT / THERMOMÈTRE (Climate) ---
        case 'climate':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Tube vertical */}
                    <View
                        style={{
                            width: s * 0.22,
                            height: s * 0.56,
                            borderWidth: 2,
                            borderColor: color,
                            borderTopLeftRadius: s * 0.11,
                            borderTopRightRadius: s * 0.11,
                            backgroundColor: sec,
                            position: 'absolute',
                            top: s * 0.1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: 2,
                        }}
                    >
                        {/* Colonne de mercure */}
                        <View
                            style={{
                                width: s * 0.08,
                                height: '65%',
                                backgroundColor: color,
                                borderRadius: 1,
                            }}
                        />
                    </View>
                    {/* Bulbe inférieur */}
                    <View
                        style={{
                            width: s * 0.42,
                            height: s * 0.42,
                            borderRadius: s * 0.21,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: color,
                            position: 'absolute',
                            bottom: s * 0.1,
                        }}
                    />
                    {/* Graduations latérales */}
                    <View style={{ position: 'absolute', right: s * 0.15, top: s * 0.2, gap: 3 }}>
                        <View style={{ width: 4, height: 1.5, backgroundColor: color }} />
                        <View style={{ width: 6, height: 1.5, backgroundColor: color }} />
                        <View style={{ width: 4, height: 1.5, backgroundColor: color }} />
                    </View>
                </View>
            );

        // --- 5. GARAGE MOTORISÉ (Garage Door) ---
        case 'garage':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Châssis extérieur */}
                    <View
                        style={{
                            width: s * 0.78,
                            height: s * 0.72,
                            borderWidth: 2,
                            borderColor: color,
                            borderRadius: 4,
                            padding: 2,
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Lames sectionnelles horizontales */}
                        <View style={{ height: 2, backgroundColor: color, borderRadius: 1 }} />
                        <View style={{ height: 2, backgroundColor: color, borderRadius: 1 }} />
                        <View style={{ height: 2, backgroundColor: color, borderRadius: 1 }} />
                        <View style={{ height: 2, backgroundColor: color, borderRadius: 1 }} />
                        {/* Poignée centrale de sécurité */}
                        <View
                            style={{
                                width: s * 0.24,
                                height: 3,
                                backgroundColor: color,
                                alignSelf: 'center',
                                borderRadius: 1.5,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 6. FENÊTRE & BAIE VITRÉE (Window) ---
        case 'window':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Dormant / Cadre extérieur */}
                    <View
                        style={{
                            width: s * 0.74,
                            height: s * 0.74,
                            borderWidth: 2,
                            borderColor: color,
                            borderRadius: 4,
                            backgroundColor: sec,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Croisillon vertical */}
                        <View
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                bottom: 0,
                                width: 2,
                                marginLeft: -1,
                                backgroundColor: color,
                            }}
                        />
                        {/* Croisillon horizontal */}
                        <View
                            style={{
                                position: 'absolute',
                                top: '48%',
                                left: 0,
                                right: 0,
                                height: 2,
                                marginTop: -1,
                                backgroundColor: color,
                            }}
                        />
                        {/* Reflet de vitre diagonale */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 2,
                                left: 2,
                                width: 6,
                                height: 6,
                                borderTopWidth: 1.5,
                                borderLeftWidth: 1.5,
                                borderColor: '#FFF',
                                opacity: 0.7,
                            }}
                        />
                    </View>
                    {/* Appui de fenêtre inférieur */}
                    <View
                        style={{
                            width: s * 0.86,
                            height: 2.5,
                            backgroundColor: color,
                            borderRadius: 1.5,
                            marginTop: 1,
                        }}
                    />
                </View>
            );

        // --- 7. CAPTEUR DE PRÉSENCE PIR (Motion Waves) ---
        case 'motion':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Onde externe */}
                    <View
                        style={{
                            width: s * 0.82,
                            height: s * 0.82,
                            borderRadius: (s * 0.82) / 2,
                            borderWidth: 1.5,
                            borderColor: `${color}44`,
                            borderBottomColor: 'transparent',
                            borderLeftColor: 'transparent',
                            transform: [{ rotate: '-45deg' }],
                            position: 'absolute',
                        }}
                    />
                    {/* Onde intermédiaire */}
                    <View
                        style={{
                            width: s * 0.56,
                            height: s * 0.56,
                            borderRadius: (s * 0.56) / 2,
                            borderWidth: 1.8,
                            borderColor: `${color}88`,
                            borderBottomColor: 'transparent',
                            borderLeftColor: 'transparent',
                            transform: [{ rotate: '-45deg' }],
                            position: 'absolute',
                        }}
                    />
                    {/* Lentille de Fresnel centrale */}
                    <View
                        style={{
                            width: s * 0.28,
                            height: s * 0.28,
                            borderRadius: (s * 0.28) / 2,
                            backgroundColor: color,
                        }}
                    />
                </View>
            );

        // --- 8. ÉNERGIE (Power Bolt) ---
        case 'energy':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Éclair géométrique taillé au rasoir */}
                    <View
                        style={{
                            width: s * 0.75,
                            height: s * 0.75,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: s * 0.35,
                                height: s * 0.45,
                                borderTopWidth: 3,
                                borderRightWidth: 3,
                                borderColor: color,
                                transform: [{ skewX: '-24deg' }],
                                top: -s * 0.08,
                                left: -s * 0.04,
                            }}
                        />
                        <View
                            style={{
                                width: s * 0.35,
                                height: s * 0.45,
                                borderBottomWidth: 3,
                                borderLeftWidth: 3,
                                borderColor: color,
                                transform: [{ skewX: '-24deg' }],
                                bottom: -s * 0.08,
                                right: -s * 0.04,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 9. SCÉNARIO (Star Sparkle) ---
        case 'scenario':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Étoile 4 branches losange */}
                    <View
                        style={{
                            width: s * 0.52,
                            height: s * 0.52,
                            backgroundColor: color,
                            borderRadius: 2,
                            transform: [{ rotate: '45deg' }],
                        }}
                    />
                    {/* Satellite micro-étoile */}
                    <View
                        style={{
                            width: s * 0.18,
                            height: s * 0.18,
                            backgroundColor: color,
                            borderRadius: 1,
                            position: 'absolute',
                            top: s * 0.12,
                            right: s * 0.15,
                            transform: [{ rotate: '45deg' }],
                        }}
                    />
                </View>
            );

        // --- 10. HISTORIQUE / CHRONOLOGIE (Audit History) ---
        case 'history':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Cadran d'horloge circulaire */}
                    <View
                        style={{
                            width: s * 0.74,
                            height: s * 0.74,
                            borderRadius: (s * 0.74) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Aiguille des heures */}
                        <View
                            style={{
                                width: 2,
                                height: s * 0.22,
                                backgroundColor: color,
                                position: 'absolute',
                                top: s * 0.14,
                                borderRadius: 1,
                            }}
                        />
                        {/* Aiguille des minutes */}
                        <View
                            style={{
                                height: 2,
                                width: s * 0.22,
                                backgroundColor: color,
                                position: 'absolute',
                                right: s * 0.14,
                                borderRadius: 1,
                            }}
                        />
                        {/* Pivot central */}
                        <View
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: color,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 11. SOLEIL (Sun Mode Clair) ---
        case 'sun':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.44,
                            height: s * 0.44,
                            borderRadius: (s * 0.44) / 2,
                            backgroundColor: color,
                        }}
                    />
                    {/* Rayons solaires cardinaux */}
                    <View style={{ position: 'absolute', width: 2, height: s * 0.88, backgroundColor: color, borderRadius: 1 }} />
                    <View style={{ position: 'absolute', height: 2, width: s * 0.88, backgroundColor: color, borderRadius: 1 }} />
                    <View style={{ position: 'absolute', width: 2, height: s * 0.78, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '45deg' }] }} />
                    <View style={{ position: 'absolute', height: 2, width: s * 0.78, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '45deg' }] }} />
                </View>
            );

        // --- 12. LUNE (Moon Mode Sombre) ---
        case 'moon':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.62,
                            height: s * 0.62,
                            borderRadius: (s * 0.62) / 2,
                            borderWidth: 2.2,
                            borderColor: color,
                            borderRightColor: 'transparent',
                            transform: [{ rotate: '-35deg' }],
                        }}
                    />
                    <View
                        style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: color,
                            position: 'absolute',
                            top: s * 0.2,
                            right: s * 0.22,
                        }}
                    />
                </View>
            );

        // --- 13. ADMIN / COURONNE (Admin Role) ---
        case 'admin':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.74,
                            height: s * 0.44,
                            borderWidth: 2,
                            borderColor: color,
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4,
                            backgroundColor: sec,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            paddingTop: 1,
                        }}
                    >
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, top: -5, left: -1 }} />
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color, top: -7 }} />
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, top: -5, right: -1 }} />
                    </View>
                </View>
            );

        // --- 14. UTILISATEUR / MEMBRE (User) ---
        case 'user':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Tête */}
                    <View
                        style={{
                            width: s * 0.34,
                            height: s * 0.34,
                            borderRadius: (s * 0.34) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            marginBottom: 2,
                        }}
                    />
                    {/* Épaules */}
                    <View
                        style={{
                            width: s * 0.62,
                            height: s * 0.28,
                            borderTopLeftRadius: s * 0.31,
                            borderTopRightRadius: s * 0.31,
                            borderWidth: 2,
                            borderBottomWidth: 0,
                            borderColor: color,
                        }}
                    />
                </View>
            );

        // --- 15. INVITÉ (Guest Keycard) ---
        case 'guest':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.54,
                            height: s * 0.72,
                            borderWidth: 2,
                            borderColor: color,
                            borderRadius: 4,
                            backgroundColor: sec,
                            alignItems: 'center',
                            paddingTop: 3,
                        }}
                    >
                        {/* Fente de cordon */}
                        <View style={{ width: s * 0.22, height: 2, backgroundColor: color, borderRadius: 1 }} />
                        {/* Puce magnétique */}
                        <View
                            style={{
                                width: s * 0.24,
                                height: s * 0.2,
                                borderWidth: 1.5,
                                borderColor: color,
                                borderRadius: 2,
                                marginTop: 6,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 16. WIFI / CONNEXION (Network) ---
        case 'wifi':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.8,
                            height: s * 0.8,
                            borderRadius: (s * 0.8) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderBottomColor: 'transparent',
                            position: 'absolute',
                            top: s * 0.15,
                        }}
                    />
                    <View
                        style={{
                            width: s * 0.5,
                            height: s * 0.5,
                            borderRadius: (s * 0.5) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderBottomColor: 'transparent',
                            position: 'absolute',
                            top: s * 0.32,
                        }}
                    />
                    <View
                        style={{
                            width: 5,
                            height: 5,
                            borderRadius: 2.5,
                            backgroundColor: color,
                            position: 'absolute',
                            bottom: s * 0.18,
                        }}
                    />
                </View>
            );

        // --- 17. ALERTE / ATTENTION (Alert) ---
        case 'alert':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.78,
                            height: s * 0.68,
                            borderWidth: 2,
                            borderColor: color,
                            borderTopLeftRadius: 3,
                            borderTopRightRadius: 3,
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ width: 2, height: s * 0.22, backgroundColor: color, borderRadius: 1 }} />
                        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color, marginTop: 3 }} />
                    </View>
                </View>
            );

        // --- 18. VALIDATION (Check) ---
        case 'check':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.3,
                            height: s * 0.55,
                            borderBottomWidth: 2.5,
                            borderRightWidth: 2.5,
                            borderColor: color,
                            transform: [{ rotate: '45deg' }],
                            marginBottom: 4,
                        }}
                    />
                </View>
            );

        // --- 19. PARAMÈTRES (Settings Cog) ---
        case 'settings':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Anneau extérieur */}
                    <View
                        style={{
                            width: s * 0.68,
                            height: s * 0.68,
                            borderRadius: (s * 0.68) / 2,
                            borderWidth: 2.2,
                            borderColor: color,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Noyau central */}
                        <View
                            style={{
                                width: s * 0.22,
                                height: s * 0.22,
                                borderRadius: (s * 0.22) / 2,
                                backgroundColor: color,
                            }}
                        />
                    </View>
                    {/* Dents extérieures */}
                    <View style={{ position: 'absolute', width: 3, height: s * 0.88, backgroundColor: color, borderRadius: 1 }} />
                    <View style={{ position: 'absolute', height: 3, width: s * 0.88, backgroundColor: color, borderRadius: 1 }} />
                </View>
            );

        // --- 20. POWER / MARCHE-ARRÊT ---
        case 'power':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.68,
                            height: s * 0.68,
                            borderRadius: (s * 0.68) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            borderTopColor: 'transparent',
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            top: s * 0.12,
                            width: 2,
                            height: s * 0.32,
                            backgroundColor: color,
                            borderRadius: 1,
                        }}
                    />
                </View>
            );

        // --- 21. PORTE FERMÉE (Door Closed) ---
        case 'door':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.62,
                            height: s * 0.85,
                            borderWidth: 2,
                            borderColor: color,
                            borderRadius: 3,
                            backgroundColor: sec,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            paddingRight: 4,
                        }}
                    >
                        {/* Poignée de porte */}
                        <View
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: color,
                            }}
                        />
                        {/* Panneau intérieur décoratif */}
                        <View
                            style={{
                                position: 'absolute',
                                left: 3,
                                top: 4,
                                bottom: 4,
                                right: 10,
                                borderWidth: 1,
                                borderColor: `${color}44`,
                                borderRadius: 1.5,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 22. PORTE OUVERTE (Door Open) ---
        case 'door-open':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Bâti fixe */}
                    <View
                        style={{
                            position: 'absolute',
                            width: s * 0.72,
                            height: s * 0.85,
                            borderWidth: 1.8,
                            borderRightWidth: 0,
                            borderColor: `${color}66`,
                            borderRadius: 2,
                        }}
                    />
                    {/* Battant ouvert en perspective */}
                    <View
                        style={{
                            width: s * 0.44,
                            height: s * 0.8,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            borderRadius: 2,
                            transform: [{ skewY: '-14deg' }],
                            left: -s * 0.08,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            paddingRight: 2,
                        }}
                    >
                        <View style={{ width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
                    </View>
                </View>
            );

        // --- 23. HYGROMÉTRIE / GOUTTE D'EAU (Humidity) ---
        case 'humidity':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.52,
                            height: s * 0.52,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            borderTopLeftRadius: 2,
                            borderTopRightRadius: s * 0.26,
                            borderBottomLeftRadius: s * 0.26,
                            borderBottomRightRadius: s * 0.26,
                            transform: [{ rotate: '-45deg' }],
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 3,
                                height: 3,
                                borderRadius: 1.5,
                                backgroundColor: color,
                                position: 'absolute',
                                top: 4,
                                left: 4,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 24. CHAUFFAGE / FLAMME (Heat) ---
        case 'heat':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Flamme externe */}
                    <View
                        style={{
                            width: s * 0.56,
                            height: s * 0.72,
                            borderTopRightRadius: s * 0.28,
                            borderBottomLeftRadius: s * 0.28,
                            borderBottomRightRadius: s * 0.28,
                            borderTopLeftRadius: 4,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            transform: [{ rotate: '45deg' }],
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Cœur chaud */}
                        <View
                            style={{
                                width: s * 0.2,
                                height: s * 0.2,
                                borderRadius: s * 0.1,
                                backgroundColor: color,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 25. CLIMATISATION / FLOCON (Cool) ---
        case 'cool':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Axe vertical */}
                    <View style={{ position: 'absolute', width: 2, height: s * 0.76, backgroundColor: color, borderRadius: 1 }} />
                    {/* Axe horizontal */}
                    <View style={{ position: 'absolute', height: 2, width: s * 0.76, backgroundColor: color, borderRadius: 1 }} />
                    {/* Diagonale 1 */}
                    <View style={{ position: 'absolute', width: 2, height: s * 0.65, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '45deg' }] }} />
                    {/* Diagonale 2 */}
                    <View style={{ position: 'absolute', width: 2, height: s * 0.65, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-45deg' }] }} />
                    {/* Cœur central cristal */}
                    <View style={{ width: s * 0.22, height: s * 0.22, borderRadius: s * 0.11, backgroundColor: color }} />
                </View>
            );

        // --- 26. MODE ÉCOLOGIQUE / FEUILLE (Eco) ---
        case 'eco':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.64,
                            height: s * 0.64,
                            borderTopRightRadius: s * 0.45,
                            borderBottomLeftRadius: s * 0.45,
                            borderTopLeftRadius: 3,
                            borderBottomRightRadius: 3,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Nervure centrale */}
                        <View
                            style={{
                                width: 1.8,
                                height: s * 0.42,
                                backgroundColor: color,
                                transform: [{ rotate: '45deg' }],
                            }}
                        />
                    </View>
                </View>
            );

        // --- 27. MODE CINÉMA (Cinema) ---
        case 'cinema':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Écran large 16:9 */}
                    <View
                        style={{
                            width: s * 0.76,
                            height: s * 0.48,
                            borderWidth: 2,
                            borderColor: color,
                            borderRadius: 3,
                            backgroundColor: sec,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Triangle Play feutré */}
                        <View
                            style={{
                                width: 0,
                                height: 0,
                                borderTopWidth: 4,
                                borderBottomWidth: 4,
                                borderLeftWidth: 7,
                                borderTopColor: 'transparent',
                                borderBottomColor: 'transparent',
                                borderLeftColor: color,
                                marginLeft: 2,
                            }}
                        />
                    </View>
                    {/* Socle projecteur */}
                    <View style={{ width: s * 0.4, height: 2, backgroundColor: color, marginTop: 3, borderRadius: 1 }} />
                </View>
            );

        // --- 28. LIT / NUIT (Bed) ---
        case 'bed':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Tête de lit */}
                    <View style={{ position: 'absolute', left: s * 0.12, bottom: s * 0.22, width: 2.2, height: s * 0.52, backgroundColor: color, borderRadius: 1 }} />
                    {/* Sommier */}
                    <View style={{ position: 'absolute', left: s * 0.12, right: s * 0.12, bottom: s * 0.26, height: 2.2, backgroundColor: color, borderRadius: 1 }} />
                    {/* Pied droit */}
                    <View style={{ position: 'absolute', right: s * 0.12, bottom: s * 0.22, width: 2.2, height: s * 0.32, backgroundColor: color, borderRadius: 1 }} />
                    {/* Matelas & Couette */}
                    <View
                        style={{
                            position: 'absolute',
                            left: s * 0.22,
                            right: s * 0.16,
                            bottom: s * 0.28,
                            height: s * 0.22,
                            borderWidth: 1.8,
                            borderColor: color,
                            backgroundColor: sec,
                            borderRadius: 2,
                        }}
                    />
                    {/* Oreiller */}
                    <View
                        style={{
                            position: 'absolute',
                            left: s * 0.25,
                            bottom: s * 0.4,
                            width: s * 0.18,
                            height: s * 0.1,
                            borderRadius: 2,
                            backgroundColor: color,
                        }}
                    />
                </View>
            );

        // --- 29. CANAPÉ / SALON (Sofa) ---
        case 'sofa':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Dossier */}
                    <View
                        style={{
                            width: s * 0.72,
                            height: s * 0.32,
                            borderWidth: 2,
                            borderBottomWidth: 0,
                            borderColor: color,
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            backgroundColor: sec,
                        }}
                    />
                    {/* Assise & Accoudoirs */}
                    <View
                        style={{
                            width: s * 0.8,
                            height: s * 0.24,
                            borderWidth: 2,
                            borderColor: color,
                            borderRadius: 3,
                            backgroundColor: sec,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 3,
                        }}
                    >
                        <View style={{ width: 2, height: '80%', backgroundColor: color }} />
                        <View style={{ width: 2, height: '80%', backgroundColor: color }} />
                    </View>
                    {/* Pieds design */}
                    <View style={{ width: s * 0.65, flexDirection: 'row', justifyContent: 'space-between', marginTop: 1 }}>
                        <View style={{ width: 2, height: 4, backgroundColor: color }} />
                        <View style={{ width: 2, height: 4, backgroundColor: color }} />
                    </View>
                </View>
            );

        // --- 30. CUISINE (Kitchen) ---
        case 'kitchen':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Table de cuisson à induction : deux anneaux concentriques */}
                    <View
                        style={{
                            width: s * 0.64,
                            height: s * 0.64,
                            borderRadius: (s * 0.64) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: sec,
                        }}
                    >
                        <View
                            style={{
                                width: s * 0.28,
                                height: s * 0.28,
                                borderRadius: (s * 0.28) / 2,
                                borderWidth: 1.8,
                                borderColor: color,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 31. JARDIN (Garden) ---
        case 'garden':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Tige */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: s * 0.15,
                            width: 2,
                            height: s * 0.55,
                            backgroundColor: color,
                            borderRadius: 1,
                        }}
                    />
                    {/* Feuille gauche */}
                    <View
                        style={{
                            position: 'absolute',
                            left: s * 0.18,
                            top: s * 0.28,
                            width: s * 0.3,
                            height: s * 0.2,
                            borderTopLeftRadius: s * 0.2,
                            borderBottomRightRadius: s * 0.2,
                            borderWidth: 1.8,
                            borderColor: color,
                            backgroundColor: sec,
                        }}
                    />
                    {/* Feuille droite */}
                    <View
                        style={{
                            position: 'absolute',
                            right: s * 0.18,
                            top: s * 0.2,
                            width: s * 0.3,
                            height: s * 0.2,
                            borderTopRightRadius: s * 0.2,
                            borderBottomLeftRadius: s * 0.2,
                            borderWidth: 1.8,
                            borderColor: color,
                            backgroundColor: sec,
                        }}
                    />
                </View>
            );

        // --- 32. BATTERIE (Battery) ---
        case 'battery':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Corps capsule */}
                        <View
                            style={{
                                width: s * 0.64,
                                height: s * 0.36,
                                borderWidth: 1.8,
                                borderColor: color,
                                borderRadius: 3,
                                padding: 2,
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: '70%',
                                    height: '100%',
                                    backgroundColor: color,
                                    borderRadius: 1.5,
                                }}
                            />
                        </View>
                        {/* Pôle positif */}
                        <View
                            style={{
                                width: 2.2,
                                height: s * 0.16,
                                backgroundColor: color,
                                borderTopRightRadius: 1.5,
                                borderBottomRightRadius: 1.5,
                            }}
                        />
                    </View>
                </View>
            );

        // --- 33. ATTENTION / WARNING (Warning) ---
        case 'warning':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.74,
                            height: s * 0.66,
                            borderWidth: 2,
                            borderColor: color,
                            borderRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: sec,
                        }}
                    >
                        <View style={{ width: 2, height: s * 0.24, backgroundColor: color, borderRadius: 1 }} />
                        <View style={{ width: 2.6, height: 2.6, borderRadius: 1.3, backgroundColor: color, marginTop: 2.5 }} />
                    </View>
                </View>
            );

        // --- 34. SYNCHRONISATION (Sync) ---
        case 'sync':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.65,
                            height: s * 0.65,
                            borderRadius: (s * 0.65) / 2,
                            borderWidth: 2,
                            borderColor: color,
                            borderRightColor: 'transparent',
                            borderLeftColor: 'transparent',
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            top: s * 0.16,
                            right: s * 0.2,
                            width: 0,
                            height: 0,
                            borderTopWidth: 3.5,
                            borderBottomWidth: 3.5,
                            borderLeftWidth: 5,
                            borderTopColor: 'transparent',
                            borderBottomColor: 'transparent',
                            borderLeftColor: color,
                        }}
                    />
                </View>
            );

        // --- 35. FERMETURE / CROIX (Cross) ---
        case 'cross':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View style={{ position: 'absolute', width: 2, height: s * 0.6, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '45deg' }] }} />
                    <View style={{ position: 'absolute', width: 2, height: s * 0.6, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-45deg' }] }} />
                </View>
            );

        // --- 36. VISIBILITÉ / ŒIL (Eye) ---
        case 'eye':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.72,
                            height: s * 0.44,
                            borderTopLeftRadius: s * 0.36,
                            borderBottomRightRadius: s * 0.36,
                            borderWidth: 2,
                            borderColor: color,
                            transform: [{ rotate: '-45deg' }],
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ width: s * 0.16, height: s * 0.16, borderRadius: s * 0.08, backgroundColor: color }} />
                    </View>
                </View>
            );

        // --- 37. MASQUÉ / ŒIL BARRÉ (Eye-Off) ---
        case 'eye-off':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.72,
                            height: s * 0.44,
                            borderTopLeftRadius: s * 0.36,
                            borderBottomRightRadius: s * 0.36,
                            borderWidth: 2,
                            borderColor: color,
                            transform: [{ rotate: '-45deg' }],
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ width: s * 0.16, height: s * 0.16, borderRadius: s * 0.08, backgroundColor: color }} />
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            width: 2,
                            height: s * 0.75,
                            backgroundColor: color,
                            borderRadius: 1,
                            transform: [{ rotate: '45deg' }],
                        }}
                    />
                </View>
            );

        // --- 38. BOUCLIER SÉCURISÉ (Shield) ---
        case 'shield':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    <View
                        style={{
                            width: s * 0.68,
                            height: s * 0.76,
                            borderWidth: 2,
                            borderColor: color,
                            backgroundColor: sec,
                            borderTopLeftRadius: 3,
                            borderTopRightRadius: 3,
                            borderBottomLeftRadius: s * 0.34,
                            borderBottomRightRadius: s * 0.34,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ width: 2, height: s * 0.35, backgroundColor: color, borderRadius: 1 }} />
                    </View>
                </View>
            );

        // --- 39. DÉCONNEXION (Logout) ---
        case 'logout':
            return (
                <View style={[styles.center, { width: s, height: s }, style]}>
                    {/* Cadre porte */}
                    <View
                        style={{
                            position: 'absolute',
                            left: s * 0.15,
                            width: s * 0.45,
                            height: s * 0.75,
                            borderWidth: 2,
                            borderRightWidth: 0,
                            borderColor: color,
                            borderRadius: 2,
                        }}
                    />
                    {/* Flèche sortie vers la droite */}
                    <View style={{ position: 'absolute', right: s * 0.12, width: s * 0.45, height: 2, backgroundColor: color, borderRadius: 1 }} />
                    <View
                        style={{
                            position: 'absolute',
                            right: s * 0.12,
                            width: 0,
                            height: 0,
                            borderTopWidth: 4,
                            borderBottomWidth: 4,
                            borderLeftWidth: 6,
                            borderTopColor: 'transparent',
                            borderBottomColor: 'transparent',
                            borderLeftColor: color,
                        }}
                    />
                </View>
            );
    }
};

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
});
