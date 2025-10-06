const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide book title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide author name'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide book description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please provide ISBN'],
    unique: true,
    match: [/^(?:\d{10}|\d{13})$/, 'Please provide a valid 10 or 13 digit ISBN']
  },
  price: {
    type: Number,
    required: [true, 'Please provide book price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide book category'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Mystery',
      'Romance',
      'Thriller',
      'Biography',
      'History',
      'Science',
      'Technology',
      'Self-Help',
      'Business',
      'Children',
      'Young Adult',
      'Poetry',
      'Drama',
      'Comics',
      'Cooking',
      'Travel',
      'Religion'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'English',
    enum: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean']
  },
  format: {
    type: String,
    default: 'Paperback',
    enum: ['Paperback', 'Hardcover', 'E-Book', 'Audiobook', 'Digital']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  publisher: {
    type: String,
    trim: true
  },
  publishDate: {
    type: Date
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide cover image URL']
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  newRelease: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
bookSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

// Update average rating when reviews change
bookSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
};

// Update timestamp on save
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', bookSchema); 