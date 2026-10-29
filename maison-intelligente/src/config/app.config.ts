// ============================================================
//  Configuration de l'application
//  Toutes les constantes configurables (pas de secrets ici)
// ============================================================

// Durée max d'attente sur chaque requête réseau (ms)
export const REQUEST_TIMEOUT_MS = 5_000;

// Intervalle de rafraîchissement du statut (ms)
export const POLL_INTERVAL_MS = 5_000;

// Délai min/max de latence simulée dans MockService (ms)
export const MOCK_LATENCY_MIN_MS = 300;
export const MOCK_LATENCY_MAX_MS = 800;

// Bornes de la consigne de température (°C)
export const SETPOINT_MIN = 16;
export const SETPOINT_MAX = 30;
export const SETPOINT_STEP = 0.5;

// Nombre max d'événements à charger par défaut
export const EVENTS_DEFAULT_LIMIT = 50;

// Clé de stockage sécurisé pour le jeton d'authentification
export const AUTH_TOKEN_KEY = 'maison_auth_token';

// URL par défaut de l'ESP32 sur le réseau local Wi-Fi
export const DEFAULT_ESP32_BASE_URL = 'http://192.168.1.100';
export const ESP32_REQUEST_TIMEOUT_MS = 4_000;

// Utilisateur de démonstration (simulation uniquement)
export const DEMO_USER = {
    username: 'demo',
    password: 'demo1234',
    displayName: 'Utilisateur démo',
} as const;
