'use client';

import React, { useState } from 'react';
import { X, Camera, Save, Eye, EyeOff, Plus, Trash2, Check } from 'lucide-react';
import { Avatar } from './Avatar';
import { useToast } from './Toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userImage?: string;
  onImageUpdate?: (image: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  userName,
  userEmail,
  userPhone,
  userImage,
  onImageUpdate,
}) => {
  const { success, error } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(userImage);
  const [isUploading, setIsUploading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    phone: userPhone,
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    paymentAlerts: true,
    loanUpdates: true,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('Image size must be less than 5MB');
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setProfileImage(result);
        if (onImageUpdate) {
          onImageUpdate(result);
        }
        setTimeout(() => {
          setIsUploading(false);
          success('Profile picture updated successfully!');
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    success('Profile updated successfully!');
    setTimeout(() => onClose(), 300);
  };

  const handleSaveSecurity = () => {
    if (!securityData.currentPassword || !securityData.newPassword) {
      error('Please fill all password fields');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      error('New passwords do not match');
      return;
    }
    success('Password changed successfully!');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => onClose(), 300);
  };

  const handleSaveNotifications = () => {
    success('Notification preferences saved!');
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile Settings':
        return (
          <div className="space-y-6 animate-slide-up">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className={`transition-all duration-300 ${isUploading ? 'scale-95 opacity-50' : 'scale-100'}`}>
                  <Avatar src={profileImage} name={profileData.name} size="xl" />
                </div>
                <label className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-primary to-secondary hover:shadow-green text-white rounded-full shadow-medium cursor-pointer transition-all duration-300 group-hover:scale-110 active:scale-95">
                  <Camera size={20} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-sm text-text-gray mt-3">Click camera icon to upload photo</p>
              <p className="text-xs text-text-light">Max size: 5MB</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-text-dark mb-2">Full Name</label>
                <input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-text-dark mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-text-dark mb-2">Phone Number</label>
                <input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                  placeholder="+250 788 123 456"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-semibold shadow-green hover:shadow-large transition-all duration-300 active:scale-95"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        );

      case 'Security & Privacy':
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-gradient-to-r from-accent-blue/10 to-accent-blue/5 border-2 border-accent-blue/20 rounded-2xl p-4">
              <p className="font-semibold text-text-dark">🔒 Change Your Password</p>
              <p className="text-sm text-text-gray mt-1">Keep your account secure</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Current Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all duration-300"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all duration-300"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all duration-300"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPassword ? 'Hide' : 'Show'} passwords
              </button>
            </div>

            <button
              onClick={handleSaveSecurity}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-accent-blue to-accent-blue/80 text-white rounded-2xl font-semibold shadow-blue hover:shadow-large transition-all duration-300 active:scale-95"
            >
              <Save size={20} />
              Update Password
            </button>
          </div>
        );

      case 'Payment Methods':
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-gradient-to-r from-accent-orange/10 to-accent-orange/5 border-2 border-accent-orange/20 rounded-2xl p-4">
              <p className="font-semibold text-text-dark">💳 Payment Methods</p>
              <p className="text-sm text-text-gray mt-1">Manage your payment options</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl transition-all duration-300 hover:shadow-green">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-soft">
                      <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-dark">MTN Mobile Money</p>
                      <p className="text-sm text-text-gray">+250 788 123 456</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">Primary</span>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-2xl hover:border-accent-orange transition-all duration-300 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-orange to-accent-orange/80 rounded-xl flex items-center justify-center shadow-soft">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-dark">Airtel Money</p>
                      <p className="text-sm text-text-gray">+250 788 987 654</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-accent-red/10 text-accent-red rounded-xl transition-all duration-300 active:scale-90">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white rounded-2xl font-semibold shadow-orange hover:shadow-large transition-all duration-300 active:scale-95">
              <Plus size={20} />
              Add Payment Method
            </button>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-gradient-to-r from-accent-purple/10 to-accent-purple/5 border-2 border-accent-purple/20 rounded-2xl p-4">
              <p className="font-semibold text-text-dark">🔔 Notification Settings</p>
              <p className="text-sm text-text-gray mt-1">Choose how you want to be notified</p>
            </div>

            <div className="space-y-3">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="p-4 bg-background-gray rounded-2xl hover:bg-background-light transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-dark">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-text-gray">Receive updates via this channel</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, [key]: !value })}
                      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                        value ? 'bg-gradient-to-r from-primary to-secondary shadow-green' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                          value ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      >
                        {value && <Check size={14} className="text-primary" />}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveNotifications}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-accent-purple to-accent-purple/80 text-white rounded-2xl font-semibold hover:shadow-large transition-all duration-300 active:scale-95"
            >
              <Save size={20} />
              Save Preferences
            </button>
          </div>
        );

      case 'Help & Support':
        return (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/20 rounded-2xl p-4">
              <p className="font-semibold text-text-dark">❓ Need Help?</p>
              <p className="text-sm text-text-gray mt-1">We're here to assist you</p>
            </div>

            {[
              { icon: '📚', title: 'User Guide', desc: 'Learn how to use the platform' },
              { icon: '💬', title: 'Contact Support', desc: 'Get help from our team' },
              { icon: '❓', title: 'FAQs', desc: 'Find answers to common questions' },
              { icon: '📧', title: 'Email Us', desc: 'support@rosca.com' },
            ].map((item, index) => (
              <button
                key={index}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:border-success hover:bg-success/5 transition-all duration-300 text-left hover:shadow-soft active:scale-98"
              >
                <p className="font-semibold text-text-dark flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  {item.title}
                </p>
                <p className="text-sm text-text-gray mt-1 ml-10">{item.desc}</p>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-background-gray to-white">
          <div>
            <h2 className="text-2xl font-bold text-primary">{activeTab}</h2>
            <p className="text-sm text-text-gray mt-1">Manage your settings</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-all duration-300 active:scale-90"
          >
            <X size={24} className="text-text-gray" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
