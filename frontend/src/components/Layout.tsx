import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Layout() {
  const [sessions, setSessions] = useState(0);
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    socket.on('sessions_count', (count: number) => setSessions(count));
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => {
      socket.off('sessions_count');
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: 'sans-serif', backgroundColor: '#f4f6f8' }}>
      <aside style={{ width: '250px', minWidth: '250px', backgroundColor: '#fff', boxShadow: '2px 0 5px rgba(0,0,0,0.05)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          <img src="https://via.placeholder.com/100" alt="User" style={{ borderRadius: '50%', width: '80px', height: '80px', objectFit: 'cover' }} />
        </div>
        <nav style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <Link to="/orders" style={{ textDecoration: 'none', color: '#333', fontWeight: location.pathname === '/orders' ? 'bold' : 'normal', borderBottom: location.pathname === '/orders' ? '2px solid #689f38' : 'none', paddingBottom: '5px', width: '100%', textAlign: 'center' }}>ORDERS</Link>
          <Link to="/products" style={{ textDecoration: 'none', color: '#333', fontWeight: location.pathname === '/products' ? 'bold' : 'normal', borderBottom: location.pathname === '/products' ? '2px solid #689f38' : 'none', paddingBottom: '5px', width: '100%', textAlign: 'center' }}>PRODUCTS</Link>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <header style={{ height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px' }}>
          <div style={{ color: '#689f38', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px' }}>INVENTORY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', color: '#555', fontSize: '14px' }}>
            <div>Active sessions: <strong>{sessions}</strong></div>
            <div style={{ textAlign: 'right' }}>
              <div>{formatDay(time)}</div>
              <div><strong>{formatDate(time)}</strong> <span style={{ color: '#689f38', marginLeft: '5px' }}>⏱ {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span></div>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f8', width: '100%' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}