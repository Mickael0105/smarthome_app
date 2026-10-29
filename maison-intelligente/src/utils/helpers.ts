// ============================================================
//  Utilitaires généraux
// ============================================================

import { STALE_THRESHOLD_MS } from '../constants/theme';

/**
 * Latence aléatoire simulée entre min et max ms.
 */
export function randomDelay(minMs: number, maxMs: number): Promise<void> {
    const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Formatte une date ISO 8601 en chaîne lisible française.
 * Ex : "20 oct. 2026, 12h05"
 */
export function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

/**
 * Formatte une heure ISO 8601 en heure seule.
 * Ex : "12:05"
 */
export function formatTime(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

/**
 * Retourne true si la date ISO est plus vieille que le seuil (défaut 30 s).
 * Retourne false si la date est null.
 */
export function isStale(iso: string | null, thresholdMs = STALE_THRESHOLD_MS): boolean {
    if (!iso) return false;
    try {
        const age = Date.now() - new Date(iso).getTime();
        return age > thresholdMs;
    } catch {
        return false;
    }
}

/**
 * Génère un identifiant unique simple (pseudo-UUID basé sur Date + random).
 */
export function generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tronque un texte à maxLength caractères.
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 1) + '…';
}

/**
 * Clamp : borne une valeur entre min et max.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Arrondit à un multiple de `step` (utile pour la consigne 0,5 °C).
 */
export function roundToStep(value: number, step: number): number {
    return Math.round(value / step) * step;
}

/**
 * Formate une température : "24.5 °C" ou "Indisponible".
 */
export function formatTemperature(value: number | null, unit: 'C' | 'F' = 'C'): string {
    if (value === null) return 'Indisponible';
    return `${value.toFixed(1)} °${unit}`;
}

/**
 * Label du mode de verrouillage.
 */
export function formatLockMode(mode: 'locked' | 'unlocked'): string {
    return mode === 'locked' ? 'Verrouillée' : 'Déverrouillée';
}

/**
 * Label de l'état d'une lumière.
 */
export function formatLightState(state: 'on' | 'off'): string {
    return state === 'on' ? 'Allumée' : 'Éteinte';
}
