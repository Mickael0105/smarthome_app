# 📊 Dossier d'Architecture & 3 Diagrammes Clés — AM'NAY
## Soutenance de Licence en Génie Logiciel (L3)

Ce document rassemble les **3 diagrammes indispensables** pour la soutenance de votre projet de maison intelligente **AM'NAY**, modélisés selon les normes du **Génie Logiciel (UML & Architecture Système)** avec la syntaxe standard **Mermaid**.

---

## 📑 Sommaire
1. [Diagramme 1 : Diagramme de Cas d'Utilisation (Use Case)]
2. [Diagramme 2 : Diagramme de Séquence (Cycle de Vie d'une Alerte & Action)]
3. [Diagramme 3 : Diagramme d'Architecture Système & Déploiement Matériel/Réseau]
4. [Fiche Technique & Arguments pour le Jury de Soutenance]

---

## 1. 🎯 Diagramme de Cas d'Utilisation (Use Case Diagram)

### 📌 Description
Ce diagramme structure les fonctionnalités du système en fonction des différents acteurs et de leurs niveaux de privilèges (modèle de sécurité **RBAC — Role-Based Access Control**).

### 👥 Acteurs identifiés :
* **👑 Administrateur** : Propriétaire du logement, possède tous les droits (pilotage total, gestion des utilisateurs, scénarios, acquittement des alarmes).
* **👤 Membre de la famille** : Résident régulier (contrôle de ses pièces, ajustement limité de température).
* **👋 Invité** : Accès temporaire limité à la consultation et à l'éclairage de la pièce commune (salon).
* **🤖 Système / Capteurs IoT** : Acteur technique automatisé qui émet des mesures et déclenche des événements.

```mermaid
graph TD
    classDef actor fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef usecase fill:#0f172a,stroke:#10b981,stroke-width:1.5px,color:#fff;
    classDef security fill:#450a0a,stroke:#ef4444,stroke-width:1.5px,color:#fff;

    Admin["👑 Administrateur"]:::actor
    Membre["👤 Membre"]:::actor
    Invite["👋 Invité"]:::actor
    Capteur["🤖 Capteurs IoT / Système"]:::actor

    UC_Auth(["S'authentifier (RBAC)"]):::usecase
    UC_Light(["Commander l'éclairage"]):::usecase
    UC_Doors(["Verrouiller / Déverrouiller les portes"]):::usecase
    UC_Thermostat(["Consulter & Régler la consigne thermique"]):::usecase
    UC_Scenario(["Déclencher un scénario (Nuit, Départ, Éco)"]):::usecase
    UC_History(["Consulter l'historique & Consommation"]):::usecase
    UC_Alert(["Détecter une intrusion ou anomalie"]):::security
    UC_Ack(["Acquitter l'alarme critique"]):::security
    UC_Config(["Configurer le système & mode simulation"]):::usecase

    %% Relations Héritage
    Admin --> Membre
    Membre --> Invite

    %% Relations Cas d'utilisation
    Invite --> UC_Auth
    Invite --> UC_Light
    Invite --> UC_History

    Membre --> UC_Thermostat

    Admin --> UC_Doors
    Admin --> UC_Scenario
    Admin --> UC_Ack
    Admin --> UC_Config

    Capteur --> UC_Alert

    %% Dépendances Includes
    UC_Doors -.->|<< include >>| UC_Auth
    UC_Scenario -.->|<< include >>| UC_Auth
    UC_Ack -.->|<< include >>| UC_Auth
    UC_Alert -.->|<< trigger >>| UC_Ack
```

### 💡 Points clés à expliquer au jury :
* **Principe du moindre privilège** : Un invité ne peut pas déverrouiller la porte ni couper l'alarme.
* **Sécurité R5/R6** : Les actions sensibles requièrent obligatoirement une authentification valide.

---

## 2. ⚡ Diagramme de Séquence (Sequence Diagram)

### 📌 Scénario : Détection d'Intrusion & Réaction d'Urgence (Règles R5 & R6)
Ce diagramme détaille la chronologie des échanges lors d'un incident critique : une porte s'ouvre alors que la maison est en mode armé/verrouillé.

```mermaid
sequenceDiagram
    autonumber
    actor Intrus as 🚶 Intrus
    participant Capteur as 🚪 Capteur d'ouverture (Zigbee/ESP32)
    participant Hub as 🧠 Passerelle (Raspberry Pi / MQTT Broker)
    participant Backend as ⚙️ Serveur AM'NAY (Node.js/Express)
    participant App as 📱 Application Mobile (iPhone/Android)
    actor Admin as 👑 Administrateur

    Note over Hub,Backend: Maison armée en mode "LOCKED"

    Intrus->>Capteur: Ouvre la porte d'entrée
    Capteur->>Hub: Trame Zigbee (état = OUVERT)
    Hub->>Backend: MQTT Publish: `home/doors/entree/state` = OPEN

    Backend->>Backend: Évaluation Règle R6: (Verrouillé + Porte Ouverte) => INTRUSION !
    Backend->>Hub: Ordre: Déclencher Buzzer physique
    Backend-->>App: Push WebSocket / Notification: `ALERT_INTRUSION`

    App->>App: Déclenche alerte sonore + Vibreur Haptique
    App->>App: Affiche le bandeau rouge critique (Persistant)

    Admin->>App: Ouvre l'application AM'NAY
    App-->>Admin: Affiche le détail de l'incident (Porte, Heure exacte)

    Admin->>App: Clique sur "Acquitter l'alarme"
    App->>App: Demande confirmation / Vérification du rôle Admin

    App->>Backend: POST /api/alert/acknowledge { user: "admin" }
    Backend->>Hub: MQTT Publish: `home/alarm/reset`
    Hub->>Backend: Arrêt du signal sonore
    Backend-->>App: Confirmation HTTP 200 (Statut = NORMAL)

    App->>App: Disparition du bandeau d'alerte rouge
```

### 💡 Points clés à expliquer au jury :
* **Découplage asynchrone** : Le capteur ne connaît pas le smartphone. Tout transite par le protocole MQTT / WebSocket pour une latence inférieure à 100 ms.
* **Persistance de l'alarme (Règle R6)** : L'alerte ne disparaît pas toute seule ; une action humaine volontaire de l'administrateur est obligatoire pour garantir la traçabilité.

---

## 3. 🏗️ Diagramme d'Architecture Système & Déploiement Réseau

### 📌 Description
Ce diagramme expose l'architecture physique et logicielle multiniveaux (**N-Tiers / IoT 3-Tier Architecture**) démontrant la séparation claire des responsabilités.

```mermaid
graph TB
    subgraph COUCHE_TERRAIN ["1. 🌐 Couche Terrain (Capteurs & Actionneurs IoT)"]
        direction LR
        L1["💡 Ampoules & Éclairage"]
        S1["🌡️ Capteur Température & Humidité (DHT22 / Zigbee)"]
        D1["🚪 Détecteur Ouverture Porte/Fenêtre"]
        M1["🚶 Détecteur Mouvement PIR"]
        R1["⚡ Relais Prise & Moteur Serrure"]
    end

    subgraph COUCHE_COMMUNICATION ["2. 📡 Passerelle de Communication"]
        direction TB
        Coord["📡 Coordinateur Zigbee USB (CC2652P)"]
        WifiDirect["📶 Point d'Accès Wi-Fi (2.4 GHz)"]
    end

    subgraph COUCHE_CERVEAU ["3. 🧠 Cerveau Central (Raspberry Pi 4 / PC Local)"]
        direction TB
        Z2M["Zigbee2MQTT / Drivers Série"]
        Broker["Broker MQTT (Eclipse Mosquitto)"]
        API["Backend API REST & WebSockets (Node.js / Express)"]
        DB[(Base de Données Événements & SQLite / Timescale)]

        Z2M <-->|Pub / Sub| Broker
        Broker <-->|Events & Triggers| API
        API <-->|Persistence| DB
    end

    subgraph COUCHE_PRESENTATION ["4. 📱 Couche Présentation (Clients Utilisateur)"]
        direction LR
        AppMobile["📱 Application Mobile AM'NAY (React Native / Expo 57 / iOS 18)"]
        WebAdmin["💻 Tableau de Bord Web Administrateur (Navigateur PC)"]
    end

    %% Connexions physiques et protocolaires
    L1 & S1 & D1 & M1 <-->|Zigbee 3.0 / 2.4 GHz| Coord
    R1 <-->|Wi-Fi HTTP / MQTT| WifiDirect

    Coord -->|Liaison Série USB /dev/ttyUSB0| Z2M
    WifiDirect <-->|TCP/IP Réseau Local| Broker

    API <-->|HTTP REST & WebSocket (JSON)| AppMobile
    API <-->|HTTP REST & SSE| WebAdmin
```

---

## 📋 Tableau Récapitulatif des 3 Diagrammes (Pour ton oral)

| N° | Nom du Diagramme | Type UML | Rôle lors de la soutenance |
|:---:|---|---|---|
| **1** | **Cas d'Utilisation** | Fonctionnel | Prouve la gestion des profils (**RBAC**), les droits d'accès et les cas nominaux. |
| **2** | **Séquence** | Dynamique | Démontre la gestion temps réel des alertes critiques, le découplage asynchrone et les règles métier (**R5/R6**). |
| **3** | **Architecture & Déploiement** | Structurel / Physique | Montre la maîtrise de l'écosystème complet : matériel, protocoles IoT (**Zigbee, MQTT**), passerelle et application mobile. |

---

## 🎯 Réponses aux Questions Pièges Fréquentes du Jury

1. **Pourquoi utiliser MQTT plutôt qu'une simple API REST pour les capteurs ?**
   * *Réponse :* Le protocole MQTT est ultra-léger (en-tête de 2 octets), optimisé pour les réseaux contraints et fonctionne en publication/souscription (**Pub/Sub**), évitant ainsi le "polling" consommateur d'énergie pour les capteurs sur pile.
2. **Pourquoi choisir Zigbee pour les capteurs plutôt que le Wi-Fi ?**
   * *Réponse :* Le Wi-Fi est trop énergivore (batterie vidée en quelques semaines). Zigbee fonctionne en réseau maillé (**Mesh**) avec une autonomie de batterie de 1 à 2 ans sur pile bouton (CR2032).
3. **Que se passe-t-il en cas de coupure d'Internet ?**
   * *Réponse :* Le système AM'NAY fonctionne en **Local-First**. Le Raspberry Pi gère la logique d'automatisation sur le réseau local sans dépendre d'un serveur cloud externe. L'application mobile continue de fonctionner tant que le smartphone est connecté au Wi-Fi de la maison.
