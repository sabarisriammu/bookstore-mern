# Bookstore Quick Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BOOKSTORE APPLICATION SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "MongoDB Setup Options:" -ForegroundColor Yellow
Write-Host "1. Use MongoDB Atlas (FREE cloud database - Recommended)" -ForegroundColor White
Write-Host "2. Use local MongoDB (must be installed)" -ForegroundColor White
Write-Host "3. Download MongoDB Community Server" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, or 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "   MONGODB ATLAS SETUP" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Steps to get your MongoDB Atlas connection string:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
        Write-Host "2. Create a FREE account" -ForegroundColor White
        Write-Host "3. Create a FREE cluster (M0 Sandbox)" -ForegroundColor White
        Write-Host "4. Click 'Connect' on your cluster" -ForegroundColor White
        Write-Host "5. Choose 'Connect your application'" -ForegroundColor White
        Write-Host "6. Copy the connection string" -ForegroundColor White
        Write-Host ""
        Write-Host "Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookstore" -ForegroundColor Gray
        Write-Host ""
        
        $atlasUri = Read-Host "Paste your MongoDB Atlas connection string here"
        
        if ($atlasUri) {
            Write-Host ""
            Write-Host "Updating configuration..." -ForegroundColor Yellow
            
            $configContent = @"
PORT=5000
MONGODB_URI=$atlasUri
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure_$(Get-Random)
JWT_EXPIRE=30d
NODE_ENV=development
"@
            Set-Content -Path "backend\config.env" -Value $configContent
            Write-Host "✓ Configuration updated!" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "Installing dependencies..." -ForegroundColor Yellow
            npm install --prefix . 2>&1 | Out-Null
            npm install --prefix backend 2>&1 | Out-Null
            npm install --prefix frontend 2>&1 | Out-Null
            Write-Host "✓ Dependencies installed!" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
            npm run seed --prefix backend
            
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "   SETUP COMPLETE!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Starting application..." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Frontend will open at: http://localhost:3000" -ForegroundColor Cyan
            Write-Host "Backend API running at: http://localhost:5000" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Default Login Credentials:" -ForegroundColor Yellow
            Write-Host "Admin - Email: admin@bookstore.com | Password: admin123" -ForegroundColor White
            Write-Host "User  - Email: user@bookstore.com  | Password: user123" -ForegroundColor White
            Write-Host ""
            Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Gray
            Write-Host ""
            
            npm start
        } else {
            Write-Host "No connection string provided. Exiting..." -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
        try {
            $mongoVersion = mongod --version 2>&1 | Select-String "db version"
            Write-Host "✓ MongoDB is installed: $mongoVersion" -ForegroundColor Green
        } catch {
            Write-Host "✗ MongoDB is not installed or not in PATH!" -ForegroundColor Red
            Write-Host "Please install MongoDB or choose option 3" -ForegroundColor Red
            pause
            exit
        }
        
        Write-Host ""
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install --prefix . 2>&1 | Out-Null
        npm install --prefix backend 2>&1 | Out-Null
        npm install --prefix frontend 2>&1 | Out-Null
        Write-Host "✓ Dependencies installed!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
        npm run seed --prefix backend
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   SETUP COMPLETE!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Starting application..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Frontend will open at: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Backend API running at: http://localhost:5000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Default Login Credentials:" -ForegroundColor Yellow
        Write-Host "Admin - Email: admin@bookstore.com | Password: admin123" -ForegroundColor White
        Write-Host "User  - Email: user@bookstore.com  | Password: user123" -ForegroundColor White
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Gray
        Write-Host ""
        
        npm start
    }
    
    "3" {
        Write-Host ""
        Write-Host "Opening MongoDB download page..." -ForegroundColor Yellow
        Start-Process "https://www.mongodb.com/try/download/community"
        Write-Host ""
        Write-Host "Installation Instructions:" -ForegroundColor Yellow
        Write-Host "1. Download MongoDB Community Server for Windows" -ForegroundColor White
        Write-Host "2. Run the installer" -ForegroundColor White
        Write-Host "3. Make sure 'Install MongoDB as a Service' is checked" -ForegroundColor White
        Write-Host "4. Complete the installation" -ForegroundColor White
        Write-Host "5. Run this script again and choose option 2" -ForegroundColor White
        Write-Host ""
        pause
    }
    
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
    }
}