import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';
import AppRoutes from './routes';
import { useAppSelector } from './store/hooks';

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
      <AppRoutes />
    </BrowserRouter>
  );
}
