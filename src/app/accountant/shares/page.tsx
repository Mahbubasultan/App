'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { mockUsers } from '@/lib/mockData';
import { AccountantTable, TableColumn } from '@/components/accountant/AccountantTable';
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

// Generate mock shares data from mock users
const generateSharesData = (): Share[] => {
  return mockUsers.map((user, idx) => ({
    id: `SHARE${idx + 1}`,
    memberName: user.name,
    memberEmail: user.email,
    shares: user.shares,
    value: user.totalValue,
    date: user.joinedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    status: idx % 3 === 0 ? 'pending' : 'approved',
  }));
};

export default function SharesPage() {
  const [shares] = useState<Share[]>(generateSharesData());
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const columns: TableColumn<Share>[] = [
    {
      key: 'memberName',
      label: 'Member Name',
      sortable: true,
    },
    {
      key: 'shares',
      label: 'Share Amount',
      sortable: true,
      render: (value) => `${value.toLocaleString()} shares`,
    },
    {
      key: 'value',
      label: 'Total Value',
      sortable: true,
      render: (value) => `${(value / 1000000).toFixed(2)}M RWF`,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'id',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedShare(row);
            setIsDetailOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-1 text-[#0B5D3B] hover:bg-[#0B5D3B]/10 rounded-lg transition-colors"
        >
          <Eye size={16} />
          View
        </button>
      ),
    },
  ];

  const filteredShares = shares.filter((share) => {
    if (searchQuery.trim() === '') return true;
    const searchText = searchQuery.toLowerCase();
    return (
      share.memberName.toLowerCase().includes(searchText) ||
      share.memberEmail.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shares Management</h1>
        <p className="text-gray-600 mt-1">View and manage all member shares</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => setSearchQuery(searchInput)}
            placeholder="Search"
            className="w-full max-w-[280px]"
          />
        </div>

        <AccountantTable
          columns={columns}
          data={filteredShares}
          keyExtractor={(item) => item.id}
          rowsPerPage={10}
          showSearch={false}
        />
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Share Details</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Member Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Member Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedShare.memberName}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedShare.memberEmail}</p>
                </div>
              </div>

              {/* Share Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-blue-600 mb-1">Total Shares</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedShare.shares.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-green-600 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-green-700">{(selectedShare.value / 1000000).toFixed(2)}M RWF</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Date Created</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedShare.date}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Status</p>
                  <StatusBadge status={selectedShare.status} />
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full bg-[#0B5D3B] text-white font-semibold py-3 rounded-lg hover:bg-[#094a2e] transition-colors"
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
