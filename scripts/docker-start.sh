#!/bin/sh
set -e

echo "Starting Salon Booking application..."

# Vérifier si la base de données existe
if [ ! -f "/app/data/prod.db" ]; then
    echo "Database not found. Initializing..."
    
    # Utiliser Prisma CLI pour créer la base
    if [ -f "/app/node_modules/prisma/build/index.js" ]; then
        cd /app
        node /app/node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss
        echo "Database initialized successfully!"
    else
        echo "Warning: Prisma CLI not found. Database initialization skipped."
        echo "You may need to initialize the database manually."
    fi
else
    echo "Database found at /app/data/prod.db"
fi

# Démarrer l'application
echo "Starting Next.js server..."
exec node server.js
