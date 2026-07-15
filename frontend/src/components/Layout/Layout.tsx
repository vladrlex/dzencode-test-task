import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Layout.css';

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

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`;

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__logo-wrapper">
          <span className="layout__logo">INVENTORY</span>
        </div>
        
        <div className="layout__top-info">
          <div className="layout__sessions">
            Active sessions: <strong className="layout__sessions-count">{activeSessions}</strong>
          </div>
          <div className="layout__time-wrapper">
            <div className="layout__date">
              <div className="layout__date-weekday">{time.toLocaleDateString('en-US', { weekday: 'long' })}</div>
              <div className="layout__date-full">
                {time.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="layout__clock">
              <span>🕒</span>
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>
        </div>
      </header>

      <div className="layout__body">
        <nav className="layout__sidebar">
          <div className="layout__user">
            <div className="layout__user-avatar">👤</div>
            <div className="layout__user-name">Active User</div>
          </div>

          <NavLink to="/orders" className={getLinkClass}>
            ORDERS
          </NavLink>
          <NavLink to="/products" className={getLinkClass}>
            PRODUCTS
          </NavLink>
        </nav>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}