'use client';

import React from 'react';
import { X } from 'lucide-react';

interface GenericEditModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  children?: React.ReactNode;
  maxWidth?: string; // e.g., 'max-w-md', 'max-w-lg'
}

const GenericEditModal: React.FC<GenericEditModalProps> = ({
  title,
  isOpen,
  onClose,
  onSave,
  saveLabel = 'Save',
  children,
  maxWidth = 'max-w-md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl ${maxWidth} w-full shadow-2xl overflow-hidden`}>
        <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {children}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2.5 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-colors"
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericEditModal;
