# Multi-stage Dockerfile for CampScape Backend with NGINX

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Stage 2: Production with NGINX
FROM node:18-alpine

# Install NGINX and wget for health checks
RUN apk add --no-cache nginx wget

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy NGINX configuration
# Alpine Linux uses /etc/nginx/conf.d/ for server configs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Create uploads and logs directories
RUN mkdir -p uploads logs /var/log/nginx /var/cache/nginx /var/run/nginx

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app /var/log/nginx /var/cache/nginx /var/run/nginx

# Fix NGINX permissions (NGINX needs to run as root or specific user)
# We'll run NGINX as root but Node.js as nodejs user
RUN chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/run/nginx

# Expose port 80 (NGINX)
EXPOSE 80

# Health check - check NGINX which proxies to Node.js
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start both NGINX and Node.js
CMD ["/app/start.sh"]












