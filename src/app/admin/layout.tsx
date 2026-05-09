'use client';

import { Layout } from '@/components/layout/Layout';

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return <Layout role="admin" userName="Admin User">{children}</Layout>;
}
