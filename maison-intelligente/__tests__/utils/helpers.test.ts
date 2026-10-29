// ============================================================
//  Tests unitaires — src/utils/helpers.ts
//  Couverture : randomDelay, formatDate, formatTime, isStale,
//               generateId, truncate, clamp, roundToStep,
//               formatTemperature, formatLockMode, formatLightState
// ============================================================

import {
    randomDelay,
    formatDate,
    formatTime,
    isStale,
    generateId,
    truncate,
    clamp,
    roundToStep,
    formatTemperature,
    formatLockMode,
    formatLightState,
} from '../../src/utils/helpers';

// ==== randomDelay ====
describe('randomDelay', () => {
    it('résout une Promise en moins de maxMs + marge', async () => {
        const start = Date.now();
        await randomDelay(10, 50);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(10);
        expect(elapsed).toBeLessThan(500); // large marge CI
    });

    it('retourne bien une Promise', () => {
        expect(randomDelay(0, 0)).toBeInstanceOf(Promise);
    });
});

// ==== formatDate ====
describe('formatDate', () => {
    it('formate une date ISO valide en chaîne française', () => {
        const result = formatDate('2026-10-29T10:30:00.000Z');
        // Doit contenir au moins l'année et des chiffres
        expect(result).toMatch(/2026/);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(4);
    });

    it('retourne la valeur brute si la date est invalide', () => {
        const result = formatDate('not-a-date');
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });
});

// ==== formatTime ====
describe('formatTime', () => {
    it('retourne une chaîne non vide pour une date valide', () => {
        const result = formatTime('2026-10-29T14:05:00.000Z');
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('gère les dates invalides sans lever d\'exception', () => {
        expect(() => formatTime('invalid-date')).not.toThrow();
    });
});

// ==== isStale ====
describe('isStale', () => {
    it('retourne false pour une date récente (< seuil)', () => {
        const recent = new Date(Date.now() - 5000).toISOString(); // 5s ago
        expect(isStale(recent, 30000)).toBe(false);
    });

    it('retourne true pour une date ancienne (> seuil)', () => {
        const old = new Date(Date.now() - 60000).toISOString(); // 60s ago
        expect(isStale(old, 30000)).toBe(true);
    });

    it('retourne false si la date est null', () => {
        expect(isStale(null)).toBe(false);
    });

    it('retourne false pour une chaîne invalide', () => {
        expect(isStale('invalid')).toBe(false);
    });
});

// ==== generateId ====
describe('generateId', () => {
    it('génère une chaîne non vide', () => {
        const id = generateId();
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
    });

    it('génère des identifiants uniques à chaque appel', () => {
        const ids = new Set(Array.from({ length: 100 }, generateId));
        expect(ids.size).toBe(100);
    });

    it('contient un tiret séparateur', () => {
        const id = generateId();
        expect(id).toContain('-');
    });
});

// ==== truncate ====
describe('truncate', () => {
    it('ne tronque pas si le texte est plus court que maxLength', () => {
        expect(truncate('Bonjour', 20)).toBe('Bonjour');
    });

    it('ne tronque pas si le texte est exactement maxLength', () => {
        expect(truncate('Bonjour', 7)).toBe('Bonjour');
    });

    it('tronque et ajoute "…" si le texte dépasse maxLength', () => {
        const result = truncate('Bonjour le monde', 10);
        expect(result).toHaveLength(10);
        expect(result.endsWith('…')).toBe(true);
    });

    it('gère une chaîne vide', () => {
        expect(truncate('', 5)).toBe('');
    });
});

// ==== clamp ====
describe('clamp', () => {
    it('retourne la valeur si elle est dans la plage', () => {
        expect(clamp(15, 10, 20)).toBe(15);
    });

    it('retourne min si la valeur est inférieure', () => {
        expect(clamp(5, 10, 20)).toBe(10);
    });

    it('retourne max si la valeur est supérieure', () => {
        expect(clamp(25, 10, 20)).toBe(20);
    });

    it('retourne min si la valeur est égale à min', () => {
        expect(clamp(10, 10, 20)).toBe(10);
    });

    it('retourne max si la valeur est égale à max', () => {
        expect(clamp(20, 10, 20)).toBe(20);
    });
});

// ==== roundToStep ====
describe('roundToStep', () => {
    it('arrondit à 0.5 vers le bas', () => {
        expect(roundToStep(21.3, 0.5)).toBeCloseTo(21.5);
    });

    it('arrondit à 0.5 vers le haut (21.8 → 22.0)', () => {
        // 21.8 / 0.5 = 43.6 → Math.round(43.6) = 44 → 44 * 0.5 = 22.0
        expect(roundToStep(21.8, 0.5)).toBeCloseTo(22.0);
    });

    it('arrondit à 0.5 vers le bas (21.7 → 21.5)', () => {
        // 21.7 / 0.5 = 43.4 → Math.round(43.4) = 43 → 43 * 0.5 = 21.5
        expect(roundToStep(21.7, 0.5)).toBeCloseTo(21.5);
    });

    it('retourne la valeur exacte si déjà un multiple', () => {
        expect(roundToStep(21.5, 0.5)).toBeCloseTo(21.5);
    });

    it('arrondit à 1 comme un Math.round standard', () => {
        expect(roundToStep(3.4, 1)).toBe(3);
        expect(roundToStep(3.6, 1)).toBe(4);
    });
});

// ==== formatTemperature ====
describe('formatTemperature', () => {
    it('formate un nombre en degrés Celsius', () => {
        expect(formatTemperature(22.4)).toBe('22.4 °C');
    });

    it('formate un nombre en degrés Fahrenheit', () => {
        expect(formatTemperature(72.5, 'F')).toBe('72.5 °F');
    });

    it('retourne "Indisponible" pour null', () => {
        expect(formatTemperature(null)).toBe('Indisponible');
    });

    it('affiche toujours une décimale', () => {
        expect(formatTemperature(21)).toBe('21.0 °C');
    });
});

// ==== formatLockMode ====
describe('formatLockMode', () => {
    it('retourne "Verrouillée" pour locked', () => {
        expect(formatLockMode('locked')).toBe('Verrouillée');
    });

    it('retourne "Déverrouillée" pour unlocked', () => {
        expect(formatLockMode('unlocked')).toBe('Déverrouillée');
    });
});

// ==== formatLightState ====
describe('formatLightState', () => {
    it('retourne "Allumée" pour on', () => {
        expect(formatLightState('on')).toBe('Allumée');
    });

    it('retourne "Éteinte" pour off', () => {
        expect(formatLightState('off')).toBe('Éteinte');
    });
});
