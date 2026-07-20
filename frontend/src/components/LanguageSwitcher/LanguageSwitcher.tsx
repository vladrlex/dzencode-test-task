import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY } from '../../i18n/i18n';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <button
        onClick={() => changeLanguage('en')}
        className={`language-switcher__btn ${i18n.language === 'en' ? 'language-switcher__btn--active' : ''}`}
      >
        EN
      </button>
      <span className="language-switcher__divider">|</span>
      <button
        onClick={() => changeLanguage('ru')}
        className={`language-switcher__btn ${i18n.language === 'ru' ? 'language-switcher__btn--active' : ''}`}
      >
        RU
      </button>
    </div>
  );
}
