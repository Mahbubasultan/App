'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Eye, ChevronDown, X } from 'lucide-react';
import { useLocalSavings } from '@/hooks/useLocalSavings';
import { base64ToDataUrl, fileToBase64, getSavingDraft, saveSavingDraft, clearSavingDraft, SavingDraft } from '@/lib/localStorageService';
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

export default function MySavings() {
  const { t } = useSettings();
  const { records, addSaving, isLoading, error } = useLocalSavings();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<SavingDraft>(initialDraft);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const draft = getSavingDraft();
      if (draft) {
        setFormData(draft);
      }
    } catch {
      setStorageError('Unable to restore draft data from storage.');
    }
  }, []);

  const filteredSavings = useMemo(() => {
    return records.filter(saving => {
      const matchesSearch = saving.shareName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || saving.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredSavings.length / itemsPerPage);
  const paginatedSavings = filteredSavings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFormChange = (updates: Partial<SavingDraft>) => {
    const nextDraft = { ...formData, ...updates };
    setFormData(nextDraft);
    saveSavingDraft(nextDraft);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const base64 = await fileToBase64(file);
        handleFormChange({ screenshot: base64, screenshotFileName: file.name });
      } catch (err) {
        setStorageError('Unable to process the uploaded image.');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const share = mockShares.find(item => item.id.toString() === formData.shareId);
      if (!share) {
        setStorageError('Please select a share to continue.');
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
    } catch (err) {
      setStorageError('Unable to save this record right now. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const statusOptions = ['All', 'Approved', 'Pending', 'Rejected'];

  return (
    <MemberLayout userName="Jean Baptiste Mugabo">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">{t('mySavings')}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 mt-1">{t('trackSavings')}</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] hover:shadow-lg transition-all duration-300 w-full sm:w-fit text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            {t('addSaving')}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-700">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 flex-col lg:flex-row lg:items-center">
                <div className="relative w-full lg:max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-slate-500"
                  />
                </div>
                <button className="px-4 py-2 bg-[#0B5D3B] text-white rounded-xl font-medium hover:bg-[#094a2e] transition-all duration-200 text-sm whitespace-nowrap">
                  {t('searchButton')}
                </button>
              </div>

              <div className="relative w-full lg:w-64" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-medium flex items-center justify-between hover:border-[#0B5D3B] focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all"
                >
                  <span>{t(statusFilter.toLowerCase() as any) || statusFilter}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setStatusFilter(option);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          statusFilter === option
                            ? 'bg-[#0B5D3B] text-white font-semibold'
                            : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {t(option.toLowerCase() as any) || option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">{t('shareName')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">{t('amount')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">Proof</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">{t('date')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">{t('status')}</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSavings.map((saving) => (
                    <tr key={saving.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-slate-100 text-xs sm:text-sm">{saving.shareName}</td>
                      <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm whitespace-nowrap">{saving.amount.toLocaleString()} RWF</td>
                      <td className="py-3 px-4">
                        {saving.screenshot ? (
                          <img
                            src={saving.screenshot.startsWith('data:') ? saving.screenshot : `data:image/png;base64,${saving.screenshot}`}
                            alt="Proof"
                            className="rounded-lg h-10 w-10 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-gray-500 dark:text-slate-400">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-slate-300 text-xs sm:text-sm whitespace-nowrap">{saving.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(saving.status)}`}>
                          {saving.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedSaving(saving);
                            setIsViewModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center p-2 text-[#0B5D3B] hover:bg-[#0B5D3B]/10 rounded-lg transition-all"
                          title={t('viewDetails')}
                        >
                          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 text-center sm:text-left">
              Showing <span className="font-semibold text-gray-900 dark:text-slate-100">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-semibold text-gray-900 dark:text-slate-100">{Math.min(currentPage * itemsPerPage, filteredSavings.length)}</span> of <span className="font-semibold text-gray-900 dark:text-slate-100">{filteredSavings.length}</span>
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {storageError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {storageError}
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Loading savings data...
        </div>
      )}

      {!isLoading && !filteredSavings.length && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
          No savings found yet. Add a new saving to get started.
        </div>
      )}

      {/* Add Saving Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white dark:bg-slate-950 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B5D3B] px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{t('addSaving')}</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">{t('shareName')}</label>
                <select
                  value={formData.shareId}
                  onChange={(e) => handleFormChange({ shareId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-medium"
                >
                  <option value="">Choose a share...</option>
                  {mockShares.map(share => (
                    <option key={share.id} value={share.id}>{share.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">{t('amount')}</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange({ amount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">{t('paymentProof')}</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-4 hover:border-emerald-500 transition-colors bg-white dark:bg-slate-950">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                  {formData.screenshotFileName && (
                    <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
                      ✓ File selected: {formData.screenshotFileName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-200 font-semibold hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] hover:shadow-lg transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white dark:bg-slate-950 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="bg-[#0B5D3B] px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{t('viewDetails')}</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{t('shareName')}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{selectedSaving.shareName}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{t('amount')}</p>
                  <p className="text-sm font-bold text-[#0B5D3B]">{selectedSaving.amount.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{t('date')}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{selectedSaving.date}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{t('status')}</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(selectedSaving.status)}`}>
                    {selectedSaving.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">{t('paymentProof')}</p>
                {selectedSaving.screenshot ? (
                  <img
                    src={selectedSaving.screenshot.startsWith('data:') ? selectedSaving.screenshot : `data:image/png;base64,${selectedSaving.screenshot}`}
                    alt="Proof"
                    className="rounded-xl w-full object-cover border border-gray-200 dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 py-10 text-center text-sm text-gray-500 dark:text-slate-400">
                    No uploaded proof available.
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full px-4 py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}

  return (
    <MemberLayout userName="Jean Baptiste Mugabo">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Savings</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage all your savings contributions</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] hover:shadow-lg transition-all duration-300 w-full sm:w-fit text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Add Saving
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filter Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-3">
              {/* Search Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                  />
                </div>
                <button className="px-4 py-2 bg-[#0B5D3B] text-white rounded-xl font-medium hover:bg-[#094a2e] transition-all duration-200 text-sm whitespace-nowrap">
                  Search
                </button>
              </div>

              {/* Custom Dropdown */}
              <div className="relative w-full" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 font-medium flex items-center justify-between hover:border-[#0B5D3B] focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all"
                >
                  <span>{statusFilter}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setStatusFilter(option);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          statusFilter === option
                            ? 'bg-[#0B5D3B] text-white font-semibold'
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

          {/* Table Section */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Share Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSavings.map((saving) => (
                    <tr key={saving.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{saving.shareName}</td>
                      <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm whitespace-nowrap">{saving.amount.toLocaleString()} RWF</td>
                      <td className="py-3 px-4 text-gray-600 text-xs sm:text-sm whitespace-nowrap">{saving.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(saving.status)}`}>
                          {saving.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedSaving(saving);
                            setIsViewModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center p-2 text-[#0B5D3B] hover:bg-[#0B5D3B]/10 rounded-lg transition-all"
                          title="View details"
                        >
                          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Section */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredSavings.length)}</span> of <span className="font-semibold text-gray-900">{filteredSavings.length}</span>
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Saving Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0B5D3B] px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add New Saving</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Share</label>
                <select
                  value={formData.shareId}
                  onChange={(e) => setFormData({ ...formData, shareId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-gray-900 font-medium"
                >
                  <option value="">Choose a share...</option>
                  {mockShares.map(share => (
                    <option key={share.id} value={share.id}>{share.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Payment Proof</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                  {formData.screenshot && (
                    <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
                      ✓ File selected: {formData.screenshot.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] hover:shadow-lg transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Saving Modal */}
      {isViewModalOpen && selectedSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#0B5D3B] px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Saving Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-3">
              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Share Name</p>
                  <p className="text-sm font-bold text-gray-900">{selectedSaving.shareName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Amount</p>
                  <p className="text-sm font-bold text-[#0B5D3B]">{selectedSaving.amount.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-900">{selectedSaving.date}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSaving.status)}`}>
                    {selectedSaving.status}
                  </span>
                </div>
              </div>

              {/* Screenshot */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Payment Proof</p>
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <Image 
                    src={selectedSaving.screenshot} 
                    alt="Screenshot" 
                    fill 
                    className="rounded-xl shadow-lg object-cover border border-gray-200" 
                  />
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full px-4 py-2.5 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}
