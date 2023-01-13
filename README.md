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
2. Installer le plugin en utilisant [Homebridge Config UI X (RECOMMANDÉ)](https://github.com/oznu/homebridge-config-ui-x), ou en exécutant `npm install -g homebridge-hilo`.

## Configuration
Pour que le plugin soit fonctionnel, il doit avoir accès à votre compte Hilo

Vous pouvez fournir votre nom d'utilisateur / mot de passe lors du processus d'installation fournit par [Homebridge Config UI X (RECOMMANDÉ)](https://github.com/oznu/homebridge-config-ui-x),
ou en ajoutant la configuration suivante à HomeBridge [homebridge](https://github.com/homebridge/homebridge/wiki/Homebridge-Config-JSON-Explained)

Ce plugin fonctionne avec Allia par Stelpro, utilisez `"vendor": "allia"` dans la configuration

```json
{
  "platforms": [
    {
        "platform": "Hilo",
        "username": "monemail@exemple.com",
        "password": "***************",
        "vendor": "hilo",
        "noChallengeSensor": false
    }
  ]
}
```

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

Si l'un de vos appareils n'est pas encore pris en charge par le plugin, les contributions (PR) sont les bienvenues. Vous pouvez aussi faire un don ce qui me permettra d'acheter les appareils pas encore pris en charge et facilitera le développement.



---------------------------------



# homebridge-hilo

[Homebridge](https://homebridge.io) plugin for [Hilo](https://www.hiloenergie.com/) par [Hydro-Québec](https://www.hydroquebec.com/),
enabling control of your Hilo devices via HomeKit and the [Apple Home App](https://www.apple.com/ios/home/).

Note: This is not an official plugin, this plugin is not affiliated with Hilo nor Hydro-Québec.

## Installation
1. Install Homebridge by following
   [the instructions](https://github.com/homebridge/homebridge/wiki).
2. Install this plugin using [Homebridge Config UI X (RECOMMENDED)](https://github.com/oznu/homebridge-config-ui-x), or by running `npm install -g homebridge-hilo`.

## Configuration
For the plugin to work, it needs access to your Hilo account

You can provide your username/password via the installation process provided by [Homebridge Config UI X (RECOMMENDED)](https://github.com/oznu/homebridge-config-ui-x),
or by adding the following configuration to [homebridge](https://github.com/homebridge/homebridge/wiki/Homebridge-Config-JSON-Explained)

This plugin works with Allia by Stelpro, you can make it work by using `"vendor": "allia"` in the config.

```json
{
  "platforms": [
    {
        "platform": "Hilo",
        "username": "myemail@example.com",
        "password": "***************",
        "vendor": "hilo",
        "noChallengeSensor": false
    }
  ]
}
```

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

If one of your device is not yet supported by the plugin, contributions (PR) are welcome. You can also consider donating to the project so I can buy the remaining devices and continue development.
