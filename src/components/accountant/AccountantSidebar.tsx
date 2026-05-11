'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Layers, TrendingUp, Banknote, Users, X } from 'lucide-react';

interface AccountantSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/accountant/dashboard', icon: LayoutDashboard },
  { label: 'Shares', href: '/accountant/shares', icon: Layers },
  { label: 'Savings', href: '/accountant/savings', icon: TrendingUp },
  { label: 'Loans', href: '/accountant/loans', icon: Banknote },
  { label: 'Guarantors', href: '/accountant/guarantor', icon: Users },
];

export const AccountantSidebar: React.FC<AccountantSidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className="fixed inset-0 bg-black/40 lg:hidden z-30"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto shadow-lg lg:relative lg:z-0 lg:shadow-none">
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} className="text-gray-700" />
        </button>

        {/* Logo/Header */}
        <div className="p-6 pt-8 lg:pt-6">
          <h2 className="text-lg font-bold text-gray-900">Accountant</h2>
          <p className="text-xs text-gray-600 mt-1">Management Portal</p>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0B5D3B] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50 hidden lg:block">
          <p className="text-xs text-gray-600 text-center">
            © 2024 Community Savings App
          </p>
        </div>
      </div>
    </>
  );
};
