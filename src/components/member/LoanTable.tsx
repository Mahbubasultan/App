'use client';

import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Calendar, DollarSign, User, CheckCircle, Clock } from 'lucide-react';
import { Loan } from '@/types';

interface LoanTableProps {
  loans: Loan[];
  onViewDetails: (loan: Loan) => void;
}

export const LoanTable: React.FC<LoanTableProps> = ({ loans, onViewDetails }) => {
  const getStatusVariant = (status: string) => {
    if (status === 'approved' || status === 'disbursed') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar size={32} className="text-text-gray sm:w-10 sm:h-10" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-2">No loans found</h3>
        <p className="text-sm sm:text-base text-text-gray text-center">
          There are no loans matching the selected filter.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4 p-4">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-mono text-primary mb-1">{loan.id}</p>
                <p className="text-xl font-bold text-text-dark">{formatCurrency(loan.amount)}</p>
                <p className="text-xs text-text-gray mt-1">{loan.duration} months</p>
              </div>
              <Badge variant={getStatusVariant(loan.status)} size="sm">
                {loan.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-2 py-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <User size={14} className="text-text-gray" />
                <span className="text-sm text-text-gray">Guarantor:</span>
                <span className="text-sm font-medium text-text-dark">{loan.guarantorName}</span>
              </div>
              <div className="flex items-center gap-2">
                {loan.guarantorAccepted ? (
                  <CheckCircle size={14} className="text-success" />
                ) : (
                  <Clock size={14} className="text-warning" />
                )}
                <span className="text-xs text-text-gray">
                  {loan.guarantorAccepted ? 'Accepted' : 'Pending acceptance'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-text-gray" />
                <span className="text-sm text-text-gray">{formatDate(loan.createdAt)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onViewDetails(loan)}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              <Eye size={16} />
              <span>View Details</span>
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Loan ID</th>
              <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Amount</th>
              <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Guarantor</th>
              <th className="text-center py-4 px-4 font-semibold text-text-gray text-sm">Status</th>
              <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Date</th>
              <th className="text-center py-4 px-4 font-semibold text-text-gray text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr 
                key={loan.id}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-background-gray hover:to-transparent transition-all duration-300"
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-sm font-semibold text-primary">{loan.id}</span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-bold text-text-dark">{formatCurrency(loan.amount)}</p>
                    <p className="text-xs text-text-gray">{loan.duration} months</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-text-dark text-sm">{loan.guarantorName}</p>
                    <p className="text-xs text-text-gray">
                      {loan.guarantorAccepted ? '✓ Accepted' : '⏳ Pending'}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <Badge variant={getStatusVariant(loan.status)} size="sm">
                    {loan.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-text-gray">{formatDate(loan.createdAt)}</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => onViewDetails(loan)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <Eye size={16} />
                    <span className="text-sm font-medium">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
