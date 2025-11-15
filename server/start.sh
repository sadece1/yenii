#!/bin/sh

# Start script for NGINX + Node.js backend

# Function to handle shutdown
cleanup() {
    echo "🛑 Shutting down..."
    kill -TERM "$NODE_PID" 2>/dev/null
    nginx -s quit 2>/dev/null
    exit 0
}

# Trap signals
trap cleanup SIGTERM SIGINT

# Start Node.js backend in background
echo "🚀 Starting Node.js backend..."
echo "📁 Current directory: $(pwd)"
echo "📦 Checking dist/server.js..."
if [ ! -f "dist/server.js" ]; then
    echo "❌ ERROR: dist/server.js not found!"
    ls -la dist/ || echo "dist/ directory does not exist"
    exit 1
fi

# Start Node.js with output to stdout/stderr
node dist/server.js > /app/logs/node.log 2>&1 &
NODE_PID=$!

# Wait a bit for Node.js to start
echo "⏳ Waiting for Node.js to be ready..."
sleep 10

# Check if Node.js is running
if ! kill -0 $NODE_PID 2>/dev/null; then
    echo "❌ Node.js failed to start"
    echo "📋 Last 20 lines of node.log:"
    tail -20 /app/logs/node.log || echo "No logs available"
    exit 1
fi

echo "✅ Node.js is running (PID: $NODE_PID)"
echo "📋 Checking if port 3000 is listening..."
netstat -tuln | grep 3000 || echo "⚠️  Port 3000 not yet listening"

# Start NGINX in foreground (this will block)
echo "🌐 Starting NGINX..."
exec nginx -g "daemon off;"

