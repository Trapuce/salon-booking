# Dockerfile pour Salon Élégance
FROM node:20-alpine AS base

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Étape de gestion des dépendances
FROM base AS deps
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Étape de build
FROM base AS builder
WORKDIR /app

# Copier les dépendances depuis l'étape deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Build Next.js avec output standalone
RUN npm run build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Créer les dossiers nécessaires avec les bonnes permissions
RUN mkdir -p /app/data && \
    chown -R nextjs:nodejs /app/data

# Copier package.json et prisma schema
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Installer UNIQUEMENT les dépendances de production + Prisma CLI
RUN npm install --omit=dev && \
    npm install -D prisma && \
    npx prisma generate

# Copier les fichiers de l'application Next.js
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Démarrage direct
CMD ["node", "server.js"]