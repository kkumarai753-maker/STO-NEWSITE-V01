# syntax=docker/dockerfile:1
# Sunrise Tech Origin — website (Next.js 16, standalone output).
# Build:  docker build -t sunrise-frontend ./frontend
# Run:    docker run -p 3000:3000 sunrise-frontend

ARG NODE_VERSION=22

# ---- 1. Dependencies (cached until package*.json change) -------------------
FROM node:${NODE_VERSION}-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- 2. Build ----------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the browser bundle at build time, so
# they are build arguments (docker-compose.yml passes them from .env).
# Never put secrets in NEXT_PUBLIC_* variables.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=918766803990
ARG NEXT_PUBLIC_PHONE_NUMBER=+918766803990
ARG NEXT_PUBLIC_CONTACT_EMAIL=kkumarai753@gmail.com
ARG NEXT_PUBLIC_DESIGN_LAB=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_PHONE_NUMBER=$NEXT_PUBLIC_PHONE_NUMBER \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL \
    NEXT_PUBLIC_DESIGN_LAB=$NEXT_PUBLIC_DESIGN_LAB \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- 3. Runtime --------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# Standalone server + only the node_modules it needs, then static assets.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Brand fonts read at runtime by the generated share image / app icon.
COPY --from=builder --chown=nextjs:nodejs /app/assets ./assets
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
# Tolerate a Windows (CRLF) checkout of the entrypoint script.
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
