# Build the Next.js application and generate the Prisma client in a Node 22 image.
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Prisma generate requires a syntactically valid URL at build time; the real
# production URL is injected by Coolify only when the container runs.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Keep Prisma CLI and migrations in the runtime image so migrations can be
# applied before the web server accepts traffic.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
