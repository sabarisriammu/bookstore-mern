import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { wishlistAPI } from '../services/api';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/currency';

const BookCard = memo(({ book }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(book._id, 1);
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    try {
      await wishlistAPI.addItem(book._id);
      toast.success('Added to wishlist!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(message);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          } text-sm`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <Link to={`/books/${book._id}`}>
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToWishlist}
            className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
            title="Add to wishlist"
          >
            <FaHeart className="text-gray-600 hover:text-red-500" />
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-white p-2 rounded-full shadow-md hover:bg-green-50 transition-colors"
            title="Add to cart"
          >
            <FaShoppingCart className="text-gray-600 hover:text-green-600" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {book.discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
              -{book.discount}%
            </span>
          )}
          {book.featured && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
          {book.bestseller && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Bestseller
            </span>
          )}
          {book.newRelease && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <Link to={`/books/${book._id}`} className="block">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2">
          by {book.author}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars(book.ratings?.average || 0)}
          </div>
          <span className="text-sm text-gray-600">
            ({book.ratings?.count || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {book.discount > 0 && book.originalPrice ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(book.originalPrice * (1 - book.discount / 100))}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(book.originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(book.price)}
              </span>
            )}
          </div>
          
          {/* Stock status */}
          <span className={`text-xs px-2 py-1 rounded ${
            book.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="flex-1 btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="btn btn-outline text-sm"
          >
            <FaHeart className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default BookCard;