import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/authSlice';
import ShieldLogoIcon from '../../components/Icons/ShieldLogoIcon';
import './Login.css';

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className="login">
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

        {error && <div className="login__error">{t('auth.loginError')}</div>}

        <button type="submit" className="login__submit" disabled={status === 'loading'}>
          {status === 'loading' ? t('auth.loggingIn') : t('auth.loginBtn')}
        </button>
      </form>
    </div>
  );
}
