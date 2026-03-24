'use client';

import { Layout } from '@/components/layout/Layout';
import { LoanRequestForm } from '@/components/member/LoanRequestForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockLoans, mockUsers } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Shield, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function MemberLoan() {
  const currentUser = mockUsers[0]; // Jean Baptiste Mugabo

  return (
    <Layout role="member" userName={currentUser.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request Loan</h1>
          <p className="text-gray-600 mt-1">Apply for a loan with 100% coverage guarantee</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoanRequestForm currentUserId={currentUser.id} currentUserSavings={currentUser.totalValue} />

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>My Loan Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockLoans.map((loan) => {
                const statusIcon = {
                  pending: <Clock size={18} className="text-warning-600" />,
                  guarantor_pending: <Shield size={18} className="text-info-600" />,
                  approved: <CheckCircle size={18} className="text-success-600" />,
                  rejected: <XCircle size={18} className="text-danger-600" />,
                };

                return (
                  <div key={loan.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(loan.amount)}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Guarantor: {loan.guarantorName}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          loan.status === 'approved' ? 'success' : 
                          loan.status === 'rejected' ? 'danger' : 
                          'warning'
                        } 
                        icon={statusIcon[loan.status]}
                        dot
                      >
                        {loan.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="space-y-2 py-3 border-t border-b">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coverage:</span>
                        <span className="font-semibold text-success-600">
                          {loan.coveragePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Combined Savings:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(loan.combinedSavings)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(loan.monthlyPayment)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mt-3">
                      <span className="text-gray-600">Requested on</span>
                      <span className="font-medium">{formatDate(loan.createdAt)}</span>
                    </div>

                    {loan.status === 'pending' && !loan.guarantorAccepted && (
                      <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                        <p className="text-xs text-warning-800">
                          <Shield size={14} className="inline mr-1" />
                          Awaiting guarantor acceptance
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
