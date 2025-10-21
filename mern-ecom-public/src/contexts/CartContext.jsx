import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Load from localStorage for guest users
      const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAmount": 0}');
      setCart(localCart);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1, price) => {
    setLoading(true);
    try {
      if (user) {
        // Authenticated user - use API
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_BASE_URL}/cart`, { productId, quantity, price }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.cart);
      } else {
        // Guest user - use localStorage
        const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAmount": 0}');
        const existingItem = localCart.items.find(item => item.productId === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          localCart.items.push({ productId, quantity, price });
        }

        localCart.totalAmount = localCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        localStorage.setItem('guestCart', JSON.stringify(localCart));
        setCart(localCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    try {
      if (user) {
        const token = localStorage.getItem('token');
        const res = await axios.put(`${API_BASE_URL}/cart`, { productId, quantity }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.cart);
      } else {
        const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAmount": 0}');
        const item = localCart.items.find(item => item.productId === productId);
        if (item) {
          item.quantity = quantity;
          localCart.totalAmount = localCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
          localStorage.setItem('guestCart', JSON.stringify(localCart));
          setCart(localCart);
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      if (user) {
        const token = localStorage.getItem('token');
        const res = await axios.delete(`${API_BASE_URL}/cart/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.cart);
      } else {
        const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAmount": 0}');
        localCart.items = localCart.items.filter(item => item.productId !== productId);
        localCart.totalAmount = localCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        localStorage.setItem('guestCart', JSON.stringify(localCart));
        setCart(localCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], totalAmount: 0 });
    if (user) {
      // API call to clear cart
    } else {
      localStorage.removeItem('guestCart');
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};