'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Wallet,
  DollarSign,
  UserCheck,
  Users,
  BarChart3,
  Megaphone,
  Sparkles,
  X,
  LogOut,
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const pathname = usePathname();

  const memberLinks = [
    { href: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/member/my-savings', label: 'My Savings', icon: Wallet },
    { href: '/member/shares', label: 'Shares', icon: Layers },
    { href: '/member/loans', label: 'Loans', icon: DollarSign },
  ];

  const accountantLinks = [
    { href: '/accountant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/accountant/shares', label: 'Shares', icon: Layers },
    { href: '/accountant/savings', label: 'Savings', icon: Wallet },
    { href: '/accountant/loans', label: 'Loans', icon: DollarSign },
    { href: '/accountant/guarantor', label: 'Guarantors', icon: UserCheck },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/shares', label: 'Shares', icon: Layers },
    { href: '/admin/savings', label: 'Savings', icon: Wallet },
    { href: '/admin/loans', label: 'Loans', icon: DollarSign },
    { href: '/admin/guarantor', label: 'Guarantors', icon: UserCheck },
    { href: '/admin/accountants', label: 'Accountants', icon: Users },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const links = role === 'member' ? memberLinks : role === 'accountant' ? accountantLinks : adminLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in" 
          onClick={onClose} 
        />
      )}
      
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-primary
          transform transition-transform duration-300 ease-in-out flex flex-col shadow-large
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-primary-light/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">ROSCA</h1>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1 capitalize">{role} Portal</p>
            </div>
            <button 
              onClick={onClose} 
              className="lg:hidden p-2 hover:bg-white/10 rounded-2xl transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-white text-primary shadow-soft'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 sm:p-4 border-t border-primary-light/20">
          <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-xl sm:rounded-2xl transition-all duration-200">
            <LogOut size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
