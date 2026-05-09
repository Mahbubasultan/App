'use client';

import { LoanStatus } from '@/types';

const statusMap: Record<LoanStatus, { label: string; cls: string; dot: string }> = {
  pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  approved: { label: 'Approved', cls: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  on_hold: { label: 'On Hold', cls: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  guarantor_pending: { label: 'Guarantor Pending', cls: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  disbursed: { label: 'Disbursed', cls: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  repaid: { label: 'Repaid', cls: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
};

interface StatusBadgeProps {
  status: LoanStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusMap[status] ?? statusMap.pending;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.cls}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
