import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, getLanguageByCode } from '../i18n/languages';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_language');
      if (saved && AVAILABLE_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_LANGUAGE;
  });

  const currentLanguageObj = useMemo(() => {
    return getLanguageByCode(language);
  }, [language]);

  // Synchronize <html> attributes (lang and dir)
  useEffect(() => {
    try {
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', currentLanguageObj?.dir || 'ltr');
      localStorage.setItem('sahayak_language', language);
    } catch (e) {
      console.error('Failed to sync language attributes', e);
    }
  }, [language, currentLanguageObj]);

  const setLanguage = useCallback((code) => {
    if (AVAILABLE_LANGUAGES.some(l => l.code === code)) {
      setLanguageState(code);
    }
  }, []);

  // Translation lookup helper
  const t = useCallback((path, fallbackOrParams = null, params = null) => {
    let fallback = typeof fallbackOrParams === 'string' ? fallbackOrParams : null;
    let actualParams = typeof fallbackOrParams === 'object' && fallbackOrParams !== null ? fallbackOrParams : params;

    const resolvePath = (obj, p) => {
      if (!obj) return null;
      const parts = p.split('.');
      let current = obj;
      for (const part of parts) {
        if (current === undefined || current === null) return null;
        current = current[part];
      }
      return current;
    };

    // Try current selected language
    let result = resolvePath(translations[language], path);

    // Fallback to English
    if (result === undefined || result === null) {
      result = resolvePath(translations[DEFAULT_LANGUAGE], path);
    }

    // Final fallback
    if (result === undefined || result === null) {
      result = fallback !== null ? fallback : path;
    }

    // Variable interpolation if string and params provided, e.g. {name} or {count}
    if (typeof result === 'string' && actualParams) {
      return result.replace(/\{(\w+)\}/g, (match, key) => {
        return actualParams[key] !== undefined ? actualParams[key] : match;
      });
    }

    return result;
  }, [language]);

  const value = useMemo(() => ({
    language,
    currentLanguageObj,
    availableLanguages: AVAILABLE_LANGUAGES,
    setLanguage,
    t
  }), [language, currentLanguageObj, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

