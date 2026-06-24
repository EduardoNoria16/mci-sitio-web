import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDict } from '../data/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <K extends keyof TranslationDict>(key: K) => TranslationDict[K];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('mci_language');
      if (stored === 'es' || stored === 'en') {
        return stored as Language;
      }
    } catch (e) {
      // Ignorar errores de localStorage
    }
    return 'es'; // Idioma por defecto
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('mci_language', lang);
    } catch (e) {
      // Ignorar errores de localStorage
    }
  };

  const t = <K extends keyof TranslationDict>(key: K): TranslationDict[K] => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
