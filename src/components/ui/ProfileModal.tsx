'use client';

import React from 'react';
import { X, Mail, Phone, Calendar, MapPin, Edit } from 'lucide-react';
import { Avatar } from './Avatar';
import { Modal } from './Modal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userPhone: string;
  userImage?: string;
  onImageUpdate?: (image: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  userPhone,
  userImage,
  onImageUpdate,
}) => {
  const handleImageUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpdate) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpdate(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Information">
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar src={userImage} name={userName} size="xl" />
            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors">
              <Edit size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpdate}
                className="hidden"
              />
            </label>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-text-dark">{userName}</h3>
            <p className="text-sm text-text-gray">Administrator</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-background-gray rounded-xl">
            <Mail className="text-primary" size={20} />
            <div>
              <p className="text-xs text-text-gray uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-text-dark">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background-gray rounded-xl">
            <Phone className="text-primary" size={20} />
            <div>
              <p className="text-xs text-text-gray uppercase tracking-wide">Phone</p>
              <p className="text-sm font-medium text-text-dark">{userPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background-gray rounded-xl">
            <Calendar className="text-primary" size={20} />
            <div>
              <p className="text-xs text-text-gray uppercase tracking-wide">Member Since</p>
              <p className="text-sm font-medium text-text-dark">January 2022</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background-gray rounded-xl">
            <MapPin className="text-primary" size={20} />
            <div>
              <p className="text-xs text-text-gray uppercase tracking-wide">Location</p>
              <p className="text-sm font-medium text-text-dark">Kigali, Rwanda</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">250</p>
            <p className="text-xs text-text-gray">Total Shares</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">500K</p>
            <p className="text-xs text-text-gray">Total Value</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};