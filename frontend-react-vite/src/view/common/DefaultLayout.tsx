import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const DefaultLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;