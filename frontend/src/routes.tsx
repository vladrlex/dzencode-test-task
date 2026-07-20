import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';

const Orders = lazy(() => import('./pages/Orders/Orders'));
const Products = lazy(() => import('./pages/Products/Products'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="lazy-fallback-container">
          <div className="lazy-spinner"></div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
