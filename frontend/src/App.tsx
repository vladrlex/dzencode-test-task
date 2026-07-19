import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import { useAppSelector } from './store/hooks';

const Orders = lazy(() => import('./pages/Orders/Orders'));
const Products = lazy(() => import('./pages/Products/Products'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));

export default function App() {
  const token = useAppSelector((state) => state.auth.token);
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked);

  if (token && !sessionChecked) {
    return (
      <div className="lazy-fallback-container">
        <div className="lazy-spinner"></div>
      </div>
    );
  }

  if (!token) {
    return <Login />;
  }

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
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}