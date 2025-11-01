# Guide de Déploiement Production - Salon Booking

## Configuration Docker optimisée

### Dockerfile
- Multi-stage build pour réduire la taille de l'image
- Utilisateur non-root pour la sécurité
- Healthcheck intégré
- Script de démarrage automatique avec initialisation DB

### Docker Compose
- Configuration Traefik complète avec HTTPS automatique
- Redirection HTTP vers HTTPS
- Limites de ressources définies
- Volumes persistants pour la base de données

## Déploiement sur VPS

### 1. Préparer le VPS

```bash
# Se connecter au VPS
ssh user@78.138.58.252

# Créer le dossier du projet
mkdir -p /infra-traefik/apps/salon-booking
cd /infra-traefik/apps/salon-booking
```

### 2. Transférer les fichiers

```bash
# Option 1: Via Git
git clone git@github.com:Trapuce/salon-booking.git .

# Option 2: Via SCP depuis votre machine locale
scp -r /Users/daoudatraore/Downloads/salon-booking/* user@78.138.58.252:/infra-traefik/apps/salon-booking/
```

### 3. Configuration de l'environnement

```bash
# Créer le fichier .env
cat > .env << 'EOF'
ADMIN_PASSWORD=VotreMotDePasseSecurise123!
RESEND_API_KEY=re_xxxxxxxxxx
EOF

# IMPORTANT: Changez ADMIN_PASSWORD par un mot de passe fort !
# C'est ce mot de passe qui protège votre interface admin

# Sécuriser le fichier
chmod 600 .env
```

### 4. Build et déploiement

```bash
# Builder l'image
docker compose build

# Démarrer l'application
docker compose up -d

# Vérifier les logs
docker compose logs -f salon-booking
```

### 5. Vérification

```bash
# Vérifier que le conteneur est healthy
docker ps | grep salon-booking

# Tester l'API
curl https://barber-time.trapuce.tech/api/appointments

# Accéder à l'application
# Frontend: https://barber-time.trapuce.tech
# Admin: https://barber-time.trapuce.tech/admin
# Identifiants admin: admin / [votre ADMIN_PASSWORD dans .env]
```

## Maintenance

### Mise à jour de l'application

```bash
cd /infra-traefik/apps/salon-booking

# Récupérer les dernières modifications
git pull

# Rebuilder et redéployer
docker compose build
docker compose up -d
```

### Sauvegardes

```bash
# Backup automatique de la base de données
docker run --rm \
  -v salon-booking_salon-data:/data \
  -v $(pwd)/backups:/backup \
  alpine sh -c "cp /data/prod.db /backup/prod-$(date +%F-%H%M).db"

# Créer un cron pour backup quotidien
echo "0 2 * * * cd /infra-traefik/apps/salon-booking && docker run --rm -v salon-booking_salon-data:/data -v $(pwd)/backups:/backup alpine sh -c 'cp /data/prod.db /backup/prod-\$(date +%F).db'" | crontab -
```

### Monitoring

```bash
# Voir l'utilisation des ressources
docker stats salon-booking

# Voir les logs en temps réel
docker compose logs -f salon-booking

# Vérifier la santé du conteneur
docker inspect salon-booking | grep -A 5 "Health"
```

## Dépannage

### Le certificat SSL ne fonctionne pas

1. Vérifier les logs Traefik :
```bash
docker logs traefik | grep -i "barber-time\|certificate"
```

2. Vérifier que le DNS pointe bien vers le VPS :
```bash
dig barber-time.trapuce.tech +short
# Doit retourner: 78.138.58.252
```

### L'application ne démarre pas

1. Vérifier les logs :
```bash
docker compose logs salon-booking
```

2. Vérifier que la base de données est initialisée :
```bash
docker compose exec salon-booking ls -la /app/data/
```

### Erreur Prisma

Si Prisma ne trouve pas la base de données :
```bash
# Initialiser manuellement
docker compose exec salon-booking sh -c "npm install -g prisma && prisma db push"
```

## Sécurité

### Recommandations

1. **Mots de passe forts** : Changez `ADMIN_PASSWORD` dans `.env`
2. **Firewall** : Assurez-vous que seuls les ports 80/443 sont ouverts
3. **Mises à jour** : Gardez Docker et les dépendances à jour
4. **Backups** : Configurez des sauvegardes automatiques
5. **Monitoring** : Surveillez les logs pour détecter les anomalies

### Commandes utiles de sécurité

```bash
# Voir les dernières connexions admin
docker compose exec salon-booking grep "admin" /app/logs/*.log

# Nettoyer les vieux logs
find /infra-traefik/apps/salon-booking/logs -name "*.log" -mtime +30 -delete
```

## Performance

### Optimisations appliquées

- Image Docker minimale (Alpine Linux)
- Build multi-stage (image finale ~200MB)
- Standalone Next.js (pas de node_modules complet)
- Limites de mémoire définies (512MB max)
- Healthcheck pour redémarrage automatique

### Monitoring des performances

```bash
# Utilisation CPU/RAM
docker stats salon-booking --no-stream

# Temps de réponse
time curl -s https://barber-time.trapuce.tech > /dev/null
```

## Contact et Support

Pour toute question ou problème :
- Vérifiez d'abord les logs : `docker compose logs salon-booking`
- Consultez la documentation Traefik : https://doc.traefik.io/
- Repository GitHub : https://github.com/Trapuce/salon-booking
