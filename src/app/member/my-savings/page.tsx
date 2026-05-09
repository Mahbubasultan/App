'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Eye, ChevronDown, X } from 'lucide-react';
import { useLocalSavings } from '@/hooks/useLocalSavings';
import {
  fileToBase64,
  getSavingDraft,
  saveSavingDraft,
  clearSavingDraft,
  SavingDraft,
} from '@/lib/localStorageService';
import { useSettings } from '@/context/SettingsContext';

const mockShares = [
  { id: 1, name: 'Emergency Fund' },
  { id: 2, name: 'Education Share' },
  { id: 3, name: 'Business Capital' },
  { id: 4, name: 'Health Share' },
];

const initialDraft: SavingDraft = {
  shareId: '',
  amount: 0,
  screenshot: null,
  screenshotFileName: '',
};

const itemsPerPage = 5;

export default function MySavings() {
  const { t } = useSettings();
  const { records, addSaving, isLoading } = useLocalSavings();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<SavingDraft>(initialDraft);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const draft = getSavingDraft();

      if (draft) {
        setFormData(draft);
      }
    } catch {
      setStorageError('Unable to restore draft data.');
    }
  }, []);

  const filteredSavings = useMemo(() => {
    return records.filter((saving) => {
      const matchesSearch = saving.shareName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || saving.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredSavings.length / itemsPerPage);

  const paginatedSavings = filteredSavings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFormChange = (updates: Partial<SavingDraft>) => {
    const nextDraft = {
      ...formData,
      ...updates,
    };

    setFormData(nextDraft);
    saveSavingDraft(nextDraft);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];

        const base64 = await fileToBase64(file);

        handleFormChange({
          screenshot: base64,
          screenshotFileName: file.name,
        });
      } catch {
        setStorageError('Unable to upload image.');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const share = mockShares.find(
        (item) => item.id.toString() === formData.shareId
      );

      if (!share) {
        setStorageError('Please select a share.');
        return;
      }

      await addSaving({
        shareName: share.name,
        amount: formData.amount,
        screenshot: formData.screenshot || '',
        screenshotFileName: formData.screenshotFileName,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      clearSavingDraft();
      setFormData(initialDraft);
      setIsAddModalOpen(false);
      setStorageError(null);
    } catch {
      setStorageError('Unable to save record.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';

      case 'Pending':
        return 'bg-amber-100 text-amber-700';

      case 'Rejected':
        return 'bg-rose-100 text-rose-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const statusOptions = ['All', 'Approved', 'Pending', 'Rejected'];

  return (
    <MemberLayout userName="Jean Baptiste Mugabo">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('mySavings')}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {t('trackSavings')}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold"
          >
            <Plus size={18} />
            {t('addSaving')}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />

                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl"
                  />
                </div>

                <button className="px-4 py-2 bg-[#0B5D3B] text-white rounded-xl text-sm">
                  Search
                </button>
              </div>

              <div className="relative w-full" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl bg-white flex items-center justify-between"
                >
                  <span>{statusFilter}</span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setStatusFilter(option);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === option
                            ? 'bg-[#0B5D3B] text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4">Share Name</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedSavings.map((saving) => (
                  <tr
                    key={saving.id}
                    className="border-b border-gray-100"
                  >
                    <td className="py-3 px-4">{saving.shareName}</td>

                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold">
                      {saving.amount.toLocaleString()} RWF
                    </td>

                    <td className="py-3 px-4">{saving.date}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          saving.status
                        )}`}
                      >
                        {saving.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedSaving(saving);
                          setIsViewModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center p-2 text-[#0B5D3B]"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {storageError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {storageError}
          </div>
        )}
      </div>
    </MemberLayout>
  );
}