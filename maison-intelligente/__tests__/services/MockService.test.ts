// ============================================================
//  Tests unitaires — src/services/MockService (HouseService)
//  Couverture : getStatus, setLight, toggleWindow, setGarageState,
//               lock, unlock, setSetpoint, acknowledgeAlert,
//               activateScenario, getEvents
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
import type { HouseStatus } from '../../src/types/house';

// Utilitaire : exécute la commande + avance les faux timers
async function run<T>(promise: Promise<T>): Promise<T> {
    jest.advanceTimersByTime(300);
    return promise;
}

describe('MockService — Service Principal', () => {
    let service: MockService;

    beforeEach(() => {
        service = new MockService();
    });

    afterEach(() => {
        service.destroy();
        jest.clearAllTimers();
    });

    // ----------------------------------------------------------------
    //  getStatus
    // ----------------------------------------------------------------
    describe('getStatus()', () => {
        it('retourne un statut avec les champs obligatoires', async () => {
            const status = await run(service.getStatus());
            expect(status).toHaveProperty('timestamp');
            expect(status).toHaveProperty('lights');
            expect(status).toHaveProperty('doors');
            expect(status).toHaveProperty('windows');
            expect(status).toHaveProperty('garage');
            expect(status).toHaveProperty('motionSensors');
            expect(status).toHaveProperty('scenarios');
            expect(status).toHaveProperty('energy');
        });

        it('retourne exactement 5 lumières', async () => {
            const status = await run(service.getStatus());
            expect(status.lights).toHaveLength(5);
        });

        it('retourne exactement 3 portes', async () => {
            const status = await run(service.getStatus());
            expect(status.doors).toHaveLength(3);
        });

        it('retourne exactement 3 fenêtres', async () => {
            const status = await run(service.getStatus());
            expect(status.windows).toHaveLength(3);
        });

        it('retourne exactement 5 scénarios', async () => {
            const status = await run(service.getStatus());
            expect(status.scenarios).toHaveLength(5);
        });

        it('retourne un timestamp ISO valide', async () => {
            const status = await run(service.getStatus());
            expect(new Date(status.timestamp).getTime()).not.toBeNaN();
        });

        it('lève une erreur si simulateFailures est actif (aléatoire, au moins 1 fois sur 3)', async () => {
            service.setOptions({ simulateFailures: true });
            let errorCount = 0;
            for (let i = 0; i < 20; i++) {
                try {
                    await run(service.getStatus());
                } catch {
                    errorCount++;
                }
            }
            // Au moins 1 erreur doit se produire sur 20 tentatives
            expect(errorCount).toBeGreaterThanOrEqual(1);
        });
    });

    // ----------------------------------------------------------------
    //  setLight
    // ----------------------------------------------------------------
    describe('setLight()', () => {
        it('allume une lumière existante', async () => {
            const status = await run(service.setLight('chambre', 'on'));
            const light = status.lights.find((l) => l.id === 'chambre');
            expect(light?.state).toBe('on');
        });

        it('éteint une lumière existante', async () => {
            await run(service.setLight('salon', 'off'));
            const status = await run(service.getStatus());
            const light = status.lights.find((l) => l.id === 'salon');
            expect(light?.state).toBe('off');
        });

        it('lève une erreur pour un ID inconnu', async () => {
            await expect(run(service.setLight('inexistant', 'on'))).rejects.toThrow(
                'Lumière introuvable'
            );
        });

        it('n\'affecte pas les autres lumières', async () => {
            const before = await run(service.getStatus());
            const kitchenBefore = before.lights.find((l) => l.id === 'cuisine')?.state;

            await run(service.setLight('chambre', 'on'));
            const after = await run(service.getStatus());
            const kitchenAfter = after.lights.find((l) => l.id === 'cuisine')?.state;

            expect(kitchenAfter).toBe(kitchenBefore);
        });
    });

    // ----------------------------------------------------------------
    //  toggleWindow
    // ----------------------------------------------------------------
    describe('toggleWindow()', () => {
        it('ouvre une fenêtre fermée', async () => {
            const status = await run(service.toggleWindow('fenetre_salon'));
            const win = status.windows.find((w) => w.id === 'fenetre_salon');
            expect(win?.open).toBe(true);
        });

        it('ferme une fenêtre ouverte (double toggle)', async () => {
            await run(service.toggleWindow('fenetre_salon'));
            const status = await run(service.toggleWindow('fenetre_salon'));
            const win = status.windows.find((w) => w.id === 'fenetre_salon');
            expect(win?.open).toBe(false);
        });

        it('lève une erreur pour un ID de fenêtre inconnu', async () => {
            await expect(run(service.toggleWindow('fenetre_inexistante'))).rejects.toThrow(
                'Fenêtre introuvable'
            );
        });

        it('déclenche une alerte si maison verrouillée et fenêtre ouverte', async () => {
            // D'abord verrouiller
            await run(service.lock());
            // Ouvrir une fenêtre → doit déclencher alerte
            const status = await run(service.toggleWindow('fenetre_chambre'));
            expect(status.alert).not.toBeNull();
            expect(status.alert?.active).toBe(true);
        });
    });

    // ----------------------------------------------------------------
    //  setGarageState
    // ----------------------------------------------------------------
    describe('setGarageState()', () => {
        it('ouvre le garage et le déverrouille', async () => {
            const status = await run(service.setGarageState('open'));
            expect(status.garage.state).toBe('open');
            expect(status.garage.lock).toBe('unlocked');
        });

        it('ferme le garage et le verrouille', async () => {
            await run(service.setGarageState('open'));
            const status = await run(service.setGarageState('closed'));
            expect(status.garage.state).toBe('closed');
            expect(status.garage.lock).toBe('locked');
        });

        it('accepte l\'état "opening" (transition motorisée)', async () => {
            const status = await run(service.setGarageState('opening'));
            expect(status.garage.state).toBe('opening');
        });

        it('accepte l\'état "stopped" (arrêt d\'urgence)', async () => {
            const status = await run(service.setGarageState('stopped'));
            expect(status.garage.state).toBe('stopped');
        });
    });

    // ----------------------------------------------------------------
    //  lock / unlock
    // ----------------------------------------------------------------
    describe('lock() et unlock()', () => {
        it('verrouille la maison et toutes les portes', async () => {
            const status = await run(service.lock());
            expect(status.lock_mode).toBe('locked');
            status.doors.forEach((d) => {
                expect(d.lock).toBe('locked');
            });
        });

        it('déverrouille la maison', async () => {
            await run(service.lock());
            const status = await run(service.unlock());
            expect(status.lock_mode).toBe('unlocked');
        });

        it('toutes les portes sont déverrouillées après unlock', async () => {
            await run(service.lock());
            const status = await run(service.unlock());
            status.doors.forEach((d) => {
                expect(d.lock).toBe('unlocked');
            });
        });

        it('RÈGLE MÉTIER — refuse le verrouillage si une porte est ouverte', async () => {
            // Simuler une porte ouverte via simulateDoorToggle
            await run(service.simulateDoorToggle('entree'));
            await expect(run(service.lock())).rejects.toThrow('Impossible de verrouiller');
        });
    });

    // ----------------------------------------------------------------
    //  setSetpoint
    // ----------------------------------------------------------------
    describe('setSetpoint()', () => {
        it('accepte une consigne valide (18°C)', async () => {
            const status = await run(service.setSetpoint(18));
            expect(status.setpoint).toBe(18);
        });

        it('accepte une consigne avec décimale multiple de 0.5', async () => {
            const status = await run(service.setSetpoint(22.5));
            expect(status.setpoint).toBe(22.5);
        });

        it('RÈGLE MÉTIER — rejette une consigne < 16°C', async () => {
            await expect(run(service.setSetpoint(10))).rejects.toThrow('hors limites');
        });

        it('RÈGLE MÉTIER — rejette une consigne > 30°C', async () => {
            await expect(run(service.setSetpoint(35))).rejects.toThrow('hors limites');
        });

        it('accepte exactement 16°C (borne inférieure)', async () => {
            const status = await run(service.setSetpoint(16));
            expect(status.setpoint).toBe(16);
        });

        it('accepte exactement 30°C (borne supérieure)', async () => {
            const status = await run(service.setSetpoint(30));
            expect(status.setpoint).toBe(30);
        });
    });

    // ----------------------------------------------------------------
    //  acknowledgeAlert
    // ----------------------------------------------------------------
    describe('acknowledgeAlert()', () => {
        it('efface l\'alerte active', async () => {
            // Créer une alerte via fenêtre en mode verrouillé
            await run(service.lock());
            await run(service.toggleWindow('fenetre_salon'));
            // Acquitter
            const status = await run(service.acknowledgeAlert());
            expect(status.alert).toBeNull();
        });

        it('ne lève pas d\'erreur s\'il n\'y a pas d\'alerte active', async () => {
            await expect(run(service.acknowledgeAlert())).resolves.not.toThrow();
        });
    });

    // ----------------------------------------------------------------
    //  activateScenario
    // ----------------------------------------------------------------
    describe('activateScenario()', () => {
        it('scénario "night" — éteint toutes les lumières', async () => {
            const status = await run(service.activateScenario('night'));
            status.lights.forEach((l) => {
                expect(l.state).toBe('off');
            });
        });

        it('scénario "night" — verrouille la maison', async () => {
            const status = await run(service.activateScenario('night'));
            expect(status.lock_mode).toBe('locked');
            expect(status.setpoint).toBe(18.5);
        });

        it('scénario "away" — verrouille et réduit le chauffage', async () => {
            const status = await run(service.activateScenario('away'));
            expect(status.lock_mode).toBe('locked');
            expect(status.setpoint).toBe(17.0);
        });

        it('scénario "home" — déverrouille et allume le salon', async () => {
            // D'abord activer "away" pour partir d'un état verrouillé
            await run(service.activateScenario('away'));
            const status = await run(service.activateScenario('home'));
            expect(status.lock_mode).toBe('unlocked');
            const salon = status.lights.find((l) => l.id === 'salon');
            expect(salon?.state).toBe('on');
        });

        it('scénario "eco" — réduit la consigne', async () => {
            const status = await run(service.activateScenario('eco'));
            expect(status.setpoint).toBeLessThanOrEqual(19.0);
        });

        it('un seul scénario est actif à la fois', async () => {
            const status = await run(service.activateScenario('cinema'));
            const activeCount = status.scenarios.filter((s) => s.active).length;
            expect(activeCount).toBe(1);
        });

        it('le bon scénario est marqué comme actif', async () => {
            const status = await run(service.activateScenario('eco'));
            const active = status.scenarios.find((s) => s.active);
            expect(active?.id).toBe('eco');
        });
    });

    // ----------------------------------------------------------------
    //  getEvents
    // ----------------------------------------------------------------
    describe('getEvents()', () => {
        it('retourne un tableau d\'événements', async () => {
            const events = await run(service.getEvents(10));
            expect(Array.isArray(events)).toBe(true);
        });

        it('respecte la limite passée en paramètre', async () => {
            // Générer des événements
            await run(service.setLight('salon', 'off'));
            await run(service.setLight('salon', 'on'));
            await run(service.setLight('cuisine', 'off'));
            const events = await run(service.getEvents(2));
            expect(events.length).toBeLessThanOrEqual(2);
        });

        it('chaque événement a les champs requis', async () => {
            await run(service.setLight('salon', 'off'));
            const events = await run(service.getEvents(5));
            if (events.length > 0) {
                const e = events[0];
                expect(e).toHaveProperty('id');
                expect(e).toHaveProperty('type');
                expect(e).toHaveProperty('description');
                expect(e).toHaveProperty('severity');
                expect(e).toHaveProperty('created_at');
            }
        });
    });

    // ----------------------------------------------------------------
    //  simulateDoorToggle (méthode de simulation)
    // ----------------------------------------------------------------
    describe('simulateDoorToggle()', () => {
        it('ouvre la porte d\'entrée', async () => {
            const status = await run(service.simulateDoorToggle('entree'));
            const door = status.doors.find((d) => d.id === 'entree');
            expect(door?.open).toBe(true);
        });

        it('referme la porte si togglée deux fois', async () => {
            await run(service.simulateDoorToggle('entree'));
            const status = await run(service.simulateDoorToggle('entree'));
            const door = status.doors.find((d) => d.id === 'entree');
            expect(door?.open).toBe(false);
        });
    });

    // ----------------------------------------------------------------
    //  setOptions / getOptions
    // ----------------------------------------------------------------
    describe('setOptions() et getOptions()', () => {
        it('getOptions() retourne les options par défaut', () => {
            const opts = service.getOptions();
            expect(opts.simulateFailures).toBe(false);
            expect(opts.networkCut).toBe(false);
        });

        it('setOptions() met à jour simulateFailures', () => {
            service.setOptions({ simulateFailures: true });
            expect(service.getOptions().simulateFailures).toBe(true);
        });

        it('setOptions() met à jour networkCut — les appels suivants échouent', async () => {
            service.setOptions({ networkCut: true });
            await expect(run(service.getStatus())).rejects.toThrow(/réseau/i);
        });
    });
});
