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
node dist/server.js &
NODE_PID=$!

# Wait a bit for Node.js to start
echo "⏳ Waiting for Node.js to be ready..."
sleep 5

# Check if Node.js is running
if ! kill -0 $NODE_PID 2>/dev/null; then
    echo "❌ Node.js failed to start"
    exit 1
fi

# Start NGINX in foreground (this will block)
echo "🌐 Starting NGINX..."
exec nginx -g "daemon off;"

