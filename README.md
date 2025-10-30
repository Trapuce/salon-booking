# Salon Élégance - Système de Réservation en Ligne

Un système complet de prise de rendez-vous pour salon de coiffure, construit avec Next.js, Prisma, et TailwindCSS.

## Fonctionnalités

### Interface Client
- Formulaire de réservation simple et intuitif
- Sélection de date avec calendrier
- Créneaux horaires de 30 minutes (9h - 18h)
- Vérification en temps réel de la disponibilité
- Confirmation immédiate de la réservation
- Notifications automatiques par email et SMS
- Validation avancée des données
- Code QR pour accès mobile rapide
- Design responsive (mobile et desktop)

### Interface Admin
- Authentification par mot de passe
- Liste des rendez-vous à venir
- Historique des rendez-vous passés
- Marquer un rendez-vous comme terminé
- Supprimer un rendez-vous
- Affichage des coordonnées clients (nom, email, téléphone)
- Gestionnaire de rappels automatiques
- Envoi de rappels par email et SMS
- Génération et gestion des codes QR

### Base de Données
- SQLite pour le développement (facile à déployer)
- Prisma ORM pour la gestion des données
- Modèle Appointment avec tous les champs nécessaires

## Installation

### Prérequis
- Node.js 18+ installé
- npm ou yarn

### Étapes d'installation

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances**
\`\`\`bash
npm install
\`\`\`

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :

\`\`\`env
# Database URL (SQLite par défaut)
DATABASE_URL="file:./dev.db"

# Mot de passe admin (changez-le !)
ADMIN_PASSWORD="votre_mot_de_passe_securise"

# Configuration Resend pour les emails (gratuit)
RESEND_API_KEY="re_xxxxxxxxxx"

# URL de base de l'application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

4. **Initialiser la base de données**

\`\`\`bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et les tables
npx prisma db push

# (Optionnel) Ouvrir Prisma Studio pour voir les données
npx prisma studio
\`\`\`

5. **Lancer le serveur de développement**

\`\`\`bash
npm run dev
\`\`\`

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Configurez les variables d'environnement :
   - `DATABASE_URL` : Utilisez une base de données PostgreSQL (recommandé pour la production)
   - `ADMIN_PASSWORD` : Votre mot de passe admin sécurisé
5. Cliquez sur "Deploy"

### Méthode 2 : Via la CLI Vercel

\`\`\`bash
# Installer la CLI Vercel
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add ADMIN_PASSWORD
vercel env add DATABASE_URL
\`\`\`

### Base de données en production

Pour la production, il est recommandé d'utiliser PostgreSQL au lieu de SQLite :

1. **Créer une base de données PostgreSQL** (options recommandées) :
   - [Neon](https://neon.tech) - Gratuit, serverless
   - [Supabase](https://supabase.com) - Gratuit, avec authentification
   - [Vercel Postgres](https://vercel.com/storage/postgres) - Intégré à Vercel

2. **Mettre à jour le schema Prisma** :

\`\`\`prisma
datasource db {
  provider = "postgresql"  // Changé de "sqlite" à "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

3. **Appliquer les migrations** :

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

## Structure du Projet

\`\`\`
salon-booking/
├── app/
│   ├── api/                    # Routes API
│   │   ├── book/              # Créer une réservation
│   │   ├── appointments/      # Gérer les rendez-vous
│   │   ├── available-slots/   # Vérifier la disponibilité
│   │   └── admin/             # Authentification admin
│   ├── admin/                 # Page admin
│   ├── page.tsx               # Page d'accueil (réservation)
│   ├── layout.tsx             # Layout principal
│   └── globals.css            # Styles globaux
├── components/
│   ├── booking-form.tsx       # Formulaire de réservation
│   ├── time-slot-picker.tsx   # Sélecteur de créneaux
│   ├── admin-dashboard.tsx    # Tableau de bord admin
│   ├── appointment-list.tsx   # Liste des rendez-vous
│   └── ui/                    # Composants UI (shadcn)
├── lib/
│   ├── prisma.ts              # Client Prisma
│   └── db-utils.ts            # Utilitaires base de données
├── prisma/
│   └── schema.prisma          # Schéma de la base de données
├── .env                       # Variables d'environnement
└── package.json
\`\`\`

## Configuration

### Horaires d'ouverture

Par défaut, les créneaux sont disponibles de 9h à 18h. Pour modifier :

Éditez `lib/db-utils.ts` :

\`\`\`typescript
export function generateTimeSlots(date: Date): Date[] {
  const slots: Date[] = []
  const baseDate = new Date(date)
  baseDate.setHours(9, 0, 0, 0) // Heure de début (9h)

  // Générer des créneaux de 30 minutes
  for (let i = 0; i < 18; i++) {
    const slot = new Date(baseDate)
    slot.setMinutes(baseDate.getMinutes() + i * 30)

    // Heure de fin (18h)
    if (slot.getHours() < 18) {
      slots.push(slot)
    }
  }

  return slots
}
\`\`\`

### Durée des créneaux

Pour changer la durée des créneaux (actuellement 30 minutes) :

1. Modifiez `i * 30` dans `generateTimeSlots()` (ex: `i * 60` pour 1 heure)
2. Ajustez le nombre d'itérations en conséquence

### Jours fermés

Par défaut, le salon est fermé le dimanche. Pour modifier :

Éditez `components/booking-form.tsx` :

\`\`\`typescript
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  disabled={(date) => 
    date < new Date() || 
    date.getDay() === 0 || // Dimanche
    date.getDay() === 1    // Lundi (exemple)
  }
  className="rounded-lg border"
/>
\`\`\`

## Sécurité

### Mot de passe admin

- Le mot de passe admin est stocké dans la variable d'environnement `ADMIN_PASSWORD`
- Changez-le immédiatement après l'installation
- Utilisez un mot de passe fort (minimum 12 caractères)
- Ne commitez jamais le fichier `.env` dans Git

### Recommandations

- En production, utilisez HTTPS (automatique avec Vercel)
- Ajoutez une limitation de taux (rate limiting) sur les API routes
- Considérez l'ajout d'un CAPTCHA sur le formulaire de réservation
- Implémentez une authentification plus robuste (JWT, NextAuth.js) pour l'admin

## Personnalisation

### Nom du salon

Modifiez dans :
- `app/page.tsx` : Titre et description
- `app/layout.tsx` : Métadonnées
- `app/admin/page.tsx` : Titre admin

### Couleurs et design

Les couleurs sont définies dans `app/globals.css` :

\`\`\`css
:root {
  --primary: oklch(0.35 0.08 160);  /* Vert principal */
  --background: oklch(0.98 0.01 15); /* Rose doux */
  /* ... autres couleurs ... */
}
\`\`\`

## Support et Maintenance

### Voir les données

\`\`\`bash
# Ouvrir Prisma Studio
npx prisma studio
\`\`\`

### Sauvegarder la base de données

\`\`\`bash
# SQLite
cp prisma/dev.db prisma/dev.db.backup

# PostgreSQL
pg_dump $DATABASE_URL > backup.sql
\`\`\`

### Logs et débogage

- Les erreurs sont loggées dans la console
- Utilisez `console.log("[v0] ...")` pour déboguer
- Vérifiez les logs Vercel en production

## Améliorations futures

- [x] Envoi d'emails de confirmation automatiques
- [x] Notifications SMS
- [x] Rappels automatiques 24h avant le rendez-vous
- [x] Validation avancée des données
- [x] Génération de QR code pour la page de réservation
- [ ] Système de notes/commentaires
- [ ] Gestion de plusieurs coiffeurs
- [ ] Choix du type de prestation
- [ ] Paiement en ligne
- [ ] Intégration calendrier Google/Outlook
- [ ] Système de fidélité clients

## Licence

Ce projet est libre d'utilisation pour votre salon de coiffure.

## Support

Pour toute question ou problème, consultez la documentation Next.js, Prisma, ou TailwindCSS.
