import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import * as Localization from "expo-localization"
import { ar } from "./ar"
import { en } from "./en"

const resources = {
  en,
  ar,
}

i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next.
  .init({
    resources,
    lng: Localization.locale.split("-")[0], // Automatically detect user's language
    fallbackLng: "ar", // Default language
    interpolation: {
      escapeValue: false, // React already escapes strings
    },
  })

export default i18n
