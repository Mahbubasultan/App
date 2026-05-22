'use client';

import { useState } from 'react';
import { Eye, X, Filter, Ban, Lock, Unlock, UserX, UserCheck, Mail, Phone } from 'lucide-react';
import ActionCell from '@/components/ui/ActionCell';
import { SearchBar } from '@/components/ui/SearchBar';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'member' | 'accountant' | 'admin';
  status: 'active' | 'restricted' | 'blocked';
  totalSavings: number;
  shares: number;
  joinedDate: string;
  lastActive: string;
}

const mockUsers: User[] = [
  // Production-ready: Start with empty array, users will be loaded from database
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'restrict' | 'block' | 'unblock'>('restrict');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'restricted': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'blocked': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'accountant': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'member': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAction = (user: User, action: 'restrict' | 'block' | 'unblock') => {
    setSelectedUser(user);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedUser) return;
    
    const newStatus = actionType === 'unblock' ? 'active' : actionType === 'restrict' ? 'restricted' : 'blocked';
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
    setIsActionModalOpen(false);
    setSelectedUser(null);
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    restricted: users.filter(u => u.status === 'restricted').length,
    blocked: users.filter(u => u.status === 'blocked').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Restricted</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.restricted}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Blocked</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.blocked}</p>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
        {/* Filter Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search users by name, email, or phone..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsRoleFilterOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 active:scale-95"
                >
                  <Filter size={18} />
                  <span>{statusFilter}</span>
                </button>
                
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in-0 zoom-in-95 duration-200">
                      {['All', 'active', 'restricted', 'blocked'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors capitalize ${
                            statusFilter === status ? 'bg-[#0B5D3B]/10 text-[#0B5D3B] font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Role Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsRoleFilterOpen(!isRoleFilterOpen);
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 active:scale-95"
                >
                  <span className="capitalize">{roleFilter}</span>
                </button>
                
                {isRoleFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsRoleFilterOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in-0 zoom-in-95 duration-200">
                      {['All', 'member', 'accountant', 'admin'].map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setRoleFilter(role);
                            setIsRoleFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors capitalize ${
                            roleFilter === role ? 'bg-[#0B5D3B]/10 text-[#0B5D3B] font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Savings</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border capitalize ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs sm:text-sm">
                    <span className="font-semibold text-[#0B5D3B]">{user.totalSavings.toLocaleString()} RWF</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ActionCell onView={() => { setSelectedUser(user); setIsViewModalOpen(true); }} />
                      {user.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleAction(user, 'restrict')}
                            className="p-1.5 hover:bg-orange-50 text-orange-600 rounded-lg transition-all active:scale-95"
                            title="Restrict"
                          >
                            <Ban size={16} />
                          </button>
                          <button
                            onClick={() => handleAction(user, 'block')}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-all active:scale-95"
                            title="Block"
                          >
                            <Lock size={16} />
                          </button>
                        </>
                      )}
                      {(user.status === 'restricted' || user.status === 'blocked') && (
                        <button
                          onClick={() => handleAction(user, 'unblock')}
                          className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-all active:scale-95"
                          title="Unblock"
                        >
                          <Unlock size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto touch-pan-y flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full bg-gradient-to-r from-[#0B5D3B]/10 to-blue-50 rounded-xl p-4 border border-[#0B5D3B]/20">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0B5D3B] rounded-full flex items-center justify-center text-white font-bold">
                      {selectedUser.name.charAt(0)}
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Role</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border capitalize ${getRoleBadge(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Total Savings</p>
                  <p className="text-base font-bold text-[#0B5D3B]">{selectedUser.totalSavings.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Shares</p>
                  <p className="text-base font-bold text-blue-600">{selectedUser.shares}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Joined Date</p>
                  <p className="text-base font-bold text-gray-900">{selectedUser.joinedDate}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Last Active</p>
                  <p className="text-base font-bold text-gray-900">{selectedUser.lastActive}</p>
                </div>
                <div className="col-span-full bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full px-4 py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {isActionModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`px-6 py-4 ${actionType === 'block' ? 'bg-red-600' : actionType === 'restrict' ? 'bg-orange-600' : 'bg-green-600'}`}>
              <h2 className="text-xl font-bold text-white capitalize">{actionType} User</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-900 mb-4">
                Are you sure you want to <span className="font-bold">{actionType}</span> <span className="font-bold">{selectedUser.name}</span>?
              </p>
              {actionType === 'restrict' && (
                <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  User will have limited access to certain features.
                </p>
              )}
              {actionType === 'block' && (
                <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  User will be completely blocked from accessing the platform.
                </p>
              )}
              {actionType === 'unblock' && (
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  User will regain full access to the platform.
                </p>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold transition-all active:scale-95 ${
                  actionType === 'block' ? 'bg-red-600 hover:bg-red-700' : 
                  actionType === 'restrict' ? 'bg-orange-600 hover:bg-orange-700' : 
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
