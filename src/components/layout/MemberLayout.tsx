'use client';

import React from 'react';
import { Layout } from './Layout';

interface MemberLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userImage?: string;
}

export const MemberLayout: React.FC<MemberLayoutProps> = ({
  children,
  userName = 'Member',
  userImage,
}) => {
  return (
    <Layout role="member" userName={userName} userImage={userImage}>
      {children}
    </Layout>
  );
};
