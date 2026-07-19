import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { API_URL } from '../../config/config';
import { LANGUAGE_STORAGE_KEY } from '../../i18n/i18n';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import ClockIcon from '../Icons/ClockIcon';
import UserIcon from '../Icons/UserIcon';
import ShieldLogoIcon from '../Icons/ShieldLogoIcon';
import SettingsIcon from '../Icons/SettingsIcon';
import LogoutIcon from '../Icons/LogoutIcon';
import './Layout.css';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.auth.username);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSessions, setActiveSessions] = useState(1);
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (searchQuery) {
            next.set('q', searchQuery);
          } else {
            next.delete('q');
          }
          next.delete('page');
          return next;
        },
        { replace: true }
      );
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const socket = io(API_URL);

    socket.on('sessions_count', (count: number) => {
      setActiveSessions(count);
    });

    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      socket.off('sessions_count');
      socket.disconnect();
      clearInterval(timer);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const currentLang = i18n.language;

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`;

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__left-side">
          <div className="layout__logo-wrapper">
            <ShieldLogoIcon size={32} />
            <span className="layout__logo">INVENTORY</span>
          </div>

          <div className="layout__search-wrapper">
            <input
              type="text"
              placeholder={t('layout.searchPlaceholder', { defaultValue: 'Search' })}
              className="layout__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
              <ClockIcon size={14} />
              {time.toLocaleTimeString(currentLang, { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
          </div>

          <div className="layout__lang-switcher">
            <button
              onClick={() => changeLanguage('en')}
              className={`layout__lang-btn ${i18n.language === 'en' ? 'layout__lang-btn--active' : ''}`}
            >
              EN
            </button>
            <span className="layout__lang-divider">|</span>
            <button
              onClick={() => changeLanguage('ru')}
              className={`layout__lang-btn ${i18n.language === 'ru' ? 'layout__lang-btn--active' : ''}`}
            >
              RU
            </button>
          </div>
        </div>
      </header>

      <div className="layout__body">
        <nav className="layout__sidebar">
          <div className="layout__user-section">
            <div className="layout__avatar-container">
              <div className="layout__user-avatar">
                <UserIcon size={40} className="layout__user-icon" />
              </div>
              <button className="layout__avatar-settings" aria-label={t('a11y.settings')}>
                <SettingsIcon size={12} />
              </button>
            </div>
            <div className="layout__user-name">{username || t('layout.activeUser')}</div>
            <button className="layout__logout-btn" onClick={handleLogout} aria-label={t('a11y.logout')}>
              <LogoutIcon size={14} />
              {t('auth.logoutBtn')}
            </button>
          </div>

          <div className="layout__navigation">
            <NavLink to="/orders" className={getLinkClass}>
              {t('navigation.orders').toUpperCase()}
            </NavLink>
            <NavLink to="/products" className={getLinkClass}>
              {t('navigation.products').toUpperCase()}
            </NavLink>
          </div>
        </nav>

        <main className="layout__content">
          <div key={location.pathname} className="route-transition">
            <Outlet context={{ searchQuery: debouncedQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
}