import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        loading: false,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: response.data.data.cart });
    } catch (error) {
      console.error('Failed to load cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  }, [isAuthenticated]);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadCart();
    } else if (!isAuthenticated && !authLoading) {
      // Clear cart when user is not authenticated
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, authLoading, loadCart]);

  const addToCart = async (bookId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await cartAPI.addItem(bookId, quantity);
      dispatch({ type: 'ADD_ITEM', payload: response.data.data.cart });
      toast.success('Item added to cart!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const updateCartItem = async (bookId, quantity) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await cartAPI.updateItem(bookId, quantity);
      dispatch({ type: 'UPDATE_ITEM', payload: response.data.data.cart });
      toast.success('Cart updated!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const removeFromCart = async (bookId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await cartAPI.removeItem(bookId);
      dispatch({ type: 'REMOVE_ITEM', payload: response.data.data.cart });
      toast.success('Item removed from cart!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartAPI.clear();
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  // Calculate cart totals
  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.book.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  };

  const getCartItem = (bookId) => {
    return state.items.find(item => item.book._id === bookId);
  };

  const value = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getCartTotal,
    getCartItemCount,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 