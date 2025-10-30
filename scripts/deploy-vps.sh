#!/bin/bash

# Script de déploiement pour VPS - barber-time.trapuce.tech
# Usage: ./scripts/deploy-vps.sh

set -e

echo "🚀 Déploiement de Barber Time sur VPS..."

# Variables
DOMAIN="barber-time.trapuce.tech"
APP_DIR="/opt/barber-time"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé. Installez Docker d'abord."
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé. Installez Docker Compose d'abord."
fi

# Créer le répertoire de l'application
log "Création du répertoire de l'application..."
sudo mkdir -p $APP_DIR
cd $APP_DIR

# Cloner ou mettre à jour le code
if [ -d ".git" ]; then
    log "Mise à jour du code existant..."
    git pull origin main
else
    log "Clonage du code..."
    # Remplacez par votre URL Git
    git clone https://github.com/votre-username/salon-booking.git .
fi

# Copier les fichiers de configuration
log "Configuration des fichiers..."
cp .env.production.example .env.production

# Éditer le fichier .env.production
warn "Veuillez éditer le fichier .env.production avec vos vraies valeurs :"
echo "nano .env.production"
echo ""
echo "Variables importantes à configurer :"
echo "- RESEND_API_KEY: Votre clé API Resend"
echo "- ADMIN_PASSWORD: Mot de passe admin sécurisé"
echo "- POSTGRES_PASSWORD: Mot de passe PostgreSQL sécurisé"
echo ""

read -p "Appuyez sur Entrée une fois la configuration terminée..."

# Construire et démarrer les conteneurs
log "Construction des images Docker..."
docker-compose build

log "Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
log "Attente du démarrage des services..."
sleep 30

# Vérifier le statut des conteneurs
log "Vérification du statut des conteneurs..."
docker-compose ps

# Exécuter les migrations de base de données
log "Exécution des migrations de base de données..."
docker-compose exec app npx prisma db push

# Vérifier que l'application répond
log "Vérification de l'application..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "✅ Application démarrée avec succès !"
    log "🌐 Votre application est accessible sur : https://$DOMAIN"
else
    error "❌ L'application ne répond pas sur le port 3000"
fi

# Afficher les logs
log "Logs de l'application :"
docker-compose logs app

log "🎉 Déploiement terminé !"
log "📋 Prochaines étapes :"
log "   1. Configurez votre domaine $DOMAIN pour pointer vers ce serveur"
log "   2. Installez un certificat SSL (Let's Encrypt recommandé)"
log "   3. Testez l'application sur https://$DOMAIN"
log "   4. Configurez vos clés API Resend"

echo ""
log "🔧 Commandes utiles :"
echo "   Voir les logs: docker-compose logs -f"
echo "   Redémarrer: docker-compose restart"
echo "   Arrêter: docker-compose down"
echo "   Mise à jour: git pull && docker-compose build && docker-compose up -d"
