// ============================================================
//  SoundAlert — Synthétiseur Sonore & Alarme d'Intrusion
//  Génère une sirène de sécurité d'urgence en temps réel
// ============================================================

import { Platform } from 'react-native';
import { Haptics } from './haptics';

class SoundAlertService {
    private isPlaying: boolean = false;
    private intervalId: any = null;
    private audioCtx: any = null;

    /**
     * Déclenche la sirène d'alarme d'intrusion (Sonore + Haptique d'urgence)
     */
    startIntrusionAlarm(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;

        // Vibrations haptiques répétées
        Haptics.alarm();
        this.intervalId = setInterval(() => {
            if (!this.isPlaying) return;
            Haptics.alarm();
        }, 1200);

        // Synthèse sonore si disponible (ex: Web Audio API ou navigateur Expo Web)
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            try {
                const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
                if (AudioContextClass) {
                    if (!this.audioCtx) {
                        this.audioCtx = new AudioContextClass();
                    }
                    if (this.audioCtx.state === 'suspended') {
                        this.audioCtx.resume();
                    }
                    this._playWebSiren();
                }
            } catch {
                // AudioContext non supporté ou non autorisé sans interaction préalable
            }
        }
    }

    private _playWebSiren(): void {
        if (!this.isPlaying || !this.audioCtx) return;

        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sawtooth';
            // Alternance bitonale 880 Hz / 660 Hz (sirène de sécurité européenne)
            const now = this.audioCtx.currentTime;
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.linearRampToValueAtTime(620, now + 0.4);
            osc.frequency.linearRampToValueAtTime(880, now + 0.8);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.8);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.8);

            // Rebouclage tant que l'alarme n'est pas acquittée
            if (this.isPlaying) {
                setTimeout(() => {
                    if (this.isPlaying) this._playWebSiren();
                }, 850);
            }
        } catch {}
    }

    /**
     * Stoppe immédiatement la sirène et les vibrations
     */
    stop(): void {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        Haptics.cancel();
    }
}

export const SoundAlert = new SoundAlertService();
