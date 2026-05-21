'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { UserRole } from '@/types';
import { clearUserSession } from '@/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userImage?: string;
  onImageUpdate?: (image: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, userName, userImage, onImageUpdate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          role={role}
          userName={userName} 
          userImage={userImage}
          onImageUpdate={onImageUpdate}
          onMenuClick={() => setSidebarOpen(true)} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
