const Book = require('../models/Book');
const Order = require('../models/Order');

// @desc    Add review to book
// @route   POST /api/reviews/:bookId
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has purchased this book
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      'items.book': bookId,
      status: { $in: ['Delivered', 'Shipped'] }
    });

    if (!hasPurchased) {
      return res.status(403).json({ 
        message: 'You can only review books you have purchased' 
      });
    }

    // Check if user already reviewed this book
    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    // Add review
    book.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Update average rating
    book.updateAverageRating();
    await book.save();

    // Populate the new review
    await book.populate('reviews.user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { 
        book: {
          id: book._id,
          title: book.title,
          ratings: book.ratings,
          reviews: book.reviews
        }
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:bookId
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find user's review
    const reviewIndex = book.reviews.findIndex(
      review => review.user.toString() === req.user.id
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update review
    book.reviews[reviewIndex].rating = rating;
    book.reviews[reviewIndex].comment = comment;
    book.reviews[reviewIndex].date = new Date();

    // Update average rating
    book.updateAverageRating();
    await book.save();

    // Populate reviews
    await book.populate('reviews.user', 'name avatar');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { 
        book: {
          id: book._id,
          title: book.title,
          ratings: book.ratings,
          reviews: book.reviews
        }
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:bookId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find user's review
    const reviewIndex = book.reviews.findIndex(
      review => review.user.toString() === req.user.id
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Remove review
    book.reviews.splice(reviewIndex, 1);

    // Update average rating
    book.updateAverageRating();
    await book.save();

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: { 
        book: {
          id: book._id,
          title: book.title,
          ratings: book.ratings,
          reviews: book.reviews
        }
      }
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
};

// @desc    Get book reviews
// @route   GET /api/reviews/:bookId
// @access  Public
const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if book exists
    const book = await Book.findById(bookId)
      .populate('reviews.user', 'name avatar')
      .select('reviews ratings');

    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Paginate reviews
    const totalReviews = book.reviews.length;
    const totalPages = Math.ceil(totalReviews / limit);
    const reviews = book.reviews
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        reviews,
        ratings: book.ratings,
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get book reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find({
      'reviews.user': req.user.id,
      isActive: true
    })
    .populate('reviews.user', 'name avatar')
    .select('title author coverImage reviews ratings')
    .skip(skip)
    .limit(limit);

    // Filter to only show user's reviews
    const userReviews = books.map(book => {
      const userReview = book.reviews.find(
        review => review.user._id.toString() === req.user.id
      );
      return {
        book: {
          id: book._id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
        },
        review: userReview
      };
    });

    const total = await Book.countDocuments({
      'reviews.user': req.user.id,
      isActive: true
    });
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        reviews: userReviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getBookReviews,
  getMyReviews
}; 