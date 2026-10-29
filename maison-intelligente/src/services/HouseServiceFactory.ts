// ============================================================
//  HouseServiceFactory — Fabrique de Services (Design Pattern Factory)
//  Permet l'interchangeabilité transparente entre Simulation et Matériel ESP32
//  Respecte le principe d'Inversion de Dépendance (DIP - SOLID)
// ============================================================

import type { HouseService } from './HouseService';
import { mockService } from './MockService';
import { esp32HttpService } from './Esp32HttpService';

export type ServiceMode = 'simulation' | 'local' | 'remote';

export class HouseServiceFactory {
    /**
     * Retourne l'instance de service adaptée selon le mode choisi :
     * - 'simulation' : MockService avec génération de données aléatoires et latence
     * - 'local' : Esp32HttpService connecté à l'ESP32 sur le réseau Wi-Fi local
     * - 'remote' : Connexion distante via passerelle Cloud / MQTT (évolutif)
     */
    static getService(mode: ServiceMode): HouseService {
        switch (mode) {
            case 'simulation':
                return mockService;
            case 'local':
            case 'remote':
                return esp32HttpService;
            default:
                return mockService;
        }
    }
}
