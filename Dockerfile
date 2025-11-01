# Stage 1: Base
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Stage 3: Builder
FROM base AS builder
WORKDIR /app

# Copier les dépendances depuis deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /root/.npm /root/.npm

# Copier tout le code source
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Générer le client Prisma
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Stage 4: Runner (Production)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Créer les dossiers nécessaires
RUN mkdir -p /app/data && \
    chown -R nextjs:nodejs /app

# Copier les fichiers publics
COPY --from=builder /app/public ./public

# Créer le dossier .next avec les bonnes permissions
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Copier les fichiers standalone de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copier Prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# Copier package.json pour les scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copier lib pour les utilitaires
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/appointments', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Démarrer directement Node.js
CMD ["node", "server.js"]