import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Container, Button, Row, Col, Table, Badge, Pagination } from 'react-bootstrap';
import { getUserId } from './components/pages/Account/userStorageService';
import './S.css';
import { useTranslation } from 'react-i18next';
import { getToken } from './components/pages/Account/userStorageService';
const Orderss = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const { t, i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');
  const userId = getUserId();

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }, [i18n.language]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://194.163.173.3:8888/api/customer/myOrders/${userId}` , {headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },});
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  const fetchCartItems = async (userId, orderId) => {
    try {
      const lang = i18n.language;
      const url = `http://194.163.173.3:8888/api/customer/cartI/${userId}`;
      const response = await axios.get(url, {
        params: { lang, orderId },headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setCartItems(response.data.cartItems);
      setShowCartModal(true);
    } catch (error) {
      console.error('Error fetching cart items:', error.message);
    }
  };

  const handleShowCartModal = (order) => {
    fetchCartItems(order.user_id, order.id);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-container" style={{ direction }}>
      <Container className="content-wrap">
        <Row>
          <Col>
            <h2>{t('orders.title')}</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t('Amount')}</th>
                  <th>{t('Numero')}</th>
                  <th>{t('Date')}</th>
                  <th>{t('Status')}</th>
                  <th>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.amount}</td>
                    <td>{order.address}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>
                      {order.orderStatus === "Shipped" ? (
                        <Badge className="badge-shipped">{t('PStatusShipped')}</Badge>
                      ) : order.orderStatus === "Delivered" ? (
                        <Badge className="badge-delivered">{t('PStatusDelivered')}</Badge>
                      ) : (
                        <Badge className="badge-pending">{t('PStatusPending')}</Badge>
                      )}
                    </td>
                    <td>
                      <Button variant="info" size="sm" className="mr-2 mb-1" onClick={() => handleShowCartModal(order)}>
                        {t('orders.viewCart')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Pagination */}
            <Pagination>
              {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>
        <Modal show={showCartModal} onHide={() => setShowCartModal(false)} centered>
          <Modal.Header closeButton className="custom-modal-header">
            <Modal.Title>{t('orders.cartItems')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cartItems.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead className="admin-products__table-header">
                  <tr>
                    <th>{t('orders.image')}</th>
                    <th>{t('orders.size')}</th>
                    <th>{t('orders.marque')}</th>
                    <th>{t('orders.quantity')}</th>
                    <th>{t('orders.price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} className="admin-products__table-row">
                      <td><img src={`data:image/jpeg;base64,${item.returnedImg}`} alt={item.productName} style={{ width: '50px' }} /></td>
                      <td>{item.taille}</td>
                      <td>{item.marque}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>{t('orders.noItems')}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCartModal(false)}>
              {t('common.close')}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Orderss;
