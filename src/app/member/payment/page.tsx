'use client';

import { Layout } from '@/components/layout/Layout';
import { PaymentProofForm } from '@/components/member/PaymentProofForm';
import { mockUsers } from '@/lib/mockData';

export default function MemberPayment() {
  const currentUser = mockUsers[0];

  return (
    <Layout role="member" userName={currentUser.name}>
      <div className="animate-slide-up">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-black">Pay Shares</h1>
          <p className="text-text-gray mt-1">Submit your monthly contribution with payment proof</p>
        </div>
        <PaymentProofForm nextPaymentDue={currentUser.nextPaymentDue} />
      </div>
    </Layout>
  );
}
