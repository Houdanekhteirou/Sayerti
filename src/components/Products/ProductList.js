import React, { useState } from 'react';
import ProductCard from './ProductCard';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = ({ deals, updateCart, cartItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = deals.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container">
      <div className="row">
        {currentItems.map((deal) => (
          <div key={deal.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <ProductCard deal={deal} updateCart={updateCart} cartItems={cartItems} />
          </div>
        ))}
      </div>
      <Pagination className="justify-content-center">
        {[...Array(Math.ceil(deals.length / itemsPerPage)).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default ProductList;
