# ============================================================
# Naik Kelas 2.0 - Multi-stage Docker Build
# ============================================================
# Build: docker build -t naikkelas:latest .
# Run:   docker compose up -d
# ============================================================

# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM node:22-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# ============================================================
# Stage 2: Build
# ============================================================
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.pnpm-store /.pnpm-store

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# ============================================================
# Stage 3: Production
# ============================================================
FROM node:22-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S naikkelas && \
    adduser -S naikkelas -u 1001 -G naikkelas

WORKDIR /app

# Copy built output from build stage
COPY --from=build --chown=naikkelas:naikkelas /app/build ./build
COPY --from=build --chown=naikkelas:naikkelas /app/.svelte-kit ./.svelte-kit
COPY --from=build --chown=naikkelas:naikkelas /app/node_modules ./node_modules
COPY --from=build --chown=naikkelas:naikkelas /app/package.json ./
COPY --from=build --chown=naikkelas:naikkelas /app/scripts ./scripts

# Create data directory for SQLite (if needed)
RUN mkdir -p /data && chown -R naikkelas:naikkelas /data

# Switch to non-root user
USER naikkelas

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build"]
