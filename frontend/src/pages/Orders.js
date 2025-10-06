import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { FaBox, FaCalendar, FaDollarSign, FaEye } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const Orders = () => {
  const navigate = useNavigate();

  // Fetch user orders
  const { data: ordersResponse, isLoading } = useQuery(
    ['orders'],
    () => ordersAPI.getMyOrders()
  );

  const orders = ordersResponse?.data?.data?.orders || [];

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaBox className="mx-auto h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate('/books')}
              className="btn-primary"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaCalendar className="mr-2" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaDollarSign className="mr-2" />
                      Total: {formatCurrency(order.total)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="btn-secondary flex items-center text-sm"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Items:</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center">
                        <img
                          src={item.book?.coverImage || '/placeholder-book.jpg'}
                          alt={item.book?.title || 'Deleted Book'}
                          className="w-12 h-16 object-cover rounded mr-3"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 text-sm">{item.book?.title || 'Deleted Book'}</h5>
                          <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-green-600 font-medium text-sm">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-gray-500 text-sm">
                        +{order.items.length - 3} more items
                      </p>
                    )}
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

export default Orders; 