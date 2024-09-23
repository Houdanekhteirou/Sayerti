import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './AboutUs.css'; // Assurez-vous que le chemin est correct

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <Container className={`about-us-container ${direction}`}>
      <Row className="about-us-header">
        <Col>
          <h1  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{t('about_us_title')}</h1>
        </Col>
      </Row>
      <Row className="about-us-section">
        <Col md={6}>
          <h2 dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{t('mission_title')}</h2>
          <p>{t('mission_text')}</p>
      
        </Col>
        <Col md={6}>
          <h2  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{t('vision_title')}</h2>
          <p>{t('vision_text')}</p>
         
        </Col>
      </Row>
      <Row className="about-us-section">
        <Col>
          <h2  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{t('values_title')}</h2>
          <ul  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <li><strong>{t('quality')}</strong>: {t('quality_text')}</li>
            <li><strong>{t('innovation')}</strong>: {t('innovation_text')}</li>
            <li><strong>{t('service')}</strong>: {t('service_text')}</li>
            <li><strong>{t('integrity')}</strong>: {t('integrity_text')}</li>
          </ul>
        
        </Col>
      </Row>
    
    
  
    </Container>
  );
};

export default AboutUs;
