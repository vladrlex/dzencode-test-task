import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  // Передаємо i18n в react-i18next
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;