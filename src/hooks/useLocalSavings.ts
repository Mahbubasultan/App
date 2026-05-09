/**
 * Custom React Hook for managing savings data with localStorage
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  SavingRecord,
  UserData,
  saveSavingRecord,
  getSavingRecords,
  updateSavingRecord,
  deleteSavingRecord,
  searchSavingRecords,
  getSavingRecordsByStatus,
  saveUserData,
  getUserData,
  updateUserData,
  fileToBase64,
  getSavingsStatistics,
} from '@/lib/localStorageService';

export interface UseSavingsReturn {
  // Savings records
  records: SavingRecord[];
  isLoading: boolean;
  error: string | null;
  
  // Record operations
  addSaving: (saving: Omit<SavingRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SavingRecord | null>;
  updateSaving: (id: string, updates: Partial<SavingRecord>) => Promise<SavingRecord | null>;
  deleteSaving: (id: string) => Promise<boolean>;
  getSavingById: (id: string) => SavingRecord | null;
  
  // Filtering and searching
  filterByStatus: (status: SavingRecord['status']) => SavingRecord[];
  search: (query: string) => SavingRecord[];
  
  // File handling
  processImageFile: (file: File) => Promise<string>;
  
  // User data
  userData: UserData | null;
  setUserData: (data: UserData) => Promise<void>;
  updateUser: (updates: Partial<UserData>) => Promise<void>;
  
  // Statistics
  statistics: ReturnType<typeof getSavingsStatistics>;
  
  // Refresh
  refresh: () => void;
}

export const useLocalSavings = (): UseSavingsReturn => {
  const [records, setRecords] = useState<SavingRecord[]>([]);
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedRecords = getSavingRecords();
      const savedUserData = getUserData();
      setRecords(savedRecords);
      setUserDataState(savedUserData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    try {
      const savedRecords = getSavingRecords();
      const savedUserData = getUserData();
      setRecords(savedRecords);
      setUserDataState(savedUserData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  }, []);

  const addSaving = useCallback(
    async (saving: Omit<SavingRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newRecord = saveSavingRecord(saving);
        setRecords(prev => [...prev, newRecord]);
        setError(null);
        return newRecord;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add saving';
        setError(message);
        return null;
      }
    },
    []
  );

  const updateSaving = useCallback(
    async (id: string, updates: Partial<SavingRecord>) => {
      try {
        const updated = updateSavingRecord(id, updates);
        if (updated) {
          setRecords(prev => prev.map(r => r.id === id ? updated : r));
          setError(null);
        }
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update saving';
        setError(message);
        return null;
      }
    },
    []
  );

  const deleteSaving = useCallback(
    async (id: string) => {
      try {
        const success = deleteSavingRecord(id);
        if (success) {
          setRecords(prev => prev.filter(r => r.id !== id));
          setError(null);
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete saving';
        setError(message);
        return false;
      }
    },
    []
  );

  const getSavingById = useCallback((id: string) => {
    return records.find(r => r.id === id) || null;
  }, [records]);

  const filterByStatus = useCallback((status: SavingRecord['status']) => {
    return getSavingRecordsByStatus(status);
  }, []);

  const search = useCallback((query: string) => {
    return searchSavingRecords(query);
  }, []);

  const processImageFile = useCallback(async (file: File): Promise<string> => {
    try {
      const base64 = await fileToBase64(file);
      return base64;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image';
      setError(message);
      throw err;
    }
  }, []);

  const setUserData = useCallback(async (data: UserData) => {
    try {
      saveUserData(data);
      setUserDataState(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save user data';
      setError(message);
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserData>) => {
    try {
      const updated = updateUserData(updates);
      if (updated) {
        setUserDataState(updated);
        setError(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user data';
      setError(message);
      throw err;
    }
  }, []);

  const statistics = getSavingsStatistics();

  return {
    records,
    isLoading,
    error,
    addSaving,
    updateSaving,
    deleteSaving,
    getSavingById,
    filterByStatus,
    search,
    processImageFile,
    userData,
    setUserData,
    updateUser,
    statistics,
    refresh,
  };
};
