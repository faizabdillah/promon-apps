FROM node:20.19.6-alpine3.22 AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.24.0

# Copy root workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy app package.json
COPY promon/package.json ./promon/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/promon/node_modules ./promon/node_modules
COPY . .

# Install pnpm in builder too
RUN npm install -g pnpm@10.24.0

ARG BACKEND_DOMAIN=placeholder
ARG SSL=true
ENV BACKEND_DOMAIN=$BACKEND_DOMAIN
ENV SSL=$SSL

# Build using turbo
RUN pnpm turbo build --filter=promon

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/promon/public ./promon/public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/promon/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/promon/.next/static ./promon/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "promon/server.js"]
