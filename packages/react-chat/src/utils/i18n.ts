import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    lng: 'en', // default language
    fallbackLng: 'no',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
