import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./public/locales/en/common.json";
import de from "./public/locales/de/common.json";
import es from "./public/locales/es/common.json";
import tr from "./public/locales/tr/common.json";
import ar from "./public/locales/ar/common.json";
import fa from "./public/locales/fa/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
    tr: { translation: tr },
    ar: { translation: ar },
    fa: { translation: fa },
  },
  lng: "fa",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  react: {
    useSuspense: false, // Set to true if you want to use Suspense for loading translations
  },
});

export default i18n;
