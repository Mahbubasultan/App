'use client';

import React, { useState } from 'react';
import { X, Eye, Edit2 } from 'lucide-react';
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

const mockShares: Share[] = [
  { id: 'SHARE-001', memberName: 'Jean Baptiste', memberEmail: 'jean.baptiste@rosca.com', shares: 45, value: 760000, date: '2024-01-15', status: 'approved' },
  { id: 'SHARE-002', memberName: 'Marie Claire', memberEmail: 'marie.claire@rosca.com', shares: 32, value: 540000, date: '2024-02-02', status: 'pending' },
  { id: 'SHARE-003', memberName: 'Eric Habimana', memberEmail: 'eric.habimana@rosca.com', shares: 58, value: 980000, date: '2024-02-18', status: 'approved' },
  { id: 'SHARE-004', memberName: 'Grace Uwera', memberEmail: 'grace.uwera@rosca.com', shares: 26, value: 430000, date: '2024-03-05', status: 'approved' },
  { id: 'SHARE-005', memberName: 'Patrick Nkunda', memberEmail: 'patrick.nkunda@rosca.com', shares: 20, value: 320000, date: '2024-03-10', status: 'pending' },
  { id: 'SHARE-006', memberName: 'David Mugisha', memberEmail: 'david.mugisha@rosca.com', shares: 40, value: 680000, date: '2024-01-20', status: 'approved' },
  { id: 'SHARE-007', memberName: 'Susan Mwangi', memberEmail: 'susan.mwangi@rosca.com', shares: 35, value: 590000, date: '2024-02-14', status: 'approved' },
  { id: 'SHARE-008', memberName: 'Robert Nkosi', memberEmail: 'robert.nkosi@rosca.com', shares: 50, value: 850000, date: '2024-03-01', status: 'pending' },
  { id: 'SHARE-009', memberName: 'Christine Kwame', memberEmail: 'christine.kwame@rosca.com', shares: 28, value: 470000, date: '2024-03-08', status: 'approved' },
  { id: 'SHARE-010', memberName: 'John Omondi', memberEmail: 'john.omondi@rosca.com', shares: 42, value: 710000, date: '2024-01-25', status: 'approved' },
  { id: 'SHARE-011', memberName: 'Anna Kipchoge', memberEmail: 'anna.kipchoge@rosca.com', shares: 38, value: 640000, date: '2024-02-28', status: 'pending' },
  { id: 'SHARE-012', memberName: 'Michael Kimani', memberEmail: 'michael.kimani@rosca.com', shares: 55, value: 930000, date: '2024-03-15', status: 'approved' },
];

export default function SharesPage() {
  const [shares, setShares] = useState<Share[]>(mockShares);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Approved'];
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedShareForStatus, setSelectedShareForStatus] = useState<Share | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleStatusUpdate = (share: Share, newStatus: 'approved' | 'pending') => {
    setShares((current) =>
      current.map((item) => (item.id === share.id ? { ...item, status: newStatus } : item))
    );
    setIsStatusModalOpen(false);
    setSelectedShareForStatus(null);
  };

  const columns: TableColumn<Share>[] = [
    {
      key: 'memberName',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'shares',
      label: 'Amount',
      sortable: true,
      render: (value) => `${value.toLocaleString()} shares`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'id',
      label: 'Action',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => { setSelectedShare(row); setIsDetailOpen(true); }}
            className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-all active:scale-95"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => { setSelectedShareForStatus(row); setIsStatusModalOpen(true); }}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-all active:scale-95"
            title="Update"
          >
            <Edit2 size={16} />
          </button>
        </div>
      ),
    },
  ];

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

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shares Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all member shares</p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
          <SearchBar
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value);
              setSearchQuery(value);
            }}
            onSearch={() => setSearchQuery(searchInput)}
            placeholder="Search"
            className="w-full max-w-[280px]"
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

        <AccountantTable
          columns={columns}
          data={filteredShares}
          keyExtractor={(item) => item.id}
          rowsPerPage={10}
          showSearch={false}
        />
      </div>

      {isDetailOpen && selectedShare && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Share Details</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Update Share Status</h2>
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setSelectedShareForStatus(null);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
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
