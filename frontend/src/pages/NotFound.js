import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300">404</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Go Home
          </button>
          
          <button
            onClick={() => navigate('/books')}
            className="w-full btn-secondary flex items-center justify-center"
          >
            <FaSearch className="mr-2" />
            Browse Books
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <button
              onClick={() => navigate('/books')}
              className="text-blue-600 hover:text-blue-800"
            >
              Browse Books
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="text-blue-600 hover:text-blue-800"
            >
              Shopping Cart
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="text-blue-600 hover:text-blue-800"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-blue-600 hover:text-blue-800"
            >
              My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 