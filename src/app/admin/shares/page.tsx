'use client';

import React, { useState } from 'react';
import { Eye, Edit, Trash2, X } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { StatusBadge } from '@/components/accountant/StatusBadge';
import ActionCell from '@/components/ui/ActionCell';
import GenericEditModal from '@/components/ui/GenericEditModal';
import { ConfirmDialog } from '@/components/accountant/ConfirmDialog';

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
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Transactions', 'History', 'Analytics'];
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteShare, setDeleteShare] = useState<Share | null>(null);
  const [editFormData, setEditFormData] = useState<Share | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredShares = shares.filter((share) => {
    if (searchQuery.trim() === '') return true;
    const searchText = searchQuery.toLowerCase();
    return (
      share.memberName.toLowerCase().includes(searchText) ||
      share.memberEmail.toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredShares.length / itemsPerPage);
  const paginatedShares = filteredShares.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shares Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all member shares</p>
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
            <div className="flex flex-wrap gap-2">
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Member Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Share Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedShares.map((share) => (
                  <tr key={share.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{share.memberName}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm">{share.shares.toLocaleString()} shares</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={share.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ActionCell
                        onView={() => { setSelectedShare(share); setIsDetailOpen(true); setIsEditMode(false); }}
                        onEdit={() => { setSelectedShare(share); setEditFormData(share); setIsDetailOpen(false); setIsEditModalOpen(true); }}
                        onDelete={() => setDeleteShare(share)}
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

      {/* Detail Modal */}
      {isDetailOpen && selectedShare && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Share Details</h2>
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditMode(false);
                  setEditFormData(null);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Member Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedShare.memberName}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
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
                  setIsDetailOpen(false);
                  setIsEditMode(false);
                  setEditFormData(null);
                }}
                className="w-full bg-[#0B5D3B] text-white font-semibold py-3 rounded-lg hover:bg-[#094a2e] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
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