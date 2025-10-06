const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUsers,
  updateUserRole
} = require('../controllers/userController');

const router = express.Router();

// Cart routes
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:bookId', protect, updateCartItem);
router.delete('/cart/:bookId', protect, removeFromCart);
router.delete('/cart', protect, clearCart);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:bookId', protect, removeFromWishlist);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router; 