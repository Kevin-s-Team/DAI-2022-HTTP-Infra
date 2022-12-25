HTTP Infra
==========

Célestin Piccin & Kévin Jorand

------------

## Introduction
Le but de ce laboratoire est de découvrir et se familiariser avec différents outils afin de construire une infrastructure web complète.

Le résultat final contiendra deux serveurs HTTP (un dynamique et un statique), un reverse-proxy et un manager de containers Docker.


## Step 1: Static HTTP server with apache httpd

Les fichiers de configuration apache se trouvent dans le dossier ```/etc/apache2```. Dans notre cas nous n'avons pas touché aux fichiers de configuration car la config par défaut d'apache est suffisante.

Pour accéder a un container en exécution : ```docker exec -it <nom container> /bin/bash```

Ensuite on peut naviguer dans l'arborescence du système en utilisant la commande ```cd```.

Le Dockerfile utilise l'image php 8.1 avec apache (```php:8.1-apache```). On copie ensuite notre site (https://bootstrapmade.com/gp-free-multipurpose-html-bootstrap-template/) dans le dossier ```/var/www/html/``` de l'image.

Deux scripts sont disponibles:
 - build.ps1:  crée notre image à partir du Dockerfile 
 - run.ps1: lance un nouveau container à partir de l'image créée par build.ps1

Si un container est en exécution : ```loaclhost:80``` pour accéder a notre site web.

### Note

Après quelques essais sur le contenu du labo, nous n'avons rencontré aucun problème à l'utilisation de php 8.1. Raison pour laquelle nous avons choisi de partir sur la version actuelle plutôt que la version précédente.

## Step 2: Dynamic HTTP server with express.js

Notre serveur HTTP dynamique utilise express.js et renvoie la météo de différentes villes au client sous format JSON.

Le JSON renvoyé contient différentes informations, notamment le nom de la ville, le jour et la température.

### Js
Les commandes suivantes ont été utiles pour cette étape:

 - ```npm init``` => pour créer une nouvelle application node.js

 - ```npm install --save chance``` => pour ajouter le module chance à l'application

 - ```npm install --save express``` => pour ajouter le module express.js à l'application

Le code se trouve dans le fichier ```index.js```. Le serveur renvoie au client le résultat de notre fonction ```getWeather()``` à chaque fois qu'il reçoit une requête à l'URL racine sur le port 3000 (port standard pour les applications express.js).

### Docker
Le Dockerfile utilise l'image node version 18 (```node:18```). On copie ensuite notre application dans ```/opt/app``` puis on utilise l'instruction CMD (```CMD ["node", "/opt/app/index.js"]```) qui permet d'exécuter notre fichier index.js à chaque fois qu'un container est crée à partir de l'image.

De la même manière que pour l'étape 1, deux scripts sont disponibles : 
 - build.ps1:  crée notre image à partir du Dockerfile 
 - run.ps1: lance un nouveau container à partir de l'image créée par build.ps1

Si un container est en exécution on accède au site web dynamique à partir de ```localhost:3000```.

### Note
Le dossier node_modules n'a pas été push sur Github pour respecter les standards et car il est relativement volumineux. De ce fait avant de build notre image, il faut générer les node_modules en local. Pour ce faire, il faut utiliser la commande ```npm i``` dans le dossier ```/src/```  (là ou se trouvent ```package.json``` et ```package-lock.json```).


## Step 3: Docker compose to build the infrastructure

Les instructions sont stockées dans docker-compose.yml

Pour démarrer l'infrastructure utiliser : ```docker compose up``` ou le script ```run.ps1``` fourni.

Le fichier docker-compose.yml permet de démarrer 3 containers/3 services de manière très simple et rapide. 

Les 3 services sont:
 - reverse-proxy => un container utilisant Treafik pour faire du reverse-proxy
 - static => un container avec notre serveur HTTP static
 - dynamic => un container avec notre serveur HTTP dynamique

Le label suivant a été ajouté pour le service static : ```"traefik.http.routers.static.rule=Host(`localhost`)"```.

Ce label est utilisé par Traefik pour rediriger le client sur le serveur static lorsqu'il accède à l'URL localhost

Le label suivant a été ajouté pour le service dynamic : 
```"traefik.http.routers.dynamic.rule=(Host(`localhost`) && PathPrefix(`/api`))"```.

De la même manière, ce label permet à Traefik de rediriger le client sur le serveur dynamique lorsque celui-ci accède à l'URL localhost/api.

On accède à l'UI de Traefik par le port 8080 (localhost:8080).

### Note 
Le fichier index.js a du être modifier pour cette étape pour que le serveur dynamique réponde lorsque le client demande la ressource ```/api``` et plus ```/``` tout court. De plus nous avons aussi ajouter un ```console.log()```, ce qui est utile pour l'étape 3a pour savoir facilement quel instance du serveur dynamique réponds au client.

## Step 3a: Dynamic cluster management

Pour lancer plusieurs instances des 2 serveurs webs il suffit d'utiliser la commande suivante : ```docker compose up --scale dynamic=2 --scale static=2```.

Cette commande utilise l'option --scale pour démarrer 2 serveurs webs statiques et 2 serveurs webs dynamiques. On a donc 5 containers au total qui sont créés à partir de cette commande.

On notera aussi que pour le service static et dynamic on ne précise pas le ```HOST_PORT``` dans la section ```ports:```. Un port aléatoire est donc choisi par le système. Ceci est nécessaire car par exemple si on précise le ```HOST_PORT``` et on lance 2 instances du service static une erreur serai générée car on aurait 2 containers utilisant le même ```HOST_PORT```.

## Step 4: AJAX requests with JQuery

On choisi l'option avec montage de volume pour l'édition en live. On a choisi l'utilisation de la Fetch API plustôt que de jQuery. Il n'y a pas eu grand-chose à configurer ... plutôt comprendre / apprendre / appliquer. Cela se voit relativement bien par les commits assez peu volumineux.

On peut construire le tout et tester avec la commande : 
```ps
.\buildAllAndRunScale.ps1 -dynamicScale 3 -staticScale 4
```
Qui va lancer 3 instances dynamiques et 4 instances statiques.

## Step 5 : Load balancing: round-robin and sticky sessions

Afin d'utiliser l'option sticky session, on ajoute les 2 labels suivants dans le docker-compose.yml pour le service static.

```
- "traefik.http.services.static.loadbalancer.sticky=true"
- "traefik.http.services.static.loadbalancer.sticky.cookie.name=StickyCookie"
```

On remarque que Traefik utilise des cookies pour gérer des sticky sessions.

### Procédure de validation
La validation peut se faire en faisant un docker compose up et en utilisant l'option --scale pour lancer plusieurs instances.


## Step 6: Management UI

Pour cette étape nous avons choisi une solution déja existante trouvée sur Internet : Portainer

Nous avons ajouté le service portainer dans le docker-compose en utilisant l'image portainer/portainer

On accède à l'UI portainer en utilisant le port 9000 (localhost:9000) depuis un navigateur


