// src/components/StatCard.js
import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card className="mb-4" style={{ borderLeft: `5px solid ${color}` }}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <h5>{title}</h5>
          <h3>{value}</h3>
        </div>
        <div className="icon" style={{ fontSize: '2rem', color: color }}>
          {icon}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
