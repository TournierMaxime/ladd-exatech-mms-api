# ladd-exatech-mms-api

## Installation

1. Créer le .env grâce au .env.dist
2. Créer le docker-compose.yml grâce au docker-compose.yml.dist
3. Lancer la commande docker compose run --rm server npm i pour installer les packages
4. Lancer docker compose build
5. Puis docker compose up -d pour lancer le serveur et la db

## Migration

1. Pour créer une migration: npx sequelize-cli migration:generate --name <nom_de_la_migration>
2. Renommer l'extension du fichier de migration en .cjs (compatibilité type module)
3. Pour exécuter les modifications effectuées par une migration: docker compose run --rm server npm run migrate

## Documentation

La documentation Postman est disponible [ici](https://documenter.getpostman.com/view/1788084/2s9XxvSuHr)

## Serveur de dev

l'api est disponible et fonctionnelle via [cette adresse](https://ladd-exatech-mms-api.dev1.ladd.guru/api/v1)
