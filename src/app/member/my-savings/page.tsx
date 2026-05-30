'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import ActionCell from '@/components/ui/ActionCell';
import { SearchBar } from '@/components/ui/SearchBar';
import { useLocalSavings } from '@/hooks/useLocalSavings';
import { getUserSession } from '@/lib/auth';
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

interface MemberShare {
  id: string;
  name: string; 
}

const initialDraft: SavingDraft = {
  shareId: '',
  amount: 0,
  screenshot: null,
  screenshotFileName: '',
};

const itemsPerPage = 5;

export default function MySavings() {
  const { records, addSaving, updateSaving, deleteSaving, isLoading } = useLocalSavings();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<SavingRecord | null>(null);
  const [editingSaving, setEditingSaving] = useState<SavingRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);
  const [viewImagePreview, setViewImagePreview] = useState<string | null>(null);
  const [viewImageFileName, setViewImageFileName] = useState<string>('');
  const [viewImageBase64, setViewImageBase64] = useState<string>('');
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [availableShares, setAvailableShares] = useState<MemberShare[]>([]);

  const [userName, setUserName] = useState('Member');

  const [formData, setFormData] = useState<SavingDraft>(initialDraft);

  useEffect(() => {
    try {
      const draft = getSavingDraft();

      if (draft) {
        setFormData(draft);
        if (draft.screenshot) {
          const preview = base64ToDataUrl(
            draft.screenshot,
            getMimeTypeFromFileName(draft.screenshotFileName || '')
          );
          setAddImagePreview(preview);
        }
      }
    } catch {
      setStorageError('Unable to restore draft data.');
    }
  }, []);

  useEffect(() => {
    const user = getUserSession();
    if (user) {
      setUserName(user.name || 'Member');
      const email = user.email;

      fetch(`/api/member/shares?email=${encodeURIComponent(email)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to load shares');
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data.shares)) {
            setAvailableShares(data.shares);
          }
        })
        .catch(() => {
          setStorageError('Unable to load your shares.');
        });
    }
  }, []);

  const filteredSavings = useMemo(() => {
    return records.filter((saving) => {
      const lowerSearch = searchQuery.toLowerCase();
      const amountText = [saving.amount.toString(), saving.amount.toLocaleString()];
      const matchesStatus = activeTab === 'All' || saving.status === activeTab;
      const matchesSearch =
        searchQuery === '' ||
        saving.shareName.toLowerCase().includes(lowerSearch) ||
        saving.status.toLowerCase().includes(lowerSearch) ||
        amountText.some((value) => value.toLowerCase().includes(lowerSearch));
      return matchesStatus && matchesSearch;
    });
  }, [records, searchQuery, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

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
    if (!editingSaving) {
      saveSavingDraft(nextDraft);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];

        const base64 = await fileToBase64(file);
        const preview = base64ToDataUrl(
          base64,
          getMimeTypeFromFileName(file.name)
        );

        handleFormChange({
          screenshot: base64,
          screenshotFileName: file.name,
        });
        setAddImagePreview(preview);
      } catch {
        setStorageError('Unable to upload image.');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const share = availableShares.find(
        (item) => item.id.toString() === formData.shareId
      );
      const isCurrentEditedShare = editingSaving && formData.shareId === `current-${editingSaving.id}`;
      const shareName = share?.name || (isCurrentEditedShare ? editingSaving.shareName : '');

      if (!shareName) {
        setStorageError('Please select a share.');
        return;
      }

      if (editingSaving) {
        await updateSaving(editingSaving.id, {
          shareName,
          amount: formData.amount,
          screenshot: formData.screenshot || '',
          screenshotFileName: formData.screenshotFileName,
        });
      } else {
        await addSaving({
          shareName,
          amount: formData.amount,
          screenshot: formData.screenshot || '',
          screenshotFileName: formData.screenshotFileName,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending',
        });
      }

      clearSavingDraft();
      setFormData(initialDraft);
      setIsAddModalOpen(false);
      setEditingSaving(null);
      setStorageError(null);
      setAddImagePreview(null);
    } catch {
      setStorageError('Unable to save record.');
    }
  };

  const openAddModal = () => {
    clearSavingDraft();
    setEditingSaving(null);
    setSelectedSaving(null);
    setFormData(initialDraft);
    setAddImagePreview(null);
    setStorageError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (saving: SavingRecord) => {
    const matchingShare = availableShares.find((share) => share.name === saving.shareName);
    setEditingSaving(saving);
    setSelectedSaving(saving);
    setFormData({
      shareId: matchingShare?.id.toString() || `current-${saving.id}`,
      amount: saving.amount,
      screenshot: saving.screenshot || null,
      screenshotFileName: saving.screenshotFileName || '',
    });
    setAddImagePreview(
      saving.screenshot
        ? base64ToDataUrl(saving.screenshot, getMimeTypeFromFileName(saving.screenshotFileName || ''))
        : null
    );
    setStorageError(null);
    setIsAddModalOpen(true);
  };

  const closeFormModal = () => {
    setIsAddModalOpen(false);
    setEditingSaving(null);
    setSelectedSaving(null);
    setFormData(initialDraft);
    setAddImagePreview(null);
    if (!editingSaving) {
      clearSavingDraft();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Savings</h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Track your savings contributions and manage proof images for each record.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0B5D3B] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#094a2e] hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add Saving
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-[420px]">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={() => setSearchQuery(searchQuery)}
                onClear={() => setSearchQuery('')}
                placeholder="Search by name, status, or amount..."
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-[#0B5D3B] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSavings.map((saving) => (
                <tr key={saving.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{saving.shareName}</td>
                  <td className="py-3 px-4 text-[#0B5D3B] font-semibold">
                    {saving.amount.toLocaleString()} RWF
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(saving.status)}`}>
                      {saving.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ActionCell
                      onView={() => {
                        setSelectedSaving(saving);
                        setIsViewModalOpen(true);
                      }}
                      onEdit={() => {
                        openEditModal(saving);
                      }}
                      onDelete={async () => {
                        if (confirm('Are you sure you want to delete this saving?')) {
                          await deleteSaving(saving.id);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {filteredSavings.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSavings.length)} of {filteredSavings.length}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg min-w-[32px] ${currentPage === page ? 'bg-[#0B5D3B] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
                <h2 className="text-xl font-bold text-gray-900">{editingSaving ? 'Edit Saving' : 'Add New Saving'}</h2>
                <p className="text-sm text-gray-600">{editingSaving ? 'Update your savings record and proof image.' : 'Add a savings record and upload proof image if available.'}</p>
              </div>
              <button onClick={closeFormModal} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
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
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                  >
                    <option value="" disabled={availableShares.length > 0}>
                      {availableShares.length > 0 ? 'Select share' : 'Loading shares...'}
                    </option>
                    {editingSaving && !availableShares.some((share) => share.id.toString() === formData.shareId) && (
                      <option value={`current-${editingSaving.id}`}>{editingSaving.shareName}</option>
                    )}
                    {availableShares.length === 0 && (
                      <option value="" disabled>No shares available</option>
                    )}
                    {availableShares.map((share) => (
                      <option key={share.id} value={share.id}>{share.name}</option>
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
                {addImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        src={addImagePreview}
                        alt="Proof preview"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 md:flex-row md:justify-end">
              <button
                onClick={closeFormModal}
                className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:shadow-md"
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className="rounded-2xl bg-[#0B5D3B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#094a2e] shadow-lg hover:shadow-xl">
                {editingSaving ? 'Update Saving' : 'Save Saving'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Saving Details</h2>
                </div>
                <button onClick={closeViewModal} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 px-6 py-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Share</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedSaving.shareName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Amount</p>
                    <p className="text-sm font-semibold text-[#0B5D3B]">{selectedSaving.amount.toLocaleString()} RWF</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedSaving.status)}`}>
                      {selectedSaving.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedSaving.date}</p>
                  </div>
                </div>

                {viewImagePreview && (
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Proof Image</p>
                    <div className="relative h-64 w-full overflow-hidden rounded-xl">
                      <Image
                        src={viewImagePreview}
                        alt="Proof preview"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex border-t border-gray-200 px-6 py-4">
                <button onClick={closeViewModal} className="w-full px-5 py-3 bg-[#0B5D3B] text-white rounded-2xl font-semibold hover:bg-[#094a2e] transition-colors text-sm shadow-lg hover:shadow-xl">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
