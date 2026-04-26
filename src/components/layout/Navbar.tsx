'use client';

import React, { useState } from 'react';
import { Bell, Menu, Settings, User, Lock, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { SettingsModal } from '../ui/SettingsModal';
import { useToast } from '../ui/Toast';

interface NavbarProps {
  userName: string;
  userImage?: string;
  onMenuClick: () => void;
  onImageUpdate?: (image: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, userImage, onMenuClick, onImageUpdate }) => {
  const { success } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('');
  const [currentUserImage, setCurrentUserImage] = useState(userImage);

  const notifications = [
    { id: 1, message: 'Your payment has been verified', time: '5 min ago', unread: true },
    { id: 2, message: 'New loan request pending approval', time: '1 hour ago', unread: true },
    { id: 3, message: 'Monthly giveaway completed', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const settingsMenu = [
    { icon: User, label: 'Profile Settings', color: 'text-primary', gradient: 'from-primary/10 to-primary/5' },
    { icon: Lock, label: 'Security & Privacy', color: 'text-accent-blue', gradient: 'from-accent-blue/10 to-accent-blue/5' },
    { icon: CreditCard, label: 'Payment Methods', color: 'text-accent-orange', gradient: 'from-accent-orange/10 to-accent-orange/5' },
    { icon: Bell, label: 'Notifications', color: 'text-accent-purple', gradient: 'from-accent-purple/10 to-accent-purple/5' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-success', gradient: 'from-success/10 to-success/5' },
  ];

  const handleSettingsClick = (label: string) => {
    setActiveSettingsTab(label);
    setSettingsModalOpen(true);
    setShowSettings(false);
  };

  const handleImageUpdate = (newImage: string) => {
    setCurrentUserImage(newImage);
    if (onImageUpdate) {
      onImageUpdate(newImage);
    }
  };

  const handleLogout = () => {
    success('Logged out successfully!');
    setShowSettings(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-soft">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-background-gray rounded-xl transition-all duration-300 active:scale-90"
          >
            <Menu size={24} className="text-text-dark" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowSettings(false);
                }}
                className="relative p-2 hover:bg-background-gray rounded-2xl transition-all duration-300 active:scale-90"
              >
                <Bell size={20} className="text-text-gray" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-orange rounded-full animate-pulse shadow-orange" />
                )}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-large border border-gray-200 z-50 animate-slide-up">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-background-gray to-white">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text-dark">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-accent-orange/10 text-accent-orange text-xs font-medium rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id}
                          className={`p-4 border-b border-gray-200 hover:bg-background-gray transition-all duration-300 cursor-pointer ${
                            notif.unread ? 'bg-primary/5' : ''
                          }`}
                        >
                          <p className="text-sm text-text-dark mb-1">{notif.message}</p>
                          <p className="text-xs text-text-gray">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowNotifications(false);
                }}
                className="p-2 hover:bg-background-gray rounded-2xl transition-all duration-300 active:scale-90"
              >
                <Settings size={20} className={`text-text-gray transition-transform duration-500 ${showSettings ? 'rotate-90' : ''}`} />
              </button>

              {showSettings && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSettings(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-large border border-gray-200 z-50 animate-slide-up">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-background-gray to-white">
                      <h3 className="font-semibold text-text-dark">Settings</h3>
                      <p className="text-xs text-text-gray mt-0.5">Manage your account</p>
                    </div>
                    <div className="p-2">
                      {settingsMenu.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleSettingsClick(item.label)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r ${item.gradient} hover:shadow-soft transition-all duration-300 mb-2 active:scale-95`}
                          >
                            <div className={`p-2 bg-white rounded-lg shadow-soft`}>
                              <Icon size={18} className={item.color} />
                            </div>
                            <span className="text-sm font-medium text-text-dark">{item.label}</span>
                          </button>
                        );
                      })}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-accent-red/10 transition-all duration-300 border-t border-gray-200 mt-2 pt-3 active:scale-95"
                      >
                        <div className="p-2 bg-accent-red/10 rounded-lg">
                          <LogOut size={18} className="text-accent-red" />
                        </div>
                        <span className="text-sm font-medium text-accent-red">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* User Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-gray-200">
              <div className="transition-transform duration-300 hover:scale-110">
                <Avatar src={currentUserImage} name={userName} size="md" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-text-dark truncate max-w-[120px]">{userName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        activeTab={activeSettingsTab}
        userName={userName}
        userEmail="user@example.com"
        userPhone="+250 788 123 456"
        userImage={currentUserImage}
        onImageUpdate={handleImageUpdate}
      />
    </>
  );
};
