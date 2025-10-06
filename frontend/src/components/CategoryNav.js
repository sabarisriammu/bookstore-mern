import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaRocket, FaHeart, FaSearch, FaChild, FaGraduationCap, FaBriefcase, FaUtensils } from 'react-icons/fa';

const CategoryNav = () => {
  const categories = [
    { name: 'Fiction', icon: FaBook, color: 'text-blue-600' },
    { name: 'Science Fiction', icon: FaRocket, color: 'text-purple-600' },
    { name: 'Romance', icon: FaHeart, color: 'text-pink-600' },
    { name: 'Mystery', icon: FaSearch, color: 'text-gray-600' },
    { name: 'Children', icon: FaChild, color: 'text-green-600' },
    { name: 'Young Adult', icon: FaGraduationCap, color: 'text-indigo-600' },
    { name: 'Business', icon: FaBriefcase, color: 'text-yellow-600' },
    { name: 'Cooking', icon: FaUtensils, color: 'text-red-600' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Shop by Category:
            </span>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/books?category=${encodeURIComponent(category.name)}`}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap"
                >
                  <IconComponent className={`text-sm ${category.color}`} />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
          <Link
            to="/books"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
