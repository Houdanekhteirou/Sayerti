import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './cartIconStyle.css'; // Assurez-vous d'avoir le bon chemin vers le fichier CSS

const CartIcon = ({ cartCount }) => {
  return (
    <div className="cart-icon">
      <FontAwesomeIcon icon={faShoppingCart} />
      {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
    </div>
  );
};

export default CartIcon;
