// ============================================================
//  Tests unitaires — Règles métier / Business Rules
//  Vérifie les contraintes fonctionnelles clés du cahier des charges
// ============================================================

jest.useFakeTimers();

jest.mock('../../src/constants/theme', () => ({
    STALE_THRESHOLD_MS: 30000,
}));
jest.mock('../../src/config/app.config', () => ({
    MOCK_LATENCY_MIN_MS: 0,
    MOCK_LATENCY_MAX_MS: 0,
}));

import { MockService } from '../../src/services/MockService';

async function run<T>(promise: Promise<T>): Promise<T> {
    jest.advanceTimersByTime(300);
    return promise;
}

describe('Règles Métier — Cahier des Charges Maison Intelligente', () => {
    let service: MockService;

    beforeEach(() => {
        service = new MockService();
    });

    afterEach(() => {
        service.destroy();
        jest.clearAllTimers();
    });

    // ----------------------------------------------------------------
    //  RÈGLE 1 : RBAC — Invité ne peut pas verrouiller
    //  (vérification au niveau service Auth)
    // ----------------------------------------------------------------
    describe('RÈGLE 1 — Accès RBAC', () => {
        it('un guest a isLoggedIn() == false', async () => {
            await run(service.auth.switchRole('guest'));
            expect(service.auth.isLoggedIn()).toBe(false);
        });

        it('un admin a isLoggedIn() == true', async () => {
            await run(service.auth.switchRole('admin'));
            expect(service.auth.isLoggedIn()).toBe(true);
        });

        it('un member a isLoggedIn() == true', async () => {
            await run(service.auth.switchRole('member'));
            expect(service.auth.isLoggedIn()).toBe(true);
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 2 : Verrouillage impossible si ouverture présente
    // ----------------------------------------------------------------
    describe('RÈGLE 2 — Verrouillage avec ouvrant ouvert', () => {
        it('refuse de verrouiller si porte d\'entrée ouverte', async () => {
            await run(service.simulateDoorToggle('entree')); // ouvre
            await expect(run(service.lock())).rejects.toThrow('Impossible de verrouiller');
        });

        it('refuse de verrouiller si fenêtre salon ouverte', async () => {
            await run(service.toggleWindow('fenetre_salon')); // ouvre
            await expect(run(service.lock())).rejects.toThrow('Impossible de verrouiller');
        });

        it('accepte le verrouillage si toutes les portes et fenêtres sont fermées', async () => {
            // État initial : tout fermé
            const status = await run(service.lock());
            expect(status.lock_mode).toBe('locked');
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 3 : Alerte intrusion si ouvrant s'ouvre en mode verrouillé
    // ----------------------------------------------------------------
    describe('RÈGLE 3 — Alerte intrusion automatique', () => {
        it('déclenche une alerte si une porte s\'ouvre en mode verrouillé', async () => {
            await run(service.lock());
            const status = await run(service.simulateDoorToggle('entree'));
            expect(status.alert?.active).toBe(true);
            expect(status.alert?.sourceType).toBe('door');
        });

        it('déclenche une alerte si une fenêtre s\'ouvre en mode verrouillé', async () => {
            await run(service.lock());
            const status = await run(service.toggleWindow('fenetre_chambre'));
            expect(status.alert?.active).toBe(true);
            expect(status.alert?.sourceType).toBe('window');
        });

        it('pas d\'alerte si porte ouverte en mode déverrouillé', async () => {
            const status = await run(service.simulateDoorToggle('entree'));
            expect(status.alert).toBeNull();
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 4 : Acquittement d'alerte
    // ----------------------------------------------------------------
    describe('RÈGLE 4 — Acquittement d\'alerte', () => {
        it('efface l\'alerte après acknowledgeAlert()', async () => {
            await run(service.lock());
            await run(service.simulateDoorToggle('chambre'));
            // alerte active
            let status = await run(service.getStatus());
            expect(status.alert?.active).toBe(true);
            // acquittement
            status = await run(service.acknowledgeAlert());
            expect(status.alert).toBeNull();
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 5 : Consigne de température bornée (16–30°C)
    // ----------------------------------------------------------------
    describe('RÈGLE 5 — Bornes de la consigne de température', () => {
        const validValues = [16, 18.5, 21, 24.5, 30];
        validValues.forEach((val) => {
            it(`accepte ${val}°C`, async () => {
                const status = await run(service.setSetpoint(val));
                expect(status.setpoint).toBeCloseTo(val, 1);
            });
        });

        const invalidValues = [15.9, 15, 0, -5, 30.1, 35, 100];
        invalidValues.forEach((val) => {
            it(`rejette ${val}°C (hors limites)`, async () => {
                await expect(run(service.setSetpoint(val))).rejects.toThrow('hors limites');
            });
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 6 : Scénarios de vie — un seul actif à la fois
    // ----------------------------------------------------------------
    describe('RÈGLE 6 — Unicité du scénario actif', () => {
        const scenarios = ['night', 'away', 'home', 'cinema', 'eco'] as const;

        scenarios.forEach((id) => {
            it(`scénario "${id}" — un seul actif après activation`, async () => {
                const status = await run(service.activateScenario(id));
                const actives = status.scenarios.filter((s) => s.active);
                expect(actives).toHaveLength(1);
                expect(actives[0].id).toBe(id);
            });
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 7 : Mode Nuit — sécurisation complète
    // ----------------------------------------------------------------
    describe('RÈGLE 7 — Mode Nuit : sécurisation complète', () => {
        it('toutes les lumières sont éteintes', async () => {
            const status = await run(service.activateScenario('night'));
            status.lights.forEach((l) => expect(l.state).toBe('off'));
        });

        it('maison verrouillée', async () => {
            const status = await run(service.activateScenario('night'));
            expect(status.lock_mode).toBe('locked');
        });

        it('consigne réduite à 18.5°C', async () => {
            const status = await run(service.activateScenario('night'));
            expect(status.setpoint).toBe(18.5);
        });

        it('garage fermé et verrouillé', async () => {
            const status = await run(service.activateScenario('night'));
            expect(status.garage.state).toBe('closed');
            expect(status.garage.lock).toBe('locked');
        });

        it('toutes les fenêtres fermées', async () => {
            const status = await run(service.activateScenario('night'));
            status.windows.forEach((w) => expect(w.open).toBe(false));
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 8 : Énergie — ecoScore dépend de la consommation
    // ----------------------------------------------------------------
    describe('RÈGLE 8 — Score Éco dynamique', () => {
        it('score "A" quand peu de lumières allumées', async () => {
            // Éteindre tout
            await run(service.activateScenario('night'));
            const status = await run(service.getStatus());
            expect(['A', 'A+']).toContain(status.energy.ecoScore);
        });

        it('énergie currentPowerW est un nombre positif', async () => {
            const status = await run(service.getStatus());
            expect(status.energy.currentPowerW).toBeGreaterThan(0);
        });

        it('dailyKwh est un nombre positif', async () => {
            const status = await run(service.getStatus());
            expect(status.energy.dailyKwh).toBeGreaterThan(0);
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 9 : Coupure réseau — toutes les opérations échouent
    // ----------------------------------------------------------------
    describe('RÈGLE 9 — Résilience hors-ligne (networkCut)', () => {
        beforeEach(() => {
            service.setOptions({ networkCut: true });
        });

        it('getStatus() échoue', async () => {
            await expect(run(service.getStatus())).rejects.toThrow();
        });

        it('setLight() échoue', async () => {
            await expect(run(service.setLight('salon', 'on'))).rejects.toThrow();
        });

        it('lock() échoue', async () => {
            await expect(run(service.lock())).rejects.toThrow();
        });

        it('setSetpoint() échoue', async () => {
            await expect(run(service.setSetpoint(21))).rejects.toThrow();
        });
    });

    // ----------------------------------------------------------------
    //  RÈGLE 10 : Garage — états motorisés
    // ----------------------------------------------------------------
    describe('RÈGLE 10 — Machine à états du garage', () => {
        it('transition closed → open déverrouille le garage', async () => {
            const status = await run(service.setGarageState('open'));
            expect(status.garage.lock).toBe('unlocked');
        });

        it('transition open → closed reverrouille le garage', async () => {
            await run(service.setGarageState('open'));
            const status = await run(service.setGarageState('closed'));
            expect(status.garage.lock).toBe('locked');
        });

        it('transition → opening (moteur en cours)', async () => {
            const status = await run(service.setGarageState('opening'));
            expect(status.garage.state).toBe('opening');
        });

        it('transition → stopped (arrêt d\'urgence)', async () => {
            await run(service.setGarageState('opening'));
            const status = await run(service.setGarageState('stopped'));
            expect(status.garage.state).toBe('stopped');
        });
    });
});
