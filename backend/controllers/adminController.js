const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Debug: Check all order statuses
    const allOrders = await Order.find({}, 'status total');
    console.log('All orders:', allOrders.map(o => ({ status: o.status, total: o.total })));

    // Calculate total revenue (status is capitalized in the model)
    const revenueResult = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    console.log('Admin Stats:', { totalUsers, totalBooks, totalOrders, totalRevenue });

    // Get login statistics
    const totalLogins = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$loginCount' } } }
    ]);
    const totalLoginCount = totalLogins.length > 0 ? totalLogins[0].total : 0;

    // Get users who logged in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const loginsToday = await User.countDocuments({
      lastLogin: { $gte: today }
    });

    // Get users who logged in this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const loginsThisWeek = await User.countDocuments({
      lastLogin: { $gte: weekAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue,
        totalLoginCount,
        loginsToday,
        loginsThisWeek
      }
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get recent orders
// @route   GET /api/admin/orders/recent
// @access  Private/Admin
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.book', 'title author coverImage price')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error getting recent orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user login statistics
// @route   GET /api/admin/login-stats
// @access  Private/Admin
const getLoginStats = async (req, res) => {
  try {
    // Get users with their login information
    const users = await User.find()
      .select('name email loginCount lastLogin loginHistory createdAt')
      .sort({ loginCount: -1 })
      .limit(50);

    // Get login activity by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyLogins = await User.aggregate([
      { $unwind: '$loginHistory' },
      {
        $match: {
          'loginHistory.loginTime': { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$loginHistory.loginTime'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get most active users
    const mostActiveUsers = await User.find({ loginCount: { $gt: 0 } })
      .select('name email loginCount lastLogin')
      .sort({ loginCount: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        users,
        dailyLogins,
        mostActiveUsers
      }
    });
  } catch (error) {
    console.error('Error getting login stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getStats,
  getRecentOrders,
  getLoginStats
};
