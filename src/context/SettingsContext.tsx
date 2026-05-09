'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAppSettings, saveAppSettings, AppSettings } from '@/lib/localStorageService';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  theme: 'light',
};

const TRANSLATIONS: Record<'en' | 'fr', Record<string, string>> = {
  en: {
    mySavings: 'My Savings',
    trackSavings: 'Track and manage all your savings contributions',
    searchPlaceholder: 'Search...',
    searchButton: 'Search',
    addSaving: 'Add Saving',
    filterStatus: 'Filter by Status',
    all: 'All',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    shareName: 'Share Name',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    action: 'Action',
    viewDetails: 'View details',
    notifications: 'Notifications',
    manageNotifications: 'View all your notifications and alerts',
    shares: 'Shares',
    manageShares: 'Manage your shares and equity',
    loans: 'Loans',
    manageLoans: 'Request and manage your loans',
    selectLanguage: 'Select Language',
    english: 'English (Eng)',
    french: 'French (Fr)',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    saveChanges: 'Save Changes',
    settingsSaved: 'Settings saved successfully!',
    paymentProof: 'Payment Proof',
    noNotifications: 'No notifications found',
    searchNotifications: 'Search notifications...',
  },
  fr: {
    mySavings: 'Mes économies',
    trackSavings: 'Suivez et gérez toutes vos contributions d’épargne',
    searchPlaceholder: 'Rechercher...',
    searchButton: 'Rechercher',
    addSaving: 'Ajouter une épargne',
    filterStatus: 'Filtrer par statut',
    all: 'Tous',
    approved: 'Approuvé',
    pending: 'En attente',
    rejected: 'Rejeté',
    shareName: 'Nom du partage',
    amount: 'Montant',
    date: 'Date',
    status: 'Statut',
    action: 'Action',
    viewDetails: 'Voir les détails',
    notifications: 'Notifications',
    manageNotifications: 'Voir toutes vos notifications et alertes',
    shares: 'Actions',
    manageShares: 'Gérez vos actions et capitaux',
    loans: 'Prêts',
    manageLoans: 'Demandez et gérez vos prêts',
    selectLanguage: 'Choisir la langue',
    english: 'English (Eng)',
    french: 'Français (Fr)',
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    saveChanges: 'Enregistrer',
    settingsSaved: 'Paramètres enregistrés !',
    paymentProof: 'Preuve de paiement',
    noNotifications: 'Aucune notification trouvée',
    searchNotifications: 'Rechercher des notifications...',
  },
};

interface SettingsContextValue {
  settings: AppSettings;
  setLanguage: (language: AppSettings['language']) => void;
  setTheme: (theme: AppSettings['theme']) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = getAppSettings();
      setSettings(saved);
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      root.setAttribute('lang', settings.language === 'fr' ? 'fr' : 'en');
    }
    try {
      saveAppSettings(settings);
    } catch {
      // ignore save errors silently, handled elsewhere if needed
    }
  }, [settings]);

  const t = useMemo(
    () => (key: string) => {
      return TRANSLATIONS[settings.language][key] || TRANSLATIONS.en[key] || key;
    },
    [settings.language]
  );

  const setLanguage = (language: AppSettings['language']) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const setTheme = (theme: AppSettings['theme']) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setLanguage, setTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
