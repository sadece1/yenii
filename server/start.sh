#!/bin/sh

# Create logs directory
mkdir -p /app/logs

# Debug: Show what we have
echo "=== CONTAINER STARTING ==="
echo "Current directory: $(pwd)"
echo "Files in /app:"
ls -la /app || echo "Cannot list /app"
echo "Files in /app/dist:"
ls -la /app/dist || echo "Cannot list /app/dist"

# Start NGINX in background
echo "Starting NGINX..."
nginx &
NGINX_PID=$!

# Wait a moment for NGINX to start
sleep 2

# Check if NGINX started
if ! kill -0 $NGINX_PID 2>/dev/null; then
    echo "ERROR: NGINX failed to start"
    # Keep container alive to see error
    sleep infinity
    exit 1
fi

echo "NGINX started successfully (PID: $NGINX_PID)"

# Check if server.js exists
if [ ! -f "/app/dist/server.js" ]; then
    echo "ERROR: /app/dist/server.js not found!"
    echo "Files in dist:"
    ls -la /app/dist || echo "dist directory not found"
    # Keep container alive to see error
    sleep infinity
    exit 1
fi

# Start Node.js in foreground (logs will be visible in Dokploy)
echo "Starting Node.js server..."
echo "Running: node /app/dist/server.js"
exec node /app/dist/server.js
