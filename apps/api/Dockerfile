FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY prisma prisma
RUN pnpm install --filter ./apps/api... --filter ./packages/types... --frozen-lockfile=false

FROM deps AS builder
COPY . .
RUN pnpm --filter api build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
RUN corepack enable && pnpm install --prod --frozen-lockfile=false
EXPOSE 4000
CMD ["node", "dist/main.js"]
