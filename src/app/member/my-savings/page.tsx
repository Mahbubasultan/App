'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Eye, ChevronDown, X } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { useLocalSavings } from '@/hooks/useLocalSavings';
import {
  SavingRecord,
  fileToBase64,
  getSavingDraft,
  saveSavingDraft,
  clearSavingDraft,
  SavingDraft,
  base64ToDataUrl,
  getMimeTypeFromFileName,
} from '@/lib/localStorageService';

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
  const { records, addSaving, updateSaving, isLoading } = useLocalSavings();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<SavingRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);
  const [viewImagePreview, setViewImagePreview] = useState<string | null>(null);
  const [viewImageFileName, setViewImageFileName] = useState<string>('');
  const [viewImageBase64, setViewImageBase64] = useState<string>('');

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
      });

      clearSavingDraft();
      setFormData(initialDraft);
      setIsAddModalOpen(false);
      setStorageError(null);
    } catch {
      setStorageError('Unable to save record.');
    }
  };

  useEffect(() => {
    if (!selectedSaving) {
      setViewImagePreview(null);
      setViewImageBase64('');
      setViewImageFileName('');
      return;
    }

    if (selectedSaving.screenshot) {
      const newPreview = base64ToDataUrl(
        selectedSaving.screenshot,
        getMimeTypeFromFileName(selectedSaving.screenshotFileName || '')
      );
      setViewImagePreview(newPreview);
      setViewImageBase64(selectedSaving.screenshot);
      setViewImageFileName(selectedSaving.screenshotFileName || 'proof-image');
    }
  }, [selectedSaving]);

  const handleViewFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!selectedSaving) return;

    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const base64 = await fileToBase64(file);
        const preview = base64ToDataUrl(
          base64,
          getMimeTypeFromFileName(file.name)
        );

        setViewImagePreview(preview);
        setViewImageBase64(base64);
        setViewImageFileName(file.name);
        setViewError(null);
      } catch {
        setViewError('Unable to process image preview.');
      }
    }
  };

  const handleSaveProof = async () => {
    if (!selectedSaving) return;
    if (!viewImageBase64) {
      setViewError('Please select an image to attach.');
      return;
    }

    try {
      const updated = await updateSaving(selectedSaving.id, {
        screenshot: viewImageBase64,
        screenshotFileName: viewImageFileName,
      });

      if (updated) {
        setSelectedSaving(updated);
        setViewError(null);
      }
    } catch {
      setViewError('Unable to save proof image.');
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedSaving(null);
    setViewImagePreview(null);
    setViewImageBase64('');
    setViewImageFileName('');
    setViewError(null);
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Savings
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Track your savings contributions and manage proof images for each record.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0B5D3B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#094a2e]"
          >
            <Plus size={18} />
            Add Saving
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={() => setSearchQuery(searchQuery)}
                placeholder="Search savings..."
                className="flex-1 min-w-[240px] max-w-xl"
              />

              <div className="relative w-full sm:w-[220px]" ref={dropdownRef}>
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

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add New Saving</h2>
                  <p className="text-sm text-gray-600">Add a savings record and upload proof image if available.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Share</label>
                    <select
                      value={formData.shareId}
                      onChange={(e) => handleFormChange({ shareId: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                    >
                      <option value="">Select share</option>
                      {mockShares.map((share) => (
                        <option key={share.id} value={share.id}>
                          {share.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleFormChange({ amount: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proof Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                  />
                  {formData.screenshotFileName && (
                    <p className="mt-3 text-sm text-gray-600">Selected file: {formData.screenshotFileName}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 md:flex-row md:justify-end">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="rounded-2xl bg-[#0B5D3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#094a2e]"
                >
                  Save Saving
                </button>
              </div>
            </div>
          </div>
        )}

        {isViewModalOpen && selectedSaving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Saving Details</h2>
                  <p className="text-sm text-gray-600">Review and attach proof image for this saving.</p>
                </div>
                <button
                  onClick={closeViewModal}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 px-6 py-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">Member</p>
                    <p className="text-sm text-gray-900">Jean Baptiste Mugabo</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">Share</p>
                    <p className="text-sm text-gray-900">{selectedSaving.shareName}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">Amount</p>
                    <p className="text-sm text-gray-900">{selectedSaving.amount.toLocaleString()} RWF</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">Status</p>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(selectedSaving.status)}`}>
                      {selectedSaving.status}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">Date</p>
                    <p className="text-sm text-gray-900">{selectedSaving.date}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">Updated</p>
                    <p className="text-sm text-gray-900">{new Date(selectedSaving.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Proof Image</h3>
                      <p className="text-sm text-gray-500">Upload an image from your computer and preview it before saving.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_270px]">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleViewFileChange}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                      />
                      {viewImageFileName && (
                        <p className="mt-3 text-sm text-gray-600">Selected file: {viewImageFileName}</p>
                      )}
                      {viewError && (
                        <p className="mt-3 text-sm text-red-600">{viewError}</p>
                      )}
                    </div>

                    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                      <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                      {viewImagePreview ? (
                        <img
                          src={viewImagePreview}
                          alt="Proof preview"
                          className="mx-auto h-48 w-full max-w-xs rounded-3xl object-contain"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center rounded-3xl bg-white text-sm text-gray-500">
                          No preview available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 md:flex-row md:justify-end">
                <button
                  onClick={closeViewModal}
                  className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveProof}
                  className="rounded-2xl bg-[#0B5D3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#094a2e]"
                >
                  Save Proof Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
}