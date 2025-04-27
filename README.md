# ⚠️ IMPORTANT: Compatibilité des versions ⚠️

Hilo a changé leur méthode de synchronisation des appareils entre les applications.
- Les versions 3.X.X et moins ne sont plus supportées
- Vous devez installer la version 4.0.0 ou supérieure

# homebridge-hilo

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![npm-version](https://badgen.net/npm/v/homebridge-hilo)](https://www.npmjs.com/package/homebridge-hilo)
[![npm-total-downloads](https://badgen.net/npm/dt/homebridge-hilo)](https://www.npmjs.com/package/homebridge-hilo)

[![Donate](https://badgen.net/badge/paypal/donate?icon=https://simpleicons.now.sh/paypal/fff)](https://paypal.me/jsanterre)
[![Donate](https://badgen.net/badge/buymeacoffee/donate?icon=https://simpleicons.now.sh/buymeacoffee/fff)](https://www.buymeacoffee.com/santerrejo)

Plugin [Homebridge](https://homebridge.io) pour [Hilo](https://www.hiloenergie.com/) par [Hydro-Québec](https://www.hydroquebec.com/),
permet de contrôler vos appareils Hilo par le biais de HomeKit et de l'app [Domicile d'Apple](https://www.apple.com/ios/home/).

> **Note:** Ceci n'est pas un plugin officiel, le plugin n'est pas affilié avec Hilo ni Hydro-Québec

## Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Défis Hilo](#défis-hilo)
- [Appareils supportés](#appareils-supportés)
- [Dépannage](#dépannage)
- [Contributions](#contributions)

## Installation

1. Installer Homebridge en suivant [les instructions](https://github.com/homebridge/homebridge/wiki)
2. Installer le plugin en utilisant [Homebridge Config UI X (REQUIS)](https://github.com/oznu/homebridge-config-ui-x)

## Configuration

### Prérequis
- Un compte Hilo actif
- Accès à votre serveur Homebridge via une adresse IP ou un nom de domaine
- Port 8880 accessible sur votre serveur Homebridge

### Étapes de Configuration

1. **Préparation**
   - Notez l'adresse IP ou le nom de domaine de votre serveur Homebridge
   - Assurez-vous que le port 8880 est accessible:
     - Pour Docker: Ajoutez `-p 8880:8880` à votre commande
     - Pour reverse proxy: Configurez le port 8880

2. **Processus d'Authentification**
   1. Cliquez sur "Login with Hilo" dans l'interface de configuration
   2. Connectez-vous à votre compte Hilo
   3. Entrez l'URL de redirection (ex: `http://192.168.0.10:8880` ou `http://homebridge.local:8880`)
   4. Cliquez sur "Save" puis "Link account"
      > Note: La redirection vers Home Assistant est normale - le plugin utilise leur service de redirection

3. **Finalisation**
   - Sauvegardez la configuration
   - Redémarrez votre serveur Homebridge

## Défis Hilo

Un capteur de contact vous permet de:
- Détecter si un défi Hilo est actif
- Suspendre vos automatisations pendant les défis
- Intégrer les défis dans vos scènes HomeKit

## Appareils supportés

| Type d'appareil | Statut | Notes |
|----------------|--------|-------|
| Thermostat | ✅ |  |
| Thermostat de plancher | ✅ |  |
| Interrupteur mural | ✅ |  |
| Gradateur mural | ✅ |  |
| Prise | ✅ |  |
| Ampoule intelligente | ✅  \* | Couleurs non supportées présentement |
| Détecteur de fumée/CO | 🚧 | Développement futur |
| Station météo | 🚫 | |
| Borne de recharge | 🚫 | |

### Obtenir de l'aide
- Consultez les [problèmes GitHub](https://github.com/your-repo/issues) pour les problèmes connus
- Créez un nouveau problème si votre problème n'est pas documenté

## Contributions

Les contributions sont les bienvenues ! Si vous souhaitez :
- Ajouter le support pour de nouveaux appareils
- Améliorer les fonctionnalités existantes
- Corriger des bogues
- Améliorer la documentation

Veuillez soumettre une Pull Request avec vos modifications.

---

# homebridge-hilo (English)

[Homebridge](https://homebridge.io) plugin for [Hilo](https://www.hiloenergie.com/) by [Hydro-Québec](https://www.hydroquebec.com/),
enabling control of your Hilo devices via HomeKit and the [Apple Home App](https://www.apple.com/ios/home/).

> **Note:** This is not an official plugin, this plugin is not affiliated with Hilo nor Hydro-Québec.

## Table of Contents
- [Installation](#installation-1)
- [Configuration](#configuration-1)
- [Hilo Events (Challenges)](#hilo-events-challenges)
- [Supported Devices](#supported-devices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Installation

1. Install Homebridge by following [the instructions](https://github.com/homebridge/homebridge/wiki)
2. Install this plugin using [Homebridge Config UI X (REQUIRED)](https://github.com/oznu/homebridge-config-ui-x)

## Configuration

### Prerequisites
- An active Hilo account
- Access to your Homebridge server via IP address or domain name
- Port 8880 accessible on your Homebridge server

### Configuration Steps

1. **Preparation**
   - Note your Homebridge server's IP address or domain name
   - Ensure port 8880 is accessible:
     - For Docker: Add `-p 8880:8880` to your command
     - For reverse proxy: Configure port 8880

2. **Authentication Process**
   1. Click "Login with Hilo" in the configuration interface
   2. Log in to your Hilo account
   3. Enter the redirect URL (e.g., `http://192.168.0.10:8880` or `http://homebridge.local:8880`)
   4. Click "Save" then "Link account"
      > Note: Redirection to Home Assistant is normal - the plugin uses their redirect service and does not interfere with your home assistant server if you have one.

3. **Finalization**
   - Save the configuration
   - Restart your Homebridge server

## Hilo Events (Challenges)

A contact sensor allows you to:
- Detect if a Hilo challenge is active
- Pause your automations during challenges
- Integrate challenges into your HomeKit scenes

## Supported Devices

| Device Type | Status | Notes |
|------------|--------|-------|
| Thermostat | ✅ | |
| Floor Thermostat | ✅ | |
| In-wall Switch | ✅ | |
| In-wall Dimmer | ✅ | |
| Plug-in Switch | ✅ |  |
| Smart Bulb | ✅ | Colors not currently supported |
| Smoke/CO Detector | 🚧 | Futur development |
| Weather Station | 🚫 | |
| EV Charger | 🚫 | |

## Troubleshooting

### Getting Help
- Check the [GitHub Issues](https://github.com/your-repo/issues) for known problems
- Create a new issue if your problem isn't documented

## Contributing

Contributions are welcome! If you'd like to:
- Add support for new devices
- Improve existing features
- Fix bugs
- Enhance documentation

Please submit a Pull Request with your changes.
