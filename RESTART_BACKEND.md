# 🔄 RESTART BACKEND SERVER

## ⚠️ IMPORTANT: Backend Must Be Restarted

The backend code has been modified and needs to be restarted for changes to take effect.

---

## 🎯 **Quick Restart Instructions:**

### **Option 1: Using Terminal (Recommended)**

1. **Find the backend terminal window** (the one running `npm start` in the backend folder)

2. **Stop the server:**
   - Press `Ctrl + C` in that terminal

3. **Restart the server:**
   ```powershell
   npm start
   ```

---

### **Option 2: Kill and Restart**

If you can't find the terminal, use PowerShell:

```powershell
# Stop all node processes (WARNING: This stops ALL node processes)
Stop-Process -Name node -Force

# Start backend
cd c:\se17\bookstore-master\backend
npm start

# In a new terminal, start frontend
cd c:\se17\bookstore-master\frontend
npm start
```

---

## ✅ **Verify Backend is Running:**

After restart, check:

```powershell
curl http://localhost:5000/api/health
```

Should return: `{"success":true,"message":"API is running"}`

---

## 🎨 **Frontend Auto-Reload:**

The frontend (React) automatically reloads when files change, so you don't need to restart it manually. Just refresh your browser if needed.

---

## 🧪 **After Restart, Test:**

1. **Admin Dashboard:**
   - Login as admin: `admin@bookstore.com` / `admin123`
   - Go to Admin Dashboard
   - Check if stats are updating correctly

2. **Payment Methods:**
   - Login as user
   - Add books to cart
   - Go to checkout
   - Try selecting different payment methods
   - Verify form fields change based on selection

3. **Place Order:**
   - Select "Cash on Delivery"
   - Fill shipping info
   - Place order
   - Check order details page - should show payment method

4. **Admin Orders:**
   - Login as admin
   - Go to "Manage Orders"
   - Verify "Payment" column is visible
   - Check payment method and status are displayed

---

## 📝 **What Changed (Why Restart is Needed):**

### Backend Changes:
1. ✅ `backend/controllers/adminController.js` - Fixed revenue calculation
2. ✅ `backend/models/Order.js` - Added payment method options

### Frontend Changes (Auto-reload):
3. ✅ `frontend/src/pages/Checkout.js` - Payment method selection
4. ✅ `frontend/src/pages/OrderDetails.js` - Display payment method
5. ✅ `frontend/src/pages/AdminOrders.js` - Payment column

---

**After restarting backend, everything should work perfectly!** ✨