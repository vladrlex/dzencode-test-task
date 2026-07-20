import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/authSlice';
import ShieldLogoIcon from '../../components/Icons/ShieldLogoIcon';
import Clock from '../../components/Clock/Clock';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import './Login.css';

const formatCountdown = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);
  const retryAfterSeconds = useAppSelector((state) => state.auth.retryAfterSeconds);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const prevRetryAfter = useRef<number | null>(null);

  useEffect(() => {
    if (retryAfterSeconds !== prevRetryAfter.current) {
      prevRetryAfter.current = retryAfterSeconds;
      setCountdown(retryAfterSeconds ?? 0);
      return;
    }

    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [retryAfterSeconds, countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  const isRateLimited = countdown > 0;

  return (
    <div className="login">
      <div className="login__topbar">
        <Clock className="login__clock" />
        <LanguageSwitcher />
      </div>

      <form className="login__card" onSubmit={handleSubmit}>
        <div className="login__logo">
          <ShieldLogoIcon size={40} />
          <span>INVENTORY</span>
        </div>

        <h2 className="login__title">{t('auth.loginTitle')}</h2>

        <div className="login__field">
          <label htmlFor="login-username">{t('auth.usernameLabel')}</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('auth.placeholderUsername')}
            required
            autoFocus
          />
        </div>

        <div className="login__field">
          <label htmlFor="login-password">{t('auth.passwordLabel')}</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.placeholderPassword')}
            required
          />
        </div>

        {!isRateLimited && error && <div className="login__error">{t('auth.loginError')}</div>}

        <button type="submit" className="login__submit" disabled={status === 'loading' || isRateLimited}>
          {isRateLimited
            ? t('auth.tryAgainIn', { time: formatCountdown(countdown) })
            : status === 'loading'
            ? t('auth.loggingIn')
            : t('auth.loginBtn')}
        </button>
      </form>
    </div>
  );
}
