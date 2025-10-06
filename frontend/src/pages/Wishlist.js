import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { FaHeart, FaShoppingCart, FaTrash, FaEye } from 'react-icons/fa';
import BookCard from '../components/BookCard';

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  // Fetch wishlist
  const { data: wishlist = [], isLoading } = useQuery(
    ['wishlist'],
    () => wishlistAPI.getWishlist()
  );

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation(
    (bookId) => wishlistAPI.removeFromWishlist(bookId),
    {
      onSuccess: () => {
        toast.success('Removed from wishlist');
        queryClient.invalidateQueries(['wishlist']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
      }
    }
  );

  const handleRemoveFromWishlist = (bookId) => {
    removeFromWishlistMutation.mutate(bookId);
  };

  const handleAddToCart = (book) => {
    addToCart({ ...book, quantity: 1 });
    toast.success('Added to cart!');
  };

  const handleViewBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} book{wishlist.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaHeart className="mx-auto h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Add some books to your wishlist to see them here!</p>
            <button
              onClick={() => navigate('/books')}
              className="btn-primary"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Book Image */}
                <div className="relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleViewBook(book._id)}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                      title="View Details"
                    >
                      <FaEye className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(book._id)}
                      disabled={removeFromWishlistMutation.isLoading}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                      title="Remove from Wishlist"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-600">
                      ${book.price.toFixed(2)}
                    </span>
                    {book.discountPercentage > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ${(book.price / (1 - book.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      book.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(book)}
                      disabled={book.stock === 0}
                      className="flex-1 btn-primary flex items-center justify-center text-sm py-2"
                    >
                      <FaShoppingCart className="mr-1" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(book._id)}
                      disabled={removeFromWishlistMutation.isLoading}
                      className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 