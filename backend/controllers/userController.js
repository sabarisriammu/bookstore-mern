const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.book', 'title author price coverImage stock');

    res.json({
      success: true,
      data: { cart: user.cart }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/users/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    // Check if book exists and is active
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check stock availability
    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if book already in cart
    const existingItem = user.cart.find(item => item.book.toString() === bookId);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      if (existingItem.quantity > book.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    } else {
      // Add new item
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();

    // Populate cart items
    await user.populate('cart.book', 'title author price coverImage stock');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cart: user.cart }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/users/cart/:bookId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check book stock
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(item => item.book.toString() === bookId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    await user.populate('cart.book', 'title author price coverImage stock');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: { cart: user.cart }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:bookId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.book.toString() !== bookId);
    await user.save();

    await user.populate('cart.book', 'title author price coverImage stock');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: { cart: user.cart }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/users/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { cart: [] }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'title author price coverImage ratings');

    res.json({
      success: true,
      data: { wishlist: user.wishlist }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// @desc    Add book to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Check if book exists and is active
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already in wishlist
    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }

    user.wishlist.push(bookId);
    await user.save();

    await user.populate('wishlist', 'title author price coverImage ratings');

    res.json({
      success: true,
      message: 'Book added to wishlist successfully',
      data: { wishlist: user.wishlist }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Error adding book to wishlist' });
  }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/users/wishlist/:bookId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
    await user.save();

    await user.populate('wishlist', 'title author price coverImage ratings');

    res.json({
      success: true,
      message: 'Book removed from wishlist successfully',
      data: { wishlist: user.wishlist }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Error removing book from wishlist' });
  } 
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

module.exports = {
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
}; 