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
  Megaphone,
  X,
  LogOut,
} from 'lucide-react';
import { UserRole } from '@/types';
import { TrustNetLogo } from '@/components/ui/TrustNetLogo';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose, onLogout }) => {
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
  ];

  const roleLabel = role === 'member' ? 'Member Portal' : role === 'accountant' ? 'Accountant Portal' : 'Admin Portal';
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
          fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-[#14532D] text-white
          transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2 w-full">
              <TrustNetLogo size={56} />
              <div className="text-center">
                <p style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.5px', margin: 0 }}>
                  <span style={{ color: '#ffffff' }}>Trust </span><span style={{ color: '#4ade80' }}>Nest</span>
                </p>
                <p className="text-white/50 text-xs mt-0.5">{roleLabel}</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-white self-start">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-white/15 text-white shadow-[0_8px_20px_rgba(255,255,255,0.1)]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 sm:p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200">
            <LogOut size={20} className="flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
