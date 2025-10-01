import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

import en from './locales/en.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

export const translations: Record<string, any> = { en, ko, zh, ja, es, de, fr };

export const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
];

const getInitialLanguage = (): string => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }
    const browserLang = navigator.language.split(/[-_]/)[0];
    return translations[browserLang] ? browserLang : 'en';
};

interface I18nContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string, replacements?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<string>(getInitialLanguage);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const setLanguage = (lang: string) => {
        if (translations[lang]) {
            setLanguageState(lang);
        }
    };

    const t = useCallback((key: string, replacements?: Record<string, string>): string => {
        const langTranslations = translations[language] || translations.en;
        let translation = key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), langTranslations);

        if (translation === undefined) {
            // Fallback to English if key not found in current language
            translation = key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), translations.en);
        }

        if (typeof translation !== 'string') {
            console.warn(`Translation key '${key}' not found.`);
            return key;
        }

        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
            });
        }

        return translation;
    }, [language]);


    // FIX: Replaced JSX with React.createElement to support .ts file extension.
    // The .ts extension does not allow JSX syntax, which was causing parsing errors.
    return React.createElement(I18nContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useTranslation = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
};