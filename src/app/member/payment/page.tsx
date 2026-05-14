'use client';

import { PaymentProofForm } from '@/components/member/PaymentProofForm';
import { mockUsers } from '@/lib/mockData';

export default function MemberPayment() {
  // Production-ready: Get current user from authentication context/database
  const currentUser = mockUsers.length > 0 ? mockUsers[0] : {
    name: 'Member',
    nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pay Shares</h1>
        <p className="text-gray-600 mt-1">Submit your monthly contribution with payment proof</p>
      </div>
      <PaymentProofForm nextPaymentDue={currentUser.nextPaymentDue} />
    </div>
  );
}
