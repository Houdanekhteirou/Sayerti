import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Style.css';  // Assurez-vous que le chemin est correct
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    const lang = i18n.language;
    const getDirection = () => ['ar', 'he', 'fa', 'ur'].includes(lang) ? 'rtl' : 'ltr';
    setDirection(getDirection());
  }, [i18n.language]);

  return (
    <footer className={`footer-custom py-4 mt-5 `} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>{t('footer.aboutUs')}</h5>
            <p>
              {t('mission_text')}
            </p>
          </Col>
          <Col md={4}>
            <h5>{t('footer.quickLinks')}</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">{t('footer.home')}</a></li>
              <li><a href="/AboutUs" className="footer-link">{t('footer.about')}</a></li>
            
              <li><a href="/ContactUs" className="footer-link">{t('footer.contact')}</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>{t('footer.followUs')}</h5>
            <div className="d-flex">
              <a href="https://facebook.com" className="footer-link me-3"><FaFacebook size={20} /></a>
              <a href="https://twitter.com" className="footer-link me-3"><FaTwitter size={20} /></a>
              <a href="https://instagram.com" className="footer-link"><FaInstagram size={20} /></a>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p>{t('footer.copyRight', { year: new Date().getFullYear() })}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
