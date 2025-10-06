import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { booksAPI, usersAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const AdminBooks = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  // Fetch books
  const { data: booksData, isLoading } = useQuery(
    ['admin-books', searchTerm, selectedCategory, stockStatus],
    () => booksAPI.getBooks({ 
      search: searchTerm, 
      category: selectedCategory,
      stockStatus: stockStatus
    })
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    ['categories'],
    () => booksAPI.getCategories()
  );

  const booksList = booksData?.data?.data?.books || [];
  const categoriesList = categoriesData?.data?.data || [];

  // Delete book mutation
  const deleteBookMutation = useMutation(
    (bookId) => booksAPI.deleteBook(bookId),
    {
      onSuccess: () => {
        toast.success('Book deleted successfully');
        queryClient.invalidateQueries(['admin-books']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  );



  const handleDeleteBook = (bookId, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      deleteBookMutation.mutate(bookId);
    }
  };

  const handleEditBook = (bookId) => {
    navigate(`/admin/books/edit/${bookId}`);
  };

  const handleViewBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Books</h1>
              <p className="text-gray-600">Add, edit, and manage your book inventory</p>
            </div>
            <button
              onClick={() => navigate('/admin/books/add')}
              className="btn-primary flex items-center mt-4 md:mt-0"
            >
              <FaPlus className="mr-2" />
              Add New Book
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books by title, author, ISBN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categoriesList.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Stock Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock (≤10)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {booksList.length} book{booksList.length !== 1 ? 's' : ''} found
            </p>
            {(searchTerm || selectedCategory || stockStatus) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setStockStatus('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Books Grid/Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : booksList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSearch className="mx-auto h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No books found</h2>
            <p className="text-gray-600 mb-8">Try adjusting your search terms or add a new book</p>
            <button
              onClick={() => navigate('/admin/books/add')}
              className="btn btn-primary"
            >
              Add New Book
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-4">
              {booksList.map((book) => (
                <div key={book._id} className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                      <p className="text-sm text-gray-500 mb-2">{book.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(book.price)}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            book.stock > 10 ? 'bg-green-100 text-green-800' :
                            book.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Stock: {book.stock}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewBook(book._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Book"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEditBook(book._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Edit Book"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id, book.title)}
                            disabled={deleteBookMutation.isLoading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Book"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {booksList.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">{book.isbn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(book.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          book.stock > 10 ? 'bg-green-100 text-green-800' :
                          book.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {book.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {book.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewBook(book._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Book"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEditBook(book._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Book"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id, book.title)}
                            disabled={deleteBookMutation.isLoading}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Book"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBooks; 