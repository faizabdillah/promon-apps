FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.24.0

# Copy root workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy app package.json
COPY console/package.json ./console/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/console/node_modules ./console/node_modules
COPY . .

# Install pnpm in builder too
RUN npm install -g pnpm@10.24.0

ARG GOOGLE_CLIENT_ID=placeholder
ARG GOOGLE_CLIENT_SECRET=placeholder
ARG NEXTAUTH_SECRET=placeholder
ARG NEXTAUTH_URL=http://localhost:3000
ARG BACKEND_DOMAIN=placeholder

ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV BACKEND_DOMAIN=$BACKEND_DOMAIN

# Build using turbo
RUN echo "Checking env vars..." && \
    echo "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}" && \
    echo "NEXTAUTH_URL=${NEXTAUTH_URL}"
RUN pnpm turbo build --filter=mikrotik-box

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/console/public ./console/public

# Set the correct permission for prerender cache
RUN mkdir -p console/.next
RUN chown nextjs:nodejs console/.next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/console/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/console/.next/static ./console/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "console/server.js"]
