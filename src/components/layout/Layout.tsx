'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { UserRole } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userImage?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, userName, userImage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background-gray overflow-hidden">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          userName={userName} 
          userImage={userImage}
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
