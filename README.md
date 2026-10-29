# 🏠 Système Domotique Résidentiel Sécurisé — Maison Intelligente (L3 Génie Logiciel)

[![React Native](https://img.shields.io/badge/React%20Native-0.86-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-57-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tests Unitaires](https://img.shields.io/badge/Jest-138%2F138%20Pass-brightgreen.svg)](https://jestjs.io/)
[![Couverture](https://img.shields.io/badge/Couverture-90.3%25-brightgreen.svg)](https://jestjs.io/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2F%20SOLID-orange.svg)]()

> **Projet de Soutenance de Licence 3 en Génie Logiciel**  
> Application mobile cross-platform de supervision et contrôle domotique temps réel, intégrant résilience réseau, sécurité RBAC, scénarios de vie automatisés et connectivité microcontrôleur ESP32.

---

## 📋 Table des Matières

1. [Aperçu & Fonctionnalités Clés](#-aperçu--fonctionnalités-clés)
2. [Architecture Logicielle](#-architecture-logicielle)
3. [Design System & Interface Utilisateur](#-design-system--interface-utilisateur)
4. [Tests Unitaires & Assurance Qualité](#-tests-unitaires--assurance-qualité)
5. [Couche Matérielle (ESP32 REST API)](#-couche-matérielle-esp32-rest-api)
6. [Comptes Démo & Gestion des Rôles (RBAC)](#-comptes-démo--gestion-des-rôles-rbac)
7. [Installation & Lancement](#-installation--lancement)

---

## 🌟 Aperçu & Fonctionnalités Clés

- **🎛️ Pilotage temps réel des actionneurs** : 5 circuits d'éclairage avec suivi de puissance (Watts), baie vitrée, fenêtre oscillo-battante, porte de garage motorisée avec machine à états (`closed`, `opening`, `open`, `closing`, `stopped`).
- **🛡️ Sécurité & Détection d'Intrusion** : Verrouillage centralisé des accès, capteurs PIR de présence avec niveau de sensibilité ajustable, déclenchement d'alerte en cas d'effraction et protocole d'acquittement.
- **🌡️ Confort Thermique & Énergétique** : Suivi thermique 24h avec courbe de dérive, réglage consigne par pas de 0.5°C, estimation dynamique de consommation électrique (kWh) et score éco (A/B/C).
- **🎭 Scénarios de Vie Automatisés** :
  - **Nuit** : Extinction globale, fermeture volets/fenêtres, verrouillage intégral, baisse chauffage à 18.5°C.
  - **Départ** : Sécurisation de l'habitat, extinction et réduction énergétique.
  - **Retour** : Accueil lumineux, déverrouillage, confort thermique à 21°C.
  - **Cinéma** : Ambiance tamisée salon, fenêtres fermées.
  - **Éco** : Optimisation stricte des dépenses d'énergie.
- **📶 Résilience Réseau & Mode Hors-Ligne** : File d'attente d'actions différées (`offlineQueue`) rejouée automatiquement dès reconnexion.
- **🧑‍💼 Console Développeur & Simulation** : Injection de pannes, coupure réseau simulée, dérive thermique et déclenchement manuel de capteurs.

---

## 🏛️ Architecture Logicielle

Le projet est conçu selon les principes de la **Clean Architecture** et du paradigme **SOLID** pour garantir un découplage total entre l'interface utilisateur et la couche matérielle :

```
maison-intelligente/
├── app/                  # Couche Présentation (Expo Router - File-based routing)
│   ├── (tabs)/           # Navigation par onglets (Dashboard, Lumières, Sécurité, etc.)
│   └── _layout.tsx       # Gestionnaire de routes et SafeArea
├── src/
│   ├── components/       # Composants réutilisables UI (Cartes, Widgets, SmartIcon)
│   ├── constants/        # Thèmes clair/sombre, palettes HSL, typographies
│   ├── config/           # Paramètres configurables (Timeouts, URLs ESP32, seuils)
│   ├── services/         # Couche Métier & Abstraction Matérielle
│   │   ├── HouseService.ts         # Interface / Contrat (DIP - Dependency Inversion)
│   │   ├── MockService.ts          # Simulation haute fidélité (Dérive, latence)
│   │   ├── Esp32HttpService.ts     # Client REST HTTP direct vers microcontrôleur
│   │   └── HouseServiceFactory.ts  # Fabrique (Factory Pattern) pour bascule transparente
│   ├── store/            # Gestion d'état global réactif (Zustand)
│   ├── types/            # Définitions TypeScript strictes (HouseStatus, Events, etc.)
│   └── utils/            # Fonctions pures (Formatage, clamp, arrondi, helpers)
└── __tests__/            # Suite de tests automatisés Jest (138 tests)
```

### Design Pattern Factory (Interchangeabilité Matériel / Simulation)

```typescript
// Bascule transparente en une seule ligne sans recharger l'application :
useHouseStore.getState().setServiceMode('local'); // Connexion ESP32 réelle
useHouseStore.getState().setServiceMode('simulation'); // Mode simulation L3
```

---

## 🎨 Design System & Interface Utilisateur

- **Dual-Theme Natif** : Mode Sombre OLED ultra-contrasté et Mode Clair soigné, avec persistance d'état.
- **Micro-animations & Retours d'état** : Feedback instantané sur chaque commande (indicateurs visuels de chargement, succès et alerte).
- **Iconographie Vectorielle 100% Native (`SmartIcon`)** : Glyphes sur mesure tracés sans dépendances externes conflictuelles pour une netteté absolue.
- **Accessibilité & Ergonomie** : Cibles tactiles calibrées (min 48px), contrastes conformes WCAG AA.

---

## 🧪 Tests Unitaires & Assurance Qualité

Le projet dispose d'une suite complète de **138 tests unitaires** développée sous **Jest** et **Babel** :

```
-----------------|---------|----------|---------|---------|
Fichier          | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
MockService.ts   |   90.5% |    80.2% |   94.0% |   90.7% |
helpers.ts       |   89.3% |   100.0% |  100.0% |   87.5% |
-----------------|---------|----------|---------|---------|
TOTAL GLOBAL     |   90.3% |    82.0% |   95.2% |   90.4% |
-----------------|---------|----------|---------|---------|
Test Suites: 4 passed, 4 total
Tests:       138 passed, 138 total (100% de réussite)
```

### Couverture des Règles Métier :
- **Règle 1** : Contrôle d'accès strict selon le rôle RBAC (Guest vs Member vs Admin).
- **Règle 2** : Impossibilité de verrouiller l'habitat si une porte ou fenêtre est ouverte.
- **Règle 3** : Déclenchement automatique d'alerte intrusion sur ouverture en mode verrouillé.
- **Règle 4** : Acquittement sécurisé d'alerte.
- **Règle 5** : Validation des bornes et pas de consigne de température (16.0°C – 30.0°C, multiples de 0.5).
- **Règle 6** : Unicité stricte du scénario actif.
- **Règle 7** : Exécution atomique du scénario « Nuit ».
- **Règle 8** : Calcul dynamique du score éco et de la puissance active.
- **Règle 9** : Gestion des erreurs réseau et mise en file d'attente hors-ligne.
- **Règle 10** : Machine à états finis de la motorisation de porte de garage.

---

## 🔌 Couche Matérielle (ESP32 REST API)

L'application communique directement avec l'ESP32 via des requêtes HTTP REST normalisées :

| Verbe HTTP | Endpoint | Description | Payload Exemple |
|---|---|---|---|
| `GET` | `/api/status` | Statut complet capteurs/actionneurs | — |
| `POST` | `/api/light` | Allumage/extinction lumière | `{"id":"salon","state":"on"}` |
| `POST` | `/api/window` | Bascule d'état fenêtre | `{"id":"fenetre_salon"}` |
| `POST` | `/api/garage` | Commande moteur garage | `{"state":"opening"}` |
| `POST` | `/api/lock` | Verrouillage centralisé | `{"mode":"locked"}` |
| `POST` | `/api/unlock` | Déverrouillage sécurisé | `{"mode":"unlocked"}` |
| `POST` | `/api/thermostat` | Réglage consigne température | `{"setpoint":21.5}` |
| `POST` | `/api/scenario` | Déclenchement de scénario | `{"scenario":"night"}` |
| `POST` | `/api/alert/ack` | Acquittement d'alerte | — |

---

## 👥 Comptes Démo & Gestion des Rôles (RBAC)

L'authentification intègre un contrôle d'accès basé sur les rôles (RBAC) :

| Rôle | Identifiant | Mot de passe | Droits & Permissions |
|---|---|---|---|
| **Administrateur** | `admin` | `admin123` | Accès total : pilotage, verrouillage, scénarios, console dév |
| **Membre Famille** | `famille` | `famille123` | Pilotage des lumières, fenêtres, chauffage, scénarios |
| **Invité** | `invite` | `invite123` | Consultation seule (lecture du statut sans droit de verrouillage) |

---

## 🚀 Installation & Lancement

### Prérequis
- **Node.js** (v18 ou supérieur recommandé)
- **npm** ou **yarn**
- Application mobile **Expo Go** (sur smartphone iOS ou Android)

### Commandes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Mickael0105/smarthome_app.git
cd smarthome_app/maison-intelligente

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Lancer l'environnement de développement Expo
npm start

# 4. Exécuter l'ensemble des 138 tests unitaires
npm test

# 5. Générer le rapport de couverture de code
npm run test:coverage
```

---

*Projet réalisé dans le cadre de la soutenance de Licence 3 en Génie Logiciel.*
