'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CreditCard, 
  Wallet, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Gift, 
  X,
  LogOut,
  Sparkles
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
    { href: '/member/savings', label: 'My Savings', icon: Home },
    { href: '/member/payment', label: 'Pay Shares', icon: CreditCard },
    { href: '/member/loan', label: 'Loan', icon: Wallet },
  ];

  const accountantLinks = [
    { href: '/accountant/verify', label: 'Verify Payments', icon: CheckSquare },
    { href: '/accountant/loans', label: 'Loan Approvals', icon: Wallet },
  ];

  const adminLinks = [
    { href: '/admin/analytics', label: 'Group Analytics', icon: BarChart3 },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/giveaway', label: 'Run Giveaway', icon: Gift },
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
      
      {/* Sidebar - Dark Green */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-primary
          transform transition-transform duration-300 ease-in-out flex flex-col shadow-large
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-primary-light/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-white" size={24} />
                <h1 className="text-2xl font-bold text-white">ROSCA</h1>
              </div>
              <p className="text-sm text-white/70 mt-1 capitalize">{role} Portal</p>
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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-white text-primary shadow-soft'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium">{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-light/20">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl transition-all duration-200">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
