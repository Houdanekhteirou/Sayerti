// src/components/Dashboard.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StatCard from '../StatCard' ;
import { FaShoppingCart, FaUsers, FaDollarSign, FaBox } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <Container fluid>
      <h1 className="my-4">Admin Dashboard</h1>
      <Row>
        <Col lg={3} md={6}>
          <StatCard 
            title="Total Sales" 
            value="$24,000" 
            icon={<FaDollarSign />} 
            color="green" 
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard 
            title="Orders" 
            value="120" 
            icon={<FaShoppingCart />} 
            color="blue" 
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard 
            title="Users" 
            value="1,200" 
            icon={<FaUsers />} 
            color="purple" 
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard 
            title="Products" 
            value="320" 
            icon={<FaBox />} 
            color="orange" 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
