/**
 * Local Storage Service for Savings Data
 * Handles persistent storage of savings records, images, and user information
 */

import { UserRole } from '@/types';

export interface SavingRecord {
  id: string;
  shareName: string;
  amount: number;
  screenshot: string; // Base64 encoded image
  screenshotFileName: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  description?: string;
  momoName?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalSavings: number;
  lastUpdated: string;
}

const STORAGE_KEYS = {
  SAVINGS: 'app_savings_records',
  USER_DATA: 'app_user_data',
  USERS: 'app_users',
  SAVINGS_BACKUP: 'app_savings_backup',
  APP_SETTINGS: 'app_settings',
  SAVING_DRAFT: 'app_saving_draft',
};

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  joinedDate: string;
  totalSavings: number;
  lastUpdated: string;
}

const now = new Date().toISOString();

const DEMO_USERS: RegisteredUser[] = [
  {
    id: 'demo_admin',
    name: 'Admin User',
    email: 'admin@gmail.com',
    phone: '+250788000000',
    password: '123456',
    role: 'admin',
    joinedDate: now,
    totalSavings: 0,
    lastUpdated: now,
  },
  {
    id: 'demo_member',
    name: 'Member User',
    email: 'member@gmail.com',
    phone: '+250788111111',
    password: '123456',
    role: 'member',
    joinedDate: now,
    totalSavings: 250000,
    lastUpdated: now,
  },
  {
    id: 'demo_accountant',
    name: 'Accountant User',
    email: 'accountant@gmail.com',
    phone: '+250788222222',
    password: '123456',
    role: 'accountant',
    joinedDate: now,
    totalSavings: 0,
    lastUpdated: now,
  },
];

export interface AppSettings {
  language: 'en' | 'fr';
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  theme: 'light',
};

const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

export const getMimeTypeFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/png';
  }
};

/**
 * Convert File to Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix to save space
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convert Base64 string back to data URL
 */
export const base64ToDataUrl = (base64: string, mimeType: string = 'image/png'): string => {
  return `data:${mimeType};base64,${base64}`;
};

/**
 * Save a new saving record
 */
export const saveSavingRecord = (record: Omit<SavingRecord, 'id' | 'createdAt' | 'updatedAt'>): SavingRecord => {
  if (!isLocalStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  try {
    const existingRecords = getSavingRecords();
    
    const newRecord: SavingRecord = {
      ...record,
      id: `saving_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedRecords = [...existingRecords, newRecord];
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(updatedRecords));
    
    // Create backup
    localStorage.setItem(STORAGE_KEYS.SAVINGS_BACKUP, JSON.stringify(updatedRecords));
    
    return newRecord;
  } catch (error) {
    console.error('Error saving record to localStorage:', error);
    throw new Error('Failed to save savings record. Storage may be full.');
  }
};

/**
 * Get all saving records
 */
export const getSavingRecords = (): SavingRecord[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving savings records:', error);
    // Try to recover from backup
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.SAVINGS_BACKUP);
      return backup ? JSON.parse(backup) : [];
    } catch {
      return [];
    }
  }
};

/**
 * Get a specific saving record by ID
 */
export const getSavingRecordById = (id: string): SavingRecord | null => {
  const records = getSavingRecords();
  return records.find(record => record.id === id) || null;
};

/**
 * Update a saving record
 */
export const updateSavingRecord = (id: string, updates: Partial<SavingRecord>): SavingRecord | null => {
  if (!isLocalStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  try {
    const records = getSavingRecords();
    const index = records.findIndex(record => record.id === id);
    
    if (index === -1) return null;

    const updatedRecord: SavingRecord = {
      ...records[index],
      ...updates,
      id: records[index].id, // Preserve ID
      createdAt: records[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    records[index] = updatedRecord;
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(records));
    localStorage.setItem(STORAGE_KEYS.SAVINGS_BACKUP, JSON.stringify(records));
    
    return updatedRecord;
  } catch (error) {
    console.error('Error updating savings record:', error);
    throw new Error('Failed to update savings record.');
  }
};

/**
 * Delete a saving record
 */
export const deleteSavingRecord = (id: string): boolean => {
  if (!isLocalStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  try {
    const records = getSavingRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(filteredRecords));
    localStorage.setItem(STORAGE_KEYS.SAVINGS_BACKUP, JSON.stringify(filteredRecords));
    return true;
  } catch (error) {
    console.error('Error deleting savings record:', error);
    throw new Error('Failed to delete savings record.');
  }
};

/**
 * Get records filtered by status
 */
export const getSavingRecordsByStatus = (status: SavingRecord['status']): SavingRecord[] => {
  const records = getSavingRecords();
  return records.filter(record => record.status === status);
};

/**
 * Search records by name
 */
export const searchSavingRecords = (query: string): SavingRecord[] => {
  const records = getSavingRecords();
  const lowerQuery = query.toLowerCase();
  return records.filter(record =>
    record.shareName.toLowerCase().includes(lowerQuery) ||
    record.userName?.toLowerCase().includes(lowerQuery) ||
    record.transactionId?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Save user data
 */
export const saveUserData = (userData: UserData): void => {
  if (!isLocalStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  try {
    const userDataWithTimestamp: UserData = {
      ...userData,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userDataWithTimestamp));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw new Error('Failed to save user data.');
  }
};

export const getRegisteredUsers = (): RegisteredUser[] => {
  if (!isLocalStorageAvailable()) {
    return DEMO_USERS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    const savedUsers = stored ? (JSON.parse(stored) as RegisteredUser[]) : [];
    const savedEmails = new Set(savedUsers.map((user) => user.email.toLowerCase()));
    const missingDemoUsers = DEMO_USERS.filter((user) => !savedEmails.has(user.email.toLowerCase()));
    return [...savedUsers, ...missingDemoUsers];
  } catch (error) {
    console.error('Error retrieving registered users:', error);
    return DEMO_USERS;
  }
};

export const saveRegisteredUser = (user: RegisteredUser): void => {
  if (!isLocalStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  try {
    const users = getRegisteredUsers();
    const existing = users.find((existingUser) => existingUser.email.toLowerCase() === user.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving registered user:', error);
    throw error instanceof Error ? error : new Error('Failed to save registration data.');
  }
};

export const findRegisteredUserByEmail = (email: string): RegisteredUser | null => {
  const users = getRegisteredUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
};

export const authenticateRegisteredUser = (email: string, password: string): RegisteredUser | null => {
  const user = findRegisteredUserByEmail(email);
  if (!user) {
    return null;
  }
  return user.password === password ? user : null;
};

/**
 * Get user data
 */
export const getUserData = (): UserData | null => {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Update user data (for name, email, phone, etc.)
 */
export const updateUserData = (updates: Partial<UserData>): UserData | null => {
  try {
    const existingData = getUserData();
    if (!existingData) return null;

    const updatedData: UserData = {
      ...existingData,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data.');
  }
};

export const saveAppSettings = (settings: AppSettings): void => {
  if (!isLocalStorageAvailable()) {
    throw new Error('Local storage is not available.');
  }

  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app settings:', error);
    throw new Error('Failed to save settings. Storage may be unavailable.');
  }
};

export const getAppSettings = (): AppSettings => {
  if (!isLocalStorageAvailable()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return stored ? (JSON.parse(stored) as AppSettings) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error retrieving app settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export interface SavingDraft {
  shareId: string;
  amount: number;
  screenshot: string | null;
  screenshotFileName: string;
}

export const saveSavingDraft = (draft: SavingDraft | null): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    if (draft) {
      localStorage.setItem(STORAGE_KEYS.SAVING_DRAFT, JSON.stringify(draft));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SAVING_DRAFT);
    }
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};

export const getSavingDraft = (): SavingDraft | null => {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVING_DRAFT);
    return stored ? (JSON.parse(stored) as SavingDraft) : null;
  } catch (error) {
    console.error('Error retrieving draft:', error);
    return null;
  }
};

export const clearSavingDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVING_DRAFT);
  } catch (error) {
    console.error('Error clearing draft:', error);
  }
};

/**
 * Get storage usage information
 */
export const getStorageUsage = (): { used: number; percentage: number } => {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    // Rough estimate: typical browser allows ~5-10MB
    const estimatedMax = 10 * 1024 * 1024; // 10MB
    return {
      used: total,
      percentage: (total / estimatedMax) * 100,
    };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return { used: 0, percentage: 0 };
  }
};

/**
 * Clear all savings data (be careful!)
 */
export const clearAllSavingsData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVINGS);
    localStorage.removeItem(STORAGE_KEYS.SAVINGS_BACKUP);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USERS);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new Error('Failed to clear data.');
  }
};

/**
 * Export all data as JSON (for backup/download)
 */
export const exportAllData = (): {
  savings: SavingRecord[];
  userData: UserData | null;
  exportDate: string;
} => {
  return {
    savings: getSavingRecords(),
    userData: getUserData(),
    exportDate: new Date().toISOString(),
  };
};

/**
 * Import data from JSON (restore from backup)
 */
export const importData = (data: {
  savings: SavingRecord[];
  userData: UserData | null;
}): void => {
  try {
    if (data.savings && Array.isArray(data.savings)) {
      localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(data.savings));
      localStorage.setItem(STORAGE_KEYS.SAVINGS_BACKUP, JSON.stringify(data.savings));
    }
    if (data.userData) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.userData));
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Failed to import data.');
  }
};

/**
 * Get statistics about savings
 */
export const getSavingsStatistics = () => {
  const records = getSavingRecords();
  return {
    totalRecords: records.length,
    totalApproved: records.filter(r => r.status === 'Approved').length,
    totalPending: records.filter(r => r.status === 'Pending').length,
    totalRejected: records.filter(r => r.status === 'Rejected').length,
    totalAmount: records
      .filter(r => r.status === 'Approved')
      .reduce((sum, r) => sum + r.amount, 0),
  };
};
