FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.24.0

# Copy root workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/package.json ./apps/package.json

# Copy app package.json
COPY apps/landing-page/package.json ./apps/landing-page/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/landing-page/node_modules ./apps/landing-page/node_modules
COPY . .

# Install pnpm in builder too
RUN npm install -g pnpm@10.24.0

# Build using turbo
RUN pnpm turbo build --filter=landing-page

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/landing-page/public ./apps/landing-page/public

# Set the correct permission for prerender cache
RUN mkdir -p apps/landing-page/.next
RUN chown nextjs:nodejs apps/landing-page/.next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing-page/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing-page/.next/static ./apps/landing-page/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/landing-page/server.js"]
