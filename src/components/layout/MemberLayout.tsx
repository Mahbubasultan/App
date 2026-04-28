'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  Layers, 
  DollarSign, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Settings
} from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userImage?: string;
}

const menuItems = [
  { label: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
  { label: 'My Savings', path: '/member/my-savings', icon: Wallet },
  { label: 'Shares', path: '/member/shares', icon: Layers },
  { label: 'Loans', path: '/member/loans', icon: DollarSign },
];

export const MemberLayout: React.FC<MemberLayoutProps> = ({ 
  children, 
  userName = 'Member',
  userImage 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          ROSCA
        </h1>
        <p className="text-xs text-gray-600 mt-1">Member Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            ROSCA
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col h-[calc(100%-73px)]">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-gradient-to-r from-green-600 to-green-700 border-b border-green-800 px-4 lg:px-8 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-green-500/30 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-white" />
            </button>
            
            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl font-semibold text-white">
                {menuItems.find(item => item.path === pathname)?.label || 'Member Portal'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-green-500/30 rounded-xl transition-colors relative">
                <Bell size={20} className="text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-green-500/30 rounded-xl transition-colors">
                <Settings size={20} className="text-white" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-green-500">
                {userImage ? (
                  <img src={userImage} alt={userName} className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-green-600 font-semibold text-sm">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="font-semibold text-white text-sm">{userName}</p>
                  <p className="text-xs text-green-100">Member</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
