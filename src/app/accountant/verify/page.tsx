'use client';

import { Layout } from '@/components/layout/Layout';
import { PaymentQueue } from '@/components/accountant/PaymentQueue';

export default function AccountantVerify() {
  return (
    <Layout role="accountant" userName="Marie Claire Uwase">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Payments</h1>
          <p className="text-gray-600 mt-1">Review and verify member payment submissions</p>
        </div>
        <PaymentQueue />
      </div>
    </Layout>
  );
}
