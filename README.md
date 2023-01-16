HTTP Infra
==========

Célestin Piccin & Kévin Jorand

------------

General description

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

## Step 3: Docker compose to build the infrastructure

Les instructions sont stockées dans docker-compose.yml

Pour démarrer l'infrastructure utiliser : ```docker compose up```

### Step 3a: Dynamic cluster management

Pour lancer plusieurs instances des 2 serveurs webs utiliser : ```docker compose up --scale dynamic=2 --scale static=2```

## Step 4: 

On choisi l'option avec montage de volume pour l'édition en live. On a choisi l'utilisation de la Fetch API plustôt que de jQuery. Il n'y a pas eu grand-chose à configurer ... plutôt comprendre / apprendre / appliquer. Cela se voit relativement bien par les commits assez peu volumineux.

On peut construire le tout et tester avec la commande : 
```ps
.\buildAllAndRunScale.ps1 -dynamicScale 3 -staticScale 4
```
Qui va lancer 3 instances dynamiques et 4 instances statiques.

## Step 5 : Load balancing: round-robin and sticky sessions

On ajoute les 2 lignes suivantes dans le docker-compose.yml pour le service static

```
- "traefik.http.services.static.loadbalancer.sticky=true"
- "traefik.http.services.static.loadbalancer.sticky.cookie.name=StickyCookie"
```

On voit que Traefik utilise des cookies pour gérer des sticky sessions

## Step 6: Management UI

Pour cette étape nous avons choisi une solution déja existante trouvée sur Internet : Portainer

Nous avons ajouté le service portainer dans le docker-compose en utilisant l'image portainer/portainer

On accède à l'UI portainer en utilisant le port 9000 (localhost:9000) depuis un navigateur

On a utilisé le paramètre suivant :
```
    command: --admin-password '$$2y$$05$$bHa3AA9lWXhIZVM/JptlMua6HdA3s/8x0nhqKPAX8WGL.mNjxdwlK'
```
Pour paramétrer le mot de passe admin à la création de l'image. Sinon il est demandé au premier accès à la page d'en créer un. Cela donne ainsi la possibilité à quiconque accédant à la page avant nous de pouvoir avoir l'accès complet à notre système ! [BAD]. 

La chaine correspond à un hash du mot de passe `adminpassword`. On note que cela permet en plus de nous afranchir des limitations (min 12 caractères) de mot de passe de l'interface graphique (mais si l'on en choisit un de longueur inférieure, alors il nous est demandé de le changer à la première connexion). La commande utilisée pour la générer est :
```ps1
docker run --rm httpd:2.4-alpine htpasswd -nbB admin 'adminpassword'
```
Qui nous a alors retourné :
```
admin:$2y$05$bHa3AA9lWXhIZVM/JptlMua6HdA3s/8x0nhqKPAX8WGL.mNjxdwlK
```
On ne prend pas la première partie qui correspond au nom d'utilisateur (`admin`, utilisé pour générer le hash), mais uniquement la seconde, qui correspond bien au hash. On doit de plus échapper les `$` par un second `$`, ce qui conduit à la chaine ci-dessus.

Il va sans dire que c'est un très mauvais mot de passe et que dans un cas réel, il ne serait pas inclus "tel quel" en clair dans la documentation, mais dans le cadre de ce labortoire, cela convient bien pour démontrer la fonctionnalité.

