import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaBox, FaCalendar, FaDollarSign, FaEdit, FaSave } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  const isAdmin = user?.role === 'admin';
  const isAdminView = location.pathname.startsWith('/admin');

  // Fetch order details
  const { data: orderResponse, isLoading, error } = useQuery(
    ['order', id],
    () => ordersAPI.getById(id),
    { enabled: !!id }
  );

  const order = orderResponse?.data?.order;

  // Cancel order mutation
  const cancelOrderMutation = useMutation(
    () => ordersAPI.cancel(id),
    {
      onSuccess: () => {
        toast.success('Order cancelled successfully');
        queryClient.invalidateQueries(['orders']);
        queryClient.invalidateQueries(['order', id]);
        queryClient.invalidateQueries(['admin-orders']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  );

  // Update order status mutation (Admin only)
  const updateStatusMutation = useMutation(
    (status) => ordersAPI.updateStatus(id, { status }),
    {
      onSuccess: () => {
        toast.success('Order status updated successfully');
        queryClient.invalidateQueries(['order', id]);
        queryClient.invalidateQueries(['admin-orders']);
        queryClient.invalidateQueries(['admin-stats']);
        setIsEditingStatus(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update order status');
      }
    }
  );

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
    return status?.charAt(0).toUpperCase() + status?.slice(1);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate();
    }
  };

  const handleEditStatus = () => {
    setNewStatus(order?.status || '');
    setIsEditingStatus(true);
  };

  const handleSaveStatus = () => {
    if (newStatus && newStatus !== order?.status) {
      updateStatusMutation.mutate(newStatus);
    } else {
      setIsEditingStatus(false);
    }
  };

  const handleBackClick = () => {
    if (isAdminView) {
      navigate('/admin/orders');
    } else {
      navigate('/orders');
    }
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
          <button
            onClick={() => navigate('/orders')}
            className="btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
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
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            {isAdminView ? 'Back to Admin Orders' : 'Back to Orders'}
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Order #{order?._id?.slice(-8).toUpperCase() || 'N/A'}
              </h1>
              <p className="text-gray-600">
                Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              {isAdmin && order?.user && (
                <p className="text-gray-600 text-sm mt-1">
                  Customer: {order.user?.name || 'Deleted User'} ({order.user?.email || 'N/A'})
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              {isAdmin && isEditingStatus ? (
                <div className="flex items-center gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                  <button
                    onClick={handleSaveStatus}
                    disabled={updateStatusMutation.isLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaSave />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingStatus(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}>
                    {getStatusText(order?.status)}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={handleEditStatus}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Status"
                    >
                      <FaEdit size={20} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order?.items?.map((item, index) => (
                  <div key={index} className="flex items-center border-b border-gray-200 pb-4 last:border-b-0">
                    <img
                      src={item.book?.coverImage || '/placeholder-book.jpg'}
                      alt={item.book?.title || 'Deleted Book'}
                      className="w-16 h-20 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">{item.book?.title || 'Deleted Book'}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {item.book?.author || 'Unknown'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Quantity: {item.quantity}</span>
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-800">{order?.shippingAddress?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-800">{order?.shippingAddress?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-800">{order?.shippingAddress?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <p className="text-gray-800">{order?.shippingAddress?.country || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-800">{order?.shippingAddress?.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <p className="text-gray-800">{order?.shippingAddress?.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <p className="text-gray-800">{order?.shippingAddress?.state || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <p className="text-gray-800">{order?.shippingAddress?.zipCode || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <FaCreditCard className="text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order?.paymentMethod || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${
                    order?.paymentStatus === 'Paid' ? 'text-green-600' :
                    order?.paymentStatus === 'Failed' ? 'text-red-600' :
                    order?.paymentStatus === 'Refunded' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`}>
                    {order?.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">{formatCurrency(order?.tax || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order?.shipping === 0 ? 'Free' : formatCurrency(order?.shipping || 0)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(order?.total || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              {order?.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelOrderMutation.isLoading}
                  className="w-full btn-secondary mb-3"
                >
                  {cancelOrderMutation.isLoading ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}

              <button
                onClick={() => navigate('/books')}
                className="w-full btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 