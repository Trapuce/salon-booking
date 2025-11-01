#!/bin/sh
set -e

echo "Starting Salon Booking application..."

# Vérifier si la base de données existe
if [ ! -f "/app/data/prod.db" ]; then
    echo "Database not found. Creating empty database..."
    
    # Créer un fichier vide pour SQLite
    touch /app/data/prod.db
    echo "Empty database created. Tables will be created on first use."
    echo "Note: You may need to run 'prisma db push' manually to create tables."
else
    echo "Database found at /app/data/prod.db"
fi

# Démarrer l'application
echo "Starting Next.js server..."
exec node server.js
