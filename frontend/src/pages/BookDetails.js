import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { booksAPI, reviewsAPI, cartAPI, wishlistAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import ReactStars from 'react-rating-stars-component';
import { formatCurrency } from '../utils/currency';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  // Fetch book details
  const { data: bookResponse, isLoading, error } = useQuery(
    ['book', id],
    () => booksAPI.getBook(id),
    { enabled: !!id }
  );

  const book = bookResponse?.data?.data;

  // Fetch reviews
  const { data: reviewsResponse } = useQuery(
    ['reviews', id],
    () => reviewsAPI.getBookReviews(id),
    { enabled: !!id }
  );

  const reviews = reviewsResponse?.data?.data || [];

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation(
    () => wishlistAPI.addItem(id),
    {
      onSuccess: () => {
        toast.success('Added to wishlist!');
        queryClient.invalidateQueries(['user']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    }
  );

  // Add review mutation
  const addReviewMutation = useMutation(
    (reviewData) => reviewsAPI.addReview(id, reviewData),
    {
      onSuccess: () => {
        toast.success('Review added successfully!');
        setReviewText('');
        setRating(0);
        queryClient.invalidateQueries(['reviews', id]);
        queryClient.invalidateQueries(['book', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add review');
      }
    }
  );

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart({ ...book, quantity });
    toast.success('Added to cart!');
  };      

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    addToWishlistMutation.mutate();
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add reviews');
      return;
    }
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }
    addReviewMutation.mutate({ rating, text: reviewText });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Image */}
            <div className="md:w-1/3 p-6">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <ReactStars
                  count={5}
                  value={book.averageRating}
                  size={24}
                  activeColor="#ffd700"
                  edit={false}
                />
                <span className="ml-2 text-gray-600">
                  ({book.averageRating.toFixed(1)} / {book.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {formatCurrency(book.price)}
                </span>
                {book.discountPercentage > 0 && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formatCurrency(book.price / (1 - book.discountPercentage / 100))}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  book.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {book.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{book.description}</p>
              </div>

              {/* Actions */}
              {book.stock > 0 && (
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm font-medium text-gray-700">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded px-3 py-1"
                    >
                      {[...Array(Math.min(book.stock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="btn-primary flex items-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="btn-secondary flex items-center"
                >
                  <FaHeart className="mr-2" />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
          
          {/* Add Review Form */}
          {user && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Write a Review</h3>
              <form onSubmit={handleAddReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <ReactStars
                    count={5}
                    value={rating}
                    onChange={setRating}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your thoughts about this book..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={addReviewMutation.isLoading}
                  className="btn-primary"
                >
                  {addReviewMutation.isLoading ? 'Adding...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this book!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={16}
                        activeColor="#ffd700"
                        edit={false}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        by {review.user.fullName}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails; 