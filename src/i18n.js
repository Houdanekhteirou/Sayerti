import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from './locale/en.json'; // Modifié en minuscules : en.json
import translationAR from './locale/ar.json'; // Modifié en minuscules : ar.json

// Les traductions
const resources = {
  fr: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) 
  .init({
    resources,
    lng: "fr", 
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
        useSuspense: false
    }
  });

export default i18n;
