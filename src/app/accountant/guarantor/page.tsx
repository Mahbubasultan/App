'use client';

import { useState } from 'react';
import { Search, Eye, X, Filter } from 'lucide-react';

const mockGuarantors = [
  { id: 1, guarantorName: 'Eric Habimana', borrowerName: 'Jean Baptiste', loanAmount: 400000, guarantorSavings: 280000, borrowerSavings: 250000, combinedSavings: 530000, coverage: '132.5%', status: 'Pending', date: '2024-01-15', guarantorPhone: '+250788345678', guarantorEmail: 'eric@email.com', borrowerPhone: '+250788123456', borrowerEmail: 'jean@email.com' },
  { id: 2, guarantorName: 'Patrick Nkunda', borrowerName: 'Marie Claire', loanAmount: 300000, guarantorSavings: 500000, borrowerSavings: 360000, combinedSavings: 860000, coverage: '286.7%', status: 'Approved', date: '2024-01-20', guarantorPhone: '+250788456789', guarantorEmail: 'patrick@email.com', borrowerPhone: '+250788234567', borrowerEmail: 'marie@email.com' },
  { id: 3, guarantorName: 'Marie Claire', borrowerName: 'Eric Habimana', loanAmount: 500000, guarantorSavings: 360000, borrowerSavings: 280000, combinedSavings: 640000, coverage: '128%', status: 'Approved', date: '2023-01-10', guarantorPhone: '+250788234567', guarantorEmail: 'marie@email.com', borrowerPhone: '+250788345678', borrowerEmail: 'eric@email.com' },
  { id: 4, guarantorName: 'Grace Uwera', borrowerName: 'Patrick Nkunda', loanAmount: 200000, guarantorSavings: 190000, borrowerSavings: 500000, combinedSavings: 690000, coverage: '345%', status: 'Rejected', date: '2024-01-05', guarantorPhone: '+250788567890', guarantorEmail: 'grace@email.com', borrowerPhone: '+250788456789', borrowerEmail: 'patrick@email.com' },
  { id: 5, guarantorName: 'David Mugisha', borrowerName: 'Grace Uwera', loanAmount: 350000, guarantorSavings: 250000, borrowerSavings: 190000, combinedSavings: 440000, coverage: '125.7%', status: 'On Hold', date: '2023-12-25', guarantorPhone: '+250788678901', guarantorEmail: 'david@email.com', borrowerPhone: '+250788567890', borrowerEmail: 'grace@email.com' },
];

export default function AccountantGuarantor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedGuarantor, setSelectedGuarantor] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredGuarantors = mockGuarantors.filter(guarantor => {
    const matchesSearch = 
      guarantor.guarantorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guarantor.borrowerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || guarantor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredGuarantors.length / itemsPerPage);
  const paginatedGuarantors = filteredGuarantors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'On Hold': return 'bg-blue-100 text-blue-700 border border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getCoverageColor = (coverage: string) => {
    const percent = parseFloat(coverage);
    if (percent >= 100) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Guarantors Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all guarantor requests</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by guarantor or borrower..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all"
                />
              </div>
              <button className="px-4 py-2 bg-[#0B5D3B] text-white rounded-xl font-medium hover:bg-[#094a2e] transition-all text-sm whitespace-nowrap">
                Search
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"
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

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Guarantor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Borrower</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Loan Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGuarantors.map((guarantor) => (
                  <tr key={guarantor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{guarantor.guarantorName}</td>
                    <td className="py-3 px-4 text-gray-900 text-xs sm:text-sm">{guarantor.borrowerName}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm whitespace-nowrap">{guarantor.loanAmount.toLocaleString()} RWF</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(guarantor.status)}`}>
                        {guarantor.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedGuarantor(guarantor);
                          setIsViewModalOpen(true);
                        }}
                        className="p-2 hover:bg-[#0B5D3B]/10 text-[#0B5D3B] rounded-lg transition-colors"
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

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredGuarantors.length)} of {filteredGuarantors.length}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
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

      {isViewModalOpen && selectedGuarantor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Guarantor Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto touch-pan-y flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guarantor Information */}
                <div className="col-span-full bg-gradient-to-r from-[#0B5D3B]/10 to-green-50 rounded-xl p-4 border border-[#0B5D3B]/20">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0B5D3B] rounded-full flex items-center justify-center text-white font-bold">
                      {selectedGuarantor.guarantorName.charAt(0)}
                    </div>
                    Guarantor Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedGuarantor.guarantorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.guarantorPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.guarantorEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Borrower Information */}
                <div className="col-span-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedGuarantor.borrowerName.charAt(0)}
                    </div>
                    Borrower Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-900">{selectedGuarantor.borrowerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.borrowerPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedGuarantor.borrowerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Loan Amount</p>
                  <p className="text-base font-bold text-[#0B5D3B]">{selectedGuarantor.loanAmount.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Coverage</p>
                  <p className={`text-base font-bold ${getCoverageColor(selectedGuarantor.coverage)}`}>
                    {selectedGuarantor.coverage} {parseFloat(selectedGuarantor.coverage) >= 100 ? '✓' : '✗'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Guarantor Savings</p>
                  <p className="text-base font-bold text-green-600">{selectedGuarantor.guarantorSavings.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Borrower Savings</p>
                  <p className="text-base font-bold text-blue-600">{selectedGuarantor.borrowerSavings.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Combined Savings</p>
                  <p className="text-base font-bold text-purple-600">{selectedGuarantor.combinedSavings.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Date</p>
                  <p className="text-base font-bold text-gray-900">{selectedGuarantor.date}</p>
                </div>
                <div className="col-span-full bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedGuarantor.status)}`}>
                    {selectedGuarantor.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <button onClick={() => setIsViewModalOpen(false)} className="w-full px-4 py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
