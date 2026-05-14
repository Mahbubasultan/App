'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Users, AlertCircle, CheckCircle, Eye, Check, X, Clock } from 'lucide-react';
import { mockLoans, mockGroupStats } from '@/lib/mockData';
import { LoanStatus } from '@/types';

export default function AdminLoansPage() {
  const [loans, setLoans] = useState(mockLoans);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loansByStatus = [
    { name: 'Approved', count: loans.filter(l => l.status === 'approved').length, color: '#16a34a' },
    { name: 'Pending', count: loans.filter(l => l.status === 'pending').length, color: '#f59e0b' },
    { name: 'Rejected', count: loans.filter(l => l.status === 'rejected').length, color: '#ef4444' },
    { name: 'Disbursed', count: 3, color: '#3b82f6' },
  ];

  const loanStats = [
    { label: 'Total Loans', value: loans.length, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Approved Loans', value: loans.filter(l => l.status === 'approved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Review', value: loans.filter(l => l.status === 'pending').length, icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const handleAction = (loan: any, action: 'approve' | 'reject' | 'hold') => {
    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      hold: 'on_hold',
    };
    setLoans(loans.map(l => 
      l.id === loan.id ? { ...l, status: statusMap[action] as LoanStatus } : l
    ));
  };

  const handleViewDetails = (loan: any) => {
    setSelectedLoan(loan);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loans Management</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Approve and monitor all loan requests from members</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loanStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Loan Status Distribution</h3>
            <p className="text-xs text-gray-500 mt-0.5">Current loan status breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={loansByStatus} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any) => [`${v} loans`, 'Count']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Status Breakdown</h3>
            <p className="text-xs text-gray-500 mt-0.5">Percentage distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={loansByStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="count">
                {loansByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {loansByStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Loans Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Loan Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Borrower</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{loan.borrowerName}</td>
                  <td className="py-3 px-4 text-gray-600">{(loan.amount / 1000000).toFixed(1)}M RWF</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      loan.status === 'approved' ? 'bg-green-100 text-green-700' :
                      loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      loan.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(loan)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {loan.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(loan, 'approve')}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleAction(loan, 'reject')}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() => handleAction(loan, 'hold')}
                            className="text-yellow-600 hover:text-yellow-800 p-1"
                            title="Hold"
                          >
                            <Clock size={16} />
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
      </div>

      {/* Loan Detail Modal */}
      {isDetailOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Loan Details</h2>
                <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Borrower</label>
                  <p className="text-lg font-semibold">{selectedLoan.borrowerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-lg font-semibold">{(selectedLoan.amount / 1000000).toFixed(1)}M RWF</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedLoan.status === 'approved' ? 'bg-green-100 text-green-700' :
                    selectedLoan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    selectedLoan.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedLoan.status.charAt(0).toUpperCase() + selectedLoan.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Purpose</label>
                  <p>{selectedLoan.purpose}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Savings</label>
                  <p>{(selectedLoan.borrowerSavings / 1000000).toFixed(1)}M RWF</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
