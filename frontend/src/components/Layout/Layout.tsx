import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { API_URL } from '../../config/config';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import Clock from '../Clock/Clock';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import UserIcon from '../Icons/UserIcon';
import ShieldLogoIcon from '../Icons/ShieldLogoIcon';
import SettingsIcon from '../Icons/SettingsIcon';
import LogoutIcon from '../Icons/LogoutIcon';
import './Layout.css';

export default function Layout() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.auth.username);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSessions, setActiveSessions] = useState(1);
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
  }, [searchQuery, setSearchParams]);

  useEffect(() => {
    const socket = io(API_URL);

    socket.on('sessions_count', (count: number) => {
      setActiveSessions(count);
    });

    return () => {
      socket.off('sessions_count');
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

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

          <Clock className="layout__time-wrapper" />
          <LanguageSwitcher className="layout__lang-switcher" />
          <ThemeToggle />
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
            <NavLink to="/dashboard" className={getLinkClass}>
              {t('navigation.dashboard').toUpperCase()}
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