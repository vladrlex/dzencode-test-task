import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Layout() {
  const [activeSessions, setActiveSessions] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('activeSessions', (count: number) => {
      setActiveSessions(count);
    });

    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, []);

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'block',
    padding: '12px 20px',
    color: isActive ? '#689f38' : '#333',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
    borderLeft: isActive ? '4px solid #689f38' : '4px solid transparent',
    backgroundColor: isActive ? '#f4f6f8' : 'transparent',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'Arial, sans-serif' }}>
      {/* Top Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 40px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        height: '60px',
        boxSizing: 'border-box',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: 'bold', color: '#689f38', fontSize: '18px', letterSpacing: '1px' }}>INVENTORY</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', fontSize: '14px', color: '#555' }}>
          <div>
            Active sessions: <strong style={{ color: '#333' }}>{activeSessions}</strong>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#999' }}>{time.toLocaleDateString('en-US', { weekday: 'long' })}</div>
              <div style={{ fontWeight: 'bold', color: '#333' }}>
                {time.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#689f38' }}>
              <span>🕒</span>
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Navigation */}
        <nav style={{
          width: '220px',
          backgroundColor: '#fff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.02)',
          paddingTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          boxSizing: 'border-box',
          zIndex: 5
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#eaeaea',
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
              👤
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Active User</div>
          </div>

          <NavLink to="/orders" style={linkStyle}>
            ORDERS
          </NavLink>
          <NavLink to="/products" style={linkStyle}>
            PRODUCTS
          </NavLink>
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto', boxSizing: 'border-box' }}>
          {/* Outlet автоматично рендерить ту сторінку, яка зараз відкрита в роутері */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}