# Guide de Déploiement VPS - Barber Time

## 🚀 Déploiement sur barber-time.trapuce.tech

### Prérequis VPS

1. **Serveur Ubuntu 20.04+** ou **Debian 11+**
2. **Docker** et **Docker Compose** installés
3. **Git** installé
4. **Ports ouverts** : 80, 443, 22
5. **Domaine** `barber-time.trapuce.tech` pointant vers votre VPS

### Installation des Prérequis

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installation de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Installation de Git
sudo apt install -y git

# Redémarrage pour appliquer les changements
sudo reboot
```

### Déploiement de l'Application

1. **Cloner le projet**
```bash
cd /opt
sudo git clone https://github.com/votre-username/salon-booking.git barber-time
sudo chown -R $USER:$USER barber-time
cd barber-time
```

2. **Configurer les variables d'environnement**
```bash
cp .env.production.example .env.production
nano .env.production
```

**Variables importantes à configurer :**
```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://barber_user:VOTRE_MOT_DE_PASSE_SECURISE@postgres:5432/barber_time"

# Mot de passe admin
ADMIN_PASSWORD="VOTRE_MOT_DE_PASSE_ADMIN_SECURISE"

# API Resend (obtenez votre clé sur resend.com)
RESEND_API_KEY="re_xxxxxxxxxx"

# URL de l'application
NEXT_PUBLIC_APP_URL="https://barber-time.trapuce.tech"

# Configuration PostgreSQL
POSTGRES_PASSWORD="VOTRE_MOT_DE_PASSE_POSTGRES_SECURISE"
```

3. **Déployer avec Docker**
```bash
# Rendre les scripts exécutables
chmod +x scripts/*.sh

# Déployer l'application
./scripts/deploy-vps.sh
```

### Configuration SSL (Let's Encrypt)

```bash
# Configurer SSL automatiquement
./scripts/setup-ssl.sh
```

### Vérification du Déploiement

1. **Vérifier les conteneurs**
```bash
docker-compose ps
```

2. **Vérifier les logs**
```bash
docker-compose logs -f app
```

3. **Tester l'application**
- Ouvrir https://barber-time.trapuce.tech
- Tester la réservation
- Tester l'interface admin

### Gestion de l'Application

#### Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer l'application
docker-compose restart

# Arrêter l'application
docker-compose down

# Mettre à jour l'application
git pull
docker-compose build
docker-compose up -d

# Sauvegarder la base de données
docker-compose exec postgres pg_dump -U barber_user barber_time > backup.sql

# Restaurer la base de données
docker-compose exec -T postgres psql -U barber_user barber_time < backup.sql
```

#### Surveillance

```bash
# Vérifier l'utilisation des ressources
docker stats

# Vérifier l'espace disque
df -h

# Vérifier les logs système
journalctl -u docker
```

### Configuration du Domaine

1. **DNS** : Pointez `barber-time.trapuce.tech` vers l'IP de votre VPS
2. **Firewall** : Ouvrez les ports 80 et 443
3. **SSL** : Le script configure automatiquement Let's Encrypt

### Sécurité

1. **Changer les mots de passe par défaut**
2. **Configurer un firewall** (UFW recommandé)
3. **Mettre à jour régulièrement** le système
4. **Sauvegarder** la base de données régulièrement

### Monitoring

```bash
# Installer un moniteur simple
sudo apt install -y htop

# Surveiller les logs en temps réel
docker-compose logs -f --tail=100
```

### Dépannage

#### Problèmes Courants

1. **Application ne démarre pas**
```bash
docker-compose logs app
```

2. **Base de données inaccessible**
```bash
docker-compose logs postgres
```

3. **SSL ne fonctionne pas**
```bash
docker-compose logs nginx
```

4. **Port déjà utilisé**
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### Sauvegarde

```bash
# Script de sauvegarde automatique
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U barber_user barber_time > /opt/backups/barber_time_$DATE.sql
find /opt/backups -name "*.sql" -mtime +7 -delete
```

### Mise à Jour

```bash
# Mise à jour complète
git pull
docker-compose build --no-cache
docker-compose down
docker-compose up -d
```

## 🎉 Félicitations !

Votre application Barber Time est maintenant déployée sur https://barber-time.trapuce.tech !

### Prochaines Étapes

1. ✅ **Tester** toutes les fonctionnalités
2. ✅ **Configurer** Resend pour les emails
3. ✅ **Personnaliser** le design si nécessaire
4. ✅ **Configurer** les sauvegardes automatiques
5. ✅ **Surveiller** les performances
