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
    <div className="flex h-screen bg-background-light text-slate-900">
      {/* Fixed Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-50">
        <Sidebar role={role} isOpen={true} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
            <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 h-screen overflow-hidden">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-30 bg-white">
          <Navbar 
            role={role}
            userName={userName} 
            userImage={userImage}
            onImageUpdate={onImageUpdate}
            onMenuClick={() => setSidebarOpen(true)} 
            onLogout={handleLogout}
          />
        </div>
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f0fdf4]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
