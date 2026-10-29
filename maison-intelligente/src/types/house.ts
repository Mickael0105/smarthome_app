// ============================================================
//  Types du contrat de données — Maison Intelligente
//  Modèle étendu pour soutenance Licence Génie Logiciel
// ============================================================

// ---------- Primitives & enums ----------

export type LightState = 'on' | 'off';
export type LockState = 'locked' | 'unlocked';
export type LockMode = 'locked' | 'unlocked';
export type EventSeverity = 'info' | 'warning' | 'critical';

export type EventType =
    | 'light_on'
    | 'light_off'
    | 'lock'
    | 'unlock'
    | 'alert'
    | 'alert_ack'
    | 'login'
    | 'logout'
    | 'setpoint_change'
    | 'door_open'
    | 'door_close'
    | 'window_open'
    | 'window_close'
    | 'garage_open'
    | 'garage_close'
    | 'motion_detected'
    | 'scenario_activated'
    | 'offline_sync';

// ---------- Rôles & Autorisations (RBAC) ----------

export type UserRole = 'admin' | 'member' | 'guest';

export interface User {
    username: string;
    displayName: string;
    name?: string; // Alias rétro-compatible
    role: UserRole;
    avatar?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

// ---------- Équipements & Actionneurs ----------

export interface Light {
    id: string;
    name: string;
    room: string;
    state: LightState;
    powerWatts: number;
}

export type DoorType = 'entrance' | 'interior' | 'terrace';

export interface Door {
    id: string;
    name: string;
    type: DoorType;
    lock: LockState;
    open: boolean;
    isLocked?: boolean; // true si lock === 'locked'
}

export interface HouseWindow {
    id: string;
    name: string;
    room: string;
    open: boolean;
    isOpen?: boolean; // Alias rétro-compatible
}

export type GarageState = 'closed' | 'open' | 'opening' | 'closing' | 'stopped';

export interface GarageDoor {
    id: string;
    name: string;
    state: GarageState;
    lock: LockState;
    isLocked?: boolean;
    motorStatus?: 'active' | 'idle';
    batteryLevel?: number;
    lastActionTime?: string;
}

// ---------- Capteurs ----------

export interface Temperature {
    value: number | null;           // null = indisponible
    unit: 'C' | 'F';
    updated_at: string | null;      // ISO 8601
}

export interface Humidity {
    value: number | null;           // % RH, null = indisponible
    current?: number;               // Alias direct
    updated_at: string | null;
}

export interface Luminosity {
    value: number | null;           // Lux, null = indisponible
    currentLux?: number;            // Alias direct
    updated_at: string | null;
}

export interface MotionSensor {
    id: string;
    name: string;
    room: string;
    detected: boolean;
    motionDetected?: boolean;       // Alias direct
    lastDetected: string | null;    // ISO 8601
    batteryLevel?: number;
}

export interface TemperaturePoint {
    time: string;                   // ex: "10:00"
    temp: number;
    setpoint: number;
}

// ---------- Alertes & Sécurité ----------

export interface Alert {
    active: boolean;
    door_id: string;
    since: string;                  // ISO 8601
    sourceType?: 'door' | 'window' | 'garage';
}

// ---------- Scénarios & Automatisations ----------

export type ScenarioId = 'night' | 'away' | 'home' | 'cinema' | 'eco';

export interface Scenario {
    id: ScenarioId;
    name: string;
    icon: string;
    description: string;
    color: string;
    active: boolean;
}

// ---------- Métriques Énergétiques ----------

export interface EnergyStats {
    currentPowerW: number;          // Puissance instantanée consommée en Watts
    currentWatts?: number;          // Alias
    dailyKwh: number;               // Énergie cumulée aujourd'hui en kWh
    dailyKWh?: number;              // Alias
    estimatedCostEur?: number;
    ecoScore: 'A+' | 'A' | 'B' | 'C' | 'D';
}

// ---------- File d'attente hors-ligne (Outbox Pattern) ----------

export interface QueuedAction {
    id: string;
    type: 'light' | 'lock' | 'setpoint' | 'scenario' | 'garage' | 'window';
    description: string;
    timestamp: string;
    payload: Record<string, unknown>;
}

// ---------- Statut global de la Maison (GET /api/status) ----------

export interface HouseStatus {
    timestamp: string;              // ISO 8601
    lock_mode: LockMode;
    lights: Light[];
    doors: Door[];
    windows: HouseWindow[];
    garage: GarageDoor;
    motionSensors: MotionSensor[];
    temperature: Temperature | null;
    humidity: Humidity | null;
    luminosity: Luminosity | null;
    setpoint: number | null;        // °C, null = indisponible
    alert: Alert | null;
    scenarios: Scenario[];
    energy: EnergyStats;
    tempHistory: TemperaturePoint[];
    temperatureHistory?: TemperaturePoint[]; // Alias
}

// ---------- Événement historique (GET /api/events) ----------

export interface HouseEvent {
    id: string;
    type: EventType;
    severity: EventSeverity;
    description: string;
    message?: string;               // Alias
    created_at: string;             // ISO 8601
    timestamp?: string;             // Alias
}

// ---------- Erreurs et commandes ----------

export type CommandStatus = 'idle' | 'pending' | 'success' | 'error';

export interface CommandState {
    status: CommandStatus;
    errorMessage?: string;
}

export type ThemeMode = 'dark' | 'light' | 'system';
