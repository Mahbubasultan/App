'use client';

import { CheckCircle, XCircle, PauseCircle, X } from 'lucide-react';
import { Loan } from '@/types';
import { StatusBadge } from './StatusBadge';

interface LoanDetailsModalProps {
  loan: Loan;
  onClose: () => void;
  onAction: (loanId: string, action: 'approved' | 'rejected' | 'on_hold') => void;
}

const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const LoanDetailsModal: React.FC<LoanDetailsModalProps> = ({ loan, onClose, onAction }) => {
  const statusConfig = {
    pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    approved: { label: 'Approved', color: 'text-green-600', bg: 'bg-green-50' },
    rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50' },
    on_hold: { label: 'On Hold', color: 'text-orange-600', bg: 'bg-orange-50' },
    guarantor_pending: { label: 'Guarantor Pending', color: 'text-orange-600', bg: 'bg-orange-50' },
    disbursed: { label: 'Disbursed', color: 'text-sky-600', bg: 'bg-sky-50' },
    repaid: { label: 'Repaid', color: 'text-slate-600', bg: 'bg-slate-50' },
  };

  const status = statusConfig[loan.status] ?? statusConfig.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Loan details</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">{loan.borrowerName}</h2>
            <p className="text-sm text-gray-500">{loan.id}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Borrower</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-sm font-bold text-white">
                  {loan.borrowerName
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{loan.borrowerName}</p>
                  <p className="text-sm text-gray-500">Savings {loan.borrowerSavings.toLocaleString()} RWF</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Guarantor</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-900 text-sm font-bold text-white">
                  {loan.guarantorName
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{loan.guarantorName}</p>
                  <p className="text-sm text-gray-500">Balance {loan.guarantorSavings.toLocaleString()} RWF</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Loan Amount', value: `${loan.amount.toLocaleString()} RWF` },
              { label: 'Status', value: status.label },
              { label: 'Date', value: formatDate(loan.createdAt) },
              { label: 'Coverage', value: `${loan.coveragePercentage.toFixed(1)}%` },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-gray-100 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{item.label}</p>
                <p className="mt-3 text-sm font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Combined coverage</p>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900">{loan.combinedSavings.toLocaleString()} RWF</p>
                <p className="text-sm text-gray-500">Guaranteed coverage amount</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${loan.coveragePercentage >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {loan.coveragePercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
              <p className="font-semibold text-gray-900">Loan schedule</p>
              <StatusBadge status={loan.status} />
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between gap-3">
                <span>Interest rate</span>
                <span>{loan.interestRate}%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Duration</span>
                <span>{loan.duration} months</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Monthly payment</span>
                <span>{loan.monthlyPayment.toLocaleString()} RWF</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Total repayment</span>
                <span>{loan.totalRepayment.toLocaleString()} RWF</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row">
          {loan.status !== 'approved' && loan.status !== 'rejected' ? (
            <>
              <button
                onClick={() => onAction(loan.id, 'approved')}
                className="flex-1 rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  <CheckCircle size={16} /> Accept
                </span>
              </button>
              <button
                onClick={() => onAction(loan.id, 'on_hold')}
                className="flex-1 rounded-2xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  <PauseCircle size={16} /> Hold
                </span>
              </button>
              <button
                onClick={() => onAction(loan.id, 'rejected')}
                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  <XCircle size={16} /> Reject
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-gray-700 border border-gray-200 transition hover:bg-gray-100"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
