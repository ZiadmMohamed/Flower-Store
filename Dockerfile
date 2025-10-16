FROM node:20-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat

# Only copy lockfiles to leverage Docker layer caching
COPY package*.json ./


# --------------------------
# Development image
# --------------------------
FROM base AS dev
ENV NODE_ENV=development
RUN npm ci

# Copy the whole project for cases when the code isn't bind-mounted
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


# --------------------------
# Build image
# --------------------------
FROM base AS builder
ENV NODE_ENV=production
RUN npm ci
COPY . .
RUN npm run build


# --------------------------
# Production runtime image
# --------------------------
FROM node:20-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install production dependencies only
COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]


