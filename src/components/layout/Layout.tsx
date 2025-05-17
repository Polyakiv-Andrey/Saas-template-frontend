import React from 'react';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { Outlet } from 'react-router-dom';
import './Layout.scss';

export const Layout: React.FC = () => (
  <div className="layout">
    <Header />
    <main className="layout__main">
      <Outlet />
    </main>
    <Footer />
  </div>
); 