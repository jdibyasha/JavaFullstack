import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./i18n/en/translate.json";
import translationFN from "./i18n/fr/translate.json";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbacking: "en",
		interpolation: { escapeValue: false },
		resources: {
			en: {
				translation: translationEN,
			},
			fr: { translation: translationFN },
		},
	});

export default i18n;
