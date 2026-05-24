'use client';

import { useState } from 'react';
import { X, UserCheck, Activity, Clock, CheckCircle } from 'lucide-react';
import ActionCell from '@/components/ui/ActionCell';
import { SearchBar } from '@/components/ui/SearchBar';

interface AccountantLog {
  id: string;
  accountantName: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'approved' | 'rejected' | 'pending';
}

const mockAccountants = [
  { id: '1', name: 'Marie Claire Uwase', email: 'marie.uwase@rosca.com', phone: '+250788234567', status: 'Active', actionsToday: 12, totalActions: 245, joinedDate: '2023-01-15' },
  { id: '2', name: 'Eric Habimana', email: 'eric.habimana@rosca.com', phone: '+250788345678', status: 'Active', actionsToday: 8, totalActions: 189, joinedDate: '2023-03-20' },
  { id: '3', name: 'Grace Umutoni', email: 'grace.umutoni@rosca.com', phone: '+250788456789', status: 'Inactive', actionsToday: 0, totalActions: 156, joinedDate: '2023-06-10' },
];

const mockLogs: AccountantLog[] = [
  { id: '1', accountantName: 'Marie Claire', action: 'Approved Payment', target: 'Jean Baptiste - 50,000 RWF', timestamp: '10 min ago', status: 'approved' },
  { id: '2', accountantName: 'Eric Habimana', action: 'Rejected Loan', target: 'Patrick Nkunda - 200,000 RWF', timestamp: '25 min ago', status: 'rejected' },
  { id: '3', accountantName: 'Marie Claire', action: 'Approved Guarantor', target: 'Grace Uwera for Jean Baptiste', timestamp: '1 hour ago', status: 'approved' },
  { id: '4', accountantName: 'Eric Habimana', action: 'Verified Payment', target: 'David Mugisha - 75,000 RWF', timestamp: '2 hours ago', status: 'approved' },
  { id: '5', accountantName: 'Marie Claire', action: 'Pending Review', target: 'Loan Request - 400,000 RWF', timestamp: '3 hours ago', status: 'pending' },
];

export default function AdminAccountants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [selectedAccountant, setSelectedAccountant] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'logs'>('list');
  const statusTabs = ['All', 'Active', 'Inactive'];

  const filteredAccountants = mockAccountants.filter(acc => {
    const lowerSearch = searchQuery.toLowerCase();
    const amountText = [acc.actionsToday.toString(), acc.totalActions.toString()];
    const matchesSearch = searchQuery === '' || (
        acc.name.toLowerCase().includes(lowerSearch) ||
        acc.email.toLowerCase().includes(lowerSearch) ||
        acc.status.toLowerCase().includes(lowerSearch) ||
        amountText.some((value) => value.toLowerCase().includes(lowerSearch))
      );
    const matchesStatus = activeStatusTab === 'All' || acc.status === activeStatusTab;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <X size={16} className="text-red-600" />;
      case 'pending': return <Clock size={16} className="text-orange-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Accountants Management</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">View accountants and their activity logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 animate-in slide-in-from-top-4 duration-500" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'list' ? 'border-[#0B5D3B] text-[#0B5D3B]' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <UserCheck size={18} />
            Accountants List
          </div>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'logs' ? 'border-[#0B5D3B] text-[#0B5D3B]' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity size={18} />
            Activity Logs
          </div>
        </button>
      </div>

      {activeTab === 'list' && (
        <>
          {/* Content Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
            {/* Filter Section */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full lg:max-w-[420px]">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search accountants by name or email..."
                    className="w-full"
                  />
                </div>

                <div className="relative">
                  <div className="flex flex-wrap gap-2">
                    {statusTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveStatusTab(tab)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          activeStatusTab === tab
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccountants.map((accountant) => (
                    <tr key={accountant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm">{accountant.name}</p>
                        <p className="text-xs text-gray-500">{accountant.email}</p>
                      </td>
                      <td className="py-3 px-4 text-xs sm:text-sm">
                        <span className="font-semibold text-[#0B5D3B]">{accountant.actionsToday}</span>
                        <span className="text-gray-500"> / {accountant.totalActions}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(accountant.status)}`}>
                          {accountant.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ActionCell onView={() => { setSelectedAccountant(accountant); setIsViewModalOpen(true); }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getLogStatusIcon(log.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{log.target}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">by {log.accountantName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedAccountant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Accountant Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto touch-pan-y flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full bg-gradient-to-r from-[#0B5D3B]/10 to-blue-50 rounded-xl p-4 border border-[#0B5D3B]/20">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0B5D3B] rounded-full flex items-center justify-center text-white font-bold">
                      {selectedAccountant.name.charAt(0)}
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedAccountant.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedAccountant.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedAccountant.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Actions Today</p>
                  <p className="text-base font-bold text-[#0B5D3B]">{selectedAccountant.actionsToday}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Total Actions</p>
                  <p className="text-base font-bold text-blue-600">{selectedAccountant.totalActions}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Joined Date</p>
                  <p className="text-base font-bold text-gray-900">{selectedAccountant.joinedDate}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(selectedAccountant.status)}`}>
                    {selectedAccountant.status}
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
    </div>
  );
}
