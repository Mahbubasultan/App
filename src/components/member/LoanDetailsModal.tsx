'use client';

import { Loan } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { X, DollarSign, Calendar, User, Shield, Percent, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface LoanDetailsModalProps {
  loan: Loan | null;
  onClose: () => void;
}

export const LoanDetailsModal: React.FC<LoanDetailsModalProps> = ({ loan, onClose }) => {
  if (!loan) return null;

  const getStatusVariant = (status: string) => {
    if (status === 'approved' || status === 'disbursed') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Loan Details</h2>
              <p className="text-white/80 text-sm mt-1">Complete loan information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Loan ID & Status */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
            <div>
              <p className="text-sm text-text-gray mb-1">Loan ID</p>
              <p className="text-xl font-mono font-bold text-primary">{loan.id}</p>
            </div>
            <Badge variant={getStatusVariant(loan.status)} size="md">
              {loan.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Amount Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary rounded-lg">
                  <DollarSign size={20} className="text-white" />
                </div>
                <p className="text-sm font-medium text-text-gray">Loan Amount</p>
              </div>
              <p className="text-3xl font-bold text-primary">{formatCurrency(loan.amount)}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border-2 border-secondary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary rounded-lg">
                  <Calendar size={20} className="text-white" />
                </div>
                <p className="text-sm font-medium text-text-gray">Duration</p>
              </div>
              <p className="text-3xl font-bold text-secondary">{loan.duration} months</p>
            </div>
          </div>

          {/* Coverage Information */}
          <div className="p-5 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border-2 border-success/20">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-success" />
              <h3 className="font-semibold text-success text-lg">Coverage Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-text-gray mb-1">Your Savings</p>
                <p className="font-bold text-text-dark">{formatCurrency(loan.borrowerSavings)}</p>
              </div>
              <div>
                <p className="text-xs text-text-gray mb-1">Guarantor Savings</p>
                <p className="font-bold text-text-dark">{formatCurrency(loan.guarantorSavings)}</p>
              </div>
              <div>
                <p className="text-xs text-text-gray mb-1">Combined</p>
                <p className="font-bold text-success">{formatCurrency(loan.combinedSavings)}</p>
              </div>
              <div>
                <p className="text-xs text-text-gray mb-1">Coverage</p>
                <p className="font-bold text-success">{loan.coveragePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Guarantor Information */}
          <div className="p-5 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <User size={20} className="text-primary" />
              <h3 className="font-semibold text-text-dark">Guarantor Information</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-text-dark">{loan.guarantorName}</p>
                <p className="text-sm text-text-gray">Guarantor</p>
              </div>
              <Badge variant={loan.guarantorAccepted ? 'success' : 'warning'} size="sm">
                {loan.guarantorAccepted ? (
                  <>
                    <CheckCircle size={14} className="mr-1" />
                    Accepted
                  </>
                ) : (
                  <>
                    <Clock size={14} className="mr-1" />
                    Pending
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Repayment Details */}
          <div className="p-5 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded-xl border-2 border-accent-orange/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-accent-orange" />
              <h3 className="font-semibold text-accent-orange text-lg">Repayment Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Percent size={16} className="text-text-gray" />
                  <p className="text-xs text-text-gray">Interest Rate</p>
                </div>
                <p className="text-xl font-bold text-text-dark">{loan.interestRate}%</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-text-gray" />
                  <p className="text-xs text-text-gray">Monthly Payment</p>
                </div>
                <p className="text-xl font-bold text-accent-orange">{formatCurrency(loan.monthlyPayment)}</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className="text-text-gray" />
                  <p className="text-xs text-text-gray">Total Repayment</p>
                </div>
                <p className="text-xl font-bold text-text-dark">{formatCurrency(loan.totalRepayment)}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-text-dark">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-text-gray">Requested:</span>
                <span className="font-medium text-text-dark">{formatDateTime(loan.createdAt)}</span>
              </div>
              {loan.approvedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-text-gray">Approved:</span>
                  <span className="font-medium text-text-dark">{formatDateTime(loan.approvedAt)}</span>
                </div>
              )}
              {loan.disbursedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-text-gray">Disbursed:</span>
                  <span className="font-medium text-text-dark">{formatDateTime(loan.disbursedAt)}</span>
                </div>
              )}
              {loan.dueDate && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                  <span className="text-text-gray">Due Date:</span>
                  <span className="font-medium text-text-dark">{formatDate(loan.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason */}
          {loan.status === 'rejected' && loan.rejectionReason && (
            <div className="p-4 bg-danger/10 border-2 border-danger/20 rounded-xl">
              <p className="text-sm font-semibold text-danger mb-1">Rejection Reason</p>
              <p className="text-sm text-text-dark">{loan.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
