-- Script d'initialisation de la base de données PostgreSQL
-- pour Salon Élégance

-- Créer la base de données si elle n'existe pas
-- (PostgreSQL crée automatiquement la base spécifiée dans POSTGRES_DB)

-- Créer la table des heures d'ouverture
CREATE TABLE IF NOT EXISTS "WorkingHours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- Insérer les heures d'ouverture par défaut (9h-18h, lundi-vendredi)
INSERT INTO "WorkingHours" ("id", "dayOfWeek", "startTime", "endTime", "isOpen") VALUES
('monday', 1, '09:00', '18:00', true),
('tuesday', 2, '09:00', '18:00', true),
('wednesday', 3, '09:00', '18:00', true),
('thursday', 4, '09:00', '18:00', true),
('friday', 5, '09:00', '18:00', true),
('saturday', 6, '09:00', '18:00', false),
('sunday', 0, '09:00', '18:00', false)
ON CONFLICT ("id") DO NOTHING;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS "WorkingHours_dayOfWeek_idx" ON "WorkingHours"("dayOfWeek");