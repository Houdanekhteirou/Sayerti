import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from './userStorageService';


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Effectuer la déconnexion
    signOut();

    // Rediriger vers la page de connexion avec un message de déconnexion réussie
    navigate('/products', { state: { message: 'You have been logged out successfully' } });
    window.location.reload();
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
