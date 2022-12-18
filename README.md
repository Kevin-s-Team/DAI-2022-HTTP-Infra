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


