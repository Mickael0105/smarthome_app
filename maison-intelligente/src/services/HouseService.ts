// ============================================================
//  Interface HouseService — contrat entre UI et implémentations
//  Respecte le principe Ouvert/Fermé (SOLID)
// ============================================================

import type {
    HouseStatus,
    HouseEvent,
    LoginCredentials,
    User,
    LightState,
    GarageState,
    ScenarioId,
} from '../types/house';

// ---------- AuthService ----------

export interface AuthService {
    login(credentials: LoginCredentials): Promise<User>;
    logout(): Promise<void>;
    getUser(): User | null;
    isLoggedIn(): boolean;
    switchRole(role: 'admin' | 'member' | 'guest'): Promise<User>;
}

// ---------- HouseService ----------

export interface HouseService {
    /** Récupère le statut complet de la maison */
    getStatus(): Promise<HouseStatus>;

    /** Allume ou éteint une lumière */
    setLight(roomId: string, state: LightState): Promise<HouseStatus>;

    /** Ouvre ou ferme une fenêtre */
    toggleWindow(windowId: string): Promise<HouseStatus>;

    /** Pilote la porte de garage motorisée */
    setGarageState(state: GarageState): Promise<HouseStatus>;

    /** Verrouille toutes les portes et accès */
    lock(): Promise<HouseStatus>;

    /** Déverrouille les accès (requiert authentification) */
    unlock(): Promise<HouseStatus>;

    /** Règle la consigne de température (16–30 °C, pas de 0.5) */
    setSetpoint(value: number): Promise<HouseStatus>;

    /** Acquitte l'alerte intrusion */
    acknowledgeAlert(): Promise<HouseStatus>;

    /** Active un scénario de vie (Nuit, Départ, Retour, Cinéma, Éco) */
    activateScenario(scenarioId: ScenarioId): Promise<HouseStatus>;

    /** Récupère l'historique des événements */
    getEvents(limit: number): Promise<HouseEvent[]>;

    /** Service d'authentification lié */
    auth: AuthService;
}
