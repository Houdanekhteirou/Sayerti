// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { getUserId, getlang } from '../pages/Account/userStorageService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const userId = getUserId();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const lang = getlang();
      const response = await axios.get(
        `http://192.168.100.190:8080/api/customer/cart/${userId}`, { params: { lang } }
      );
      if (response.data && response.data.cartItems) {
        setCartCount(response.data.cartItems.length);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, fetchCartData }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
