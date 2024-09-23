import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import './C.css';
import { getUserId , getToken } from './components/pages/Account/userStorageService';

const Wishlist = ({ updateWishlistCount }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [direction, setDirection] = useState('ltr');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const itemsPerPage = 3;
  const userId = getUserId();

  useEffect(() => {
    setDirection(i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const response = await axios.get(`http://194.163.173.3:8888/api/customer/wishlist/${userId}`, {
          params: { lang: i18n.language } ,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setWishlist(response.data);
        updateWishlistCount(response.data.length);
      } catch (error) {
        
        setErrorMessage(t(''));
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [userId, updateWishlistCount, i18n.language]);

 const handleRemoveFromWishlist = async (itemId) => {
  try {
    await axios.delete(`http://194.163.173.3:8888/api/customer/wishlist/${itemId}`, {
      params: { lang: i18n.language }, headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const updatedWishlist = wishlist.filter(item => item.id !== itemId);
    setWishlist(updatedWishlist);
    updateWishlistCount(updatedWishlist.length);
    setSuccessMessage(t('alerts.item_removed_from_wishlist'));
    setErrorMessage(''); // Clear any previous error messages

    // Trigger custom event "budgetUpdated"
    const budgetUpdatedEvent = new CustomEvent('budgetUpdated', { detail: { budget: 'new budget value' } });
    window.dispatchEvent(budgetUpdatedEvent);

  } catch (error) {
    console.error();
    setErrorMessage(t(''));
    setSuccessMessage(''); // Clear any previous success messages
  }
};

  const handleTransferAllToCart = async () => {
    try {
      await Promise.all(wishlist.map(item =>
        axios.post(`http://194.163.173.3:8888/api/customer/cart`, {
          userId,
          productId: item.productId,
          quantity: 1
        }),{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      ));
      setSuccessMessage(t('alerts.all_items_transferred_to_cart'));
      setErrorMessage(''); // Clear any previous error messages

      // Trigger custom event "budgetUpdated"
      const budgetUpdatedEvent = new CustomEvent('budgetUpdated', { detail: { budget: 'new budget value' } });
      window.dispatchEvent(budgetUpdatedEvent);

      // Show success message for 2 seconds before reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (success) {
      console.log('alerts.all_items_transferred_to_cart');
      setSuccessMessage(t('alerts.all_items_transferred_to_cart'));
    }
  };

  if (!userId) {
    navigate('/SigIn', { state: { message: t('alerts.login_redirect_message') } });
    return null;
  }

  if (loading) {
    return <div className="text-center"><Spinner animation="border" role="status"><span className="sr-only">{t('loading')}</span></Spinner></div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container style={{ direction: direction }}>
      <Row>
        <Col>
          <h2 className="text-center">{t('wishlist.title')}</h2>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {wishlist.length === 0 && !loading && !successMessage && !errorMessage && (
            <div className="text-center" dir={direction}>
              {t('wishlist.empty_message')}
              <br />
              <Button as={Link} to="/products" variant="primary">{t('wishlist.shop_now')}</Button>
            </div>
          )}
          <Row className="justify-content-center">
            {currentItems.map((item) => (
              <Col md={4} key={item.productId} className="mb-4">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={`data:image/jpeg;base64,${item.returnedImg}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{item.productName}</Card.Title>
                    <Card.Text>
                      <strong>{t('wishlist.price')}:</strong> {item.price}
                    </Card.Text>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-auto"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> {t('wishlist.remove')}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {wishlist.length > 0 && (
            <>
              <div className="text-center mt-4">
                <Button variant="primary" onClick={handleTransferAllToCart}>
                  {t('wishlist.transfer_all_to_cart')}
                </Button>
              </div>
              <Pagination className="justify-content-center mt-4">
                {Array.from({ length: Math.ceil(wishlist.length / itemsPerPage) }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Wishlist;
