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
  Settings,
  User
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  const handleSettings = () => {
    router.push('/member/settings');
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
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
        <header className="sticky top-0 z-20 bg-gradient-to-r from-green-600 via-green-600 to-green-700 border-b border-green-800/20 px-4 lg:px-8 py-4 shadow-xl shadow-green-900/10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Menu size={24} className="text-white" />
            </button>
            
            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl font-semibold text-white drop-shadow-sm">
                {menuItems.find(item => item.path === pathname)?.label || 'Member Portal'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={handleNotifications}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95 relative"
                >
                  <Bell size={20} className="text-white" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-xs text-gray-600 mt-0.5">You have 3 new notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        { title: 'Payment Verified', message: 'Your payment of 50,000 RWF has been verified', time: '2 hours ago', unread: true },
                        { title: 'Loan Approved', message: 'Your loan request of 400,000 RWF has been approved', time: '1 day ago', unread: true },
                        { title: 'Share Created', message: 'You have successfully created 25 shares', time: '3 days ago', unread: false },
                      ].map((notif, index) => (
                        <div key={index} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${notif.unread ? 'bg-green-50/50' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <button className="w-full text-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <button 
                onClick={handleSettings}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
              >
                <Settings size={20} className="text-white" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 pl-3 ml-2 border-l border-white/20 hover:bg-white/10 rounded-r-xl pr-3 py-1.5 transition-all duration-200 active:scale-95"
                >
                  {userImage ? (
                    <img src={userImage} alt={userName} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-lg" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-green-600 font-semibold text-sm shadow-lg">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="font-semibold text-white text-sm drop-shadow-sm">{userName}</p>
                    <p className="text-xs text-green-100">Member</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                      <div className="flex items-center gap-3">
                        {userImage ? (
                          <img src={userImage} alt={userName} className="w-12 h-12 rounded-full object-cover border-2 border-green-600" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-semibold">
                            {userName.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-600">Member Account</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => router.push('/member/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                      >
                        <LayoutDashboard size={18} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Dashboard</span>
                      </button>
                      <button 
                        onClick={handleSettings}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                      >
                        <Settings size={18} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Settings</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={18} className="text-red-600" />
                        <span className="text-sm font-medium text-red-600">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
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
