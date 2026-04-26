'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { LoanTabs } from '@/components/member/LoanTabs';
import { LoanTable } from '@/components/member/LoanTable';
import { LoanDetailsModal } from '@/components/member/LoanDetailsModal';
import { mockLoans, mockUsers } from '@/lib/mockData';
import { Loan } from '@/types';
import { Plus } from 'lucide-react';

export default function MemberLoan() {
  const router = useRouter();
  const currentUser = mockUsers[0]; // Jean Baptiste Mugabo
  const [activeTab, setActiveTab] = useState<'approved' | 'rejected' | 'pending'>('pending');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Filter loans by status
  const filteredLoans = mockLoans.filter(loan => {
    if (activeTab === 'approved') return loan.status === 'approved' || loan.status === 'disbursed';
    if (activeTab === 'rejected') return loan.status === 'rejected';
    if (activeTab === 'pending') return loan.status === 'pending' || loan.status === 'guarantor_pending';
    return true;
  });

  // Count loans by status
  const counts = {
    approved: mockLoans.filter(l => l.status === 'approved' || l.status === 'disbursed').length,
    rejected: mockLoans.filter(l => l.status === 'rejected').length,
    pending: mockLoans.filter(l => l.status === 'pending' || l.status === 'guarantor_pending').length,
  };

  return (
    <Layout role="member" userName={currentUser.name}>
      <div className="space-y-4 sm:space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent-orange bg-clip-text text-transparent">
              Loans
            </h1>
            <p className="text-sm sm:text-base text-text-gray mt-1">Manage your loan requests and track status</p>
          </div>
          <button
            onClick={() => router.push('/member/loan/request')}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold shadow-green hover:shadow-large transition-all duration-300 active:scale-95 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>Request Loan</span>
          </button>
        </div>

        {/* Tabs */}
        <LoanTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

        {/* Table */}
        <Card>
          <LoanTable loans={filteredLoans} onViewDetails={setSelectedLoan} />
        </Card>
      </div>

      {/* Details Modal */}
      <LoanDetailsModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
    </Layout>
  );
}
