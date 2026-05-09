'use client';

import { useState } from 'react';
import { Search, Eye, X, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockLoans = [
  { id: 1, memberName: 'Jean Baptiste', amount: 400000, duration: 6, guarantor: 'Eric Habimana', guarantorSavings: 280000, borrowerSavings: 250000, monthlyInstallment: 70000, status: 'Pending', dueDate: '2024-07-15', createdDate: '2024-01-15', phone: '+250788123456', email: 'jean@email.com', interestRate: 5 },
  { id: 2, memberName: 'Marie Claire', amount: 300000, duration: 4, guarantor: 'Patrick Nkunda', guarantorSavings: 500000, borrowerSavings: 360000, monthlyInstallment: 78750, status: 'Pending', dueDate: '2024-05-20', createdDate: '2024-01-20', phone: '+250788234567', email: 'marie@email.com', interestRate: 5 },
  { id: 3, memberName: 'Eric Habimana', amount: 500000, duration: 12, guarantor: 'Marie Claire', guarantorSavings: 360000, borrowerSavings: 280000, monthlyInstallment: 43750, status: 'Approved', dueDate: '2025-01-10', createdDate: '2023-01-10', phone: '+250788345678', email: 'eric@email.com', interestRate: 5 },
  { id: 4, memberName: 'Patrick Nkunda', amount: 200000, duration: 3, guarantor: 'Grace Uwera', guarantorSavings: 190000, borrowerSavings: 500000, monthlyInstallment: 70000, status: 'Rejected', dueDate: '', createdDate: '2024-01-05', phone: '+250788456789', email: 'patrick@email.com', interestRate: 5 },
  { id: 5, memberName: 'Grace Uwera', amount: 350000, duration: 6, guarantor: 'David Mugisha', guarantorSavings: 250000, borrowerSavings: 190000, monthlyInstallment: 61250, status: 'On Hold', dueDate: '2024-06-25', createdDate: '2023-12-25', phone: '+250788567890', email: 'grace@email.com', interestRate: 5 },
];

const loanStatusData = [
  { name: 'Active', value: 8, color: '#0B5D3B' },
  { name: 'Pending', value: 4, color: '#F59E0B' },
  { name: 'Repaid', value: 12, color: '#10B981' },
  { name: 'Overdue', value: 2, color: '#EF4444' },
];

// Horizontal bar chart data
const loanAmountData = [
  { name: 'Jean Baptiste', amount: 400000 },
  { name: 'Eric Habimana', amount: 500000 },
  { name: 'Grace Uwera', amount: 350000 },
  { name: 'Marie Claire', amount: 300000 },
  { name: 'Patrick Nkunda', amount: 200000 },
];

export default function AccountantLoans() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLoans = mockLoans.filter(loan => {
    const matchesSearch = 
      loan.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.guarantor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const calculateInstallments = (amount: number, duration: number) => {
    const totalWithInterest = amount * 1.05;
    const monthlyPayment = totalWithInterest / duration;
    return Array.from({ length: duration }, (_, i) => ({
      month: i + 1,
      amount: monthlyPayment,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'On Hold': return 'bg-blue-100 text-blue-700 border border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loans Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all member loans</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        {/* Loan Status Pie Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Loan Status Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={loanStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}`}
                outerRadius={typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : 90}
                fill="#8884d8"
                dataKey="value"
              >
                {loanStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} loans`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {loanStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 truncate">{item.name}</p>
                  <p className="font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Bar Chart - Hamburger Style */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Top Loan Amounts</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart 
              data={loanAmountData} 
              layout="vertical"
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()} RWF`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar 
                dataKey="amount" 
                fill="#0B5D3B" 
                radius={[0, 8, 8, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600">Total Loans Issued</p>
            <p className="text-lg sm:text-xl font-bold text-[#0B5D3B]">1,750,000 RWF</p>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
        {/* Filter Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by member or guarantor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all"
                />
              </div>
              <button className="px-4 py-2 bg-[#0B5D3B] text-white rounded-xl font-medium hover:bg-[#094a2e] transition-all text-sm whitespace-nowrap active:scale-95">
                Search
              </button>
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 active:scale-95"
              >
                <Filter size={18} />
                <span>{statusFilter}</span>
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in-0 zoom-in-95 duration-200">
                    {['All', 'Approved', 'Pending', 'Rejected', 'On Hold'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
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
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Member</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{loan.memberName}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm whitespace-nowrap">{loan.amount.toLocaleString()} RWF</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setIsViewModalOpen(true);
                        }}
                        className="p-2 hover:bg-[#0B5D3B]/10 text-[#0B5D3B] rounded-lg transition-all active:scale-95"
                        title="View details"
                      >
                        <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLoans.length)} of {filteredLoans.length}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Loan Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto touch-pan-y flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Member Information */}
                <div className="col-span-full bg-gradient-to-r from-[#0B5D3B]/10 to-blue-50 rounded-xl p-4 border border-[#0B5D3B]/20">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0B5D3B] rounded-full flex items-center justify-center text-white font-bold">
                      {selectedLoan.memberName.charAt(0)}
                    </div>
                    Borrower Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedLoan.memberName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedLoan.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedLoan.email}</p>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Loan Amount</p>
                  <p className="text-base font-bold text-[#0B5D3B]">{selectedLoan.amount.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Duration</p>
                  <p className="text-base font-bold text-gray-900">{selectedLoan.duration} months</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Interest Rate</p>
                  <p className="text-base font-bold text-blue-600">{selectedLoan.interestRate}%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Monthly Payment</p>
                  <p className="text-base font-bold text-purple-600">{selectedLoan.monthlyInstallment.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Guarantor</p>
                  <p className="text-base font-bold text-gray-900">{selectedLoan.guarantor}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Guarantor Savings</p>
                  <p className="text-base font-bold text-green-600">{selectedLoan.guarantorSavings.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Created Date</p>
                  <p className="text-base font-bold text-gray-900">{selectedLoan.createdDate}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedLoan.status)}`}>
                    {selectedLoan.status}
                  </span>
                </div>

                {/* Payment Schedule */}
                <div className="col-span-full border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Schedule</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto touch-pan-y">
                    {calculateInstallments(selectedLoan.amount, selectedLoan.duration).map((installment) => (
                      <div key={installment.month} className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center hover:bg-gray-100 transition-colors">
                        <p className="text-xs font-medium text-gray-700">Month {installment.month}</p>
                        <p className="text-xs font-semibold text-[#0B5D3B] mt-1">{installment.amount.toLocaleString()} RWF</p>
                      </div>
                    ))}
                  </div>
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
