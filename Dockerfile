# ============================================================
# Naik Kelas 2.0 - Docker Build (Host-Built Artifacts)
# ============================================================
# We use pre-built artifacts because VPS Docker limits
# cause Rollup to OOM on `pnpm run build`
# ============================================================

# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM node:22-slim AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# ============================================================
# Stage 2: Production
# ============================================================
FROM node:22-slim AS production

# Install dumb-init and wget for proper signal handling and health checks
RUN apt-get update && apt-get install -y dumb-init wget && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system --gid 1001 naikkelas && \
    adduser --system --uid 1001 --ingroup naikkelas naikkelas

WORKDIR /app

# Copy built output from host system (.svelte-kit and build)
COPY --chown=naikkelas:naikkelas build ./build
COPY --chown=naikkelas:naikkelas .svelte-kit ./.svelte-kit
# Copy dependencies from deps stage
COPY --from=deps --chown=naikkelas:naikkelas /app/node_modules ./node_modules
# Copy other essential files
COPY --chown=naikkelas:naikkelas package.json ./
COPY --chown=naikkelas:naikkelas scripts ./scripts

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
