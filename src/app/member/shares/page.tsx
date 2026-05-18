'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Eye, X, Edit, Trash2 } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { useSettings } from '@/context/SettingsContext';

const mockShares = [
  // Production-ready: Start with empty array, shares will be loaded from database
];

export default function Shares() {
  const { t } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedShare, setSelectedShare] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setStatusFilter('All');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    value: '',
  });

  const filteredShares = mockShares.filter((share) => {
    const matchesSearch = share.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || share.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredShares.length / itemsPerPage);
  const paginatedShares = filteredShares.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (share: any) => {
    setSelectedShare(share);
    setFormData({ name: share.name, value: share.value?.toString() || '' });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this share?')) {
      console.log('Deleting share:', id);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting:', formData);
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setFormData({ name: '', value: '' });
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
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('searchPlaceholder') || 'Search...'}
              className="max-w-[320px]"
            />
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('shareName')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('value')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('contributed')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('created')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('status')}</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedShares.map((share) => (
                    <tr key={share.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{share.name}</td>
                      <td className="py-3 px-4 text-gray-900 text-xs sm:text-sm whitespace-nowrap">{share.value.toLocaleString()} RWF</td>
                      <td className="py-3 px-4 text-gray-900 text-xs sm:text-sm whitespace-nowrap">{share.totalContributed.toLocaleString()} RWF</td>
                      <td className="py-3 px-4 text-gray-600 text-xs sm:text-sm whitespace-nowrap">{share.createdDate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(share.status)}`}>
                          {share.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => {
                              setSelectedShare(share);
                              setIsViewModalOpen(true);
                            }}
                            className="p-2 hover:bg-[#0B5D3B]/10 text-[#0B5D3B] rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredShares.length)} of {filteredShares.length}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B5D3B] px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{isEditMode ? 'Edit Share' : 'Add Share'}</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditMode(false);
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
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
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditMode(false);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-colors"
                >
                  {isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedShare && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Share Name</p>
                  <p className="font-semibold text-gray-900">{selectedShare.name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Share Value</p>
                  <p className="font-semibold text-[#0B5D3B]">{selectedShare.value.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Total Contributed</p>
                  <p className="font-semibold text-gray-900">{selectedShare.totalContributed.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Created Date</p>
                  <p className="font-semibold text-gray-900">{selectedShare.createdDate}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleEdit(selectedShare);
                    setIsViewModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedShare.id);
                    setIsViewModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full px-4 py-2.5 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
