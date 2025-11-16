#!/bin/sh

# Create logs directory
mkdir -p /app/logs

# Debug: Show what we have (stdout - Dokploy will see this)
echo "=== CONTAINER STARTING ==="
echo "Current directory: $(pwd)"
echo "Files in /app:"
ls -la /app || echo "Cannot list /app"
echo "Files in /app/dist:"
ls -la /app/dist || echo "Cannot list /app/dist"

# Check if server.js exists BEFORE starting NGINX
if [ ! -f "/app/dist/server.js" ]; then
    echo "ERROR: /app/dist/server.js not found!"
    echo "Files in dist:"
    ls -la /app/dist 2>/dev/null || echo "dist directory not found"
    echo "Keeping container alive for debugging..."
    sleep infinity
    exit 1
fi

# Start NGINX in background
echo "Starting NGINX..."
nginx &
NGINX_PID=$!

# Wait a moment for NGINX to start
sleep 3

# Check if NGINX started
if ! kill -0 $NGINX_PID 2>/dev/null; then
    echo "ERROR: NGINX failed to start"
    echo "Checking NGINX status..."
    nginx -t 2>&1 || true
    echo "Keeping container alive for debugging..."
    sleep infinity
    exit 1
fi

echo "NGINX started successfully (PID: $NGINX_PID)"

# Start Node.js in foreground (logs will be visible in Dokploy)
echo "Starting Node.js server..."
echo "Running: node /app/dist/server.js"
exec node /app/dist/server.js
