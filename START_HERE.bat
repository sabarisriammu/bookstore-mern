@echo off
echo ========================================
echo   BOOKSTORE APPLICATION SETUP
echo ========================================
echo.
echo This script will help you set up and run the bookstore application.
echo.
echo IMPORTANT: You need MongoDB to run this application.
echo.
echo Choose an option:
echo 1. I have MongoDB installed locally
echo 2. I want to use MongoDB Atlas (free cloud database)
echo 3. Install MongoDB locally (opens download page)
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" goto local
if "%choice%"=="2" goto atlas
if "%choice%"=="3" goto download
goto end

:local
echo.
echo Starting with local MongoDB...
echo Make sure MongoDB is running on mongodb://localhost:27017
echo.
pause
echo Installing dependencies...
call npm install
call npm install --prefix backend
call npm install --prefix frontend
echo.
echo Seeding database with sample data...
call npm run seed
echo.
echo Starting application...
call npm start
goto end

:atlas
echo.
echo ========================================
echo   MONGODB ATLAS SETUP
echo ========================================
echo.
echo 1. Go to: https://www.mongodb.com/cloud/atlas/register
echo 2. Create a FREE account
echo 3. Create a FREE cluster (M0 Sandbox)
echo 4. Click "Connect" on your cluster
echo 5. Choose "Connect your application"
echo 6. Copy the connection string
echo.
echo Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookstore
echo.
set /p atlas_uri="Paste your MongoDB Atlas connection string here: "
echo.
echo Updating configuration...
echo PORT=5000 > backend\config.env
echo MONGODB_URI=%atlas_uri% >> backend\config.env
echo JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure >> backend\config.env
echo JWT_EXPIRE=30d >> backend\config.env
echo NODE_ENV=development >> backend\config.env
echo.
echo Configuration updated!
echo.
echo Installing dependencies...
call npm install
call npm install --prefix backend
call npm install --prefix frontend
echo.
echo Seeding database with sample data...
call npm run seed
echo.
echo Starting application...
call npm start
goto end

:download
echo.
echo Opening MongoDB download page...
start https://www.mongodb.com/try/download/community
echo.
echo After installing MongoDB:
echo 1. Make sure "Install MongoDB as a Service" is checked
echo 2. Complete the installation
echo 3. Run this script again and choose option 1
echo.
pause
goto end

:end
echo.
echo Setup complete!
pause