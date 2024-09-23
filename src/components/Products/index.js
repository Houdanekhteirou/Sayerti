import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter,faSearch } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { getlang, getUser } from '../pages/Account/userStorageService';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import './productStyle.css';
import { FormControl, InputLabel, Select, MenuItem, InputAdornment, TextField } from '@mui/material';

function Products() {
  const { t, i18n } = useTranslation();
  const defaultOption = i18n.language === 'ar' ? 'الجميع' : 'Tous';
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(defaultOption);
  const [selectedSubCategory, setSelectedSubCategory] = useState(defaultOption);
  const [selectedSize, setSelectedSize] = useState(defaultOption);
  const [selectedBrand, setSelectedBrand] = useState(defaultOption);
  const [direction, setDirection] = useState('ltr');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
    fetchProducts();
    fetchCategories();
    fetchCartItems(); // Récupérer les articles du panier
  }, [i18n.language]);

  useEffect(() => {
    updateSizeAndBrandLists(filteredProducts);
  }, [filteredProducts]);

  const fetchProducts = (categoryId = defaultOption, size = defaultOption, brand = defaultOption) => {
    let url = 'http://194.163.173.3:8888/api/admin/ouvert/products';
    if (categoryId !== defaultOption) {
      url = `http://194.163.173.3:8888/api/admin/ouvert/category/${categoryId}`;
    }

  
    const lang = getlang();
    axios.get(url, { params: { lang } })
      .then(response => {
        let filteredProducts = response.data;
        if (size !== defaultOption) {
          filteredProducts = filteredProducts.filter(product => product.taille === size);
        }
        if (brand !== defaultOption) {
          filteredProducts = filteredProducts.filter(product => product.marque === brand);
        }
        setProducts(filteredProducts);
        setFilteredProducts(filteredProducts);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  };

  const fetchCategories = () => {
    const url = 'http://194.163.173.3:8888/api/admin/ouvert/categories';
    const lang = getlang();
    axios.get(url, { params: { lang } })
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  };

  const fetchSubCategories = (categoryId) => {
    const url = `http://194.163.173.3:8888/api/admin/ouvert/{{categoryId}}/subcategories`;
    const lang = getlang();
    axios.get(url, { params: { lang } })
      .then(response => {
        setSubCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the subcategories!', error);
      });
  };

  const fetchCartItems = () => {
    const user = getUser();
    if (user && user.userId  ) {
      axios.get(`http://194.163.173.3:8888/api/customer/cart/${user.userId}?lang=${getlang()}`)
        .then(response => {
          setCartItems(response.data.cartItems);
        })
        .catch(error => {
          console.error('There was an error fetching the cart items!', error);
        });
    } else {
      console.warn('User is not logged in or userId is not available');
    }
  };

  const updateSizeAndBrandLists = (products) => {
    const uniqueSizes = [...new Set(products.map(product => product.taille))];
    const uniqueBrands = [...new Set(products.map(product => product.marque))];
    setSizes([defaultOption, ...uniqueSizes]);
    setBrands([defaultOption, ...uniqueBrands]);
  };

  const updateCart = (product) => {
    console.log(`Adding product ${product.id} to cart`);
    fetchCartItems();
  };

  const handleCategorySelect = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubCategory(defaultOption);
    setSelectedSize(defaultOption);
    setSelectedBrand(defaultOption);
    if (categoryId === defaultOption) {
      fetchProducts(defaultOption, defaultOption, defaultOption);
      setSubCategories([]);
    } else {
      fetchSubCategories(categoryId);
      fetchProducts(categoryId, defaultOption, defaultOption);
    }
  };

  const handleSubCategorySelect = (event) => {
    const subCategoryId = event.target.value;
    setSelectedSubCategory(subCategoryId);
    fetchProducts(subCategoryId, selectedSize, selectedBrand);
  };

  const handleSizeSelect = (event) => {
    const size = event.target.value;
    setSelectedSize(size);
    fetchProducts(selectedCategory, size, selectedBrand);
  };

  const handleBrandSelect = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    fetchProducts(selectedCategory, selectedSize, brand);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handleSearchInputChange = (event) => {
      const { value } = event.target;
      setSearchQuery(value);
      if (value.trim() === '') {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    };

  return (
    <div className="products-container container-fluid" style={{ direction: direction }} >
      <div className="row">
        <div className="col-md-3">
          <div className="filters-section bg-light p-3 rounded shadow-sm mb-4">
            <h4><FontAwesomeIcon icon={faFilter} /> {t('filters')}</h4>
            <div className="mb-3">
              <FormControl fullWidth>
                <InputLabel>{t('categories')}</InputLabel>
                <Select value={selectedCategory} onChange={handleCategorySelect}>
                  <MenuItem value="">
                    
                  </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {selectedCategory !== defaultOption && (
              <div className="mb-3">
                <FormControl fullWidth>
                  <InputLabel>{t('sub_categories')}</InputLabel>
                  <Select value={selectedSubCategory} onChange={handleSubCategorySelect}>
                    <MenuItem value="">
                     
                    </MenuItem>
                    {subCategories.map(subCategory => (
                      <MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            <div className="mb-3">
              <FormControl fullWidth>
                <InputLabel>{t('select_brand')}</InputLabel>
                <Select value={selectedBrand} onChange={handleBrandSelect}>
                  <MenuItem value="">
                  
                  </MenuItem>
                  {brands.map(brand => (
                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="mb-3">
              <FormControl fullWidth>
                <InputLabel>{t('select_size')}</InputLabel>
                <Select value={selectedSize} onChange={handleSizeSelect}>
                  <MenuItem value="">
                    
                  </MenuItem>
                  {sizes.map(size => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          
          </div>
          <a href="#" download>
  <button className="btn btn-primary">{t('Télécharger')}</button>
</a>

        </div>
        <div className="col-md-9" >
        <TextField
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      className="mb-4"
      fullWidth
      variant="outlined"
      label={t('search_by_name')}
      value={searchQuery}
      onChange={handleSearchInputChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <FontAwesomeIcon icon={faSearch} />
          </InputAdornment>
        ),
        inputProps: {
          dir: i18n.language === 'ar' ? 'rtl' : 'ltr',
        },
      }}
    />
          <div className="text-center mb-4">
            <h1 className="products-title">{t('produ')}</h1>
            <div className="underline"></div>
          </div>
          <div className="row">
            {currentProducts.map(product => (
              <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
                <ProductCard deal={product} updateCart={() => updateCart(product)} cartItems={cartItems} />
              </div>
            ))}
          </div>
          <Pagination>
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
              <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)} />
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Products;
