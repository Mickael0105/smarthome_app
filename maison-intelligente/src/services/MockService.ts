// ============================================================
//  MockService — Implémentation Simulation Haute Fidélité
//  Conforme au cahier des charges L3 Génie Logiciel
// ============================================================

import type { HouseService, AuthService } from './HouseService';
import type {
    HouseStatus,
    HouseEvent,
    LoginCredentials,
    User,
    UserRole,
    LightState,
    GarageState,
    ScenarioId,
    EventType,
    EventSeverity,
    TemperaturePoint,
} from '../types/house';
import {
    MOCK_LATENCY_MIN_MS,
    MOCK_LATENCY_MAX_MS,
} from '../config/app.config';
import { randomDelay, generateId } from '../utils/helpers';

// ---- Historique initial des températures sur 24h ----
const initialTempHistory: TemperaturePoint[] = [
    { time: '00:00', temp: 19.8, setpoint: 19.0 },
    { time: '02:00', temp: 19.4, setpoint: 19.0 },
    { time: '04:00', temp: 19.1, setpoint: 19.0 },
    { time: '06:00', temp: 19.0, setpoint: 20.0 },
    { time: '08:00', temp: 20.4, setpoint: 20.5 },
    { time: '10:00', temp: 21.2, setpoint: 21.0 },
    { time: '12:00', temp: 22.8, setpoint: 21.0 },
    { time: '14:00', temp: 23.5, setpoint: 21.5 },
    { time: '16:00', temp: 23.9, setpoint: 21.5 },
    { time: '18:00', temp: 23.1, setpoint: 22.0 },
    { time: '20:00', temp: 22.6, setpoint: 22.0 },
    { time: '22:00', temp: 21.8, setpoint: 20.0 },
];

// ---- État initial complet de la maison ----
const initialStatus: HouseStatus = {
    timestamp: new Date().toISOString(),
    lock_mode: 'unlocked',
    lights: [
        { id: 'salon', name: 'Salon principal', room: 'Salon', state: 'on', powerWatts: 60 },
        { id: 'chambre', name: 'Chambre parentale', room: 'Chambre', state: 'off', powerWatts: 40 },
        { id: 'cuisine', name: 'Cuisine', room: 'Cuisine', state: 'on', powerWatts: 50 },
        { id: 'jardin', name: 'Jardin & Terrasse', room: 'Extérieur', state: 'off', powerWatts: 100 },
        { id: 'garage', name: 'Atelier Garage', room: 'Garage', state: 'off', powerWatts: 45 },
    ],
    doors: [
        { id: 'entree', name: "Porte d'entrée", type: 'entrance', lock: 'unlocked', open: false },
        { id: 'chambre', name: 'Porte de la chambre', type: 'interior', lock: 'unlocked', open: false },
        { id: 'terrasse', name: 'Porte terrasse', type: 'terrace', lock: 'unlocked', open: false },
    ],
    windows: [
        { id: 'fenetre_salon', name: 'Baie vitrée Salon', room: 'Salon', open: false },
        { id: 'fenetre_chambre', name: 'Fenêtre Chambre', room: 'Chambre', open: false },
        { id: 'fenetre_cuisine', name: 'Fenêtre Cuisine', room: 'Cuisine', open: false },
    ],
    garage: {
        id: 'porte_garage',
        name: 'Porte de garage sectionnelle',
        state: 'closed',
        lock: 'locked',
    },
    motionSensors: [
        { id: 'pir_salon', name: 'Détecteur Salon', room: 'Salon', detected: false, lastDetected: new Date(Date.now() - 360000).toISOString() },
        { id: 'pir_entree', name: 'Détecteur Hall', room: 'Entrée', detected: true, lastDetected: new Date().toISOString() },
        { id: 'pir_jardin', name: 'Détecteur Allée', room: 'Jardin', detected: false, lastDetected: new Date(Date.now() - 1200000).toISOString() },
    ],
    temperature: {
        value: 22.4,
        unit: 'C',
        updated_at: new Date().toISOString(),
    },
    humidity: {
        value: 54,
        updated_at: new Date().toISOString(),
    },
    luminosity: {
        value: 480,
        updated_at: new Date().toISOString(),
    },
    setpoint: 21.5,
    alert: null,
    scenarios: [
        { id: 'night', name: 'Mode Nuit', icon: 'bed', description: 'Extinction totale, verrouillage et chauffage éco', color: '#6366F1', active: false },
        { id: 'away', name: 'Mode Départ', icon: 'security', description: 'Maison sécurisée, alarme armée et économie', color: '#EC4899', active: false },
        { id: 'home', name: 'Mode Retour', icon: 'home', description: 'Déverrouillage, salon allumé et confort 21°C', color: '#10B981', active: true },
        { id: 'cinema', name: 'Mode Cinéma', icon: 'cinema', description: 'Lumières tamisées et ambiance salon feutrée', color: '#F59E0B', active: false },
        { id: 'eco', name: 'Mode Éco', icon: 'eco', description: 'Optimisation de la consommation énergétique', color: '#14B8A6', active: false },
    ],
    energy: {
        currentPowerW: 110,
        dailyKwh: 3.4,
        ecoScore: 'A',
    },
    tempHistory: initialTempHistory,
};

// ---- Options de simulation ----
export interface MockOptions {
    simulateFailures: boolean;
    networkCut: boolean;
    temperatureUnavailable: boolean;
}

const defaultOptions: MockOptions = {
    simulateFailures: false,
    networkCut: false,
    temperatureUnavailable: false,
};

// ============================================================
//  Auth Service Mock (RBAC)
// ============================================================

class MockAuthService implements AuthService {
    private currentUser: User = {
        username: 'admin',
        displayName: 'Administrateur',
        role: 'admin',
        avatar: 'admin',
    };

    async login(credentials: LoginCredentials): Promise<User> {
        await randomDelay(MOCK_LATENCY_MIN_MS, MOCK_LATENCY_MAX_MS);

        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            this.currentUser = { username: 'admin', displayName: 'Administrateur (Propriétaire)', role: 'admin', avatar: 'admin' };
            return this.currentUser;
        }
        if (credentials.username === 'famille' && credentials.password === 'famille123') {
            this.currentUser = { username: 'famille', displayName: 'Lucas (Membre)', role: 'member', avatar: 'user' };
            return this.currentUser;
        }
        if (credentials.username === 'invite' && credentials.password === 'invite123') {
            this.currentUser = { username: 'invite', displayName: 'Invité temporaire', role: 'guest', avatar: 'guest' };
            return this.currentUser;
        }
        if (credentials.username === 'demo' && credentials.password === 'demo1234') {
            this.currentUser = { username: 'demo', displayName: 'Utilisateur Démo', role: 'admin', avatar: 'admin' };
            return this.currentUser;
        }

        throw new Error('Identifiants incorrects. Comptes démo : admin/admin123, famille/famille123 ou invite/invite123.');
    }

    async logout(): Promise<void> {
        await randomDelay(100, 250);
        this.currentUser = { username: 'invite', displayName: 'Invité temporaire', role: 'guest', avatar: 'guest' };
    }

    getUser(): User | null {
        return this.currentUser;
    }

    isLoggedIn(): boolean {
        return this.currentUser.role !== 'guest';
    }

    async switchRole(role: UserRole): Promise<User> {
        await randomDelay(100, 200);
        switch (role) {
            case 'admin':
                this.currentUser = { username: 'admin', displayName: 'Administrateur', role: 'admin', avatar: 'admin' };
                break;
            case 'member':
                this.currentUser = { username: 'famille', displayName: 'Lucas (Membre)', role: 'member', avatar: 'user' };
                break;
            case 'guest':
                this.currentUser = { username: 'invite', displayName: 'Invité temporaire', role: 'guest', avatar: 'guest' };
                break;
        }
        return this.currentUser;
    }
}

// ============================================================
//  Service Principal Mock
// ============================================================

export class MockService implements HouseService {
    private status: HouseStatus = JSON.parse(JSON.stringify(initialStatus));
    private events: HouseEvent[] = [];
    private options: MockOptions = { ...defaultOptions };
    private tempDriftTimer: ReturnType<typeof setInterval> | null = null;

    auth: AuthService = new MockAuthService();

    constructor() {
        this._startSimulationCycles();
        this._addEvent('login', 'info', 'Système initialisé en simulation (Mode L3 Génie Logiciel)');
    }

    // ---- Configuration des options de simulation ----

    setOptions(opts: Partial<MockOptions>): void {
        this.options = { ...this.options, ...opts };

        if (opts.temperatureUnavailable !== undefined) {
            if (opts.temperatureUnavailable) {
                this.status.temperature = null;
                this.status.humidity = null;
            } else {
                this.status.temperature = {
                    value: 22.0 + Math.random() * 2,
                    unit: 'C',
                    updated_at: new Date().toISOString(),
                };
                this.status.humidity = {
                    value: 50 + Math.floor(Math.random() * 10),
                    updated_at: new Date().toISOString(),
                };
            }
        }
    }

    getOptions(): MockOptions {
        return { ...this.options };
    }

    // ---- Méthodes HouseService ----

    async getStatus(): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();
        this.status.timestamp = new Date().toISOString();
        this._updateEnergyStats();
        return this._cloneStatus();
    }

    async setLight(roomId: string, state: LightState): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        const light = this.status.lights.find((l) => l.id === roomId);
        if (!light) throw new Error(`Lumière introuvable : ${roomId}`);

        light.state = state;
        this.status.timestamp = new Date().toISOString();
        this._updateEnergyStats();

        this._addEvent(
            state === 'on' ? 'light_on' : 'light_off',
            'info',
            `${light.name} : ${state === 'on' ? 'Allumée' : 'Éteinte'}`
        );

        return this._cloneStatus();
    }

    async toggleWindow(windowId: string): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        const win = this.status.windows.find((w) => w.id === windowId);
        if (!win) throw new Error(`Fenêtre introuvable : ${windowId}`);

        win.open = !win.open;
        this.status.timestamp = new Date().toISOString();

        this._addEvent(
            win.open ? 'window_open' : 'window_close',
            win.open ? 'warning' : 'info',
            `${win.name} : ${win.open ? 'Ouverte' : 'Fermée'}`
        );

        // Règle 6 étendue : si la maison est verrouillée et qu'une fenêtre s'ouvre -> alerte intrusion
        if (win.open && this.status.lock_mode === 'locked') {
            this.status.alert = {
                active: true,
                door_id: win.id,
                sourceType: 'window',
                since: new Date().toISOString(),
            };
            this._addEvent('alert', 'critical', `Alerte intrusion ! ${win.name} ouverte en mode verrouillé`);
        }

        return this._cloneStatus();
    }

    async setGarageState(state: GarageState): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        this.status.garage.state = state;
        if (state === 'open') {
            this.status.garage.lock = 'unlocked';
        } else if (state === 'closed') {
            this.status.garage.lock = 'locked';
        }

        this.status.timestamp = new Date().toISOString();
        this._addEvent(
            state === 'open' ? 'garage_open' : 'garage_close',
            'info',
            `Porte de garage : ${state === 'open' ? 'Ouverte' : 'Fermée et sécurisée'}`
        );

        return this._cloneStatus();
    }

    async lock(): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        // Règle 5 : impossible de verrouiller si une porte ou une fenêtre est ouverte
        const openDoor = this.status.doors.find((d) => d.open);
        if (openDoor) {
            throw new Error(`Impossible de verrouiller : ${openDoor.name} est ouverte. Fermez-la d'abord.`);
        }
        const openWindow = this.status.windows.find((w) => w.open);
        if (openWindow) {
            throw new Error(`Impossible de verrouiller : ${openWindow.name} est ouverte. Fermez-la d'abord.`);
        }

        this.status.lock_mode = 'locked';
        this.status.doors.forEach((d) => (d.lock = 'locked'));
        this.status.garage.lock = 'locked';
        this.status.timestamp = new Date().toISOString();

        this._addEvent('lock', 'info', 'Maison et accès complètement verrouillés');
        return this._cloneStatus();
    }

    async unlock(): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        this.status.lock_mode = 'unlocked';
        this.status.doors.forEach((d) => (d.lock = 'unlocked'));
        this.status.timestamp = new Date().toISOString();

        this._addEvent('unlock', 'info', 'Maison déverrouillée');
        return this._cloneStatus();
    }

    async setSetpoint(value: number): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        if (value < 16 || value > 30) {
            throw new Error(`Consigne hors limites (16–30 °C) : ${value}`);
        }

        this.status.setpoint = Math.round(value * 2) / 2;
        this.status.timestamp = new Date().toISOString();
        this._updateEnergyStats();

        this._addEvent('setpoint_change', 'info', `Consigne de chauffage réglée à ${this.status.setpoint} °C`);
        return this._cloneStatus();
    }

    async acknowledgeAlert(): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        if (this.status.alert) {
            this._addEvent('alert_ack', 'info', 'Alerte intrusion acquittée par utilisateur');
            this.status.alert = null;
        }
        this.status.timestamp = new Date().toISOString();
        return this._cloneStatus();
    }

    async activateScenario(scenarioId: ScenarioId): Promise<HouseStatus> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();

        this.status.scenarios.forEach((s) => (s.active = s.id === scenarioId));

        switch (scenarioId) {
            case 'night':
                this.status.lights.forEach((l) => (l.state = 'off'));
                this.status.setpoint = 18.5;
                this.status.doors.forEach((d) => { d.open = false; d.lock = 'locked'; });
                this.status.windows.forEach((w) => (w.open = false));
                this.status.garage.state = 'closed';
                this.status.garage.lock = 'locked';
                this.status.lock_mode = 'locked';
                this._addEvent('scenario_activated', 'info', 'Scénario "Mode Nuit" activé : extinction et sécurisation');
                break;

            case 'away':
                this.status.lights.forEach((l) => (l.state = 'off'));
                this.status.setpoint = 17.0;
                this.status.doors.forEach((d) => { d.open = false; d.lock = 'locked'; });
                this.status.windows.forEach((w) => (w.open = false));
                this.status.garage.state = 'closed';
                this.status.garage.lock = 'locked';
                this.status.lock_mode = 'locked';
                this._addEvent('scenario_activated', 'warning', 'Scénario "Mode Départ" activé : alarme armée');
                break;

            case 'home':
                this.status.lock_mode = 'unlocked';
                this.status.doors.forEach((d) => (d.lock = 'unlocked'));
                const salonLight = this.status.lights.find((l) => l.id === 'salon');
                if (salonLight) salonLight.state = 'on';
                this.status.setpoint = 21.0;
                this._addEvent('scenario_activated', 'info', 'Scénario "Mode Retour" activé : confort et accueil');
                break;

            case 'cinema':
                this.status.lights.forEach((l) => {
                    l.state = l.id === 'salon' ? 'on' : 'off';
                });
                this.status.setpoint = 21.5;
                this._addEvent('scenario_activated', 'info', 'Scénario "Mode Cinéma" activé : salon tamisé');
                break;

            case 'eco':
                this.status.lights.forEach((l) => {
                    if (l.id !== 'salon') l.state = 'off';
                });
                this.status.setpoint = 19.0;
                this._addEvent('scenario_activated', 'info', 'Scénario "Mode Éco" activé : optimisation énergétique');
                break;
        }

        this.status.timestamp = new Date().toISOString();
        this._updateEnergyStats();
        return this._cloneStatus();
    }

    async getEvents(limit: number): Promise<HouseEvent[]> {
        this._checkNetworkCut();
        await this._simulatedDelay();
        this._maybeThrow();
        return [...this.events].reverse().slice(0, limit);
    }

    // ---- Simulation manuelle pour l'écran /simulation ----

    async simulateDoorToggle(doorId: string): Promise<HouseStatus> {
        const door = this.status.doors.find((d) => d.id === doorId);
        if (!door) throw new Error(`Porte introuvable : ${doorId}`);

        door.open = !door.open;
        this.status.timestamp = new Date().toISOString();

        this._addEvent(
            door.open ? 'door_open' : 'door_close',
            door.open ? 'warning' : 'info',
            `${door.name} : ${door.open ? 'Ouverte' : 'Fermée'} (simulation)`
        );

        if (door.open && this.status.lock_mode === 'locked') {
            this.status.alert = {
                active: true,
                door_id: doorId,
                sourceType: 'door',
                since: new Date().toISOString(),
            };
            this._addEvent('alert', 'critical', `Alerte intrusion ! ${door.name} ouverte en mode verrouillé`);
        }

        return this._cloneStatus();
    }

    async simulateMotion(sensorId: string): Promise<HouseStatus> {
        const sensor = this.status.motionSensors.find((s) => s.id === sensorId);
        if (sensor) {
            sensor.detected = true;
            sensor.lastDetected = new Date().toISOString();
            this._addEvent('motion_detected', 'info', `Mouvement détecté : ${sensor.name}`);
        }
        return this._cloneStatus();
    }

    // ---- Helpers internes ----

    private _cloneStatus(): HouseStatus {
        return JSON.parse(JSON.stringify(this.status));
    }

    private async _simulatedDelay(): Promise<void> {
        await randomDelay(MOCK_LATENCY_MIN_MS, MOCK_LATENCY_MAX_MS);
    }

    private _maybeThrow(): void {
        if (this.options.simulateFailures && Math.random() < 0.2) {
            throw new Error('Erreur réseau simulée : équipement injoignable.');
        }
    }

    private _checkNetworkCut(): void {
        if (this.options.networkCut) {
            throw new Error('Réseau local coupé (simulation). Vérifiez la connexion Wi-Fi.');
        }
    }

    private _addEvent(type: EventType, severity: EventSeverity, description: string): void {
        this.events.push({
            id: generateId(),
            type,
            severity,
            description,
            created_at: new Date().toISOString(),
        });
        if (this.events.length > 200) {
            this.events = this.events.slice(-200);
        }
    }

    private _updateEnergyStats(): void {
        const activeWatts = this.status.lights
            .filter((l) => l.state === 'on')
            .reduce((sum, l) => sum + (l.powerWatts || 50), 0);
        
        // Ajout puissance de chauffe si consigne > temp actuelle
        const currentTemp = this.status.temperature?.value ?? 20;
        const setpoint = this.status.setpoint ?? 20;
        const heatingWatts = setpoint > currentTemp ? 1200 : 50;

        this.status.energy = {
            currentPowerW: activeWatts + heatingWatts,
            dailyKwh: +(3.2 + (activeWatts / 1000) * 1.5).toFixed(2),
            ecoScore: activeWatts > 150 ? 'C' : activeWatts > 80 ? 'B' : 'A',
        };
    }

    private _startSimulationCycles(): void {
        // Dérive légère de température toutes les 8s
        this.tempDriftTimer = setInterval(() => {
            if (this.options.temperatureUnavailable || !this.status.temperature) return;
            const delta = (Math.random() - 0.5) * 0.2;
            const current = this.status.temperature.value ?? 22;
            this.status.temperature.value = Math.max(16, Math.min(30, +(current + delta).toFixed(1)));
            this.status.temperature.updated_at = new Date().toISOString();

            if (this.status.humidity) {
                const humDelta = Math.floor((Math.random() - 0.5) * 2);
                this.status.humidity.value = Math.max(40, Math.min(75, (this.status.humidity.value ?? 50) + humDelta));
            }
        }, 8_000);
    }

    destroy(): void {
        if (this.tempDriftTimer) clearInterval(this.tempDriftTimer);
    }
}

export const mockService = new MockService();
