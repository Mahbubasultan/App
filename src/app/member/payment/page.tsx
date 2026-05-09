'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { PaymentProofForm } from '@/components/member/PaymentProofForm';
import { mockUsers } from '@/lib/mockData';

export default function MemberPayment() {
  const currentUser = mockUsers[0];

  return (
    <MemberLayout userName={currentUser.name}>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pay Shares</h1>
          <p className="text-gray-600 mt-1">Submit your monthly contribution with payment proof</p>
        </div>
        <PaymentProofForm nextPaymentDue={currentUser.nextPaymentDue} />
      </div>
    </MemberLayout>
  );
}
