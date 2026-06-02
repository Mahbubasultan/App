'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import ActionCell from '@/components/ui/ActionCell';
import { getSavingRecords, SavingRecord } from '@/lib/localStorageService';

type Saving = SavingRecord;

export default function AccountantSavings() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
  const [savings, setSavings] = useState<Saving[]>([]);
  const [selectedSaving, setSelectedSaving] = useState<Saving | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const records = getSavingRecords();
    setSavings(records);
  }, []);

  const filteredSavings = savings.filter(saving => {
    const lowerSearch = searchQuery.toLowerCase();
    const amountText = [saving.amount.toString(), saving.amount.toLocaleString()];

    const matchesStatus = activeTab === 'All' || saving.status === activeTab;
    const matchesSearch = searchQuery === '' ||
      (saving.userName && saving.userName.toLowerCase().includes(lowerSearch)) ||
      saving.shareName.toLowerCase().includes(lowerSearch) ||
      saving.status.toLowerCase().includes(lowerSearch) ||
      amountText.some((value) => value.toLowerCase().includes(lowerSearch));
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredSavings.length / itemsPerPage);
  const paginatedSavings = filteredSavings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Savings Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all member savings</p>
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
              placeholder="Search savings by member, share, or status..."
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
                {paginatedSavings.map((saving) => (
                  <tr key={saving.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{saving.userName || 'N/A'}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm whitespace-nowrap">{saving.amount.toLocaleString()} RWF</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(saving.status)}`}>
                        {saving.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ActionCell
                        onView={() => {
                          setSelectedSaving(saving);
                          setIsViewModalOpen(true);
                        }}
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSavings.length)} of {filteredSavings.length}
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

      {/* View Modal */}
      {isViewModalOpen && selectedSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Savings Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto touch-pan-y flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Member Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedSaving.userName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedSaving.userPhone || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedSaving.userEmail || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Share Name</p>
                  <p className="text-base font-bold text-gray-900">{selectedSaving.shareName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Amount</p>
                  <p className="text-base font-bold text-[#0B5D3B]">{selectedSaving.amount.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Shares Earned</p>
                  <p className="text-base font-bold text-gray-900">{Math.floor(selectedSaving.amount / 2000)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Transaction ID</p>
                  <p className="text-base font-bold text-gray-900">{selectedSaving.transactionId}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Date</p>
                  <p className="text-base font-bold text-gray-900">{selectedSaving.date}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedSaving.status)}`}>
                    {selectedSaving.status}
                  </span>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selectedSaving.screenshot && (
                <div className="mt-6">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Payment Screenshot</p>
                  <img
                    src={`data:image/png;base64,${selectedSaving.screenshot}`}
                    alt="Payment Screenshot"
                    className="w-full h-64 object-contain rounded-xl border border-gray-200 bg-gray-50"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex-shrink-0">
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

    </div>
  );
}
