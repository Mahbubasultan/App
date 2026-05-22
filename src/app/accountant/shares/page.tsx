'use client';

import React, { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { AccountantTable, TableColumn } from '@/components/accountant/AccountantTable';
import { ConfirmDialog } from '@/components/accountant/ConfirmDialog';
import { SearchBar } from '@/components/ui/SearchBar';
import { StatusBadge } from '@/components/accountant/StatusBadge';
import ActionCell from '@/components/ui/ActionCell';
import GenericEditModal from '@/components/ui/GenericEditModal';

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
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteShare, setDeleteShare] = useState<Share | null>(null);
  const [editFormData, setEditFormData] = useState<Share | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'id',
      label: 'Action',
      align: 'center',
      render: (_, row) => (
        <ActionCell
          onView={() => { setSelectedShare(row); setIsDetailOpen(true); setIsEditMode(false); }}
          onEdit={() => { setSelectedShare(row); setEditFormData(row); setIsDetailOpen(false); setIsEditModalOpen(true); }}
          onDelete={() => setDeleteShare(row)}
        />
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
            onChange={(value) => {
              setSearchInput(value);
              setSearchQuery(value);
            }}
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
              <h2 className="text-xl font-bold text-white">{isEditMode ? 'Edit Share' : 'Share Details'}</h2>
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditMode(false);
                  setEditFormData(null);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {isEditMode && editFormData ? (
                <>
                  {/* Edit form kept inside detail modal for quick edits; standard edit modal used below for full edits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Member Name</label>
                      <input
                        type="text"
                        value={editFormData.memberName}
                        onChange={(e) => setEditFormData({...editFormData, memberName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Email</label>
                      <input
                        type="email"
                        value={editFormData.memberEmail}
                        onChange={(e) => setEditFormData({...editFormData, memberEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Shares</label>
                      <input
                        type="number"
                        value={editFormData.shares}
                        onChange={(e) => setEditFormData({...editFormData, shares: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Value (RWF)</label>
                      <input
                        type="number"
                        value={editFormData.value}
                        onChange={(e) => setEditFormData({...editFormData, value: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (editFormData) {
                          setShares((current) => current.map((item) => item.id === editFormData.id ? editFormData : item));
                        }
                        setIsDetailOpen(false);
                        setIsEditMode(false);
                        setEditFormData(null);
                      }}
                      className="flex-1 bg-[#0B5D3B] text-white font-semibold py-3 rounded-lg hover:bg-[#094a2e] transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setEditFormData(selectedShare);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                      <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Total Shares</p>
                      <p className="text-2xl font-bold text-[#0B5D3B]">{selectedShare.shares.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                      <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">{(selectedShare.value / 1000000).toFixed(2)}M RWF</p>
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

                  <button
                    onClick={() => {
                      setIsEditMode(true);
                      setEditFormData(selectedShare);
                    }}
                    className="w-full bg-[#0B5D3B] text-white font-semibold py-3 rounded-lg hover:bg-[#094a2e] transition-colors"
                  >
                    Edit Share
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditMode(false);
                  setEditFormData(null);
                }}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Edit Modal for full edits */}
      <GenericEditModal
        title="Edit Share"
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditFormData(null); }}
        onSave={() => {
          if (editFormData) {
            setShares((current) => current.map((item) => item.id === editFormData.id ? editFormData : item));
          }
          setIsEditModalOpen(false);
          setEditFormData(null);
        }}
        saveLabel="Save Changes"
        maxWidth="max-w-2xl"
      >
        {editFormData && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Member Name</label>
              <input
                type="text"
                value={editFormData.memberName}
                onChange={(e) => setEditFormData({...editFormData, memberName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={editFormData.memberEmail}
                onChange={(e) => setEditFormData({...editFormData, memberEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Shares</label>
              <input
                type="number"
                value={editFormData.shares}
                onChange={(e) => setEditFormData({...editFormData, shares: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Value (RWF)</label>
              <input
                type="number"
                value={editFormData.value}
                onChange={(e) => setEditFormData({...editFormData, value: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Date</label>
              <input
                type="date"
                value={editFormData.date}
                onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Status</label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({...editFormData, status: e.target.value as 'approved' | 'pending'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        )}
      </GenericEditModal>
      <ConfirmDialog
        isOpen={Boolean(deleteShare)}
        title="Delete Share"
        message={`Are you sure you want to delete ${deleteShare?.memberName}'s share record?`}
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          if (deleteShare) {
            setShares((current) => current.filter((item) => item.id !== deleteShare.id));
          }
          setDeleteShare(null);
        }}
        onCancel={() => setDeleteShare(null)}
      />
    </div>
  );
}
