#!/bin/bash

echo "🚀 Starting Deskbird application..."

echo "📦 Building images..."
docker-compose build

echo "🎉 Starting all services..."
docker-compose up

echo "✅ Application started successfully!"
echo "🔗 Frontend: http://localhost:4000"
echo "🔗 Backend API: http://localhost:3000"
echo "🔗 Database: postgresql://deskbird:deskbird@localhost:5432/deskbird"
