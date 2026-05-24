'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import ActionCell from '@/components/ui/ActionCell';
import GenericEditModal from '@/components/ui/GenericEditModal';
import { SearchBar } from '@/components/ui/SearchBar';
import { ConfirmDialog } from '@/components/accountant/ConfirmDialog';
import { mockGuarantors } from '@/lib/mockData';

type Guarantor = typeof mockGuarantors[0];

export default function AdminGuarantor() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [guarantors, setGuarantors] = useState<Guarantor[]>(mockGuarantors);
  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'On Hold'];
  const [selectedGuarantor, setSelectedGuarantor] = useState<Guarantor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Guarantor> | null>(null);
  const [deleteGuarantor, setDeleteGuarantor] = useState<Guarantor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredGuarantors = guarantors.filter(guarantor => {
    const lowerSearch = searchQuery.toLowerCase();
    const amountText = [guarantor.loanAmount.toString(), guarantor.loanAmount.toLocaleString()];

    const matchesStatus = activeTab === 'All' || guarantor.status === activeTab;
    const matchesSearch = searchQuery === '' ||
      guarantor.guarantorName.toLowerCase().includes(lowerSearch) ||
      guarantor.borrowerName.toLowerCase().includes(lowerSearch) ||
      guarantor.status.toLowerCase().includes(lowerSearch) ||
      amountText.some((value) => value.toLowerCase().includes(lowerSearch));
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredGuarantors.length / itemsPerPage);
  const paginatedGuarantors = filteredGuarantors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'On Hold': return 'bg-blue-100 text-blue-700 border border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const saveGuarantorChanges = () => {
    if (selectedGuarantor && editFormData) {
      setGuarantors((current) =>
        current.map((item) =>
          item.id === selectedGuarantor.id
            ? ({ ...item, ...editFormData } as Guarantor)
            : item
        )
      );
      setSelectedGuarantor((prev) => (prev ? ({ ...prev, ...editFormData } as Guarantor) : prev));
    }
    setEditFormData(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Guarantors Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all guarantor requests</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar
              value={searchInput}
              onChange={(value) => {
                setSearchInput(value);
                setSearchQuery(value);
              }}
              onSearch={() => setSearchQuery(searchInput)}
              onClear={() => {
                setSearchInput('');
                setSearchQuery('');
              }}
              placeholder="Search by guarantor or borrower..."
              className="w-full lg:max-w-[420px]"
            />
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-[#0B5D3B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGuarantors.map((guarantor) => (
                  <tr key={guarantor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">{guarantor.guarantorName}</p>
                      <p className="text-xs text-gray-500">Borrower: {guarantor.borrowerName}</p>
                    </td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm whitespace-nowrap">{guarantor.loanAmount.toLocaleString()} RWF</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(guarantor.status)}`}>
                        {guarantor.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ActionCell
                        onView={() => {
                          setSelectedGuarantor(guarantor);
                          setIsViewModalOpen(true);
                        }}
                        onEdit={() => {
                          setEditFormData(guarantor);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={() => setDeleteGuarantor(guarantor)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredGuarantors.length)} of {filteredGuarantors.length}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg transition ${
                  currentPage === page
                    ? 'bg-[#0B5D3B] text-white font-semibold'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isViewModalOpen && selectedGuarantor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Guarantor Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto touch-pan-y flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Guarantor Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedGuarantor.guarantorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.guarantorPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.guarantorEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-full bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Borrower Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedGuarantor.borrowerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.borrowerPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.borrowerEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-full bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedGuarantor.status)}`}>
                    {selectedGuarantor.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setEditFormData(null);
                }}
                className="w-full px-4 py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <GenericEditModal
        title="Edit Guarantor"
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditFormData(null); }}
        onSave={saveGuarantorChanges}
        saveLabel="Save Changes"
        maxWidth="max-w-2xl"
      >
        {editFormData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Guarantor Name</label>
              <input
                type="text"
                value={editFormData.guarantorName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, guarantorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Guarantor Phone</label>
              <input
                type="text"
                value={editFormData.guarantorPhone || ''}
                onChange={(e) => setEditFormData({ ...editFormData, guarantorPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Guarantor Email</label>
              <input
                type="email"
                value={editFormData.guarantorEmail || ''}
                onChange={(e) => setEditFormData({ ...editFormData, guarantorEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Borrower Name</label>
              <input
                type="text"
                value={editFormData.borrowerName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, borrowerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Borrower Phone</label>
              <input
                type="text"
                value={editFormData.borrowerPhone || ''}
                onChange={(e) => setEditFormData({ ...editFormData, borrowerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Borrower Email</label>
              <input
                type="email"
                value={editFormData.borrowerEmail || ''}
                onChange={(e) => setEditFormData({ ...editFormData, borrowerEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Status</label>
              <select
                value={editFormData.status || ''}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
        )}
      </GenericEditModal>

      <ConfirmDialog
        isOpen={Boolean(deleteGuarantor)}
        title="Delete Guarantor"
        message={`Are you sure you want to delete the guarantor request for ${deleteGuarantor?.guarantorName}?`}
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          if (deleteGuarantor) {
            setGuarantors((current) => current.filter((item) => item.id !== deleteGuarantor.id));
          }
          setDeleteGuarantor(null);
        }}
        onCancel={() => setDeleteGuarantor(null)}
      />
    </div>
  );
}
