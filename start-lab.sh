#!/bin/bash

# MongoDB Lab Quick Start Script
# This script helps you quickly set up and start the MongoDB lab environment

echo "=== MongoDB Document Store Lab ==="
echo "Setting up MongoDB environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Create necessary directories
echo "Creating project directories..."
mkdir -p data scripts

# Start MongoDB services
echo "Starting MongoDB services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check if containers are running
if docker ps | grep -q "mongodb-lab"; then
    echo "✅ MongoDB container is running"
else
    echo "❌ MongoDB container failed to start"
    exit 1
fi

if docker ps | grep -q "mongo-express"; then
    echo "✅ Mongo Express container is running"
else
    echo "❌ Mongo Express container failed to start"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Your MongoDB lab environment is ready."
echo ""
echo "📊 Access MongoDB Express (Web UI): http://localhost:8081"
echo "   Username: admin"
echo "   Password: password123"
echo ""
echo "💻 Connect to MongoDB shell:"
echo "   docker exec -it mongodb-lab mongosh -u admin -p password123"
echo ""
echo "📚 Follow the README.md file for detailed instructions"
echo ""
echo "🛑 To stop the services, run: docker-compose down" 