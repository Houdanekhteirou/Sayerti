import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Style.css';
import { useTranslation } from 'react-i18next';
import { getToken } from '../../Account/userStorageService';
function ProductUpdateForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    categoryName: '',
    taille: '',
    marque: '',
  });
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://192.168.100.165:8080/api/admin/product/${productId}`,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (response.status !== 200) {
          throw new Error(t('failed_to_fetch_product'));
        }
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, t]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('description', product.description);
      formData.append('categoryId', product.categoryId);
      formData.append('categoryName', product.categoryName);
      formData.append('taille', product.taille);
      formData.append('marque', product.marque);
      if (image) {
        formData.append('img', image);
      }

      const response = await axios.put(`http://192.168.100.165:8080/api/admin/product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log('Updated product:', response.data);
      setSuccessMessage(t('product_updated_successfully'));
      setShowMessage(true);
    } catch (error) {
      setError(error.message);
      setShowMessage(true);
    }
  };

  const handleCloseMessage = () => {
    navigate('/admin/ProductsA'); // redirection vers la page des produits
  };

  if (loading) return <div>{t('loading')}</div>;

  return (
    <div className="container my-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h1 className="mb-4">{t('update_product')}</h1>
          <Alert
            variant={error ? 'danger' : 'success'}
            show={showMessage}
            onClose={handleCloseMessage}
            dismissible
          >
            {error ? error : successMessage}
            <Button variant="primary" onClick={handleCloseMessage} className="ms-2">
              {t('close')}
            </Button>
          </Alert>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">{t('name')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('name')}
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t('price')}</label>
              <input
                type="number"
                className="form-control"
                placeholder={t('price')}
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                required
              />
            </div>
         
            <div className="mb-3">
              <label className="form-label">{t('category_id')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('category_id')}
                value={product.categoryId}
                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t('category_name')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('category_name')}
                value={product.categoryName}
                onChange={(e) => setProduct({ ...product, categoryName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t('size')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('size')}
                value={product.taille}
                onChange={(e) => setProduct({ ...product, taille: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t('brand')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('brand')}
                value={product.marque}
                onChange={(e) => setProduct({ ...product, marque: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{t('image')}</label>
              <input type="file" className="form-control" onChange={handleImageChange} />
            </div>
            <Button variant="primary" type="submit">{t('update_product')}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdateForm;
