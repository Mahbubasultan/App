'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { mockUsers } from '@/lib/mockData';
import { formatCurrency, checkLoanEligibility, calculateLoanPayment } from '@/lib/utils';
import { ArrowLeft, DollarSign, Calendar, FileText, Shield, CheckCircle, XCircle, Percent, User as UserIcon } from 'lucide-react';

export default function RequestLoanPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const currentUser = mockUsers[0]; // Jean Baptiste Mugabo

  const [formData, setFormData] = useState({
    amount: '',
    duration: '6',
    guarantorId: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guarantors = mockUsers.filter(u => u.id !== currentUser.id && u.role === 'member');
  const selectedGuarantor = guarantors.find(g => g.id === formData.guarantorId);

  const eligibility = formData.guarantorId && formData.amount
    ? checkLoanEligibility(currentUser.totalValue, selectedGuarantor?.totalValue || 0, Number(formData.amount))
    : null;

  const loanPayment = formData.amount
    ? calculateLoanPayment(Number(formData.amount), 5, Number(formData.duration))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eligibility?.isEligible) {
      error(eligibility?.reason || 'Loan not eligible');
      return;
    }

    if (Number(formData.amount) < 10000) {
      error('Minimum loan amount is 10,000 RWF');
      return;
    }

    if (!formData.reason.trim()) {
      error('Please provide a reason for the loan');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    success('Loan request submitted successfully! Awaiting guarantor approval.');
    router.push('/member/loan');
  };

  const guarantorOptions = [
    { value: '', label: 'Select a guarantor...' },
    ...guarantors.map(g => ({
      value: g.id,
      label: `${g.name} (${formatCurrency(g.totalValue)})`
    }))
  ];

  const durationOptions = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '9', label: '9 months' },
    { value: '12', label: '12 months' },
  ];

  const maxLoan = eligibility?.maxLoanAmount || 0;

  return (
    <Layout role="member" userName={currentUser.name}>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-text-gray" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-orange bg-clip-text text-transparent">
              Request Loan
            </h1>
            <p className="text-text-gray mt-1">Apply for a loan with 100% coverage guarantee</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Guarantor & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Select Guarantor"
                    value={formData.guarantorId}
                    onChange={(e) => setFormData({ ...formData, guarantorId: e.target.value })}
                    options={guarantorOptions}
                    required
                  />

                  <Select
                    label="Loan Duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    options={durationOptions}
                    required
                  />
                </div>

                {/* Coverage Info */}
                {formData.guarantorId && (
                  <div className="p-4 bg-info/10 border-2 border-info/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={18} className="text-info" />
                      <p className="font-semibold text-info">Coverage Calculation</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-text-gray">Your Savings:</p>
                        <p className="font-semibold text-text-dark">{formatCurrency(currentUser.totalValue)}</p>
                      </div>
                      <div>
                        <p className="text-text-gray">Guarantor Savings:</p>
                        <p className="font-semibold text-text-dark">{formatCurrency(selectedGuarantor?.totalValue || 0)}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-info/20">
                      <p className="text-sm text-text-gray">Maximum Loan Amount:</p>
                      <p className="text-2xl font-bold text-info">{formatCurrency(maxLoan)}</p>
                    </div>
                  </div>
                )}

                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-2">
                    Loan Amount (RWF)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={20} />
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="Enter amount"
                      min="10000"
                      max={maxLoan}
                      step="10000"
                      disabled={!formData.guarantorId}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                  {formData.guarantorId && (
                    <p className="text-xs text-text-gray mt-1">
                      Maximum: {formatCurrency(maxLoan)}
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-2">
                    Reason / Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-text-gray" size={20} />
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Explain why you need this loan..."
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Eligibility Check */}
                {eligibility && formData.amount && (
                  <div className={`border-2 rounded-xl p-5 ${
                    eligibility.isEligible
                      ? 'bg-success/10 border-success/30'
                      : 'bg-danger/10 border-danger/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      {eligibility.isEligible ? (
                        <CheckCircle size={24} className="text-success flex-shrink-0" />
                      ) : (
                        <XCircle size={24} className="text-danger flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${eligibility.isEligible ? 'text-success' : 'text-danger'}`}>
                          {eligibility.isEligible ? 'Loan Eligible ✓' : 'Loan Not Eligible ✗'}
                        </p>
                        {!eligibility.isEligible && (
                          <p className="text-sm text-danger mt-1">{eligibility.reason}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={isSubmitting}
                    disabled={!formData.guarantorId || !formData.amount || !eligibility?.isEligible || !formData.reason.trim()}
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar - Repayment Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-text-dark">Repayment Details</h3>

                {loanPayment && formData.amount && eligibility?.isEligible ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={18} className="text-primary" />
                        <p className="text-xs text-text-gray">Principal</p>
                      </div>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(Number(formData.amount))}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Percent size={18} className="text-accent-orange" />
                        <p className="text-xs text-text-gray">Interest (5%)</p>
                      </div>
                      <p className="text-2xl font-bold text-accent-orange">{formatCurrency(loanPayment.interest)}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-secondary" />
                        <p className="text-xs text-text-gray">Monthly Payment</p>
                      </div>
                      <p className="text-2xl font-bold text-secondary">{formatCurrency(loanPayment.monthlyPayment)}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon size={18} className="text-success" />
                        <p className="text-xs text-text-gray">Total Repayment</p>
                      </div>
                      <p className="text-2xl font-bold text-success">{formatCurrency(loanPayment.totalRepayment)}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-text-gray">
                        <span className="font-semibold">Note:</span> Your guarantor must accept this loan request before it can be approved by the accountant.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar size={32} className="text-text-gray" />
                    </div>
                    <p className="text-sm text-text-gray">
                      Fill in the form to see repayment details
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
