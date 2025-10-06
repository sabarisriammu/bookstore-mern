# ⚡ START THE BOOKSTORE NOW!

## 🎯 You have 2 options:

---

### Option 1: Use MongoDB Atlas (FREE - 2 minutes setup)

**I'll guide you step by step:**

1. **Open this link in your browser:**
   ```
   https://www.mongodb.com/cloud/atlas/register
   ```

2. **Sign up** (use Google/GitHub for faster signup)

3. **Create a FREE cluster:**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Click "Create Deployment"
   - **IMPORTANT:** Save the username and password shown!

4. **Get your connection string:**
   - Click "Connect"
   - Click "Drivers"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add `bookstore` at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookstore`

5. **Update the config:**
   - Open `backend\config.env` in this project
   - Replace the `MONGODB_URI=` line with your connection string

6. **Run these commands in PowerShell:**
   ```powershell
   cd c:\se17\bookstore-master
   npm run seed
   npm start
   ```

**Done! The app will open at http://localhost:3000**

---

### Option 2: Quick PowerShell Script (Automated)

**Just run this command:**
```powershell
cd c:\se17\bookstore-master
.\quick-start.ps1
```

The script will guide you through everything!

---

## 🔐 Login Credentials (after seeding)

### Admin Account
```
Email: admin@bookstore.com
Password: admin123
```

### User Account
```
Email: user@bookstore.com
Password: user123
```

---

## ❓ What if I already have MongoDB installed locally?

If MongoDB is already running on your computer:

```powershell
cd c:\se17\bookstore-master
npm run seed
npm start
```

That's it! The default config already points to `mongodb://localhost:27017/bookstore`

---

## 🚨 Common Issues

### "Cannot connect to MongoDB"
- **Atlas:** Make sure you replaced `<password>` with your actual password
- **Atlas:** Check if your IP is whitelisted (in Atlas, go to Network Access)
- **Local:** Make sure MongoDB service is running

### "Port 3000 is already in use"
- React will ask if you want to use another port - type `y` and press Enter

### "Port 5000 is already in use"
- Open `backend\config.env` and change `PORT=5000` to `PORT=5001`

---

## 🎉 What You'll See

Once running:
- **Frontend:** http://localhost:3000 (the website)
- **Backend:** http://localhost:5000 (the API)

The website will have:
- 📚 50+ books to browse
- 🛒 Shopping cart
- 💳 Checkout system
- 📦 Order history
- 👑 Admin dashboard (login as admin)
- 🔒 Secure authentication

---

## 💡 Pro Tip

Use **MongoDB Atlas** (Option 1) - it's:
- ✅ Free forever (512MB)
- ✅ No installation needed
- ✅ Works from anywhere
- ✅ Automatic backups
- ✅ Cloud-hosted

---

**Need help? The setup takes less than 2 minutes with Atlas!**