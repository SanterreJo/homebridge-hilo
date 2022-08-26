# homebridge-hilo
<!-- [![npm-version](https://badgen.net/npm/v/homebridge-hilo)](https://www.npmjs.com/package/homebridge-hilo) -->
<!-- [![npm-total-downloads](https://badgen.net/npm/dt/homebridge-hilo)](https://www.npmjs.com/package/homebridge-hilo) -->

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

```json
{
  "platforms": [
    {
        "platform": "Hilo",
        "username": "monemail@exemple.com",
        "password": "***************"
    },
  ]
}
```

---------------------------------

[Homebridge](https://homebridge.io) plugin for [Hilo](https://www.hiloenergie.com/) par [Hydro-Québec](https://www.hydroquebec.com/),
enabling control of your Hilo devices via HomeKit and the [Apple Home App](https://www.apple.com/ios/home/).

Note: This is not an offial plugin, this plugin is not affiliated with Hilo nor Hydro-Québec.

## Installation
1. Install Homebridge by following
   [the instructions](https://github.com/homebridge/homebridge/wiki).
2. Install this plugin using [Homebridge Config UI X (RECOMMENDED)](https://github.com/oznu/homebridge-config-ui-x), or by running `npm install -g homebridge-hilo`.

## Configuration
For the plugin to work, it needs access to your Hilo account

You can provide your username/password via the installation process provided by [Homebridge Config UI X (RECOMMENDED)](https://github.com/oznu/homebridge-config-ui-x),
or by adding the following configuration to [homebridge](https://github.com/homebridge/homebridge/wiki/Homebridge-Config-JSON-Explained)

```json
{
  "platforms": [
    {
        "platform": "Hilo",
        "username": "myemail@example.com",
        "password": "***************"
    },
  ]
}
```
