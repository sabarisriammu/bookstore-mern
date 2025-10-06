const express = require('express');
const { protect } = require('../middleware/auth');
const {
  addReview,
  updateReview,
  deleteReview,
  getBookReviews,
  getMyReviews
} = require('../controllers/reviewController');

const router = express.Router();

// Public routes
router.get('/:bookId', getBookReviews);

// Protected routes
router.post('/:bookId', protect, addReview);
router.put('/:bookId', protect, updateReview);
router.delete('/:bookId', protect, deleteReview);
router.get('/user/my-reviews', protect, getMyReviews);

module.exports = router; 