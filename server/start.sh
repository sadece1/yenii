#!/bin/sh

# Redirect all output to stdout so Dokploy can see it
exec > /proc/1/fd/1 2>&1

# Create logs directory
mkdir -p /app/logs

# Debug: Show what we have
echo "=== CONTAINER STARTING ==="
echo "Current directory: $(pwd)"
echo "Files in /app:"
ls -la /app || echo "Cannot list /app"
echo "Files in /app/dist:"
ls -la /app/dist || echo "Cannot list /app/dist"

# Check if server.js exists
if [ ! -f "/app/dist/server.js" ]; then
    echo "ERROR: /app/dist/server.js not found!"
    echo "Files in dist:"
    ls -la /app/dist 2>/dev/null || echo "dist directory not found"
    echo "Keeping container alive for debugging..."
    tail -f /dev/null
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
    tail -f /dev/null
    exit 1
fi

echo "NGINX started successfully (PID: $NGINX_PID)"

# Start Node.js in foreground (logs will be visible in Dokploy)
echo "Starting Node.js server..."
echo "Running: node /app/dist/server.js"
node /app/dist/server.js || {
    echo "ERROR: Node.js server failed to start!"
    echo "Keeping container alive for debugging..."
    tail -f /dev/null
}
