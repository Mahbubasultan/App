'use client';

import React, { useState } from 'react';
import { Eye, Edit2 } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { StatusBadge } from '@/components/accountant/StatusBadge';

interface Share {
  id: string;
  memberName: string;
  memberEmail: string;
  shares: number;
  value: number;
  date: string;
  status: 'approved' | 'pending';
}

const mockShares: Share[] = [
  { id: 'SHARE-001', memberName: 'Jean Baptiste', memberEmail: 'jean.baptiste@rosca.com', shares: 45, value: 760000, date: '2024-01-15', status: 'approved' },
  { id: 'SHARE-002', memberName: 'Marie Claire', memberEmail: 'marie.claire@rosca.com', shares: 32, value: 540000, date: '2024-02-02', status: 'pending' },
  { id: 'SHARE-003', memberName: 'Eric Habimana', memberEmail: 'eric.habimana@rosca.com', shares: 58, value: 980000, date: '2024-02-18', status: 'approved' },
  { id: 'SHARE-004', memberName: 'Grace Uwera', memberEmail: 'grace.uwera@rosca.com', shares: 26, value: 430000, date: '2024-03-05', status: 'approved' },
  { id: 'SHARE-005', memberName: 'Patrick Nkunda', memberEmail: 'patrick.nkunda@rosca.com', shares: 20, value: 320000, date: '2024-03-10', status: 'pending' },
  { id: 'SHARE-006', memberName: 'David Mugisha', memberEmail: 'david.mugisha@rosca.com', shares: 40, value: 680000, date: '2024-01-20', status: 'approved' },
  { id: 'SHARE-007', memberName: 'Susan Mwangi', memberEmail: 'susan.mwangi@rosca.com', shares: 35, value: 590000, date: '2024-02-14', status: 'approved' },
  { id: 'SHARE-008', memberName: 'Robert Nkosi', memberEmail: 'robert.nkosi@rosca.com', shares: 50, value: 850000, date: '2024-03-01', status: 'pending' },
];

export default function AdminSharesPage() {
  const [shares, setShares] = useState<Share[]>(mockShares);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Approved'];
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedShareForStatus, setSelectedShareForStatus] = useState<Share | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredShares = shares.filter((share) => {
    const searchText = searchQuery.toLowerCase();
    const amountText = [
      share.shares.toString(),
      share.shares.toLocaleString(),
      share.value.toString(),
      share.value.toLocaleString(),
    ];
    const matchesStatus = activeTab === 'All' || share.status === activeTab.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' ||
      share.memberName.toLowerCase().includes(searchText) ||
      share.memberEmail.toLowerCase().includes(searchText) ||
      share.status.toLowerCase().includes(searchText) ||
      amountText.some((value) => value.toLowerCase().includes(searchText));
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredShares.length / itemsPerPage);
  const paginatedShares = filteredShares.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = (share: Share, newStatus: 'approved' | 'pending') => {
    setShares(shares.map(s => s.id === share.id ? { ...s, status: newStatus } : s));
    setIsStatusModalOpen(false);
    setSelectedShareForStatus(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shares Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage share status</p>
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
              placeholder="Search by name or email..."
              className="w-full lg:max-w-[320px]"
            />
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
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

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Shares</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedShares.map((share) => (
                <tr key={share.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{share.memberName}</td>
                  <td className="py-3 px-4 text-gray-900 font-semibold text-xs sm:text-sm">{share.shares.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={share.status} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setSelectedShare(share); setIsDetailOpen(true); }}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-all active:scale-95"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => { setSelectedShareForStatus(share); setIsStatusModalOpen(true); }}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-all active:scale-95"
                        title="Update"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredShares.length)} of {filteredShares.length}
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

      {isDetailOpen && selectedShare && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Share Details</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <Eye size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Member Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedShare.memberName}</p>
                </div>
                <div className="col-span-2 rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedShare.memberEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
                  <p className="text-xs uppercase tracking-wider text-emerald-700 mb-1">Total Shares</p>
                  <p className="text-2xl font-bold text-emerald-700">{selectedShare.shares.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <p className="text-xs uppercase tracking-wider text-blue-700 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedShare.value.toLocaleString()} RWF</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Date Created</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedShare.date}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Status</p>
                  <StatusBadge status={selectedShare.status} />
                </div>
              </div>

              <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
                <p className="text-xs uppercase tracking-wider text-purple-700 mb-1">Share Price</p>
                <p className="text-lg font-bold text-purple-700">2,000 RWF per share</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full bg-[#0B5D3B] text-white font-semibold py-3 rounded-xl hover:bg-[#094a2e] transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isStatusModalOpen && selectedShareForStatus && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Update Share Status</h2>
              <button
                onClick={() => { setIsStatusModalOpen(false); setSelectedShareForStatus(null); }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <Eye size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Member</p>
                <p className="font-semibold text-gray-900">{selectedShareForStatus.memberName}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <StatusBadge status={selectedShareForStatus.status} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Change Status To</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedShareForStatus, 'approved')}
                    className="w-full px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedShareForStatus, 'pending')}
                    className="w-full px-4 py-2.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium text-sm"
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
