import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaGift } from 'react-icons/fa';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 px-4 relative">
      <div className="container-custom">
        <div className="flex items-center justify-center text-center">
          <FaGift className="mr-2 text-yellow-300" />
          <span className="text-sm font-medium">
            🎉 Special Offer: Free shipping on orders over $50! Use code: 
            <span className="font-bold ml-1 bg-yellow-300 text-primary-800 px-2 py-1 rounded text-xs">
              FREESHIP50
            </span>
          </span>
          <Link 
            to="/books" 
            className="ml-4 text-yellow-300 hover:text-yellow-100 text-sm font-semibold underline"
          >
            Shop Now
          </Link>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-300 transition-colors"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  );
};

export default PromoBanner;
