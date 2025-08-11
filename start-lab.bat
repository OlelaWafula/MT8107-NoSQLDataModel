@echo off
REM MongoDB Lab Quick Start Script for Windows
REM This script helps you quickly set up and start the MongoDB lab environment

echo === MongoDB Document Store Lab ===
echo Setting up MongoDB environment...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Create necessary directories
echo Creating project directories...
if not exist "data" mkdir data
if not exist "scripts" mkdir scripts

REM Start MongoDB services
echo Starting MongoDB services...
docker-compose up -d

REM Wait for services to be ready
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if containers are running
docker ps | findstr "mongodb-lab" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB container is running
) else (
    echo ❌ MongoDB container failed to start
    pause
    exit /b 1
)

docker ps | findstr "mongo-express" >nul
if %errorlevel% equ 0 (
    echo ✅ Mongo Express container is running
) else (
    echo ❌ Mongo Express container failed to start
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete! Your MongoDB lab environment is ready.
echo.
echo 📊 Access MongoDB Express (Web UI): http://localhost:8081
echo    Username: admin
echo    Password: password123
echo.
echo 💻 Connect to MongoDB shell:
echo    docker exec -it mongodb-lab mongosh -u admin -p password123
echo.
echo 📚 Follow the README.md file for detailed instructions
echo.
echo 🛑 To stop the services, run: docker-compose down
echo.
pause 