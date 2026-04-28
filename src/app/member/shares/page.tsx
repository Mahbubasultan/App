'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';

const mockShares = [
  { id: 1, name: 'Emergency Fund', value: 2000, totalContributed: 100000, createdDate: '2023-01-15', status: 'Approved', hasSavings: true },
  { id: 2, name: 'Education Share', value: 2000, totalContributed: 150000, createdDate: '2023-02-20', status: 'Approved', hasSavings: true },
  { id: 3, name: 'Business Capital', value: 2000, totalContributed: 0, createdDate: '2024-01-10', status: 'Pending', hasSavings: false },
  { id: 4, name: 'Health Share', value: 2000, totalContributed: 120000, createdDate: '2023-06-05', status: 'Approved', hasSavings: true },
  { id: 5, name: 'Investment Fund', value: 2000, totalContributed: 0, createdDate: '2024-01-20', status: 'Pending', hasSavings: false },
];

export default function Shares() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedShare, setSelectedShare] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: '',
    value: 2000,
  });

  const filteredShares = mockShares.filter(share => {
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
    setFormData({ name: share.name, value: share.value });
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
    setFormData({ name: '', value: 2000 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MemberLayout userName="Jean Baptiste Mugabo">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shares</h1>
            <p className="text-gray-600 mt-1">Manage your shares and equity</p>
          </div>
          <button
            onClick={() => {
              setIsEditMode(false);
              setFormData({ name: '', value: 2000 });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Plus size={20} />
            Add Share
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by share name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>All</option>
                <option>Approved</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Share Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Share Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Contributed</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedShares.map((share) => (
                  <tr key={share.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{share.name}</td>
                    <td className="py-3 px-4 text-gray-900">{share.value.toLocaleString()} RWF</td>
                    <td className="py-3 px-4 text-gray-900">{share.totalContributed.toLocaleString()} RWF</td>
                    <td className="py-3 px-4 text-gray-600">{share.createdDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(share.status)}`}>
                        {share.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedShare(share);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        {share.status !== 'Approved' && (
                          <>
                            <button
                              onClick={() => handleEdit(share)}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(share.id)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredShares.length)} of {filteredShares.length} entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Share Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{isEditMode ? 'Edit Share' : 'Add Share'}</h2>
            <div className="space-y-4">
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
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="2000"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditMode(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  {isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Share Name</p>
                <p className="font-semibold text-gray-900">{selectedShare.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Share Value</p>
                <p className="font-semibold text-gray-900">{selectedShare.value.toLocaleString()} RWF</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contributed</p>
                <p className="font-semibold text-gray-900">{selectedShare.totalContributed.toLocaleString()} RWF</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-semibold text-gray-900">{selectedShare.createdDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedShare.status)}`}>
                  {selectedShare.status}
                </span>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}
