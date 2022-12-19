HTTP Infra
==========

Célestin Piccin & Kévin Jorand

------------

General description

# TODO
## Step 1: Static HTTP server with apache httpd

Les fichiers de configuration apache se trouvent dans le dossier /etc/apache2

Pour accéder au container : ```docker exec -it <nom container> /bin/bash```

Ensuite on peut naviguer dans l'arborescence du système en utilisant la commande cd

### Note

Après quelques essais sur le contenu du labo, nous n'avons rencontré aucun problème à l'utilisation de php 8.1. Raison pour laquelle nous avons choisi de partir sur la version actuelle plutôt que la version précédente.

## Step 2: Dynamic HTTP server with express.js

Notre container qui utilise express.js renvoie la météo de différentes villes au client sous format JSON.

Le JSON contient différentes informations, notamment le nom de la ville, le jour et la temperature.

Les commandes suivantes ont été utiles:

```npm init``` => pour créer une nouvelle application node.js

```npm install --save chance``` => pour ajouter le module chance à l'application

```npm install --save express``` => pour ajouter le module express.js à l'application
