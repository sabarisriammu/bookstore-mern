@echo off
color 0A
cls
echo.
echo ========================================
echo    BOOKSTORE APPLICATION LAUNCHER
echo ========================================
echo.
echo Checking setup...
echo.

REM Check if node_modules exist
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    call npm install --prefix backend
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    call npm install --prefix frontend
)

echo.
echo ========================================
echo    IMPORTANT: MongoDB Required!
echo ========================================
echo.
echo This application needs MongoDB to run.
echo.
echo Quick Setup Options:
echo.
echo 1. MongoDB Atlas (FREE, 2 minutes):
echo    - Go to: https://mongodb.com/cloud/atlas/register
echo    - Create free account and cluster
echo    - Get connection string
echo    - Update backend\config.env
echo.
echo 2. Local MongoDB:
echo    - Download: https://mongodb.com/try/download/community
echo    - Install and run
echo.
echo ========================================
echo.
echo Press any key to start the application...
echo (Make sure MongoDB is configured!)
echo.
pause > nul

echo.
echo Starting backend server...
start "Bookstore Backend" cmd /k "cd backend && npm start"

timeout /t 5 /nobreak > nul

echo Starting frontend...
start "Bookstore Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo    APPLICATION STARTING!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo   Admin: admin@bookstore.com / admin123
echo   User:  user@bookstore.com / user123
echo.
echo Press any key to exit this window...
echo (The app will keep running in other windows)
echo.
pause > nul