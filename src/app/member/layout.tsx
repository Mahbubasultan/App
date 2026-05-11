'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { getUserSession, clearUserSession } from '@/lib/auth';

export default function MemberSegmentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState('Member');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = getUserSession();
    if (!user || user.role !== 'member') {
      clearUserSession();
      router.push('/login');
      return;
    }

    setUserName(user.name || 'Member');
    setIsReady(true);
  }, [router]);

  if (!isReady) return null;

  return <Layout role="member" userName={userName}>{children}</Layout>;
}
