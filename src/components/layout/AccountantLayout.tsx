'use client';

import React from 'react';
import { Layout } from './Layout';

interface AccountantLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userImage?: string;
}

export const AccountantLayout: React.FC<AccountantLayoutProps> = ({
  children,
  userName = 'Marie Claire Uwase',
  userImage,
}) => {
  return (
    <Layout role="accountant" userName={userName} userImage={userImage}>
      {children}
    </Layout>
  );
};
