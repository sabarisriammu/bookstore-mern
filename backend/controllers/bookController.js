const Book = require('../models/Book');

// @desc    Get all books with filtering and pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' };
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.format) {
      filter.format = req.query.format;
    }
    
    if (req.query.language) {
      filter.language = req.query.language;
    }
    
    // Stock filter (for admin)
    if (req.query.stockStatus) {
      if (req.query.stockStatus === 'in-stock') {
        filter.stock = { $gt: 0 };
      } else if (req.query.stockStatus === 'out-of-stock') {
        filter.stock = 0;
      } else if (req.query.stockStatus === 'low-stock') {
        filter.stock = { $lte: 10, $gt: 0 };
      }
    }
    
    // Featured, bestseller, new release filters
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    if (req.query.bestseller === 'true') {
      filter.bestseller = true;
    }
    if (req.query.newRelease === 'true') {
      filter.newRelease = true;
    }
    
    // Rating filter
    if (req.query.minRating) {
      filter['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
    }

    // Build sort object
    let sort = { createdAt: -1 };
    const sortParam = req.query.sortBy || req.query.sort;
    
    if (sortParam) {
      // Handle new format (sortBy with - prefix for descending)
      if (sortParam.startsWith('-')) {
        const field = sortParam.substring(1);
        sort = { [field]: -1 };
      } else {
        sort = { [sortParam]: 1 };
      }
    } else if (req.query.sort) {
      // Handle legacy format for backward compatibility
      switch (req.query.sort) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { 'ratings.average': -1 };
          break;
        case 'title':
          sort = { title: 1 };
          break;
        case 'author':
          sort = { author: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    // Search functionality - use regex for more flexible searching
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { isbn: searchRegex }
      ];
    }

    const books = await Book.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('reviews.user', 'name avatar');

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .populate('createdBy', 'name');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      success: true,
      data: { book }
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
};

// @desc    Create new book (Admin only)
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      createdBy: req.user.id
    };

    const book = await Book.create(bookData);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book }
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Error creating book' });
  }
};

// @desc    Update book (Admin only)
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: { book }
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
};

// @desc    Delete book (Admin only)
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Soft delete - set isActive to false
    book.isActive = false;
    await book.save();

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
};

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({
      featured: true
    })
    .limit(8)
    .populate('reviews.user', 'name avatar');

    res.json({
      success: true,
      data: { books }
    });
  } catch (error) {
    console.error('Get featured books error:', error);
    res.status(500).json({ message: 'Error fetching featured books' });
  }
};

// @desc    Get bestseller books
// @route   GET /api/books/bestsellers
// @access  Public
const getBestsellerBooks = async (req, res) => {
  try {
    const books = await Book.find({
      bestseller: true
    })
    .limit(8)
    .populate('reviews.user', 'name avatar');

    res.json({
      success: true,
      data: { books }
    });
  } catch (error) {
    console.error('Get bestseller books error:', error);
    res.status(500).json({ message: 'Error fetching bestseller books' });
  }
};

// @desc    Get new releases
// @route   GET /api/books/new-releases
// @access  Public
const getNewReleases = async (req, res) => {
  try {
    const books = await Book.find({
      newRelease: true
    })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('reviews.user', 'name avatar');

    res.json({
      success: true,
      data: { books }
    });
  } catch (error) {
    console.error('Get new releases error:', error);
    res.status(500).json({ message: 'Error fetching new releases' });
  }
};

// @desc    Get book categories
// @route   GET /api/books/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// @desc    Get all unique authors
// @route   GET /api/books/authors
// @access  Public
const getAuthors = async (req, res) => {
  try {
    const authors = await Book.distinct('author', { isActive: true });
    const sortedAuthors = authors.sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      data: { authors: sortedAuthors }
    });
  } catch (error) {
    console.error('Get authors error:', error);
    res.status(500).json({ message: 'Error fetching authors' });
  }
};

// @desc    Get filter statistics
// @route   GET /api/books/filter-stats
// @access  Public
const getFilterStats = async (req, res) => {
  try {
    const [categoryStats, formatStats, languageStats, priceStats] = await Promise.all([
      // Category counts
      Book.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // Format counts
      Book.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$format', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // Language counts
      Book.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$language', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // Price range stats
      Book.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            avgPrice: { $avg: '$price' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        categories: categoryStats,
        formats: formatStats,
        languages: languageStats,
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 100, avgPrice: 0 }
      }
    });
  } catch (error) {
    console.error('Get filter stats error:', error);
    res.status(500).json({ message: 'Error fetching filter statistics' });
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
const searchBooks = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Use regex for flexible searching
    const searchRegex = new RegExp(q, 'i');
    const filter = {
      isActive: true,
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { isbn: searchRegex }
      ]
    };

    const books = await Book.find(filter)
      .sort({ title: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews.user', 'name avatar');

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBooks: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ message: 'Error searching books' });
  }
};

// @desc    Get low stock books
// @route   GET /api/books/low-stock
// @access  Private/Admin
const getLowStockBooks = async (req, res) => {
  try {
    const books = await Book.find({ stock: { $lte: 10 } })
      .sort({ stock: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
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
};