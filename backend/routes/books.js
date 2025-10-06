const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
  getBestsellerBooks,
  getNewReleases,
  getCategories,
  getAuthors,
  getFilterStats,
  searchBooks,
  getLowStockBooks
} = require('../controllers/bookController');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/bestsellers', getBestsellerBooks);
router.get('/new-releases', getNewReleases);
router.get('/categories', getCategories);
router.get('/authors', getAuthors);
router.get('/filter-stats', getFilterStats);
router.get('/search', searchBooks);

// Protected routes (Admin only) - Place specific routes before generic /:id route
router.get('/low-stock', protect, authorize('admin'), getLowStockBooks);
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

// Generic route - must be last
router.get('/:id', getBook);

module.exports = router; 