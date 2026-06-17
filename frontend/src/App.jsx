import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AnimatePresence } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
