'use client';

import { Eye } from 'lucide-react';
import ActionCell from '@/components/ui/ActionCell';
import { Loan } from '@/types';

interface LoanTableProps {
  loans: Loan[];
  onView: (loan: Loan) => void;
  onAction: (loan: Loan, action: 'approved' | 'rejected' | 'on_hold') => void;
}

export const LoanTable: React.FC<LoanTableProps> = ({ loans, onView, onAction }) => {
  const getStatusStyles = (status: string) => {
    if (status === 'approved') return 'bg-green-50 text-green-700 border-green-200';
    if (status === 'pending') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (status === 'on_hold') return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'on_hold') return 'On Hold';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {loans.map((loan) => (
          <div key={loan.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {loan.borrowerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{loan.borrowerName}</p>
                  <p className="text-xs text-gray-500 truncate">{loan.id}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold border flex-shrink-0 ${getStatusStyles(loan.status)}`}>
                {getStatusLabel(loan.status)}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4 pb-4 border-t border-gray-200">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Amount:</span>
                <span className="text-gray-900 font-semibold">{loan.amount.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Duration:</span>
                <span className="text-gray-900 font-semibold">{loan.duration} months</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {loan.guarantorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Guarantor</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{loan.guarantorName}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Coverage:</span>
                <span className="text-gray-900 font-semibold">{loan.coveragePercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900 font-semibold">{loan.createdAt.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onView(loan)}
              className="w-full p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              <span className="text-sm font-medium">View Details</span>
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Borrower', 'Amount', 'Guarantor', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} className="text-left px-4 sm:px-5 py-3 sm:py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 sm:px-5 py-3 sm:py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {loan.borrowerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{loan.borrowerName}</p>
                      <p className="text-xs text-gray-400 truncate">{loan.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-5 py-3 sm:py-4">
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{loan.amount.toLocaleString()} RWF</p>
                  <p className="text-xs text-gray-500">{loan.duration} months</p>
                </td>
                <td className="px-4 sm:px-5 py-3 sm:py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {loan.guarantorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{loan.guarantorName}</p>
                      <p className="text-xs text-gray-400 truncate">{loan.coveragePercentage.toFixed(1)}% coverage</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-5 py-3 sm:py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusStyles(loan.status)}`}>
                    {getStatusLabel(loan.status)}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3 sm:py-4 text-xs font-medium whitespace-nowrap">
                  <span className="text-gray-700">
                    {loan.createdAt.toLocaleDateString()}
                  </span>
                </td>
                <td className="px-4 sm:px-5 py-3 sm:py-4 text-center">
                  <ActionCell onView={() => onView(loan)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
