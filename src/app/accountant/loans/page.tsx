'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { mockLoans } from '@/lib/mockData';
import { AccountantTable, TableColumn } from '@/components/accountant/AccountantTable';
import { StatusBadge } from '@/components/accountant/StatusBadge';
import { ConfirmDialog } from '@/components/accountant/ConfirmDialog';
import { SearchBar } from '@/components/ui/SearchBar';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type Loan = typeof mockLoans[0];

const chartData = [
  { month: 'Jan', accepted: 3, rejected: 1, onHold: 0 },
  { month: 'Feb', accepted: 5, rejected: 1, onHold: 1 },
  { month: 'Mar', accepted: 7, rejected: 2, onHold: 1 },
  { month: 'Apr', accepted: 8, rejected: 2, onHold: 2 },
];

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'accept' | 'reject' | 'hold' | null;
    loan: Loan | null;
  }>({ isOpen: false, action: null, loan: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (loan: Loan, action: 'accept' | 'reject' | 'hold') => {
    setConfirmDialog({ isOpen: true, action, loan });
  };

  const confirmAction = async () => {
    if (!confirmDialog.action || !confirmDialog.loan) return;

    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const statusMap = {
      accept: 'approved',
      reject: 'rejected',
      hold: 'on_hold',
    };

    setLoans(loans.map(loan =>
      loan.id === confirmDialog.loan.id ? { ...loan, status: statusMap[confirmDialog.action] as any } : loan
    ));

    if (selectedLoan?.id === confirmDialog.loan.id) {
      setSelectedLoan({
        ...selectedLoan,
        status: statusMap[confirmDialog.action] as any,
      });
    }

    setConfirmDialog({ isOpen: false, action: null, loan: null });
    setIsProcessing(false);
  };

  const columns: TableColumn<Loan>[] = [
    {
      key: 'borrowerName',
      label: 'Member Name',
      sortable: true,
    },
    {
      key: 'amount',
      label: 'Loan Amount',
      sortable: true,
      render: (value) => `${(value / 1000).toFixed(0)}K RWF`,
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (value) => `${value} months`,
    },
    {
      key: 'guarantorName',
      label: 'Guarantor',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        row.status === 'pending' ? (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row, 'accept');
              }}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Accept"
            >
              <CheckCircle size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row, 'reject');
              }}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Reject"
            >
              <XCircle size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row, 'hold');
              }}
              className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
              title="Hold"
            >
              <Clock size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLoan(row);
              setIsDetailOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1 text-[#0B5D3B] hover:bg-[#0B5D3B]/10 rounded-lg transition-colors"
          >
            <Eye size={16} />
            View
          </button>
        )
      ),
    },
  ];

  const filteredLoans = loans.filter((loan) => {
    if (searchQuery.trim() === '') return true;
    const searchText = searchQuery.toLowerCase();
    return (
      loan.borrowerName.toLowerCase().includes(searchText) ||
      loan.guarantorName.toLowerCase().includes(searchText) ||
      loan.status.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Loans Management</h1>
        <p className="text-gray-600 mt-1">Manage member loans and guarantors</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Loan Status Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accepted" stroke="#10B981" strokeWidth={2} name="Accepted" />
              <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} name="Rejected" />
              <Line type="monotone" dataKey="onHold" stroke="#F59E0B" strokeWidth={2} name="On Hold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Loan Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: loans.filter(l => l.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Approved', value: loans.filter(l => l.status === 'approved').length, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Rejected', value: loans.filter(l => l.status === 'rejected').length, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'On Hold', value: loans.filter(l => l.status === 'on_hold').length, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} rounded-lg p-4 flex items-center justify-between`}>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
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
          data={filteredLoans}
          keyExtractor={(item) => item.id}
          rowsPerPage={10}
          showSearch={false}
        />
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Loan Details</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Borrower & Guarantor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Borrower</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLoan.borrowerName}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Guarantor</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLoan.guarantorName}</p>
                </div>
              </div>

              {/* Savings Coverage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-blue-600 mb-1">Borrower Savings</p>
                  <p className="text-lg font-bold text-blue-700">{(selectedLoan.borrowerSavings / 1000).toFixed(0)}K RWF</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-green-600 mb-1">Guarantor Savings</p>
                  <p className="text-lg font-bold text-green-700">{(selectedLoan.guarantorSavings / 1000).toFixed(0)}K RWF</p>
                </div>
              </div>

              {/* Loan Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Loan Amount</p>
                  <p className="text-xl font-bold text-gray-900">{(selectedLoan.amount / 1000).toFixed(0)}K RWF</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Duration</p>
                  <p className="text-xl font-bold text-gray-900">{selectedLoan.duration} months</p>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Monthly Payment</p>
                  <p className="text-lg font-bold text-gray-900">{(selectedLoan.monthlyPayment / 1000).toFixed(0)}K RWF</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">Status</p>
                  <StatusBadge status={selectedLoan.status} />
                </div>
              </div>

              {/* Total Repayment */}
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-xs uppercase tracking-wider text-purple-600 mb-1">Total Repayment</p>
                <p className="text-2xl font-bold text-purple-700">{(selectedLoan.totalRepayment / 1000).toFixed(0)}K RWF</p>
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action === 'accept' ? 'Accept Loan' : confirmDialog.action === 'reject' ? 'Reject Loan' : 'Put Loan On Hold'}
        message={`Are you sure you want to ${confirmDialog.action} this loan from ${confirmDialog.loan?.borrowerName}?`}
        confirmText={confirmDialog.action?.charAt(0).toUpperCase() + confirmDialog.action?.slice(1)}
        variant={confirmDialog.action === 'reject' ? 'danger' : confirmDialog.action === 'hold' ? 'warning' : 'default'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ isOpen: false, action: null, loan: null })}
        isLoading={isProcessing}
      />
    </div>
  );
}
