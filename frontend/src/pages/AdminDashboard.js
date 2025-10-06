import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { booksAPI, adminAPI, usersAPI } from '../services/api';
import { FaUsers, FaBook, FaShoppingCart, FaDollarSign, FaChartLine, FaEye, FaSignInAlt, FaClock, FaSync } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dashboard stats with auto-refresh every 30 seconds
  const { data: stats, isLoading, refetch: refetchStats } = useQuery(
    ['admin-stats'],
    () => adminAPI.getStats(),
    {
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      refetchOnWindowFocus: true, // Refresh when window gains focus
      staleTime: 10000 // Consider data stale after 10 seconds
    }
  );

  // Fetch recent orders with auto-refresh
  const { data: recentOrdersResponse, refetch: refetchOrders } = useQuery(
    ['recent-orders'],
    () => adminAPI.getRecentOrders(),
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      staleTime: 10000
    }
  );

  // Fetch login statistics with auto-refresh
  const { data: loginStats, refetch: refetchLoginStats } = useQuery(
    ['login-stats'],
    () => adminAPI.getLoginStats(),
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      staleTime: 10000
    }
  );

  // Fetch low stock books with auto-refresh
  const { data: lowStockBooksResponse, refetch: refetchBooks } = useQuery(
    ['low-stock-books'],
    () => booksAPI.getLowStockBooks(),
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      staleTime: 10000
    }
  );

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        refetchOrders(),
        refetchLoginStats(),
        refetchBooks()
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Show animation for at least 500ms
    }
  };

  // Extract data safely with proper array handling
  const recentOrders = Array.isArray(recentOrdersResponse?.data)
    ? recentOrdersResponse.data
    : Array.isArray(recentOrdersResponse?.data?.data)
    ? recentOrdersResponse.data.data
    : [];

  const lowStockBooks = Array.isArray(lowStockBooksResponse?.data)
    ? lowStockBooksResponse.data
    : Array.isArray(lowStockBooksResponse?.data?.data)
    ? lowStockBooksResponse.data.data
    : [];

  // Debug logging
  console.log('AdminDashboard Debug:');
  console.log('recentOrdersResponse:', recentOrdersResponse);
  console.log('recentOrders:', recentOrders);
  console.log('recentOrders is array:', Array.isArray(recentOrders));

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of your bookstore • Auto-refreshes every 30 seconds</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`btn-primary flex items-center gap-2 ${isRefreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
            title="Refresh dashboard data"
          >
            <FaSync className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.data?.data?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaBook className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.data?.data?.totalBooks || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaShoppingCart className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.data?.data?.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaDollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.data?.data?.totalRevenue || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <FaSignInAlt className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logins</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.data?.data?.totalLoginCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaClock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Logins Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.data?.data?.loginsToday || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaChartLine className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Logins This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.data?.data?.loginsThisWeek || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All
              </button>
            </div>
            
            {!Array.isArray(recentOrders) || recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status?.toLowerCase() === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                      </span>
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Books */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Low Stock Books</h2>
              <button
                onClick={() => navigate('/admin/books')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Manage Books
              </button>
            </div>
            
            {!Array.isArray(lowStockBooks) || lowStockBooks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">All books are well stocked</p>
            ) : (
              <div className="space-y-4">
                {lowStockBooks.slice(0, 5).map((book) => (
                  <div key={book._id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{book.title}</p>
                      <p className="text-sm text-gray-600">Stock: {book.stock}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Active Users */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Most Active Users</h2>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All Users
              </button>
            </div>

            {!loginStats?.data?.mostActiveUsers || !Array.isArray(loginStats.data.mostActiveUsers) || loginStats.data.mostActiveUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No user login data available</p>
            ) : (
              <div className="space-y-4">
                {loginStats.data.mostActiveUsers.slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FaUsers className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{user.loginCount} logins</p>
                      <p className="text-xs text-gray-500">
                        Last: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/books/add')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <FaBook className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Add New Book</p>
            </button>
            
            <button
              onClick={() => navigate('/admin/books')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <FaBook className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Manage Books</p>
            </button>
            
            <button
              onClick={() => navigate('/admin/orders')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <FaShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">View Orders</p>
            </button>
            
            <button
              onClick={() => navigate('/admin/users')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <FaUsers className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Manage Users</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 