'use client';

import { useState } from 'react';
import { Plus, Eye, X } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { useSettings } from '@/context/SettingsContext';

const mockLoans = [
  // Production-ready: Start with empty array, loans will be loaded from database
];

const mockGuarantors = [
  // Production-ready: Start with empty array, guarantors will be loaded from database
];

const userSavings = 250000;

export default function LoansPage() {
  const { t } = useSettings();
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
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'Active': return 'bg-blue-100 text-blue-700 border border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loans</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Request and manage your loans</p>
        </div>
        <button
          onClick={() => {
            setFormData({ amount: 0, duration: 6, description: '', guarantorId: '' });
            setIsRequestModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] hover:shadow-lg transition-all duration-300 w-full sm:w-fit justify-center text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Request Loan
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-[#0B5D3B] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="w-full max-w-[320px]">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t('searchPlaceholder') || 'Search...'}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('amount')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('duration')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('guarantor')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('monthly')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('status')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('dueDate')}</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLoans.map((loan) => (
                    <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#0B5D3B] text-xs sm:text-sm whitespace-nowrap">{loan.amount.toLocaleString()} RWF</td>
                      <td className="py-3 px-4 text-gray-900 text-xs sm:text-sm whitespace-nowrap">{loan.duration} months</td>
                      <td className="py-3 px-4 text-gray-900 text-xs sm:text-sm">{loan.guarantor}</td>
                      <td className="py-3 px-4 text-gray-900 text-xs sm:text-sm whitespace-nowrap">{loan.monthlyInstallment.toLocaleString()} RWF</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs sm:text-sm whitespace-nowrap">{loan.dueDate || 'N/A'}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLoans.length)} of {filteredLoans.length}
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
      </div>

      {/* Request Loan Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0B5D3B] px-6 py-5 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-bold text-white">Request Loan</h2>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
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
                  placeholder="Explain why you need this loan..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-transparent text-sm font-sans"
                  style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
                />
              </div>

              {needsGuarantor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guarantor *</label>
                  <select
                    value={formData.guarantorId}
                    onChange={(e) => setFormData({ ...formData, guarantorId: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                      selectedGuarantor && !canRequest 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  >
                    <option value="">Select guarantor...</option>
                    {mockGuarantors.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.savings.toLocaleString()} RWF)</option>
                    ))}
                  </select>
                  {selectedGuarantor && (
                    <div className={`mt-2 p-3 rounded-lg ${canRequest ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className={`text-xs font-medium ${canRequest ? 'text-green-900' : 'text-red-900'}`}>
                        Your Savings: {userSavings.toLocaleString()} RWF
                      </p>
                      <p className={`text-xs font-medium mt-1 ${canRequest ? 'text-green-900' : 'text-red-900'}`}>
                        {selectedGuarantor.name}&apos;s Savings: {selectedGuarantor.savings.toLocaleString()} RWF
                      </p>
                      <p className={`text-xs font-semibold mt-2 ${canRequest ? 'text-green-900' : 'text-red-900'}`}>
                        Combined Total: {totalCoverage.toLocaleString()} RWF
                      </p>
                      <p className={`text-xs mt-2 ${canRequest ? 'text-green-700' : 'text-red-700'}`}>
                        {canRequest 
                          ? `✓ Sufficient coverage (${totalCoverage.toLocaleString()} RWF >= ${formData.amount.toLocaleString()} RWF)`
                          : `✗ Insufficient coverage (${totalCoverage.toLocaleString()} RWF < ${formData.amount.toLocaleString()} RWF)`
                        }
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    Loan amount exceeds your savings. A guarantor is required.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canRequest || formData.amount === 0}
                  className="flex-1 px-4 py-2.5 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0B5D3B] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between sticky top-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">Loan Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Amount</p>
                  <p className="text-sm sm:text-base font-semibold text-[#0B5D3B]">{selectedLoan.amount.toLocaleString()} RWF</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Duration</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{selectedLoan.duration} months</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Guarantor</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{selectedLoan.guarantor}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLoan.status)}`}>
                    {selectedLoan.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Payment Installments</h3>
                <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                  {calculateInstallments(selectedLoan.amount, selectedLoan.duration).map((installment) => (
                    <div key={installment.month} className="flex justify-between items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Month {installment.month}</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#0B5D3B]">{installment.amount.toLocaleString()} RWF</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full px-4 py-2.5 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
