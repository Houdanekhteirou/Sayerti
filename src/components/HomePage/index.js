import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ProductCard from './ProductCard';

const HomePage = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://194.163.173.3:8888/api/admin/ouvert/products');
        setFeaturedProducts(response.data.slice(0, 6)); // Limiter à 6 produits
      } catch (error) {
        console.error('Erreur lors de la récupération des produits vedettes :', error);
        setError(t('error_loading_products'));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [t]);

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col className="text-center">
          <h1>{t('welcome_to_our_store')}</h1>
          <p>{t('welcome_message')}</p>
          <Button as={Link} to="/products" variant="primary">{t('shop_now')}</Button>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Ajoutez ici le code pour afficher les produits vedettes */}
    </Container>
  );
};

export default HomePage;
