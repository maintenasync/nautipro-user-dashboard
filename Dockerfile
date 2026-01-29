# Stage 1: Build
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

RUN npm install --production

# --- SECURITY HARDENING ---
RUN chown -R node:node /app

USER node

# Expose port aplikasi
EXPOSE 3111

# Start aplikasi
CMD ["npm", "start"]