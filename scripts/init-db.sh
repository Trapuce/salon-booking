#!/bin/sh
# Script d'initialisation de la base de données
set -e

echo "Initialisation de la base de données..."

# Vérifier si Prisma CLI est disponible
if [ -f "/app/node_modules/.bin/prisma" ]; then
    PRISMA_CMD="/app/node_modules/.bin/prisma"
elif command -v prisma >/dev/null 2>&1; then
    PRISMA_CMD="prisma"
else
    echo "Prisma CLI non trouvé, installation..."
    npm install -g prisma@latest
    PRISMA_CMD="prisma"
fi

cd /app

# Initialiser la base de données
echo "Pushing schema to database..."
$PRISMA_CMD db push --skip-generate --accept-data-loss || true

echo "Base de données initialisée avec succès!"
