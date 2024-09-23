
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Form, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getToken } from '../../Account/userStorageService';
const ProductTransactions = () => {
  const { productId,productnom } = useParams();
  const [movements, setMovements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await axios.get(`http://194.163.173.3:8888/api/admin/mouvements/${productId}`,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setMovements(response.data);
      } catch (error) {
        console.error('Error fetching movements:', error);
      }
    };

    fetchMovements();
  }, [productId]);

  const filteredMovements = movements.filter(movement => {
    const matchesSearchTerm = movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              movement.remarque.toLowerCase().includes(searchTerm.toLowerCase());
    const movementDate = new Date(movement.dateMouvement).toISOString().split('T')[0];
    const matchesSelectedDate = selectedDate ? movementDate === selectedDate : true;

    return matchesSearchTerm && matchesSelectedDate;
  });

  const getMovementTypeLabel = (type) => {
    if (i18n.language === 'ar') {
      return type === 'ENTREE' ? 'داخل' : 'خارج';
    }
    return type;
  };

  return (
    <Container fluid className="mt-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <br></br>
      <br></br>
      <h1 className="mb-4">{t('products.movements')} : {productnom}</h1>
      <Form className="mb-4">
        <Row>
          <Col>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder={t('products.recherche')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>


          
          <Col>
            <Form.Group>
              <Form.Control
                type="date"
                placeholder={t('products.date')}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
          <th>{t('en.type')}</th>
            <th>{t('en.Quantity')}</th>
            <th>{t('orders.date')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredMovements.map((movement) => (
            <tr key={movement.id}>
              <td>{getMovementTypeLabel(movement.type)}</td>
              <td>{movement.quantite}</td>
              <td>{new Date(movement.dateMouvement).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductTransactions;