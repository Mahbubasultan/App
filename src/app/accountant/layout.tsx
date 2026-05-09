'use client';

import { Layout } from '@/components/layout/Layout';

export default function AccountantSegmentLayout({ children }: { children: React.ReactNode }) {
  return <Layout role="accountant" userName="Marie Claire Uwase">{children}</Layout>;
}
