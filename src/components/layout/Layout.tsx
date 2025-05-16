import React from 'react';
import { Header } from './Header/Header';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
); 