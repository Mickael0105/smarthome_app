// ============================================================
//  Store global — Zustand (Maison Intelligente L3 GL)
//  Centralise l'état, les thèmes, les scénarios et le RBAC
// ============================================================

import { create } from 'zustand';
import type {
    HouseStatus,
    HouseEvent,
    User,
    UserRole,
    CommandState,
    GarageState,
    ScenarioId,
    QueuedAction,
} from '../types/house';
import type { HouseService } from '../services/HouseService';
import { mockService, type MockOptions } from '../services/MockService';
import { EVENTS_DEFAULT_LIMIT, POLL_INTERVAL_MS } from '../config/app.config';
import { generateId } from '../utils/helpers';
import { HouseServiceFactory, type ServiceMode } from '../services/HouseServiceFactory';

interface HouseStore {
    // --- Service actif ---
    serviceMode: ServiceMode;
    service: HouseService;
    setServiceMode(mode: ServiceMode): void;

    // --- Thème visuel (Clair / Sombre) ---
    themeMode: 'dark' | 'light';
    toggleTheme(): void;
    setThemeMode(mode: 'dark' | 'light'): void;

    // --- État global de l'habitat ---
    status: HouseStatus | null;
    events: HouseEvent[];
    user: User | null;
    isLoggedIn: boolean;

    // --- Connexion & Résilience ---
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
    offlineQueue: QueuedAction[];

    // --- États de commandes individuelles ---
    lightCommands: Record<string, CommandState>;
    windowCommands: Record<string, CommandState>;
    garageCommand: CommandState;
    lockCommand: CommandState;
    unlockCommand: CommandState;
    setpointCommand: CommandState;
    alertAckCommand: CommandState;
    scenarioCommand: CommandState;

    // --- Mode développeur & simulation ---
    devMode: boolean;
    simulateFailures: boolean;
    pendingSetpoint: number | null;
    mockOptions: MockOptions;

    // --- Actions métier ---
    fetchStatus(): Promise<void>;
    setLight(roomId: string, state: 'on' | 'off'): Promise<void>;
    toggleWindow(windowId: string): Promise<void>;
    setGarageState(state: GarageState): Promise<void>;
    lock(): Promise<void>;
    unlock(): Promise<void>;
    setSetpoint(value: number): Promise<void>;
    setPendingSetpoint(value: number): void;
    acknowledgeAlert(): Promise<void>;
    triggerIntrusionAlert(): Promise<void>;
    activateScenario(scenarioId: ScenarioId): Promise<void>;
    fetchEvents(): Promise<void>;

    // --- Authentification & Rôles (RBAC) ---
    login(username: string, password: string): Promise<void>;
    logout(): Promise<void>;
    switchRole(role: UserRole): Promise<void>;

    // --- Outils Développeur & Simulation ---
    setDevMode(enabled: boolean): void;
    toggleDevMode(): void;
    toggleSimulateFailures(): void;
    setMockOptions(opts: Partial<MockOptions>): void;
    simulateDoorToggle(doorId: string): Promise<void>;
    simulateMotion(sensorId: string): Promise<void>;

    // --- File d'attente hors-ligne ---
    flushOfflineQueue(): Promise<void>;
    startPolling(): () => void;
}

function emptyCommand(): CommandState {
    return { status: 'idle' };
}

export const useHouseStore = create<HouseStore>((set, get) => ({
    serviceMode: 'simulation',
    service: mockService,
    setServiceMode(mode) {
        const newService = HouseServiceFactory.getService(mode);
        set({
            serviceMode: mode,
            service: newService,
            user: newService.auth.getUser(),
            isLoggedIn: newService.auth.isLoggedIn(),
        });
        get().fetchStatus();
    },

    themeMode: 'dark',
    toggleTheme() {
        set((s) => ({ themeMode: s.themeMode === 'dark' ? 'light' : 'dark' }));
    },
    setThemeMode(mode) {
        set({ themeMode: mode });
    },

    status: null,
    events: [],
    user: mockService.auth.getUser(),
    isLoggedIn: true,

    connectionStatus: 'disconnected',
    offlineQueue: [],

    lightCommands: {},
    windowCommands: {},
    garageCommand: emptyCommand(),
    lockCommand: emptyCommand(),
    unlockCommand: emptyCommand(),
    setpointCommand: emptyCommand(),
    alertAckCommand: emptyCommand(),
    scenarioCommand: emptyCommand(),

    devMode: false,
    simulateFailures: false,
    pendingSetpoint: null,
    mockOptions: mockService.getOptions(),

    // ----------------------------------------------------------
    //  Fetch Status
    // ----------------------------------------------------------

    async fetchStatus() {
        if (get().connectionStatus !== 'connected') {
            set({ connectionStatus: 'connecting' });
        }
        try {
            const status = await get().service.getStatus();
            set({ status, connectionStatus: 'connected' });
            // Si la file d'attente contient des actions, on les synchronise
            if (get().offlineQueue.length > 0) {
                get().flushOfflineQueue();
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur inconnue';
            set({ connectionStatus: 'disconnected' });
            console.warn('[fetchStatus]', msg);
        }
    },

    // ----------------------------------------------------------
    //  Lumières
    // ----------------------------------------------------------

    async setLight(roomId, state) {
        // Mode hors ligne : ajout à la file d'attente Outbox
        if (get().connectionStatus === 'disconnected') {
            const action: QueuedAction = {
                id: generateId(),
                type: 'light',
                description: `Allumer/Éteindre lumière ${roomId}`,
                timestamp: new Date().toISOString(),
                payload: { roomId, state },
            };
            set((s) => ({ offlineQueue: [...s.offlineQueue, action] }));
            return;
        }

        set((s) => ({
            lightCommands: { ...s.lightCommands, [roomId]: { status: 'pending' } },
        }));
        try {
            const status = await get().service.setLight(roomId, state);
            set((s) => ({
                status,
                lightCommands: { ...s.lightCommands, [roomId]: { status: 'success' } },
            }));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur';
            set((s) => ({
                lightCommands: { ...s.lightCommands, [roomId]: { status: 'error', errorMessage: msg } },
            }));
        }
    },

    // ----------------------------------------------------------
    //  Fenêtres
    // ----------------------------------------------------------

    async toggleWindow(windowId) {
        set((s) => ({
            windowCommands: { ...s.windowCommands, [windowId]: { status: 'pending' } },
        }));
        try {
            const status = await get().service.toggleWindow(windowId);
            set((s) => ({
                status,
                windowCommands: { ...s.windowCommands, [windowId]: { status: 'success' } },
            }));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur';
            set((s) => ({
                windowCommands: { ...s.windowCommands, [windowId]: { status: 'error', errorMessage: msg } },
            }));
        }
    },

    // ----------------------------------------------------------
    //  Porte de Garage
    // ----------------------------------------------------------

    async setGarageState(state) {
        set({ garageCommand: { status: 'pending' } });
        try {
            const status = await get().service.setGarageState(state);
            set({ status, garageCommand: { status: 'success' } });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur';
            set({ garageCommand: { status: 'error', errorMessage: msg } });
        }
    },

    // ----------------------------------------------------------
    //  Verrouillage / Déverrouillage
    // ----------------------------------------------------------

    async lock() {
        set({ lockCommand: { status: 'pending' } });
        try {
            const status = await get().service.lock();
            set({ status, lockCommand: { status: 'success' } });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur';
            set({ lockCommand: { status: 'error', errorMessage: msg } });
        }
    },

    async unlock() {
        set({ unlockCommand: { status: 'pending' } });
        try {
            const status = await get().service.unlock();
            set({ status, unlockCommand: { status: 'success' } });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur';
            set({ unlockCommand: { status: 'error', errorMessage: msg } });
        }
    },

    // ----------------------------------------------------------
    //  Thermostat
    // ----------------------------------------------------------

    async setSetpoint(value) {
        set({ setpointCommand: { status: 'pending' } });
        try {
            const status = await get().service.setSetpoint(value);
            set({ status, setpointCommand: { status: 'success' } });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur';
            set({ setpointCommand: { status: 'error', errorMessage: msg } });
        }
    },

    setPendingSetpoint(value) {
        set({ pendingSetpoint: value });
    },

    // ----------------------------------------------------------
    //  Alertes
    // ----------------------------------------------------------

    async acknowledgeAlert() {
        set({ alertAckCommand: { status: 'pending' } });
        try {
            const status = await get().service.acknowledgeAlert();
            set({ status, alertAckCommand: { status: 'success' } });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur';
            set({ alertAckCommand: { status: 'error', errorMessage: msg } });
        }
    },

    async triggerIntrusionAlert() {
        const firstDoor = get().status?.doors?.[0];
        if (firstDoor) {
            const newStatus = await mockService.simulateDoorToggle(firstDoor.id);
            set({ status: newStatus });
        }
    },

    // ----------------------------------------------------------
    //  Scénarios de vie (Command Pattern)
    // ----------------------------------------------------------

    async activateScenario(scenarioId) {
        set({ scenarioCommand: { status: 'pending' } });
        try {
            const status = await get().service.activateScenario(scenarioId);
            set({ status, scenarioCommand: { status: 'success' } });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur scénario';
            set({ scenarioCommand: { status: 'error', errorMessage: msg } });
        }
    },

    // ----------------------------------------------------------
    //  Historique
    // ----------------------------------------------------------

    async fetchEvents() {
        try {
            const events = await get().service.getEvents(EVENTS_DEFAULT_LIMIT);
            set({ events });
        } catch (e: unknown) {
            console.warn('[fetchEvents]', e);
        }
    },

    // ----------------------------------------------------------
    //  Authentification & RBAC
    // ----------------------------------------------------------

    async login(username, password) {
        const user = await get().service.auth.login({ username, password });
        set({ user, isLoggedIn: true });
    },

    async logout() {
        await get().service.auth.logout();
        set({ user: get().service.auth.getUser(), isLoggedIn: false });
    },

    async switchRole(role) {
        const user = await get().service.auth.switchRole(role);
        set({ user, isLoggedIn: role !== 'guest' });
    },

    // ----------------------------------------------------------
    //  File d'attente hors-ligne (Outbox Pattern)
    // ----------------------------------------------------------

    async flushOfflineQueue() {
        const queue = [...get().offlineQueue];
        if (queue.length === 0) return;

        set({ offlineQueue: [] });
        for (const item of queue) {
            if (item.type === 'light') {
                const { roomId, state } = item.payload as { roomId: string; state: 'on' | 'off' };
                await get().service.setLight(roomId, state);
            }
        }
        await get().fetchStatus();
    },

    // ----------------------------------------------------------
    //  Mode Développeur & Simulation
    // ----------------------------------------------------------

    setDevMode(enabled) { set({ devMode: enabled }); },
    toggleDevMode() { set((s) => ({ devMode: !s.devMode })); },
    toggleSimulateFailures() {
        const next = !get().simulateFailures;
        set({ simulateFailures: next });
        mockService.setOptions({ simulateFailures: next });
    },
    setMockOptions(opts) {
        mockService.setOptions(opts);
        set({ mockOptions: mockService.getOptions() });
        get().fetchStatus();
    },
    async simulateDoorToggle(doorId) {
        const status = await mockService.simulateDoorToggle(doorId);
        set({ status });
    },
    async simulateMotion(sensorId) {
        const status = await mockService.simulateMotion(sensorId);
        set({ status });
    },

    // ----------------------------------------------------------
    //  Polling
    // ----------------------------------------------------------

    startPolling() {
        get().fetchStatus();
        const id = setInterval(() => {
            get().fetchStatus();
        }, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    },
}));
