import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { FaSearch, FaFilter, FaTimes, FaStar } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filterType, setFilterType] = useState({
    featured: false,
    bestseller: false,
    newRelease: false
  });

  // Fetch books with filters
  const { data: booksData, isLoading } = useQuery(
    ['books', searchTerm, selectedCategory, selectedAuthor, selectedFormat, selectedLanguage, sortBy, priceRange, minRating, filterType],
    () => {
      const params = {
        search: searchTerm,
        category: selectedCategory,
        author: selectedAuthor,
        format: selectedFormat,
        language: selectedLanguage,
        sortBy,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        minRating
      };
      
      // Only add boolean filters if they're true
      if (filterType.featured) params.featured = 'true';
      if (filterType.bestseller) params.bestseller = 'true';
      if (filterType.newRelease) params.newRelease = 'true';
      
      return booksAPI.getBooks(params);
    }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    ['categories'],
    () => booksAPI.getCategories()
  );

  // Fetch authors
  const { data: authorsData } = useQuery(
    ['authors'],
    () => booksAPI.getAuthors()
  );

  // Fetch filter stats
  const { data: filterStatsData } = useQuery(
    ['filter-stats'],
    () => booksAPI.getFilterStats()
  );

  const categories = categoriesData?.data?.categories || [];
  const authors = authorsData?.data?.authors || [];
  const filterStats = filterStatsData?.data || {};

  const books = booksData?.data?.books || [];
  const totalBooks = booksData?.data?.pagination?.totalBooks || 0;

  const formats = ['Paperback', 'Hardcover', 'E-Book', 'Audiobook', 'Digital'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled automatically by react-query
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedAuthor('');
    setSelectedFormat('');
    setSelectedLanguage('');
    setSortBy('title');
    setPriceRange({ min: '', max: '' });
    setMinRating('');
    setFilterType({ featured: false, bestseller: false, newRelease: false });
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    selectedAuthor,
    selectedFormat,
    selectedLanguage,
    priceRange.min,
    priceRange.max,
    minRating,
    filterType.featured,
    filterType.bestseller,
    filterType.newRelease
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Books</h1>
          <p className="text-gray-600">Discover your next favorite read from our collection</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books by title, author, ISBN, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFiltersCount > 0 && (
              <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaFilter className="text-blue-600" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FaTimes />
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Quick Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Filters</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterType.featured}
                        onChange={(e) => setFilterType(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Featured Books</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterType.bestseller}
                        onChange={(e) => setFilterType(prev => ({ ...prev, bestseller: e.target.checked }))}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Bestsellers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterType.newRelease}
                        onChange={(e) => setFilterType(prev => ({ ...prev, newRelease: e.target.checked }))}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">New Releases</span>
                    </label>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author
                  </label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Authors</option>
                    {authors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Formats</option>
                    {formats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Languages</option>
                    {languages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      placeholder="Min ₹"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      placeholder="Max ₹"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {filterStats.priceRange && (
                    <p className="text-xs text-gray-500 mt-1">
                      Range: {formatCurrency(filterStats.priceRange.minPrice)} - {formatCurrency(filterStats.priceRange.maxPrice)}
                    </p>
                  )}
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">{totalBooks}</span> book{totalBooks !== 1 ? 's' : ''} found
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="title">Title A-Z</option>
                    <option value="-title">Title Z-A</option>
                    <option value="price">Price Low to High</option>
                    <option value="-price">Price High to Low</option>
                    <option value="-ratings.average">Highest Rated</option>
                    <option value="-createdAt">Newest First</option>
                    <option value="author">Author A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : books.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FaSearch className="mx-auto h-16 w-16" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
