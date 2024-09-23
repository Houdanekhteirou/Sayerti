import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Container, Row, Col, Pagination } from 'react-bootstrap';
import './ReviewsList.css';
import { useTranslation } from 'react-i18next';
import { getToken } from '../../Account/userStorageService';

function ReviewsList() {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5); // Nombre d'avis par page

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://194.163.173.3:8888/api/reviews',{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  // Obtenir les avis pour la page actuelle
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Déterminer la direction en fonction de la langue
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <Container dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Row>
        <Col>
          <br />
          <br />
          <h2 className="my-4">{t('reviews.title')}</h2>
          <ListGroup>
            {currentReviews.map(review => (
              <ListGroup.Item key={review.id}>
                <div><strong>{t('reviews.phone_number')}:</strong> {review.userName}</div>
                <div><strong>{t('reviews.message')}:</strong> {review.content}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <br />
          <Pagination>
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

export default ReviewsList;
