'use client';

import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { UserRole } from '@/types';

interface ProfileDropdownProps {
  userName: string;
  userRole: UserRole;
  userImage?: string;
  onViewProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userName,
  userRole,
  userImage,
  onViewProfile,
  onSettings,
  onLogout,
  onClose,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-up">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar src={userImage} name={userName} size="sm" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <button
            onClick={onViewProfile}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <User size={16} />
            View Profile
          </button>
          <button
            onClick={onSettings}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
