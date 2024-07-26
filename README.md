# Groupe 3 : 

## Lancement du projet

Pour construire et démarrer les conteneurs définis dans le fichier docker-compose.yml, exécutez la commande suivante :
```bash
docker compose up --build
```

Accédez au conteneur backend et installez les dépendances Node.js :
```bash
docker compose run -it --entrypoint /bin/sh backend
npm install
exit
```

Accédez au conteneur frontend et installez les dépendances Node.js :
```bash
docker compose run -it --entrypoint /bin/sh frontend
npm install
exit
```

Accédez au dossier backend et recréez la base de données :
```bash
cd backend
make db-recreate
```

## johan-mickael-myges:  RAKOTONIAINA Johan Mickael 

- Inscription avec confirmation par mail
- Authentification
- Recherche produits / filtres
- Gestion d’alertes
- Panel d’administration
- Gestion des rôles
- Gestion des stocks
- Export Csv



## RachaRamoul:  RAMOUL Racha

- Panier 
- Commande
- API La Poste pour vérification d’adresses
- Paiement
- Historique des commandes et facturation
- RGPD


## hema-brm: BIRABOURAME Hemavathi

- Réinitialisation de mot de passe 
- Affichage des produits 
- Fiche produit
- Pagination 
- Crud admin (couleurs, matériaux, marques)



## SarahLyna:   SALAMANI Sarah Lina

- Modification des mdp 
- Suppression de compte
- Insertion de données réelles pour la prod

