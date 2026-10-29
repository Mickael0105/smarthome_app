// ============================================================
//  Hook personnalisé : useAppTheme
//  Fournit les couleurs dynamiques selon le mode Sombre / Clair
// ============================================================

import { useHouseStore } from '../store/useHouseStore';
import { getThemeColors } from '../constants/theme';

export function useAppTheme() {
    const themeMode = useHouseStore((s) => s.themeMode);
    const toggleTheme = useHouseStore((s) => s.toggleTheme);
    const setThemeMode = useHouseStore((s) => s.setThemeMode);
    const isDark = themeMode === 'dark';
    const colors = getThemeColors(isDark);

    return {
        isDark,
        themeMode,
        colors,
        toggleTheme,
        setThemeMode,
    };
}
