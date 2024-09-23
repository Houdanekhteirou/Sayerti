import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import '../Footer/Style.css';  // Assurez-vous que le chemin est correct

const UserLayout = () => (
  <div className="main-layout">
    <Navbar />
    <main className="content">
     
      <Outlet />
    </main>
    
    <Footer />
  </div>
);

export default UserLayout;
