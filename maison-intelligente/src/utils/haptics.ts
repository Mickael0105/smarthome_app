// ============================================================
//  Haptics Utility — Retours Tactiles & Vibrations Haptiques
//  Compatible iOS & Android (sans dépendances tierces)
//  Fournit une sensation tactile premium style Apple Taptic Engine
// ============================================================

import { Vibration, Platform } from 'react-native';

class HapticsService {
    private enabled: boolean = true;

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    /** Retour subtil et léger : tap sur un bouton classique ou onglet */
    light(): void {
        if (!this.enabled) return;
        try {
            if (Platform.OS === 'android') {
                Vibration.vibrate(12);
            } else if (Platform.OS === 'ios') {
                Vibration.vibrate(10);
            }
        } catch {
            // Ignorer si la vibration n'est pas supportée
        }
    }

    /** Clic net et franc : bascule d'interrupteur (on/off lumière) */
    toggle(): void {
        if (!this.enabled) return;
        try {
            if (Platform.OS === 'android') {
                Vibration.vibrate(25);
            } else if (Platform.OS === 'ios') {
                Vibration.vibrate(20);
            }
        } catch {}
    }

    /** Double impulsion harmonieuse : action réussie (déverrouillage, scénario) */
    success(): void {
        if (!this.enabled) return;
        try {
            // Motif : attente 0ms, vibration 20ms, pause 50ms, vibration 30ms
            Vibration.vibrate([0, 20, 50, 30]);
        } catch {}
    }

    /** Avertissement : action bloquée ou refusée (ex: porte ouverte au verrouillage) */
    warning(): void {
        if (!this.enabled) return;
        try {
            Vibration.vibrate([0, 40, 50, 40, 50, 60]);
        } catch {}
    }

    /** Alarme continue d'intrusion d'urgence */
    alarm(): void {
        if (!this.enabled) return;
        try {
            // Motif d'alarme d'urgence répété
            Vibration.vibrate([0, 250, 100, 250, 100, 400]);
        } catch {}
    }

    /** Arrête immédiatement toute vibration en cours */
    cancel(): void {
        try {
            Vibration.cancel();
        } catch {}
    }
}

export const Haptics = new HapticsService();
