import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';

const Orders = lazy(() => import('./pages/Orders/Orders'));
const Products = lazy(() => import('./pages/Products/Products'));

export default function App() {
  return (
    <BrowserRouter>
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
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}