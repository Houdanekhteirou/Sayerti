import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Card className="mb-4">
      <Card.Img variant="top" src={`data:image/png;base64,${product.image}`} alt={product.name} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          {product.price} €
        </Card.Text>
        <Button as={Link} to={`/product/${product.id}`} variant="primary">Voir le produit</Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
