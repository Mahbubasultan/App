'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { mockUsers } from '@/lib/mockData';
import { formatCurrency, checkLoanEligibility, calculateLoanPayment, LOAN_COVERAGE_REQUIRED } from '@/lib/utils';
import { DollarSign, User, Calendar, Percent, AlertCircle, Shield, CheckCircle, XCircle } from 'lucide-react';

interface LoanRequestFormProps {
  currentUserId: string;
  currentUserSavings: number;
}

export const LoanRequestForm: React.FC<LoanRequestFormProps> = ({ 
  currentUserId, 
  currentUserSavings 
}) => {
  const { success, error } = useToast();
  const [amount, setAmount] = useState(0);
  const [guarantorId, setGuarantorId] = useState('');
  const [duration, setDuration] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guarantors = mockUsers.filter(u => u.id !== currentUserId && u.role === 'member');
  const selectedGuarantor = guarantors.find(g => g.id === guarantorId);
  
  const eligibility = useMemo(() => {
    if (!selectedGuarantor || amount === 0) return null;
    return checkLoanEligibility(currentUserSavings, selectedGuarantor.totalValue, amount);
  }, [currentUserSavings, selectedGuarantor, amount]);

  const loanPayment = useMemo(() => {
    if (amount === 0) return null;
    return calculateLoanPayment(amount, 5, duration);
  }, [amount, duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eligibility || !eligibility.isEligible) {
      error(eligibility?.reason || 'Loan not eligible');
      return;
    }
    
    if (amount < 10000) {
      error('Minimum loan amount is 10,000 RWF');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    success('Loan request submitted! Awaiting guarantor approval.');
    setAmount(0);
    setGuarantorId('');
    setDuration(6);
    setIsSubmitting(false);
  };

  const guarantorOptions = [
    { value: '', label: 'Select a guarantor...' },
    ...guarantors.map(g => ({
      value: g.id,
      label: `${g.name} (${g.shares} shares - ${formatCurrency(g.totalValue)})`
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
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Request Loan</CardTitle>
        <CardDescription>
          Apply for a loan with 100% coverage from combined savings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guarantor Selection First */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Select Guarantor (Insurance User)"
              value={guarantorId}
              onChange={(e) => setGuarantorId(e.target.value)}
              options={guarantorOptions}
              required
            />
            
            <Select
              label="Loan Duration"
              value={duration.toString()}
              onChange={(e) => setDuration(Number(e.target.value))}
              options={durationOptions}
              required
            />
          </div>

          {/* Show max loan only after guarantor selected */}
          {guarantorId && (
            <div className="bg-info-50 border border-info-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-info-600" />
                <p className="font-semibold text-info-900">Coverage Calculation</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Your Savings:</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(currentUserSavings)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Guarantor Savings:</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(selectedGuarantor?.totalValue || 0)}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-info-200">
                <p className="text-sm text-gray-600">Maximum Loan Amount (100% Coverage):</p>
                <p className="text-2xl font-bold text-info-700">{formatCurrency(maxLoan)}</p>
              </div>
            </div>
          )}

          {/* Loan Amount Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Loan Amount
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max={maxLoan}
                step="10000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={!guarantorId}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">0</span>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(amount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Requested Amount</p>
                </div>
                <span className="text-sm text-gray-600">{formatCurrency(maxLoan)}</span>
              </div>
            </div>
          </div>

          {/* Eligibility Check */}
          {eligibility && amount > 0 && (
            <div className={`border-2 rounded-xl p-5 ${
              eligibility.isEligible 
                ? 'bg-success-50 border-success-300' 
                : 'bg-danger-50 border-danger-300'
            }`}>
              <div className="flex items-start gap-3 mb-4">
                {eligibility.isEligible ? (
                  <CheckCircle size={24} className="text-success-600 flex-shrink-0" />
                ) : (
                  <XCircle size={24} className="text-danger-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${eligibility.isEligible ? 'text-success-900' : 'text-danger-900'}`}>
                    {eligibility.isEligible ? 'Loan Eligible ✓' : 'Loan Not Eligible ✗'}
                  </p>
                  {!eligibility.isEligible && (
                    <p className="text-sm text-danger-700 mt-1">{eligibility.reason}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Combined Savings</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(eligibility.combinedSavings)}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Coverage</p>
                  <p className={`text-lg font-bold ${
                    eligibility.coveragePercentage >= LOAN_COVERAGE_REQUIRED 
                      ? 'text-success-600' 
                      : 'text-danger-600'
                  }`}>
                    {eligibility.coveragePercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loan Payment Breakdown */}
          {loanPayment && amount > 0 && eligibility?.isEligible && (
            <div className="bg-gradient-to-br from-primary-50 to-info-50 border border-primary-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-primary-600" />
                <h4 className="font-semibold text-primary-900">Loan Repayment Details</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <DollarSign size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Principal</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(amount)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Percent size={18} className="text-warning-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Interest (5%)</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(loanPayment.interest)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Calendar size={18} className="text-info-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Monthly Payment</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(loanPayment.monthlyPayment)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <User size={18} className="text-success-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Repayment</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(loanPayment.totalRepayment)}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary-200">
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-semibold">Note:</span> Your guarantor must accept this loan request before it can be approved by the accountant.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1"
              onClick={() => {
                setAmount(0);
                setGuarantorId('');
                setDuration(6);
              }}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={!guarantorId || amount === 0 || !eligibility?.isEligible}
            >
              Submit Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
