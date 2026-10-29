// ============================================================
//  Thème centralisé — Maison Intelligente
//  Support Mode Sombre & Mode Clair (Dark / Light)
// ============================================================

export const DarkColors = {
    // --- Backgrounds ---
    bg: '#0B0D1B',
    surface: '#15182D',
    surfaceAlt: '#1D213D',
    surfaceBorder: '#282D50',
    card: '#161930',

    // --- Accents ---
    primary: '#10B981',        // Émeraude vibrante
    primaryDim: '#10B9812A',
    secondary: '#3B82F6',      // Bleu électrique
    secondaryDim: '#3B82F62A',
    accentPurple: '#8B5CF6',
    accentPurpleDim: '#8B5CF62A',

    // --- Alertes ---
    danger: '#EF4444',
    dangerDim: '#EF44442A',
    warning: '#F59E0B',
    warningDim: '#F59E0B2A',

    // --- Texte ---
    text: '#FFFFFF',
    textSub: '#94A3B8',
    textDisabled: '#475569',

    // --- État ---
    success: '#10B981',
    error: '#EF4444',
    pending: '#F59E0B',

    // --- Dégradés de pièces & scénarios ---
    rooms: {
        salon: ['#7C3AED', '#A78BFA'] as const,
        chambre: ['#EC4899', '#F472B6'] as const,
        cuisine: ['#F59E0B', '#FCD34D'] as const,
        jardin: ['#10B981', '#6EE7B7'] as const,
        garage: ['#475569', '#94A3B8'] as const,
        default: ['#3B82F6', '#60A5FA'] as const,
    },

    // --- Divers ---
    tabBar: '#0E1020',
    tabBarBorder: '#232746',
    overlay: 'rgba(0,0,0,0.7)',
    transparent: 'transparent',
} as const;

export const LightColors = {
    // --- Backgrounds ---
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    surfaceBorder: '#E2E8F0',
    card: '#FFFFFF',

    // --- Accents ---
    primary: '#059669',
    primaryDim: '#0596691E',
    secondary: '#2563EB',
    secondaryDim: '#2563EB1E',
    accentPurple: '#7C3AED',
    accentPurpleDim: '#7C3AED1E',

    // --- Alertes ---
    danger: '#DC2626',
    dangerDim: '#DC26261E',
    warning: '#D97706',
    warningDim: '#D977061E',

    // --- Texte ---
    text: '#0F172A',
    textSub: '#475569',
    textDisabled: '#94A3B8',

    // --- État ---
    success: '#059669',
    error: '#DC2626',
    pending: '#D97706',

    // --- Dégradés de pièces & scénarios ---
    rooms: {
        salon: ['#6D28D9', '#8B5CF6'] as const,
        chambre: ['#DB2777', '#EC4899'] as const,
        cuisine: ['#D97706', '#F59E0B'] as const,
        jardin: ['#059669', '#10B981'] as const,
        garage: ['#334155', '#64748B'] as const,
        default: ['#2563EB', '#3B82F6'] as const,
    },

    // --- Divers ---
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    overlay: 'rgba(15,23,42,0.45)',
    transparent: 'transparent',
} as const;

// Par défaut pour rétro-compatibilité
export const Colors = DarkColors;

export function getThemeColors(isDark: boolean) {
    return isDark ? DarkColors : LightColors;
}

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const Radii = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,
} as const;

export const FontSize = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 34,
} as const;

export const FontWeight = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const Shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    button: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    danger: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
} as const;

export const IconSize = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
} as const;

export const AnimDuration = {
    fast: 150,
    normal: 250,
    slow: 400,
} as const;

export const STALE_THRESHOLD_MS = 30_000;
