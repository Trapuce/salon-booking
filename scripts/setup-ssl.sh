#!/bin/bash

# Script de configuration SSL avec Let's Encrypt
# Usage: ./scripts/setup-ssl.sh

set -e

DOMAIN="barber-time.trapuce.tech"
EMAIL="admin@trapuce.tech"  # Remplacez par votre email

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Vérifier si certbot est installé
if ! command -v certbot &> /dev/null; then
    log "Installation de certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Arrêter nginx temporairement
log "Arrêt temporaire de nginx..."
docker-compose stop nginx

# Obtenir le certificat SSL
log "Obtention du certificat SSL pour $DOMAIN..."
sudo certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Créer le répertoire SSL
log "Création du répertoire SSL..."
mkdir -p ssl

# Copier les certificats
log "Copie des certificats..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*.pem

# Redémarrer nginx
log "Redémarrage de nginx avec SSL..."
docker-compose up -d nginx

# Vérifier la configuration SSL
log "Vérification de la configuration SSL..."
sleep 10

if curl -f https://$DOMAIN > /dev/null 2>&1; then
    log "✅ SSL configuré avec succès !"
    log "🌐 Votre application est maintenant accessible sur : https://$DOMAIN"
else
    warn "❌ Problème avec la configuration SSL. Vérifiez les logs :"
    docker-compose logs nginx
fi

# Configurer le renouvellement automatique
log "Configuration du renouvellement automatique..."
echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx" | sudo crontab -

log "🎉 Configuration SSL terminée !"
log "📋 Votre certificat sera renouvelé automatiquement tous les jours à 12h"
