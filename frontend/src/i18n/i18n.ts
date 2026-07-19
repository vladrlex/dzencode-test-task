import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

export const LANGUAGE_STORAGE_KEY = 'app_language';

i18n
  .use(Backend)
  // Передаємо i18n в react-i18next
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en',
    fallbackLng: 'en',

    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;