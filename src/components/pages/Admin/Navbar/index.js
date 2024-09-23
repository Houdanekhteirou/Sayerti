import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaBars, FaShoppingCart, FaTags, FaTachometerAlt } from 'react-icons/fa';
import { IoMdApps, IoIosListBox } from 'react-icons/io';
import { BiLogOut, BiCommentDetail } from 'react-icons/bi'; // Import BiCommentDetail for reviews icon
import './Header.css';

function NavigationBar() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  // Set language from localStorage on initial load
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      setSelectedLanguage(storedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng); // Store selected language in localStorage
  };

  const directionClass = selectedLanguage === 'ar' ? 'rtl' : 'ltr';

  return (
    <Navbar bg="purple" variant="dark" expand="lg" dir={directionClass} className={`navbar-${directionClass} fixed-top`}>
      <Container>
        <Navbar.Brand as={Link} to="#">{t(' ')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FaBars />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/DashboardCards">
              <FaTachometerAlt /> {t('dashboard')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/Categorie">
              <IoMdApps /> {t('category')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/ProductsA">
              <FaShoppingCart /> {t('produ')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/orders">
              <IoIosListBox /> {t('ord')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/Marque">
              <FaTags /> {t('orders.marque')}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/ReviewsList">
              <BiCommentDetail /> {t('avis')} {/* Utilize the translation for reviews */}
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => changeLanguage('fr')} active={selectedLanguage === 'fr'}>
              FR
            </Nav.Link>
            <Nav.Link onClick={() => changeLanguage('ar')} active={selectedLanguage === 'ar'}>
              AR
            </Nav.Link>
            <Nav.Link as={Link} to="/logout">
              <BiLogOut /> {t('logout')}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
