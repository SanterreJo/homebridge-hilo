⚠️ Hilo a retiré la méthode de connexion par nom d'utilisateur et mot de passe à partir du 10 avril 2024. Les versions 1.X.X ne fonctionnent plus. Veuillez installer la version 2.0.0 ou supérieur ⚠️

⚠️ Hilo deprecated the username/password login method as of April 10th 2024. Versions 1.X.X no longer work. You must install version 2.0.0 or higher. ⚠️

# homebridge-hilo
[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![npm-version](https://badgen.net/npm/v/homebridge-hilo)](https://www.npmjs.com/package/homebridge-hilo)
[![npm-total-downloads](https://badgen.net/npm/dt/homebridge-hilo)](https://www.npmjs.com/package/homebridge-hilo)

[![Donate](https://badgen.net/badge/paypal/donate?icon=https://simpleicons.now.sh/paypal/fff)](https://paypal.me/jsanterre)
[![Donate](https://badgen.net/badge/buymeacoffee/donate?icon=https://simpleicons.now.sh/buymeacoffee/fff)](https://www.buymeacoffee.com/santerrejo)

Plugin [Homebridge](https://homebridge.io) pour [Hilo](https://www.hiloenergie.com/) par [Hydro-Québec](https://www.hydroquebec.com/),
permet de contrôler vos appareils Hilo par le biais de HomeKit et de l'app [Domicile d'Apple](https://www.apple.com/ios/home/).

Note: Ceci n'est pas un plugin officiel, le plugin n'est pas affilié avec Hilo ni Hydro-Québec

## Installation
1. Installer Homebridge en suivant
   [les instructions](https://github.com/homebridge/homebridge/wiki).
2. Installer le plugin en utilisant [Homebridge Config UI X (REQUIS)](https://github.com/oznu/homebridge-config-ui-x), ou en exécutant `npm install -g homebridge-hilo`.

## Configuration
Pour que le plugin soit fonctionnel, il doit avoir accès à votre compte Hilo

Vous devrez vous connecter à votre compte Hilo lors du processus d'installation fournit par [Homebridge Config UI X (REQUIS)](https://github.com/oznu/homebridge-config-ui-x)

### Dans la page de configuration du plugin

1. Vous devrez connaître l'adresse IP ou le nom de domaine que vous utilisez pour vous connecter à homebridge. Habituellement, ce sera l'adresse dans votre navigateur
1. Cliquez sur le bouton "Login with Hilo" pour démarrer le processus d'authentification
1. Connectez-vous à votre compte hilo
1. Entrez l'adresse ip ou le nom de domaine que vous avez pris à l'étape 1 et ajoutez le port 8880 à la fin. Exemples: http://192.1680.10:8880 http://homebridge.local:8880
    * Attention: Selon la façon dont vous avez configuré votre serveur homebridge, vous devrez vous assurer que le port 8880 est acheminé jusqu'à votre serveur homebridge. Par exemple pour une configuration docker il faudra ajouter `-p 8880:8880` à votre commande docker. Si vous utilisez un reverse proxy, vous devrez ajouter le port 8880 à votre configuration
1. Cliquez sur le bouton "Save", puis cliquez sur le bouton "Link account"
1. Vous pouvez sauvegarder votre configuration et redémarrer votre serveur homebridge

## Défi Hilo
Un capteur de contact vous permet de déterminer si un défi est actif ou non. Cela peut être utile pour déterminer si vos automatisations doivent être mis en pause.

## Appareils pris en charge
Appareil | Pris en charge? | Notes
---|---|---
Thermostat | ✅ |
Interrupteur | ✅ | Non testé
Gradateur | ✅ |
Prise | ✅ | Non testé
Ampoule | ✅ * | Ne supporte pas les couleurs présentement
Détecteur de fumée / monoxyde de carbone | 🚧 |
Station météo | 🚫 |

Si l'un de vos appareils n'est pas encore pris en charge par le plugin, les contributions (PR) sont les bienvenues.


---------------------------------


# homebridge-hilo

[Homebridge](https://homebridge.io) plugin for [Hilo](https://www.hiloenergie.com/) par [Hydro-Québec](https://www.hydroquebec.com/),
enabling control of your Hilo devices via HomeKit and the [Apple Home App](https://www.apple.com/ios/home/).

Note: This is not an official plugin, this plugin is not affiliated with Hilo nor Hydro-Québec.

## Installation
1. Install Homebridge by following
   [the instructions](https://github.com/homebridge/homebridge/wiki).
2. Install this plugin using [Homebridge Config UI X (REQUIRED)](https://github.com/oznu/homebridge-config-ui-x), or by running `npm install -g homebridge-hilo`.

## Configuration
For the plugin to work, it needs access to your Hilo account

You will need to login to your Hilo account during the installation process provided by [Homebridge Config UI X (REQUIRED)](https://github.com/oznu/homebridge-config-ui-x),
or by adding the following configuration to [homebridge](https://github.com/homebridge/homebridge/wiki/Homebridge-Config-JSON-Explained)

### In the plugin configuration page

1. You will need to know the IP address or the domain name you use to connect to homebridge. Usually it will be theaddress in your browser
1. Click on the "Login with Hilo" button to start the authentication process
1. Login to your hilo account
1. Enter the ip address or domain name you took not at step 1 and add the port 8880 at the end. Examples: http://192.1680.10:8880 http://homebridge.local:8880
    * Note: Depending on how you have configured your homebridge server, you will need to ensure that port 8880 is routed to your homebridge server. For example for a docker configuration you will need to add `-p 8880:8880` to your docker command. If you are using a reverse proxy, you will need to add port 8880 to your configuration
1. Click on the "Save" button, then click on the "Link account" button
1. You can save your config and restart your homebridge server

## Hilo Events (Challenges)
A contact sensor allows you to determine whether a challenge is active or not. This can be useful in determining if your automations should be paused.

## Supported devices
Device | Supported? | Notes
---|---|---
Thermostat | ✅ |
In-wall switch | ✅ | Not tested
In-wall dimmer | ✅ | 
Plug-in switch | ✅ | Not tested
Bulb | ✅ | Currently does not support colors
Smoke / CO detector | 🚧 |
Weather station | 🚫 |

If one of your device is not yet supported by the plugin, contributions (PR) are welcome.
