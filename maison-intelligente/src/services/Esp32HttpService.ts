// ============================================================
//  Esp32HttpService — Client HTTP REST pour microcontrôleur ESP32
//  Implémente l'interface HouseService (Clean Architecture)
//  Prêt pour l'intégration matérielle finale
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
} from '../types/house';
import {
    DEFAULT_ESP32_BASE_URL,
    ESP32_REQUEST_TIMEOUT_MS,
    EVENTS_DEFAULT_LIMIT,
} from '../config/app.config';

// ------------------------------------------------------------
//  Service d'authentification ESP32
// ------------------------------------------------------------
class Esp32AuthService implements AuthService {
    private currentUser: User | null = null;
    private token: string | null = null;

    constructor(private readonly getBaseUrl: () => string) {
        // État initial : utilisateur invité par défaut
        this.currentUser = {
            username: 'invite',
            displayName: 'Visiteur ESP32',
            role: 'guest',
            avatar: 'guest',
        };
    }

    async login(credentials: LoginCredentials): Promise<User> {
        const url = `${this.getBaseUrl()}/api/auth/login`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ESP32_REQUEST_TIMEOUT_MS);

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                signal: controller.signal,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Authentification échouée (${res.status})`);
            }

            const data = await res.json();
            this.token = data.token || 'esp32_bearer_token';
            this.currentUser = {
                username: data.user?.username || credentials.username,
                displayName: data.user?.displayName || credentials.username,
                role: data.user?.role || 'admin',
                avatar: data.user?.avatar || 'admin',
            };
            return this.currentUser;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                throw new Error('Délai dépassé lors de la connexion à l’ESP32 (Timeout)');
            }
            throw new Error(`Erreur de connexion ESP32 : ${err.message || 'Hôte injoignable'}`);
        } finally {
            clearTimeout(timer);
        }
    }

    async logout(): Promise<void> {
        this.token = null;
        this.currentUser = {
            username: 'invite',
            displayName: 'Visiteur ESP32',
            role: 'guest',
            avatar: 'guest',
        };
    }

    getUser(): User | null {
        return this.currentUser;
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null && this.currentUser.role !== 'guest';
    }

    async switchRole(role: UserRole): Promise<User> {
        this.currentUser = {
            username: role === 'admin' ? 'admin' : role === 'member' ? 'famille' : 'invite',
            displayName: role === 'admin' ? 'Administrateur ESP32' : role === 'member' ? 'Membre Famille' : 'Invité ESP32',
            role,
            avatar: role,
        };
        return this.currentUser;
    }

    getToken(): string | null {
        return this.token;
    }
}

// ------------------------------------------------------------
//  Service Principal HTTP ESP32
// ------------------------------------------------------------
export class Esp32HttpService implements HouseService {
    private baseUrl: string;
    readonly auth: Esp32AuthService;

    constructor(baseUrl: string = DEFAULT_ESP32_BASE_URL) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.auth = new Esp32AuthService(() => this.baseUrl);
    }

    /** Permet de changer dynamiquement l'adresse IP de l'ESP32 dans l'UI */
    setBaseUrl(url: string): void {
        this.baseUrl = url.replace(/\/+$/, '');
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    // --- Méthodes privées d'envoi HTTP ---

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), ESP32_REQUEST_TIMEOUT_MS);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        const token = this.auth.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(fullUrl, {
                ...options,
                headers,
                signal: controller.signal,
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.message || `Erreur ESP32 HTTP ${res.status}: ${res.statusText}`);
            }

            return await res.json();
        } catch (err: any) {
            if (err.name === 'AbortError') {
                throw new Error(`Timeout : l'ESP32 (${this.baseUrl}) ne répond pas dans le délai imparti`);
            }
            throw new Error(`Échec de communication avec l'ESP32 : ${err.message || 'Réseau indisponible'}`);
        } finally {
            clearTimeout(timeout);
        }
    }

    // --- Implémentation du contrat HouseService ---

    async getStatus(): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/status', { method: 'GET' });
    }

    async setLight(roomId: string, state: LightState): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/light', {
            method: 'POST',
            body: JSON.stringify({ id: roomId, state }),
        });
    }

    async toggleWindow(windowId: string): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/window', {
            method: 'POST',
            body: JSON.stringify({ id: windowId }),
        });
    }

    async setGarageState(state: GarageState): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/garage', {
            method: 'POST',
            body: JSON.stringify({ state }),
        });
    }

    async lock(): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/lock', {
            method: 'POST',
            body: JSON.stringify({ mode: 'locked' }),
        });
    }

    async unlock(): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/unlock', {
            method: 'POST',
            body: JSON.stringify({ mode: 'unlocked' }),
        });
    }

    async setSetpoint(value: number): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/thermostat', {
            method: 'POST',
            body: JSON.stringify({ setpoint: value }),
        });
    }

    async acknowledgeAlert(): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/alert/ack', {
            method: 'POST',
        });
    }

    async activateScenario(scenarioId: ScenarioId): Promise<HouseStatus> {
        return this.request<HouseStatus>('/api/scenario', {
            method: 'POST',
            body: JSON.stringify({ scenario: scenarioId }),
        });
    }

    async getEvents(limit: number = EVENTS_DEFAULT_LIMIT): Promise<HouseEvent[]> {
        return this.request<HouseEvent[]>(`/api/events?limit=${limit}`, {
            method: 'GET',
        });
    }
}

export const esp32HttpService = new Esp32HttpService();
