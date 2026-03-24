'use client';

import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { mockLoans } from '@/lib/mockData';
import { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, User, DollarSign } from 'lucide-react';

export default function AccountantLoans() {
  const { success, error } = useToast();
  const [loans, setLoans] = useState(mockLoans);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' as const } : l));
    success('Loan approved successfully');
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' as const } : l));
    error('Loan rejected');
    setProcessing(null);
  };

  return (
    <Layout role="accountant" userName="Marie Claire Uwase">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve loan requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <Card key={loan.id} variant="bordered" hover>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{loan.memberName}</h3>
                    <p className="text-sm text-gray-600">Guarantor: {loan.guarantorName}</p>
                  </div>
                  <Badge variant={loan.status === 'approved' ? 'success' : loan.status === 'rejected' ? 'danger' : 'warning'} dot>
                    {loan.status}
                  </Badge>
                </div>

                <div className="space-y-3 py-3 border-y">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <DollarSign size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Loan Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success-100 rounded-lg">
                      <User size={18} className="text-success-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Combined Balance</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(loan.memberBalance + loan.guarantorBalance)}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500">Requested: {formatDate(loan.createdAt)}</p>

                {loan.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1"
                      leftIcon={<CheckCircle size={16} />}
                      onClick={() => handleApprove(loan.id)}
                      isLoading={processing === loan.id}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      leftIcon={<XCircle size={16} />}
                      onClick={() => handleReject(loan.id)}
                      isLoading={processing === loan.id}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
