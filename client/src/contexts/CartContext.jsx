import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const authHeaders = user ? { Authorization: `Bearer ${user.token}` } : {};

  const fetchCart = async () => {
    if (!user) return;
    const res = await axios.get('/api/cart', { headers: authHeaders, withCredentials: true });
    setItems(res.data?.data ?? []);
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) throw new Error('Not authenticated');
    await axios.post(
      '/api/cart',
      { productId: product.id, quantity },
      { headers: authHeaders, withCredentials: true }
    );
    await fetchCart();
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = { items, addToCart, fetchCart, cartCount };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
