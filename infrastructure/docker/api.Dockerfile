FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY apps/api/package.json apps/api/pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY apps/api .

# Build
RUN corepack enable pnpm && pnpm build

# Production
FROM node:18-alpine AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./

EXPOSE 3001

CMD ["node", "dist/main"]

