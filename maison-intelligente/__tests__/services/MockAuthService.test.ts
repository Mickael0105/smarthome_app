// ============================================================
//  Tests unitaires — src/services/MockService (AuthService)
//  Couverture : login, logout, getUser, isLoggedIn, switchRole
// ============================================================

// Bypass des timers pour accélérer les tests
jest.useFakeTimers();

// Mock des dépendances React Native non disponibles en Node
jest.mock('../../src/constants/theme', () => ({
    STALE_THRESHOLD_MS: 30000,
}));
jest.mock('../../src/config/app.config', () => ({
    MOCK_LATENCY_MIN_MS: 0,
    MOCK_LATENCY_MAX_MS: 0,
}));

import { MockService } from '../../src/services/MockService';

// Utilitaire : avance les timers juste assez pour débloquer les micro-délais
async function run<T>(promise: Promise<T>): Promise<T> {
    jest.advanceTimersByTime(300);
    return promise;
}

describe('MockAuthService — Authentification (RBAC)', () => {
    let service: MockService;

    beforeEach(() => {
        service = new MockService();
    });

    afterEach(() => {
        service.destroy();
        jest.clearAllTimers();
    });

    // --- getUser ---
    describe('getUser()', () => {
        it('retourne un utilisateur par défaut (admin)', () => {
            const user = service.auth.getUser();
            expect(user).not.toBeNull();
            expect(user!.username).toBe('admin');
            expect(user!.role).toBe('admin');
        });
    });

    // --- isLoggedIn ---
    describe('isLoggedIn()', () => {
        it('retourne true pour le rôle admin (état initial)', () => {
            expect(service.auth.isLoggedIn()).toBe(true);
        });

        it('retourne false après passage en rôle guest', async () => {
            await run(service.auth.switchRole('guest'));
            expect(service.auth.isLoggedIn()).toBe(false);
        });
    });

    // --- login ---
    describe('login()', () => {
        it('accepte admin/admin123 et retourne le rôle admin', async () => {
            const user = await run(service.auth.login({ username: 'admin', password: 'admin123' }));
            expect(user.role).toBe('admin');
            expect(user.username).toBe('admin');
        });

        it('accepte famille/famille123 et retourne le rôle member', async () => {
            const user = await run(service.auth.login({ username: 'famille', password: 'famille123' }));
            expect(user.role).toBe('member');
        });

        it('accepte invite/invite123 et retourne le rôle guest', async () => {
            const user = await run(service.auth.login({ username: 'invite', password: 'invite123' }));
            expect(user.role).toBe('guest');
        });

        it('accepte demo/demo1234 et retourne le rôle admin', async () => {
            const user = await run(service.auth.login({ username: 'demo', password: 'demo1234' }));
            expect(user.role).toBe('admin');
        });

        it('rejette des identifiants incorrects avec une erreur explicite', async () => {
            const promise = run(service.auth.login({ username: 'hacker', password: 'wrong' }));
            await expect(promise).rejects.toThrow('Identifiants incorrects');
        });

        it('rejette un mot de passe incorrect pour un login valide', async () => {
            const promise = run(service.auth.login({ username: 'admin', password: 'mauvais' }));
            await expect(promise).rejects.toThrow();
        });
    });

    // --- logout ---
    describe('logout()', () => {
        it('repasse l\'utilisateur en guest après déconnexion', async () => {
            await run(service.auth.logout());
            expect(service.auth.getUser()!.role).toBe('guest');
            expect(service.auth.isLoggedIn()).toBe(false);
        });
    });

    // --- switchRole ---
    describe('switchRole()', () => {
        it('passe au rôle admin', async () => {
            const user = await run(service.auth.switchRole('admin'));
            expect(user.role).toBe('admin');
        });

        it('passe au rôle member', async () => {
            const user = await run(service.auth.switchRole('member'));
            expect(user.role).toBe('member');
            expect(user.username).toBe('famille');
        });

        it('passe au rôle guest et désactive isLoggedIn', async () => {
            const user = await run(service.auth.switchRole('guest'));
            expect(user.role).toBe('guest');
            expect(service.auth.isLoggedIn()).toBe(false);
        });

        it('met à jour getUser() immédiatement après switchRole', async () => {
            await run(service.auth.switchRole('member'));
            const current = service.auth.getUser();
            expect(current!.role).toBe('member');
        });
    });
});
