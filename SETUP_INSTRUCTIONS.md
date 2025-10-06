# Bookstore Setup Instructions

## Quick Start Guide

### Option 1: Use MongoDB Atlas (Recommended - Free Cloud Database)

1. **Create a free MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account
   - Create a free cluster (M0 Sandbox - FREE)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/bookstore`)

2. **Update the backend config:**
   - Open `backend\config.env`
   - Replace the `MONGODB_URI` line with your Atlas connection string
   - Example: `MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/bookstore`

3. **Install dependencies and run:**
   ```powershell
   # From the project root (c:\se17\bookstore-master)
   npm run seed          # Seed the database with sample data
   npm start             # Start both backend and frontend
   ```

### Option 2: Install MongoDB Locally

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Select: Windows x64, MSI package
   - Download and install
   - During installation, select "Install MongoDB as a Service"

2. **Verify MongoDB is running:**
   ```powershell
   mongod --version
   ```

3. **Install dependencies and run:**
   ```powershell
   # From the project root (c:\se17\bookstore-master)
   npm run seed          # Seed the database with sample data
   npm start             # Start both backend and frontend
   ```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Default Test Accounts (after seeding)

### Admin Account
- Email: admin@bookstore.com
- Password: admin123

### User Account
- Email: user@bookstore.com
- Password: user123

## Features Available

✅ User Registration & Login
✅ Browse Books (with categories, search, filters)
✅ Shopping Cart
✅ Place Orders
✅ View Order History
✅ Admin Dashboard
✅ Admin: View All Orders
✅ Admin: Manage Books & Users
✅ Role-Based Access Control

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running (if using local installation)
- Check your connection string in `backend\config.env`
- For Atlas: Make sure your IP is whitelisted (or use 0.0.0.0/0 for testing)

### Port Already in Use
- Backend (5000): Change `PORT` in `backend\config.env`
- Frontend (3000): It will prompt you to use another port

### Dependencies Issues
```powershell
# Reinstall all dependencies
npm run install-all
```