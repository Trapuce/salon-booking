# Guide de Déploiement VPS avec Traefik

## Configuration

Votre application est maintenant configurée pour utiliser Traefik qui gère déjà les ports 80/443 sur votre VPS.

## Étapes de Déploiement

### 1. Sur votre machine locale

```bash
# Assurez-vous que le code est prêt
git add .
git commit -m "Configure Traefik integration"
git push
```

### 2. Sur votre VPS

```bash
# Créer le dossier pour l'application
mkdir -p /opt/salon-booking
cd /opt/salon-booking

# Cloner ou copier les fichiers du projet
git clone git@github.com:Trapuce/salon-booking.git .
# OU si vous copiez via scp depuis votre machine locale:
# scp -r salon-booking/* user@vps:/opt/salon-booking

# Créer le fichier .env
cat > .env << 'EOF'
DATABASE_URL="file:/app/data/prod.db"
ADMIN_PASSWORD="votre_mot_de_passe_securise"
RESEND_API_KEY="re_xxxxxxxxxx"
NEXT_PUBLIC_APP_URL="https://barber-time.trapuce.tech"
EOF

# Éditer le .env avec vos vraies valeurs
nano .env
```

### 3. Builder et lancer l'application

```bash
cd /infra-traefik/apps/salon-booking

# Builder l'image Docker (IMPORTANT: rebuild complet pour Prisma)
docker compose build --no-cache

# Lancer le conteneur
docker compose up -d

# Initialiser la base de données (première fois seulement)
# Après le rebuild avec les corrections Prisma, utilisez :
docker compose exec salon-booking node node_modules/.bin/prisma db push --skip-generate

# OU si le conteneur a déjà la DB en sync (comme indiqué dans votre sortie),
# vous pouvez ignorer cette étape - la base est déjà initialisée !
```

### 4. Vérification

```bash
# Vérifier que le conteneur tourne
docker ps | grep salon-booking

# Vérifier les logs
docker logs -f salon-booking

# Tester l'API
curl https://barber-time.trapuce.tech/api/appointments
```

### 5. Accès

- **Application** : https://barber-time.trapuce.tech
- **Interface Admin** : https://barber-time.trapuce.tech/admin
- **Page QR Code** : https://barber-time.trapuce.tech/admin/qr-code

## Comment ça fonctionne

1. Traefik écoute sur les ports 80/443 (déjà configuré dans `infra-traefik`)
2. Votre application est sur le réseau Docker `web` (même réseau que Traefik)
3. Traefik détecte automatiquement les labels du conteneur
4. HTTPS est configuré automatiquement avec Let's Encrypt via Traefik
5. Le domaine `barber-time.trapuce.tech` pointe vers votre conteneur

## Mise à jour

Pour mettre à jour l'application après des modifications :

```bash
cd /opt/salon-booking

# Récupérer les dernières modifications
git pull

# Rebuilder et redémarrer
docker compose build
docker compose up -d
```

## Sauvegardes

La base de données est stockée dans le volume Docker `salon-data` :

```bash
# Sauvegarder la base de données
docker run --rm -v salon-booking_salon-data:/data -v $(pwd):/backup alpine sh -c 'cp /data/prod.db /backup/prod-$(date +%F).db'

# Restaurer la base de données
docker run --rm -v salon-booking_salon-data:/data -v $(pwd):/backup alpine sh -c 'cp /backup/prod-YYYY-MM-DD.db /data/prod.db'
```

## Dépannage

### Le conteneur ne démarre pas

```bash
# Voir les logs
docker logs salon-booking

# Redémarrer
docker compose restart
```

### Traefik ne détecte pas le conteneur

```bash
# Vérifier que le réseau web existe
docker network ls | grep web

# Si le réseau n'existe pas, le créer
docker network create web
```

### Problème de certificat SSL

Traefik devrait obtenir automatiquement le certificat. Vérifiez les logs de Traefik :

```bash
docker logs traefik
```

### Accès à l'application

Si l'application n'est pas accessible :

1. Vérifier que le DNS pointe vers votre VPS :
   ```bash
   dig barber-time.trapuce.tech
   ```

2. Vérifier que Traefik voit le conteneur :
   - Accéder au dashboard Traefik : http://votre-vps-ip:8080
   - Vérifier que `salon-booking` apparaît dans les routes

3. Vérifier les logs Traefik pour les erreurs :
   ```bash
   docker logs traefik | grep salon-booking
   ```

## Configuration Traefik

Votre application utilise ces labels Traefik :

- `traefik.enable=true` : Active Traefik pour ce conteneur
- `traefik.http.routers.salon-booking.rule=Host(...)` : Règle de routage
- `traefik.http.routers.salon-booking.entrypoints=websecure` : Utilise HTTPS
- `traefik.http.routers.salon-booking.tls.certresolver=myresolver` : Certificat Let's Encrypt
- `traefik.http.services.salon-booking.loadbalancer.server.port=3000` : Port interne du conteneur

Ces labels sont déjà configurés dans `docker-compose.yml`, vous n'avez rien à modifier.
