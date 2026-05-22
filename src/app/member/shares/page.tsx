'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Eye, X, Edit, Trash2 } from 'lucide-react';
import ActionCell from '@/components/ui/ActionCell';
import GenericEditModal from '@/components/ui/GenericEditModal';
import { SearchBar } from '@/components/ui/SearchBar';
import { useSettings } from '@/context/SettingsContext';

const defaultShares: ShareRecord[] = [
  { id: 'SHR-1001', name: 'Jean Baptiste', value: 60000, totalContributed: 72000, createdDate: '2024-02-14', status: 'Approved' },
  { id: 'SHR-1002', name: 'Marie Claire', value: 45000, totalContributed: 45000, createdDate: '2024-02-08', status: 'Pending' },
  { id: 'SHR-1003', name: 'Eric Habimana', value: 90000, totalContributed: 150000, createdDate: '2024-01-30', status: 'Approved' },
  { id: 'SHR-1004', name: 'Grace Umutoni', value: 30000, totalContributed: 30000, createdDate: '2024-03-05', status: 'Pending' },
  { id: 'SHR-1005', name: 'Patrick Nkunda', value: 52000, totalContributed: 52000, createdDate: '2024-02-22', status: 'Approved' },
  { id: 'SHR-1006', name: 'David Mugisha', value: 80000, totalContributed: 88000, createdDate: '2024-01-18', status: 'Approved' },
  { id: 'SHR-1007', name: 'Grace Uwera', value: 35000, totalContributed: 35000, createdDate: '2024-03-12', status: 'Pending' },
];

interface ShareRecord {
  id: string;
  name: string;
  value: number;
  totalContributed: number;
  createdDate: string;
  status: string;
}

export default function Shares() {
  const { t } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedShare, setSelectedShare] = useState<ShareRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [shares, setShares] = useState<ShareRecord[]>(defaultShares);

  useEffect(() => {
    const saved = localStorage.getItem('memberShares');
    if (saved) {
      try {
        setShares(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse memberShares from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const [formData, setFormData] = useState({
    name: '',
    value: '',
  });

  const filteredShares = shares.filter((share) => {
    const lowerSearch = searchQuery.toLowerCase();
    return (
      share.name.toLowerCase().includes(lowerSearch) ||
      share.id.toLowerCase().includes(lowerSearch) ||
      share.status.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredShares.length / pageSize));
  const paginatedShares = filteredShares.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (share: ShareRecord) => {
    setSelectedShare(share);
    setFormData({ name: share.name, value: share.value.toString() });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const saveShares = (updatedShares: ShareRecord[]) => {
    setShares(updatedShares);
    localStorage.setItem('memberShares', JSON.stringify(updatedShares));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this share?')) {
      const updatedShares = shares.filter((share) => share.id !== id);
      saveShares(updatedShares);
      setSelectedShare(null);
      setIsViewModalOpen(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.value.trim()) {
      alert('Please enter a name and value for your share.');
      return;
    }

    const shareValue = Number(formData.value);
    if (Number.isNaN(shareValue) || shareValue <= 0) {
      alert('Please enter a valid share value.');
      return;
    }

    if (isEditMode && selectedShare) {
      const updatedShares = shares.map((share) =>
        share.id === selectedShare.id
          ? {
              ...share,
              name: formData.name,
              value: shareValue,
            }
          : share
      );
      saveShares(updatedShares);
    } else {
      const newShare: ShareRecord = {
        id: `share-${Date.now()}`,
        name: formData.name.trim(),
        value: shareValue,
        totalContributed: 0,
        createdDate: new Date().toLocaleDateString(),
        status: 'Pending',
      };
      saveShares([newShare, ...shares]);
    }

    setIsAddModalOpen(false);
    setIsEditMode(false);
    setFormData({ name: '', value: '' });
    setSelectedShare(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shares</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your shares and equity</p>
          </div>
          <button
            onClick={() => {
              setIsEditMode(false);
              setFormData({ name: '', value: '' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] hover:shadow-lg transition-all duration-300 w-full sm:w-fit justify-center text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Add Share
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full max-w-[420px]">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={() => setSearchQuery(searchQuery)}
                  onClear={() => setSearchQuery('')}
                  placeholder="Search by name, status, or contribution..."
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {filteredShares.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <p className="text-lg sm:text-xl font-semibold text-gray-900">No shares saved yet</p>
              <p className="text-sm mt-2 max-w-xl mx-auto">
                Create a new share entry to keep it saved in your account. Your data will stay in local storage.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Share Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Contribution</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedShares.map((share) => (
                        <tr key={share.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{share.name}</td>
                          <td className="py-3 px-4 text-gray-900 text-xs sm:text-sm whitespace-nowrap">{share.totalContributed.toLocaleString()} RWF</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(share.status)}`}>
                              {share.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <ActionCell
                              onView={() => {
                                setSelectedShare(share);
                                setIsViewModalOpen(true);
                              }}
                              onEdit={() => handleEdit(share)}
                              onDelete={() => handleDelete(share.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {filteredShares.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredShares.length)} of {filteredShares.length}
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
            </>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <GenericEditModal
          title={isEditMode ? 'Edit Share' : 'Add Share'}
          isOpen={isAddModalOpen}
          onClose={() => { setIsAddModalOpen(false); setIsEditMode(false); }}
          onSave={handleSubmit}
          saveLabel={isEditMode ? 'Update' : 'Create'}
          maxWidth="max-w-md"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Share Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter share name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Share Value</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter share value"
            />
          </div>
        </GenericEditModal>
      )}

      {isViewModalOpen && selectedShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="bg-[#0B5D3B] px-6 py-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Share Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Share Name</p>
                    <p className="font-semibold text-gray-900">{selectedShare.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Total Value</p>
                    <p className="font-semibold text-gray-900">{selectedShare.value.toLocaleString()} RWF</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Total Contributed</p>
                    <p className="font-semibold text-[#0B5D3B]">{selectedShare.totalContributed.toLocaleString()} RWF</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Created Date</p>
                    <p className="font-semibold text-gray-900">{selectedShare.createdDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 col-span-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedShare.status)}`}>
                      {selectedShare.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full px-5 py-3 bg-[#0B5D3B] text-white rounded-2xl font-semibold hover:bg-[#094a2e] transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
