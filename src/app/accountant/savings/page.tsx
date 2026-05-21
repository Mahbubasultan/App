'use client';

import { useState } from 'react';
import { Search, Filter, Eye, X } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';

const mockSavings = [
  { id: 1, memberName: 'Jean Baptiste', shareName: 'Emergency Fund', amount: 50000, date: '2024-01-15', status: 'Approved', phone: '+250788123456', email: 'jean@email.com', transactionId: 'TXN001', shares: 25 },
  { id: 2, memberName: 'Marie Claire', shareName: 'Education Share', amount: 75000, date: '2024-01-10', status: 'Pending', phone: '+250788234567', email: 'marie@email.com', transactionId: 'TXN002', shares: 37 },
  { id: 3, memberName: 'Eric Habimana', shareName: 'Business Capital', amount: 100000, date: '2024-01-05', status: 'Approved', phone: '+250788345678', email: 'eric@email.com', transactionId: 'TXN003', shares: 50 },
  { id: 4, memberName: 'Patrick Nkunda', shareName: 'Emergency Fund', amount: 50000, date: '2023-12-20', status: 'Rejected', phone: '+250788456789', email: 'patrick@email.com', transactionId: 'TXN004', shares: 25 },
  { id: 5, memberName: 'Grace Uwera', shareName: 'Health Share', amount: 60000, date: '2023-12-15', status: 'Approved', phone: '+250788567890', email: 'grace@email.com', transactionId: 'TXN005', shares: 30 },
  { id: 6, memberName: 'David Mugisha', shareName: 'Investment Fund', amount: 80000, date: '2024-01-18', status: 'Approved', phone: '+250788678901', email: 'david@email.com', transactionId: 'TXN006', shares: 40 },
  { id: 7, memberName: 'Jean Baptiste', shareName: 'Business Capital', amount: 90000, date: '2024-01-20', status: 'Pending', phone: '+250788123456', email: 'jean@email.com', transactionId: 'TXN007', shares: 45 },
];

export default function AccountantSavings() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSavings = mockSavings.filter(saving => {
    const matchesSearch = 
      searchQuery === '' ||
      saving.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saving.shareName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || saving.status === statusFilter;
    return matchesSearch && matchesStatus;
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Savings Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all member savings</p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filter Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={() => setSearchQuery(searchInput)}
              placeholder="Search"
              className="w-full max-w-[280px]"
            />

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between gap-2 min-w-[170px] px-4 py-3 border border-gray-300 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-700"
              >
                <Filter size={18} />
                <span>{statusFilter}</span>
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 mt-3 w-[220px] bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-20 transition-all duration-200 ease-out">
                    {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                          statusFilter === status ? 'bg-[#0B5D3B] text-white font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Member</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSavings.map((saving) => (
                  <tr key={saving.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{saving.memberName}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm whitespace-nowrap">{saving.amount.toLocaleString()} RWF</td>
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
                        className="p-2 hover:bg-[#0B5D3B]/10 text-[#0B5D3B] rounded-lg transition-colors"
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

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSavings.length)} of {filteredSavings.length}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
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
                {/* Member Information */}
                <div className="col-span-full bg-gradient-to-r from-[#0B5D3B]/10 to-blue-50 rounded-xl p-4 border border-[#0B5D3B]/20">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0B5D3B] rounded-full flex items-center justify-center text-white font-bold">
                      {selectedSaving.memberName.charAt(0)}
                    </div>
                    Member Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedSaving.memberName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedSaving.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedSaving.email}</p>
                    </div>
                  </div>
                </div>

                {/* Savings Details */}
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
                  <p className="text-base font-bold text-blue-600">{selectedSaving.shares}</p>
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
