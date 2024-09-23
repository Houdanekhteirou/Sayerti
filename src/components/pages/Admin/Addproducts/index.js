import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap';
import './style.css'; // Assurez-vous que style.css contient la classe .required-field
import { useTranslation } from 'react-i18next';
import { getToken } from '../../Account/userStorageService';
const AddProduct = () => {
  const { t, i18n } = useTranslation();
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [productSize, setProductSize] = useState('');
  const [productQuantite, setProductQuantite] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleProductPriceChange = (e) => setProductPrice(e.target.value);
  const handleProductDescriptionChange = (e) => setProductDescription(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleProductSizeChange = (e) => setProductSize(e.target.value);
  const handleProductQuantiteChange = (e) => setProductQuantite(e.target.value);
  const handleBrandChange = (e) => setSelectedBrand(e.target.value);

  const handleProductImageChange = (e) => {
    const image = e.target.files[0];
    setProductImage(image);
    setPreviewImage(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('description', productDescription);
    formData.append('categoryId', selectedCategory);
    formData.append('taille', productSize);
    formData.append('quantiteStock', productQuantite);
    formData.append('marqueId', selectedBrand);
    if (productImage) {
      formData.append('img', productImage);
    }

    try {
      const response = await axios.post('http://194.163.173.3:8888/api/admin/product', formData, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setShowSuccessToast(true);
        // Réinitialiser les états après la soumission réussie
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setProductImage(null);
        setPreviewImage(null);
        setProductSize('');
        setProductQuantite('');
        setSelectedBrand('');
        setSelectedCategory('');
        setErrorMessage('');
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage(error.message);
      setShowErrorToast(true);
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://194.163.173.3:8888/api/admin/ouvert/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://194.163.173.3:8888/api/marques',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setBrands(response.data);
      } else {
        console.error('Error fetching brands: Invalid response format');
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  return (
    <Container fluid className="mt-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="shadow p-4">
            <h2 className="text-center mb-4">{t('add_product')}</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {t('product_name')}
                  <span className="required-field">*</span>
                </Form.Label>
                <Form.Control type="text" value={productName} onChange={handleProductNameChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  {t('product_price')}
                  <span className="required-field">*</span>
                </Form.Label>
                <Form.Control type="number" value={productPrice} onChange={handleProductPriceChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t('category')}</Form.Label>
                <span className="required-field">*</span>
                <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">{t('select_category')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t('size')}</Form.Label>
                <Form.Control type="text" value={productSize} onChange={handleProductSizeChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                
                <Form.Label>{t('en.Quantity')}</Form.Label>
                <span className="required-field">*</span>
                <Form.Control type="number" value={productQuantite} onChange={handleProductQuantiteChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t('brand')}</Form.Label>
                <span className="required-field">*</span>
                <Form.Select value={selectedBrand} onChange={handleBrandChange}>
                  <option value="">{t('select_brand')}</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.nom}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t('product_image')}</Form.Label>
                <span className="required-field">*</span>
                <Form.Control type="file" accept="image/*" onChange={handleProductImageChange} />
              </Form.Group>
              {previewImage && (
                <div className="mb-3 text-center">
                  <Form.Label>{t('image_preview')}</Form.Label>
                  <img src={previewImage} alt="Product Preview" className="img-fluid" />
                </div>
              )}
              <Button variant="primary" type="submit" className="w-100">{t('add_product')}</Button>
            </Form>
          </div>
        </Col>
      </Row>

      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2000 }}>
        <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
          <Toast.Body>Product added successfully!</Toast.Body>
        </Toast>

        <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide bg="danger" text="white">
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </div>
    </Container>
  );
};

export default AddProduct;
