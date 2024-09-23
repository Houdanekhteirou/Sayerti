import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../pages/Account/userStorageService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './productStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheckCircle, faHeart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { addToCart, getCartItems } from '../../cartService';
import { addToWishlist } from '../../wishlistService';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './style.css';

const ProductCard = ({ deal, updateCart, cartItems }) => {
  const { t, i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');
  const navigate = useNavigate();
  const user = getUser();
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }

    const cartItem = cartItems.find(item => item.productId === deal.id);
    if (cartItem) {
      setCartQuantity(cartItem.quantity);
    }
  }, [i18n.language, deal.id, cartItems]);

  const handleAddToCart = async () => {
    if (user) {
      const response = await addToCart(deal.id);
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: t('added_to_cart'),
          text: t('added_successfully'),
        });
        updateCart();
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: t('error_title'),
          text: t('product_already_in_cart_with_quantity', { quantity: cartQuantity }),
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('error_title'),
          text: response.error || t('error_message'),
        });
      }
    } else {
      navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    }
  };

  const handleIncreaseQuantity = async () => {
    if (user) {
      try {
        const response = await axios.post('http://localhost:8080/api/customer/addition', {
          productId: deal.id,
          userId: user.userId
        });
        if (response.status === 200) {
          
        
          updateCart();
        } else {
        
          updateCart();
        }
      } catch (error) {
      
      }
    }
  };

  const handleRemoveFromCart = async () => {
    if (user) {
      try {
        const response = await axios.post('http://localhost:8080/api/customer/deduction', {
          productId: deal.id,
          userId: user.userId
        });
        if (response.status === 200) {
         
          updateCart();
        } else {
         
          updateCart();
        }
      } catch (error) {
       
      }
    }
  };

  const handleAddToWishlist = async () => {
    if (user) {
      try {
        const response = await addToWishlist(deal.id);
        Swal.fire({
          icon: 'success',
          text: t('added_to_wishlist_message'),
        });
        setAddedToWishlist(true);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          text: t('errorrr_message'),
        });
        console.error('Error adding to wishlist:', error);
      }
    } else {
      navigate('/SigIn', { state: { message: t('login_redirect_message') } });
    }
  };

  const currencySymbol = i18n.language === 'fr' ? 'MRU' : i18n.language === 'ar' ? 'أوقية' : '$';
    
  return (
    <div className="card product-card mb-4 shadow-sm" style={{ direction: direction }}>
      <h5 className="card-header text-center">{deal.name}  {deal.taille} </h5>
      <div className="card-body text-center">
        <img 
          src={`data:image/png;base64,${deal.byteimg}`} 
          alt={deal.name} 
          className="card-img-top img-fluid product-image"
          style={{ direction: direction === 'rtl' ? 'rtl' : 'ltr', width: '70%', height: 'auto', maxHeight: '150px' }} 
        />
        <h5 className="card-title mt-3">
          {deal.price.toFixed(2)} {currencySymbol} 
        </h5>
        {cartQuantity > 0 ? (
          <div className="text-success mb-2">
                <button
              className=""
            
              onClick={handleIncreaseQuantity}
            >
          
        
              <FontAwesomeIcon icon={faPlus} />
            </button>
            {cartQuantity}
            <button
              className="  "
             
              onClick={handleRemoveFromCart}
              disabled={cartQuantity === 1}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        ) : (
          <button
            className="button-custom btn mt-3 me-3"
            style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: '1.2rem', height: '50px', backgroundColor: 'rgb(134, 245, 130)' }}
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        )}
        {addedToWishlist ? (
          <div className="text-danger mb-2">
            <FontAwesomeIcon icon={faCheckCircle} /> 
          </div>
        ) : (
          <button
            className="btn btn-danger mt-3"
            style={{ fontFamily: "'Open Sans Condensed', sans-serif", fontSize: '1.2rem', height: '50px' }}
            onClick={handleAddToWishlist}
          >
            <FontAwesomeIcon icon={faHeart} /> 
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
