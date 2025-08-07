# syntax=docker/dockerfile:1

# Adjustable Node version (20-alpine by default)
ARG NODE_VERSION=22-alpine

# 1) Install dependencies
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev=false

# 2) Build the app
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Run the app
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy only what we need at runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.* ./

RUN chown -R app:app /app

EXPOSE 3000
USER app
CMD ["npm", "run", "start", "--", "-p", "3000"]
