import axios from 'axios';
import { getUserId } from './components/pages/Account/userStorageService';
import { getToken } from './components/pages/Account/userStorageService';
const BASIC_URL = 'http://194.163.173.3:8888/';

export const addToWishlist = async (productId) => {
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
    const response = await fetch(`${BASIC_URL}api/customer/wishlist`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(cartItem),
    });

    if (!response.ok) {
      throw new Error('Failed to add to wishlist');
    }

    const data = await response.json();
    console.log('Success:', data);

    const cartUpdatedEvent = new CustomEvent('wishlistUpdated', { detail: { wishlistCount: await fetchWishlistData() } });
    window.dispatchEvent(cartUpdatedEvent);
    return data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};



const fetchWishlistData = async () => {
  try {
    const userId = getUserId();
    const response = await axios.get(
      `http://194.163.173.3:8888/api/customer/wishlist/${userId}`
    );
    if (response.status === 200 && response.data) {
      return response.data.length;
    } else {
      console.error('Failed to fetch cart item count:', response.status);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching cart item count:', error);
    return 0;
  }
};