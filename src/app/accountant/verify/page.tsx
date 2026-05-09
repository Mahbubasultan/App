'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Eye, X, Check, XCircle } from 'lucide-react';

type PaymentStatus = 'pending' | 'approved' | 'rejected';

interface Payment {
  id: string;
  memberName: string;
  amount: number;
  transactionId: string;
  date: string;
  status: PaymentStatus;
  phone: string;
  momoName: string;
  uploadDate: string;
  screenshot: string;
  notes?: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    memberName: 'Jean Baptiste',
    amount: 50000,
    transactionId: 'TXN-2024-001',
    date: '2024-01-15',
    status: 'pending',
    phone: '+250 788 123 456',
    momoName: 'Jean Baptiste K.',
    uploadDate: '2024-01-15 10:30 AM',
    screenshot: 'https://via.placeholder.com/400x600',
    notes: 'Monthly contribution'
  },
  {
    id: '2',
    memberName: 'Marie Claire',
    amount: 100000,
    transactionId: 'TXN-2024-002',
    date: '2024-01-14',
    status: 'approved',
    phone: '+250 788 234 567',
    momoName: 'Marie Claire U.',
    uploadDate: '2024-01-14 02:15 PM',
    screenshot: 'https://via.placeholder.com/400x600',
    notes: 'Double payment'
  },
  {
    id: '3',
    memberName: 'Patrick Nkunda',
    amount: 75000,
    transactionId: 'TXN-2024-003',
    date: '2024-01-13',
    status: 'pending',
    phone: '+250 788 345 678',
    momoName: 'Patrick N.',
    uploadDate: '2024-01-13 09:45 AM',
    screenshot: 'https://via.placeholder.com/400x600'
  },
  {
    id: '4',
    memberName: 'Grace Uwera',
    amount: 50000,
    transactionId: 'TXN-2024-004',
    date: '2024-01-12',
    status: 'rejected',
    phone: '+250 788 456 789',
    momoName: 'Grace U.',
    uploadDate: '2024-01-12 04:20 PM',
    screenshot: 'https://via.placeholder.com/400x600',
    notes: 'Invalid screenshot'
  },
  {
    id: '5',
    memberName: 'David Mugisha',
    amount: 150000,
    transactionId: 'TXN-2024-005',
    date: '2024-01-11',
    status: 'approved',
    phone: '+250 788 567 890',
    momoName: 'David M.',
    uploadDate: '2024-01-11 11:00 AM',
    screenshot: 'https://via.placeholder.com/400x600'
  },
  {
    id: '6',
    memberName: 'Sarah Kamikazi',
    amount: 50000,
    transactionId: 'TXN-2024-006',
    date: '2024-01-10',
    status: 'pending',
    phone: '+250 788 678 901',
    momoName: 'Sarah K.',
    uploadDate: '2024-01-10 03:30 PM',
    screenshot: 'https://via.placeholder.com/400x600'
  }
];

export default function AccountantVerify() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [activeTab, setActiveTab] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const tabs = [
    { id: 'all', label: 'All', count: payments.length },
    { id: 'pending', label: 'Pending', count: payments.filter(p => p.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: payments.filter(p => p.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: payments.filter(p => p.status === 'rejected').length },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    const matchesSearch = 
      payment.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'approved' as PaymentStatus } : p));
    setSelectedPayment(null);
  };

  const handleReject = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'rejected' as PaymentStatus } : p));
    setSelectedPayment(null);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
        {/* Header */}
        <div className="animate-in slide-in-from-top-4 duration-500">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Verify Payments</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Review and verify member payment submissions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-in slide-in-from-top-4 duration-500" style={{ animationDelay: '100ms' }}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-[#0B5D3B] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tab.label}
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-4 duration-500" style={{ animationDelay: '200ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="block sm:hidden space-y-3 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
          {filteredPayments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No payments found
            </div>
          ) : (
            filteredPayments.map((payment, index) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{payment.memberName}</p>
                    <p className="text-sm text-gray-600">{payment.transactionId}</p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-[#0B5D3B]">{payment.amount.toLocaleString()} RWF</p>
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="p-2 text-[#0B5D3B] hover:bg-[#0B5D3B]/10 rounded-lg transition-all duration-200 active:scale-95"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Member</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Transaction ID</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.memberName}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-[#0B5D3B]">{payment.amount.toLocaleString()} RWF</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-600">{payment.transactionId}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-600">{payment.date}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 text-[#0B5D3B] hover:bg-[#0B5D3B]/10 rounded-lg transition-all duration-200 active:scale-95"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-[#0B5D3B] px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg sm:text-xl font-bold text-white">Payment Details</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto touch-pan-y p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedPayment.memberName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedPayment.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">MoMo Name</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedPayment.momoName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Amount</label>
                  <p className="text-sm font-bold text-[#0B5D3B] mt-1">{selectedPayment.amount.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Transaction ID</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedPayment.transactionId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Upload Date</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedPayment.uploadDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                {selectedPayment.notes && (
                  <div className="sm:col-span-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Notes</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedPayment.notes}</p>
                  </div>
                )}
              </div>

              {/* Screenshot */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Screenshot Proof</label>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                  <Image 
                    src={selectedPayment.screenshot} 
                    alt="Payment proof" 
                    width={400}
                    height={600}
                    className="max-h-64 sm:max-h-96 rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200">
              {selectedPayment.status === 'pending' ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleApprove(selectedPayment.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 active:scale-95"
                  >
                    <Check size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedPayment.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 active:scale-95"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-full px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 active:scale-95"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
