# Dockerfile pour Salon Élégance
FROM node:20-alpine AS base

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Build de l'application
FROM base AS builder
WORKDIR /app
# Copier manifest et schéma Prisma avant l'installation (postinstall a besoin du schéma)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .

# Build Next.js
RUN npx prisma generate
RUN npm run build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Créer les dossiers nécessaires
RUN mkdir -p /app/data /app/node_modules/.prisma /app/node_modules/@prisma

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib

# Copier Prisma Client avec tous les fichiers binaires nécessaires (y compris le Query Engine)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Définir les permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Commande de démarrage
CMD ["node", "server.js"]