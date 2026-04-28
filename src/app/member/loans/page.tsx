'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { useState } from 'react';
import { Search, Plus, Eye, Filter } from 'lucide-react';

const mockLoans = [
  { id: 1, amount: 400000, duration: 6, guarantor: 'Eric Habimana', monthlyInstallment: 70000, status: 'Approved', dueDate: '2024-07-15', createdDate: '2024-01-15' },
  { id: 2, amount: 300000, duration: 4, guarantor: 'Marie Claire', monthlyInstallment: 78750, status: 'Pending', dueDate: '2024-05-20', createdDate: '2024-01-20' },
  { id: 3, amount: 500000, duration: 12, guarantor: 'Patrick Nkunda', monthlyInstallment: 43750, status: 'Active', dueDate: '2025-01-10', createdDate: '2023-01-10' },
  { id: 4, amount: 200000, duration: 3, guarantor: 'Grace Uwera', monthlyInstallment: 70000, status: 'Rejected', dueDate: '', createdDate: '2024-01-05' },
  { id: 5, amount: 350000, duration: 6, guarantor: 'David Mugisha', monthlyInstallment: 61250, status: 'Active', dueDate: '2024-06-25', createdDate: '2023-12-25' },
];

const mockGuarantors = [
  { id: 1, name: 'Eric Habimana', savings: 280000 },
  { id: 2, name: 'Marie Claire', savings: 360000 },
  { id: 3, name: 'Patrick Nkunda', savings: 500000 },
  { id: 4, name: 'Grace Uwera', savings: 190000 },
];

const userSavings = 250000;

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    amount: 0,
    duration: 6,
    description: '',
    guarantorId: '',
  });

  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Active'];

  const filteredLoans = mockLoans.filter(loan => {
    const matchesTab = activeTab === 'All' || loan.status === activeTab;
    const matchesSearch = loan.guarantor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedGuarantor = mockGuarantors.find(g => g.id.toString() === formData.guarantorId);
  const totalCoverage = userSavings + (selectedGuarantor?.savings || 0);
  const needsGuarantor = formData.amount > userSavings;
  const canRequest = formData.amount <= totalCoverage;

  const calculateInstallments = (amount: number, duration: number) => {
    const totalWithInterest = amount * 1.05;
    const monthlyPayment = totalWithInterest / duration;
    return Array.from({ length: duration }, (_, i) => ({
      month: i + 1,
      amount: monthlyPayment,
    }));
  };

  const handleSubmit = () => {
    if (!canRequest) {
      alert('Loan amount exceeds available coverage!');
      return;
    }
    console.log('Submitting loan request:', formData);
    setIsRequestModalOpen(false);
    setFormData({ amount: 0, duration: 6, description: '', guarantorId: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Active': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MemberLayout userName="Jean Baptiste Mugabo">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
            <p className="text-gray-600 mt-1">Request and manage your loans</p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Plus size={20} />
            Request Loan
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by guarantor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Guarantor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Monthly Installment</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{loan.amount.toLocaleString()} RWF</td>
                    <td className="py-3 px-4 text-gray-900">{loan.duration} months</td>
                    <td className="py-3 px-4 text-gray-900">{loan.guarantor}</td>
                    <td className="py-3 px-4 text-gray-900">{loan.monthlyInstallment.toLocaleString()} RWF</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{loan.dueDate || 'N/A'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setIsViewModalOpen(true);
                        }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLoans.length)} of {filteredLoans.length} entries
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

      {/* Request Loan Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Loan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (RWF)</label>
                <input
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                />
                <p className="text-xs text-gray-500 mt-1">Your savings: {userSavings.toLocaleString()} RWF</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (months)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Purpose of loan..."
                />
              </div>

              {needsGuarantor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guarantor</label>
                  <select
                    value={formData.guarantorId}
                    onChange={(e) => setFormData({ ...formData, guarantorId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select guarantor...</option>
                    {mockGuarantors.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.savings.toLocaleString()} RWF)</option>
                    ))}
                  </select>
                  {selectedGuarantor && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-900">
                        Total Coverage: {totalCoverage.toLocaleString()} RWF
                      </p>
                      <p className={`text-xs mt-1 ${canRequest ? 'text-green-700' : 'text-red-700'}`}>
                        {canRequest ? '✓ Sufficient coverage' : '✗ Insufficient coverage'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canRequest || formData.amount === 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Loan Details Modal */}
      {isViewModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Loan Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-gray-900">{selectedLoan.amount.toLocaleString()} RWF</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">{selectedLoan.duration} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guarantor</p>
                  <p className="font-semibold text-gray-900">{selectedLoan.guarantor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLoan.status)}`}>
                    {selectedLoan.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Installments</h3>
                <div className="space-y-2">
                  {calculateInstallments(selectedLoan.amount, selectedLoan.duration).map((installment) => (
                    <div key={installment.month} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Month {installment.month}</span>
                      <span className="font-semibold text-gray-900">{installment.amount.toLocaleString()} RWF</span>
                    </div>
                  ))}
                </div>
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
