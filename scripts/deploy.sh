#!/bin/bash

# Script de déploiement et de test pour Salon Élégance
echo "🚀 Déploiement de Salon Élégance..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installation de pnpm..."
    npm install -g pnpm
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
pnpm install

# Générer le client Prisma
echo "🗄️ Génération du client Prisma..."
npx prisma generate

# Créer la base de données
echo "🗄️ Création de la base de données..."
npx prisma db push

# Vérifier les variables d'environnement
if [ ! -f ".env" ]; then
    echo "⚠️ Fichier .env manquant. Copie du fichier d'exemple..."
    cp env.example .env
    echo "📝 Veuillez configurer le fichier .env avec vos clés API"
fi

# Construire l'application
echo "🔨 Construction de l'application..."
pnpm build

echo "✅ Déploiement terminé!"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement dans .env"
echo "2. Obtenez une clé API Resend sur https://resend.com"
echo "3. Lancez l'application avec: pnpm dev"
echo "4. Testez l'application avec: pnpm test"
echo ""
echo "🌐 L'application sera disponible sur http://localhost:3000"
echo "👤 Interface admin sur http://localhost:3000/admin"


