import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import './Layout.css';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const [activeSessions, setActiveSessions] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('sessions_count', (count: number) => {
      setActiveSessions(count);
    });

    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

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
            {t('layout.activeSessions')} <strong className="layout__sessions-count">{activeSessions}</strong>
          </div>
          
          <div className="layout__time-wrapper">
            <div className="layout__date">
              <div className="layout__date-weekday">
                {time.toLocaleDateString(currentLang, { weekday: 'long' })}
              </div>
              <div className="layout__date-full">
                {time.toLocaleDateString(currentLang, { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
            
            <div className="layout__clock">
              <span>🕒</span>
              {time.toLocaleTimeString(currentLang, { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>

          <div className="layout__lang-switcher" style={{ display: 'flex', gap: '5px', marginLeft: '15px' }}>
            <button 
              onClick={() => changeLanguage('en')} 
              style={{ 
                fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                color: i18n.language === 'en' ? '#689f38' : '#666'
              }}
            >
              EN
            </button>
            <span style={{ color: '#ccc' }}>|</span>
            <button 
              onClick={() => changeLanguage('ru')} 
              style={{ 
                fontWeight: i18n.language === 'ru' ? 'bold' : 'normal',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                color: i18n.language === 'ru' ? '#689f38' : '#666'
              }}
            >
              RU
            </button>
          </div>
        </div>
      </header>

      <div className="layout__body">
        <nav className="layout__sidebar">
          <div className="layout__user">
            <div className="layout__user-avatar">👤</div>
            <div className="layout__user-name">{t('layout.activeUser')}</div>
          </div>

          <NavLink to="/orders" className={getLinkClass}>
            {t('navigation.orders').toUpperCase()}
          </NavLink>
          <NavLink to="/products" className={getLinkClass}>
            {t('navigation.products').toUpperCase()}
          </NavLink>
        </nav>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}