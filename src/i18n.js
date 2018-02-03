import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'languageByDomain',
  lookup: (options) => options.hostname.match(/\.im$/i) ? 'ru' : 'en',
});

i18n
  .use(Backend)
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    detection: {
      order: ['languageByDomain', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      hostname: window.location.hostname,
    },
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true,
    },
  });

export default i18n;
