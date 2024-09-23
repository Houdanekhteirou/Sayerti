import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faTag, faList } from '@fortawesome/free-solid-svg-icons';

const Filter = ({ categories, sizes, brands, filters, onFilterChange, t }) => {
  const handleCategorySelect = (event) => {
    onFilterChange('category', event.target.value);
  };

  const handleSizeSelect = (event) => {
    onFilterChange('size', event.target.value);
  };

  const handleBrandSelect = (event) => {
    onFilterChange('brand', event.target.value);
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label"><FontAwesomeIcon icon={faList} /> {t('categories')}</label>
        <select className="form-select scrolling-list" value={filters.category} onChange={handleCategorySelect}>
          <option value="">{t('select_category')}</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label"><FontAwesomeIcon icon={faTag} /> {t('select_brand')}</label>
        <select className="form-select" value={filters.brand} onChange={handleBrandSelect} disabled={!filters.category}>
          <option value="">{t('select_brand')}</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label"><FontAwesomeIcon icon={faRulerCombined} /> {t('select_size')}</label>
        <select className="form-select" value={filters.size} onChange={handleSizeSelect} disabled={!filters.category || !filters.brand}>
          <option value="">{t('select_size')}</option>
          {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Filter;
