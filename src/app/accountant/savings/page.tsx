'use client';

import { AccountantLayout } from '@/components/layout/AccountantLayout';

export default function AccountantSavings() {
  return (
    <AccountantLayout userName="Marie Claire Uwase">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings</h1>
          <p className="text-gray-600">Monitor member savings and contributions</p>
        </div>
      </div>
    </AccountantLayout>
  );
}
