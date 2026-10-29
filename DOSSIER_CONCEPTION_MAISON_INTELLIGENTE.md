# 🏠 DOSSIER DE CONCEPTION & SPÉCIFICATIONS TECHNIQUES
## PROJET DE MAISON INTELLIGENTE — SOUTENANCE LICENCE GÉNIE LOGICIEL (L3)

---

## 1. FICHE SIGNALÉTIQUE DU PROJET

| Champ | Valeur / Description |
| :--- | :--- |
| **Intitulé du projet** | Système de Supervision et Contrôle d'une Maison Intelligente (Maquette IoT & Application Mobile) |
| **Niveau académique** | Licence 3 Informatique — Parcours Génie Logiciel |
| **Périmètre applicatif** | Application mobile multiplateforme (React Native / Expo SDK 57 / TypeScript) |
| **Périmètre matériel** | Maquette basse tension pilotée par microcontrôleur ESP32 (Wi-Fi) |
| **Objectif de soutenance** | Démontrer une architecture logicielle robuste, découplée, tolérante aux pannes et capable d'automatiser des scénarios réels avec retour physique |

---

## 2. ÉTAT DES LIEUX DU SYSTÈME ACTUEL (PHASE 1)

### 2.1 Équipements et capteurs actuellement modélisés

Le contrat de données actuel (`src/types/house.ts`) modélise l'habitat à travers 4 sous-systèmes :

1. **Éclairage (`lights`)** :
   - *Salon* : id `salon`, état initial `on`.
   - *Chambre à coucher* : id `chambre`, état initial `off`.
   - Contrôle individuel avec accusé de réception (`idle` $\rightarrow$ `pending` $\rightarrow$ `success` | `error`).
2. **Accès et Ouvertures (`doors`)** :
   - *Porte d'entrée* : id `entree`, verrouillé/déverrouillé (`lock`), ouvert/fermé (`open`).
   - *Porte de la chambre* : id `chambre`, verrouillé/déverrouillé, ouvert/fermé.
   - Mode global de la maison : `lock_mode` (`locked` ou `unlocked`).
3. **Thermostat et Climat (`temperature`)** :
   - Mesure actuelle : sonde en °C (valeur par défaut `24.5 °C`), horodatée en ISO 8601.
   - Consigne manuelle (`setpoint`) : réglable entre 16,0 °C et 30,0 °C par pas de 0,5 °C (défaut `22.0 °C`).
   - Dérive naturelle simulée : variation dynamique de ±0,3 °C toutes les 10 secondes.
4. **Système de Sécurité & Alertes (`alert`)** :
   - Détection d'effraction : activée dès qu'une porte s'ouvre alors que la maison est en mode `locked`.
   - Horodatage précis de l'incident et porte concernée (`door_id`, `since`).

---

### 2.2 Les 7 Règles Métier Strictes Déjà Implémentées

| N° | Règle Métier | Comportement Logiciel & UI |
| :---: | :--- | :--- |
| **R1** | **Acquittement strict des commandes** | L'UI ne bascule pas immédiatement sur clic : elle passe à l'état `pending` (indicateur de chargement), puis `success` ou `error` selon le retour réel du service. |
| **R2** | **Gestion des valeurs indisponibles** | Si un capteur ne répond pas, sa valeur est strictement `null`. L'application affiche explicitement `"Indisponible"` et n'affiche **jamais zéro** à la place. |
| **R3** | **Détection de donnée ancienne (*Stale Data*)** | Toute mesure horodatée de plus de 30 secondes sans rafraîchissement affiche un badge d'avertissement jaune `"Donnée ancienne (> 30 s)"`. |
| **R4** | **Timeout réseau et possibilité de retry** | Chaque requête réseau a un timeout maximal de 5 secondes. En cas d'échec, un bouton contextuel *"Réessayer"* apparaît. |
| **R5** | **Verrouillage conditionnel sécurisé** | Impossible de verrouiller la maison si une porte est ouverte. Le déverrouillage exige une authentification et une confirmation explicite (modale). |
| **R6** | **Alerte intrusion persistante** | Si une porte s'ouvre en mode verrouillé, un bandeau d'alerte rouge critique apparaît sur **tous les écrans** de l'app jusqu'à son acquittement manuel. |
| **R7** | **Consigne de chauffage manuelle bornée** | La consigne est strictement bornée entre 16 °C et 30 °C (pas de 0,5 °C). L'envoi n'est déclenché qu'après confirmation explicite par le bouton *"Appliquer"*. |

---

### 2.3 Architecture Logicielle Actuelle

L'application respecte les principes de la **Clean Architecture** et du **Génie Logiciel** :

```
maison-intelligente/
├── app/                      # Couche Présentation (Expo Router v57 - Navigation basée fichiers)
│   ├── _layout.tsx           # Layout racine (Splash, Fonts, Bandeau d'alerte R6, Thème)
│   ├── (tabs)/               # Navigation par onglets (Tableau de bord, Lumières, Sécurité, Temp, Historique)
│   ├── login.tsx             # Modale d'authentification (admin / admin123 ou demo / demo1234)
│   ├── parametres.tsx        # Réglages, statut de connexion, mode développeur
│   ├── simulation.tsx        # Injection de pannes et scénarios pour la soutenance
│   └── aide.tsx              # Documentation intégrée des règles métier et architecture
├── src/
│   ├── components/           # Composants atomiques réutilisables (RoomCard, DoorCard, ThermostatControl...)
│   ├── constants/theme.ts    # Design System centralisé (couleurs HSL/hex sombres, typographie, espacements)
│   ├── services/             # Couche Abstraction (Service Pattern)
│   │   ├── HouseService.ts   # Interface TypeScript abstraite (HouseService & AuthService)
│   │   └── MockService.ts    # Implémentation simulation en mémoire avec latence (300-800ms) et pannes injectables
│   ├── store/useHouseStore.ts# Couche Gestion d'état global (Zustand avec polling toutes les 5s)
│   ├── types/house.ts        # Contrats d'interfaces de données strictes (TypeScript)
│   └── utils/helpers.ts      # Fonctions utilitaires pures (formatage, clamp, isStale, calculs)
```

---

## 3. SPÉCIFICATIONS DES NOUVELLES FONCTIONNALITÉS À VENIR

Ces fonctionnalités constituent la plus-value académique pour la soutenance de Licence en Génie Logiciel :

### 3.1 Moteur de Scénarios et Modes de Vie (Automation & Rules Engine)

* **Objectif** : Transformer la maquette en une véritable maison autonome.
* **Modes en 1 clic** :
  * 🌙 **Mode Nuit** : Verrouille toutes les serrures, éteint toutes les lumières, règle la consigne de température à 18,5 °C.
  * 🏃 **Mode Départ / Absent** : Éteint tout, verrouille la maison, arme le système de surveillance intrusion.
  * 🏠 **Mode Retour à la maison** : Déverrouille l'accès autorisé, allume le salon, ajuste la consigne à 21 °C.
* **Moteur de règles personnalisables (Triggers $\rightarrow$ Conditions $\rightarrow$ Actions)** :
  * *Exemple 1* : `SI (porte_entree == 'ouverte') ET (luminosite == 'faible') ALORS (allumer_lumiere('salon'))`
  * *Exemple 2* : `SI (temperature < 17) ALORS (chauffage == 'actif')`
* **Intérêt Génie Logiciel** :
  * Patron de conception **Command Pattern** (encapsulation des actions réversibles).
  * Patron de conception **Strategy Pattern** (évaluation des conditions de déclenchement).

---

### 3.2 Architecture « Offline-First » avec File d'Attente de Synchronisation

* **Objectif** : Assurer une tolérance absolue aux coupures réseau (Wi-Fi ESP32 instable ou téléphone hors de portée).
* **Fonctionnement** :
  1. Si une action est effectuée hors ligne, elle est placée dans une file d'attente locale immuable (**Outbox Pattern**).
  2. L'interface affiche l'état optimiste avec un badge distinctif : `⏳ En attente de synchronisation`.
  3. Un service d'écoute du réseau détecte le retour de la connexion et dépile la file d'attente séquentiellement avec réconciliation de l'état (**Eventual Consistency**).
* **Intérêt Génie Logiciel** :
  * Démonstration de la **résilience** et de la **tolérance aux pannes**.
  * Évite les incohérences de données et les requêtes orphelines.

---

### 3.3 Contrôle d'Accès Basé sur les Rôles (RBAC — *Role-Based Access Control*)

* **Objectif** : Sécuriser les commandes selon le profil connecté.
* **Matrice des Droits (ACL)** :

| Rôle | Profil type | Consultation | Lumières | Chauffage | Déverrouillage porte | Acquittement alarme | Mode Développeur / Simulation |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **👑 Administrateur** | Propriétaire / Chef de famille | ✅ | ✅ (Toutes) | ✅ (16-30°C) | ✅ | ✅ | ✅ |
| **👤 Membre** | Enfant / Résident habituel | ✅ | ✅ (Chambre) | ✅ (±1 °C) | ❌ | ❌ | ❌ |
| **🚪 Invité** | Ami / Baby-sitter | ✅ (Salon) | ✅ (Salon) | ❌ | ❌ | ❌ | ❌ |

* **Intérêt Génie Logiciel** :
  * Principe du moindre privilège (*Principle of Least Privilege*).
  * Sécurité applicative et gestion granulaire des autorisations dans le store Zustand.

---

### 3.4 Suivi Énergétique & Visualisation Graphique (Analytics)

* **Objectif** : Fournir une vue d'ensemble sur l'efficacité thermique et électrique de l'habitat.
* **Composants** :
  * **Graphique Température vs Consigne (24 heures)** :
    * Courbe de la température réelle avec ligne horizontale de consigne.
  * **Estimateur de Consommation Électrique (kWh & Coût estimé)** :
    * Calcul dérivé du temps cumulé d'allumage des LED/lampes et du déclenchement du chauffage.
    * Indicateur éco-score (vert / orange / rouge) selon la consommation journalière.
* **Intérêt Génie Logiciel** :
  * Traitement de séries temporelles (*Time-Series Data*).
  * Agrégation et affichage de données sans blocage du thread graphique principal.

---

### 3.5 Notifications Push Système Locales pour Alertes Critiques

* **Objectif** : Alerter l'utilisateur même si son smartphone est verrouillé ou que l'application est en arrière-plan.
* **Composants** :
  * Utilisation d'`expo-notifications` configuré pour les alertes locales sans passer par un serveur cloud tiers.
  * Déclenchement instantané en cas d'effraction (Règle 6) ou de chute brutale de température.
* **Intérêt Génie Logiciel** :
  * Prise en compte du cycle de vie des applications mobiles (*Background tasks / OS Notifications*).

---

### 3.6 Pont Matériel Réel ESP32 (Phase 2) & Backend Distant (Phase 3)

* **Phase 2 (ESP32 Local via Wi-Fi direct)** :
  * Implémentation de `LocalHttpHouseService` implémentant `HouseService`.
  * Requêtes HTTP REST directes : `GET http://192.168.4.1/api/status`, `POST /api/devices/{id}/toggle`.
  * Bascule transparente entre `MockService` et `LocalHttpHouseService` en 1 clic dans les Paramètres sans réécrire l'interface.
* **Phase 3 (Backend Node.js / Express / MySQL optionnel)** :
  * Relais distant pour accès hors domicile avec jetons JWT sécurisés.

---

## 4. MATRICE DE JUSTIFICATION POUR LA SOUTENANCE (JURY GL)

| Thème évalué par le Jury | Réponse concrète apportée par le projet |
| :--- | :--- |
| **Architecture Logicielle** | Architecture en couches strictes (Domain, Service, State, UI). Respect du principe SOLID (Open/Closed) grâce à l'interface `HouseService`. |
| **Gestion des Erreurs** | Zéro crash silencieux. Gestion native des timeouts, états `pending`/`error` systématiques, null-safety défensive, alertes persistantes. |
| **Design Patterns mobilisés** | **Service Provider Pattern**, **Observer Pattern** (Zustand), **Command Pattern** (actions & undo), **Outbox Pattern** (offline queue). |
| **Expérience Utilisateur (UX)** | Design moderne sombre, retour haptique/visuel immédiat, indicateurs clairs de fraîcheur des données (>30s), modales de sécurité. |
| **Démonstrabilité (Live Demo)** | Écran dédié `/simulation` permettant à l'étudiant d'injecter des pannes réseau ou des intrusions en direct pendant la présentation. |

---

## 5. PLAN D'EXÉCUTION (ROADMAP DU DÉVELOPPEMENT)

Une fois votre feu vert donné, les étapes de réalisation seront les suivantes :

1. **Étape 1 — Scénarios & Modes de Vie Rapides** :
   * Création du module de scénarios (Nuit, Départ, Retour).
   * Intégration sur l'écran d'accueil avec exécution séquentielle des commandes.
2. **Étape 2 — Gestion des Rôles (RBAC)** :
   * Extension du modèle `User` (Admin, Membre, Invité).
   * Filtrage des composants et actions selon le rôle actif.
3. **Étape 3 — File d'attente Hors Ligne (Outbox Pattern)** :
   * Capture des commandes émises hors réseau et stockage temporaire.
   * Traitement automatique au retour du statut `connected`.
4. **Étape 4 — Graphique Température & Consommation Énergétique** :
   * Historisation locale des mesures sur 24 points.
   * Affichage d'un graphique interactif et estimation de la consommation.
5. **Étape 5 — Notifications Système Locales** :
   * Intégration d'`expo-notifications` pour les intrusions et alertes majeures.
6. **Étape 6 — Préparation du mode ESP32 (Phase 2)** :
   * Création du connecteur HTTP paramétrable avec IP/Port pour la maquette finale.
