'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoanRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/member/loans');
  }, [router]);

  return null;
}
