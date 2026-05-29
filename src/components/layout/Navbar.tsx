'use client';

import React, { useState } from 'react';
import { Menu, Settings, Bell, ChevronDown } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';
import { ProfileDropdown } from './ProfileDropdown';
import { ProfileModal } from '../ui/ProfileModal';
import { SettingsModal } from './SettingsModal';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserRole } from '@/types';

interface NavbarProps {
  role: UserRole;
  userName: string;
  userImage?: string;
  onMenuClick: () => void;
  onImageUpdate?: (image: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role, userName, userImage, onMenuClick, onImageUpdate, onLogout }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [currentUserImage, setCurrentUserImage] = useState(userImage);
  const [unreadCount] = useState(2); // This would come from your notification state

  const handleImageUpdate = (newImage: string) => {
    setCurrentUserImage(newImage);
    if (onImageUpdate) {
      onImageUpdate(newImage);
    }
  };

  const handleViewProfile = () => {
    setProfileModalOpen(true);
    setShowProfileDropdown(false);
  };

  const handleSettings = () => {
    setSettingsModalOpen(true);
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    onLogout();
    setShowProfileDropdown(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 z-30 shadow-soft">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          {/* Left Side - Menu Button + Logo Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 active:scale-90"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
            
            {/* Logo - Mobile Only */}
            <div className="lg:hidden">
              <Logo variant="icon" size="sm" href="/" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileDropdown(false);
                }}
                className="relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 active:scale-90"
              >
                <Bell size={20} className="text-gray-700 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationsDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  userRole={role}
                />
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => {
                setSettingsModalOpen(true);
                setShowProfileDropdown(false);
                setShowNotifications(false);
              }}
              className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 active:scale-90"
            >
              <Settings size={20} className="text-gray-700 sm:w-5 sm:h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
              >
                <Avatar src={currentUserImage} name={userName} size="md" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-600 capitalize">{role}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform duration-200 hidden sm:block ${showProfileDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showProfileDropdown && (
                <ProfileDropdown
                  userName={userName}
                  userRole={role}
                  userImage={currentUserImage}
                  onViewProfile={handleViewProfile}
                  onSettings={handleSettings}
                  onLogout={handleLogout}
                  onClose={() => setShowProfileDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userName={userName}
        userEmail="admin@rosca.com"
        userPhone="+250 788 123 456"
        userImage={currentUserImage}
        onImageUpdate={handleImageUpdate}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        userRole={role}
      />
    </>
  );
};
