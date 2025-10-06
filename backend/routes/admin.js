const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getStats, getRecentOrders, getLoginStats } = require('../controllers/adminController');

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// Admin stats
router.get('/stats', getStats);
router.get('/orders/recent', getRecentOrders);
router.get('/login-stats', getLoginStats);

module.exports = router;
