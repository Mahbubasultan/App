'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Payment } from '@/types';
import { mockPayments } from '@/lib/mockData';
import { formatCurrency, formatDateTime, getPenaltyTierLabel } from '@/lib/utils';
import { Eye, CheckCircle, XCircle, Phone, Hash, Layers, AlertCircle, Calendar } from 'lucide-react';

export const PaymentQueue: React.FC = () => {
  const { success, error } = useToast();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerify = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'verified', verifiedAt: new Date() } : p
    ));
    success('Payment verified successfully');
    setSelectedPayment(null);
    setIsProcessing(false);
  };

  const handleFlag = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'flagged' } : p
    ));
    error('Payment flagged for review');
    setSelectedPayment(null);
    setIsProcessing(false);
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const processedPayments = payments.filter(p => p.status !== 'pending');

  return (
    <>
      <div className="space-y-6">
        {pendingPayments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pending Verification ({pendingPayments.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPayments.map((payment) => (
                <Card key={payment.id} variant="bordered" hover>
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{payment.memberName}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{payment.momoName}</p>
                      </div>
                      <Badge variant="warning" dot>pending</Badge>
                    </div>

                    {/* Share Calculation */}
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers size={14} className="text-primary-600" />
                        <p className="text-xs font-semibold text-primary-900">Share Calculation</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{formatCurrency(payment.amount)}</span>
                        <span className="text-lg font-bold text-primary-600">{payment.shares} shares</span>
                      </div>
                    </div>

                    {/* Penalty Warning */}
                    {payment.daysLate > 0 && (
                      <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle size={14} className="text-danger-600" />
                          <p className="text-xs font-semibold text-danger-900">Late Payment</p>
                        </div>
                        <div className="space-y-1 text-xs text-danger-700">
                          <p>{payment.daysLate} day(s) late</p>
                          <p className="font-semibold">Penalty: {formatCurrency(payment.penaltyAmount)}</p>
                          <p className="text-[10px]">{getPenaltyTierLabel(payment.penaltyTier)}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Hash size={14} />
                        <span className="font-mono text-xs truncate">{payment.transactionId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{payment.momoNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span className="text-xs">
                          Due: {payment.paymentDay.toLocaleDateString()} | 
                          Uploaded: {payment.uploadDay.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        leftIcon={<Eye size={16} />}
                        onClick={() => setSelectedPayment(payment)}
                      >
                        View Screenshot
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          leftIcon={<CheckCircle size={16} />}
                          onClick={() => handleVerify(payment.id)}
                        >
                          Verify
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<XCircle size={16} />}
                          onClick={() => handleFlag(payment.id)}
                        >
                          Flag
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {processedPayments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recently Processed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedPayments.map((payment) => (
                <Card key={payment.id} variant="default">
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.memberName}</h3>
                        <p className="text-sm text-gray-600">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-primary-600 mt-1">{payment.shares} shares</p>
                      </div>
                      <Badge variant={payment.status === 'verified' ? 'success' : 'danger'} dot>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{formatDateTime(payment.updatedAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Screenshot"
        description={selectedPayment ? `${selectedPayment.memberName} - ${formatCurrency(selectedPayment.amount)}` : ''}
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="bg-white rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-400">Screenshot Preview</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600">Transaction ID</p>
                <p className="font-mono text-sm font-medium">{selectedPayment.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">MoMo Number</p>
                <p className="text-sm font-medium">{selectedPayment.momoNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Amount</p>
                <p className="text-sm font-medium">{formatCurrency(selectedPayment.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Shares</p>
                <p className="text-sm font-medium text-primary-600">{selectedPayment.shares} shares</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Payment Day</p>
                <p className="text-sm font-medium">{selectedPayment.paymentDay.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Upload Day</p>
                <p className="text-sm font-medium">{selectedPayment.uploadDay.toLocaleDateString()}</p>
              </div>
            </div>

            {selectedPayment.daysLate > 0 && (
              <div className="p-4 bg-danger-50 border-2 border-danger-300 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-danger-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-danger-900 mb-2">Late Payment Penalty</p>
                    <div className="space-y-1 text-sm text-danger-700">
                      <p>Days Late: <span className="font-semibold">{selectedPayment.daysLate} days</span></p>
                      <p>Penalty Tier: <span className="font-semibold">{getPenaltyTierLabel(selectedPayment.penaltyTier)}</span></p>
                      <p>Penalty Amount: <span className="font-semibold">{formatCurrency(selectedPayment.penaltyAmount)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="success"
                className="flex-1"
                leftIcon={<CheckCircle size={18} />}
                onClick={() => handleVerify(selectedPayment.id)}
                isLoading={isProcessing}
              >
                Verify Payment
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                leftIcon={<XCircle size={18} />}
                onClick={() => handleFlag(selectedPayment.id)}
                isLoading={isProcessing}
              >
                Flag Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
