import axios from 'axios';
import { getUserId } from './components/pages/Account/userStorageService';
import { getToken } from './components/pages/Account/userStorageService';
const BASIC_URL = 'http://194.163.173.3:8888/';

export const addToCart = async (productId) => {
  const cartItem = {
    productId: productId,
    userId: getUserId(),
  };
  console.log(cartItem);

  const headers = {
    'Content-Type': 'application/json',
     Authorization: `Bearer ${getToken()}`,
  };

  try {
    const response = await fetch(`${BASIC_URL}api/customer/cart`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(cartItem),
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: { cartCount: await getCartItemCount() } });
    window.dispatchEvent(cartUpdatedEvent);

    // Déclencher l'événement personnalisé "budgetUpdated"
    const budgetUpdatedEvent = new CustomEvent('budgetUpdated', { detail: { budget: await getUpdatedBudget() } });
    window.dispatchEvent(budgetUpdatedEvent);

    return response;
  } catch (error) {
    console.error('There was an error adding the item to the cart:', error);
    return { ok: false, status: error.status, error: error.message };
  }
};

export const increaseCartItemQuantity = async (productId) => {
  const userId = getUserId();

  try {
    const response = await fetch(`${BASIC_URL}api/customer/addition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ productId, userId }),
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: { cartCount: await getCartItemCount() } });
    window.dispatchEvent(cartUpdatedEvent);

    // Déclencher l'événement personnalisé "budgetUpdated"
    const budgetUpdatedEvent = new CustomEvent('budgetUpdated', { detail: { budget: await getUpdatedBudget() } });
    window.dispatchEvent(budgetUpdatedEvent);

    return response;
  } catch (error) {
    console.error('There was an error updating the item quantity:', error);
    return { ok: false, status: error.status, error: error.message };
  }
};

export const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`${BASIC_URL}api/customer/cart/${userId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch cart items:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

export const getCartItemCount = async () => {
  const userId = getUserId();
  try {
    const response = await axios.get(`${BASIC_URL}api/customer/cart/${userId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (response.status === 200 && response.data.cartItems) {
      return response.data.cartItems.length;
    } else {
      console.error('Failed to fetch cart item count:', response.status);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching cart item count:', error);
    return 0;
  }
};

export const getUpdatedBudget = async () => {
  const userId = getUserId();
  try {
    // Logique pour obtenir la valeur mise à jour du budget
    const response = await axios.get(`${BASIC_URL}api/customer/budget/${userId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.budget;
  } catch (error) {
    console.error('Error fetching updated budget:', error);
    return null;
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    const response = await axios.delete(`${BASIC_URL}api/customer/items/${cartItemId}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    
    if (response.status === 200) {
      const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: { cartCount: await getCartItemCount() } });
      window.dispatchEvent(cartUpdatedEvent);

      // Déclencher l'événement personnalisé "budgetUpdated"
      const budgetUpdatedEvent = new CustomEvent('budgetUpdated', { detail: { budget: await getUpdatedBudget() } });
      window.dispatchEvent(budgetUpdatedEvent);

      return response;
    } else {
      console.error('Failed to remove cart item:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    return null;
  }
};
