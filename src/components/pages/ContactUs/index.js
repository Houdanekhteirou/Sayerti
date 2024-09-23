import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getUserId, isLoggedIn } from '../Account/userStorageService'; // Assurez-vous que ce chemin est correct
import { Alert } from 'react-bootstrap'; // Assurez-vous que Bootstrap est installé
import { useNavigate } from 'react-router-dom';
import { getToken } from '../Account/userStorageService';
function CreateReview() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [direction, setDirection] = useState('ltr');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  
    if (isLoggedIn()) {
      const fetchedUserId = getUserId();
      if (fetchedUserId) {
        setUserId(fetchedUserId);
      } else {
        setAlertMessage(t('alerts.user_id_not_available'));
        setAlertType('danger');
      }
    } else {
      navigate('/SigIn', { state: { message: t('login_required') } });
    }
  }, [i18n.language, navigate, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userId) {
      try {
        const reviewDTO = {
          content,
          userId
        };
        const response = await axios.post('http://194.163.173.3:8888/api/reviews', reviewDTO,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        console.log(t('alerts.review_created'), response.data);
        setContent('');
        setAlertMessage(t('alerts.review_submitted_success'));
        setAlertType('success');
      } catch (error) {
        console.error(t('alerts.error_creating_review'), error);
        setAlertMessage(t('alerts.review_submit_failed'));
        setAlertType('danger');
      }
    } else {
      setAlertMessage(t('alerts.invalid_user_data'));
      setAlertType('danger');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ direction: direction }}>
      <h2>{t('form.title')}</h2>
      {alertMessage && <Alert variant={alertType}>{alertMessage}</Alert>}
      <div>
        <label>{t('form.content')}</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">{t('form.submit_button')}</button>
    </form>
  );
}

export default CreateReview;
