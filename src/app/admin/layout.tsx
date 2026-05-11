'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { getUserSession, clearUserSession } from '@/lib/auth';

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState('Admin User');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = getUserSession();
    if (!user || user.role !== 'admin') {
      clearUserSession();
      router.push('/login');
      return;
    }

    setUserName(user.name || 'Admin User');
    setIsReady(true);
  }, [router]);

  if (!isReady) return null;

  return <Layout role="admin" userName={userName}>{children}</Layout>;
}
