# Testing Guide - Verify All Fixes

## Prerequisites
- Backend server running on port 5000
- Frontend server running on port 3000
- Admin account credentials ready
- Test user account with orders

## Quick Test Checklist

### 1. Admin Dashboard Stats ✓
**URL**: `http://localhost:3000/admin/dashboard`

**Test Steps**:
1. Login as admin
2. Navigate to admin dashboard
3. Verify all stats display correctly:
   - Total Users (should show actual count)
   - Total Books (should show actual count)
   - Total Orders (should show actual count)
   - Total Revenue (should show sum of delivered orders)
   - Login statistics (should show actual counts)

**Expected Result**: All numbers display correctly, no zeros unless actually zero

---

### 2. Admin Orders Page ✓
**URL**: `http://localhost:3000/admin/orders`

**Test Steps**:
1. Navigate to admin orders page
2. Check that page loads without errors
3. Verify all columns display:
   - Order ID
   - Customer (name and email)
   - Items (count and titles)
   - Total amount
   - Payment method and status
   - Order status
   - Date
4. Test status filter dropdown
5. Test search functionality
6. Click "View Details" on an order

**Expected Result**: 
- No console errors
- All data displays correctly
- Orders with deleted users show "Deleted User"
- Orders with deleted books show "Deleted Book"
- Status colors display correctly

---

### 3. Admin Order Details ✓
**URL**: `http://localhost:3000/admin/orders/:id`

**Test Steps**:
1. Click "View Details" on any order from admin orders page
2. Verify order details display correctly
3. Check customer information section (admin only)
4. Test status editing:
   - Click edit icon (pencil)
   - Change status in dropdown
   - Click Save
   - Verify status updates
5. Click "Back to Admin Orders"

**Expected Result**:
- Order details load correctly
- Customer info displays (or "Deleted User" if user deleted)
- Book info displays (or "Deleted Book" if book deleted)
- Status can be edited and saved
- Back button navigates to admin orders

---

### 4. User Orders Page ✓
**URL**: `http://localhost:3000/orders`

**Test Steps**:
1. Login as regular user
2. Navigate to "My Orders"
3. Verify orders display correctly
4. Check order items preview
5. Verify status badges show correct colors
6. Click "View Details" on an order

**Expected Result**:
- All orders display
- Book images and titles show correctly
- Status colors match order status
- No console errors

---

### 5. User Order Details ✓
**URL**: `http://localhost:3000/orders/:id`

**Test Steps**:
1. Click "View Details" on any order
2. Verify all sections display:
   - Order items with images
   - Shipping information
   - Payment information
   - Order summary
3. Check payment method displays correctly
4. Verify status badge shows correct color
5. Click "Back to Orders"

**Expected Result**:
- All order information displays correctly
- Payment method shows selected option
- No edit status button (user view)
- Back button navigates to user orders

---

### 6. Payment Method Selection ✓
**URL**: `http://localhost:3000/checkout`

**Test Steps**:
1. Add items to cart
2. Navigate to checkout
3. Fill in shipping information
4. Test each payment method:
   - **Cash on Delivery**: No additional fields required
   - **Credit Card**: Card number, expiry, CVV fields appear
   - **Debit Card**: Card number, expiry, CVV fields appear
   - **PayPal**: Redirect message appears
   - **UPI**: UPI ID field appears
   - **Net Banking**: Bank name field appears
5. Complete order with different payment methods
6. Verify payment method saves correctly

**Expected Result**:
- Payment method buttons are clickable
- Correct form fields appear for each method
- Validation works correctly
- Order saves with selected payment method

---

### 7. Status Color Consistency ✓

**Test Steps**:
1. Create orders with different statuses (or update existing ones)
2. Check status colors across all views:
   - Admin Dashboard (Recent Orders)
   - Admin Orders Page
   - Admin Order Details
   - User Orders Page
   - User Order Details

**Expected Status Colors**:
- **Pending**: Yellow background, yellow text
- **Processing**: Blue background, blue text
- **Shipped**: Purple background, purple text
- **Delivered**: Green background, green text
- **Cancelled**: Red background, red text
- **Refunded**: Purple background, purple text

**Expected Result**: Status colors are consistent across all views

---

## Edge Case Testing

### Test Deleted User Scenario
**Note**: This requires database manipulation

1. Create an order with a test user
2. Delete the user from database (or set user field to null)
3. View order in admin panel
4. Verify "Deleted User" displays instead of crashing

### Test Deleted Book Scenario
**Note**: This requires database manipulation

1. Create an order with a test book
2. Delete the book from database (or set book field to null)
3. View order in admin panel and user panel
4. Verify "Deleted Book" displays instead of crashing

---

## Browser Console Check

### No Errors Expected
Open browser console (F12) and check for:
- ❌ No "Cannot read properties of null" errors
- ❌ No "undefined is not an object" errors
- ❌ No React rendering errors
- ✅ Only informational logs (if any)

---

## Performance Check

### Page Load Times
All pages should load within:
- Admin Dashboard: < 2 seconds
- Admin Orders: < 2 seconds
- Order Details: < 1 second
- User Orders: < 1 second

### Auto-Refresh
Admin Dashboard should auto-refresh every 30 seconds:
1. Open admin dashboard
2. Wait 30 seconds
3. Check network tab for new API calls
4. Verify stats update if data changed

---

## API Response Check

### Using Browser DevTools Network Tab

1. Open Network tab (F12 → Network)
2. Navigate to admin orders page
3. Check API response for `/api/orders/admin/all`:
   ```json
   {
     "success": true,
     "data": {
       "orders": [
         {
           "_id": "...",
           "user": { "name": "...", "email": "..." },
           "items": [
             {
               "book": { "title": "...", "author": "...", "coverImage": "...", "price": ... },
               "quantity": ...,
               "price": ...
             }
           ],
           "status": "Pending",
           "paymentMethod": "Cash on Delivery",
           "total": ...
         }
       ]
     }
   }
   ```

4. Verify:
   - ✅ `user` object is populated
   - ✅ `items.book` objects are populated
   - ✅ Status is capitalized
   - ✅ Payment method is present

---

## Regression Testing

### Ensure No Breaking Changes

1. **User Registration**: Still works ✓
2. **User Login**: Still works ✓
3. **Browse Books**: Still works ✓
4. **Add to Cart**: Still works ✓
5. **Checkout**: Still works ✓
6. **Create Order**: Still works ✓
7. **View Orders**: Still works ✓
8. **Admin Login**: Still works ✓
9. **Admin Dashboard**: Still works ✓
10. **Manage Books**: Still works ✓
11. **Manage Users**: Still works ✓
12. **Manage Orders**: Still works ✓

---

## Test Results Template

```
Date: _______________
Tester: _______________

[ ] Admin Dashboard Stats - PASS/FAIL
[ ] Admin Orders Page - PASS/FAIL
[ ] Admin Order Details - PASS/FAIL
[ ] User Orders Page - PASS/FAIL
[ ] User Order Details - PASS/FAIL
[ ] Payment Method Selection - PASS/FAIL
[ ] Status Color Consistency - PASS/FAIL
[ ] Edge Cases (Deleted Data) - PASS/FAIL
[ ] No Console Errors - PASS/FAIL
[ ] Performance Check - PASS/FAIL
[ ] API Response Check - PASS/FAIL
[ ] Regression Testing - PASS/FAIL

Overall Status: PASS/FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## Troubleshooting

### If Admin Dashboard Shows Wrong Stats
1. Check backend console for debug logs
2. Verify orders exist in database
3. Check order statuses are capitalized ('Delivered' not 'delivered')
4. Clear browser cache and refresh

### If Orders Page Crashes
1. Check browser console for specific error
2. Verify backend is running
3. Check API responses in Network tab
4. Ensure book and user data is populated

### If Status Colors Don't Display
1. Check order status values in database
2. Verify status is capitalized
3. Clear browser cache
4. Check CSS classes are loading

### If Payment Method Doesn't Save
1. Check checkout form validation
2. Verify API request includes paymentMethod
3. Check Order model accepts the payment method value
4. Review backend logs for errors

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Admin dashboard shows correct stats
✅ Orders display correctly in all views
✅ Payment methods work correctly
✅ Status updates work correctly
✅ Graceful handling of deleted data
✅ No performance degradation

---

## Contact

If you encounter any issues during testing, please document:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser console errors
5. Network tab responses
6. Screenshots (if applicable)