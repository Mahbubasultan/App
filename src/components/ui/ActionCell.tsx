'use client';

import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface ActionCellProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: number;
}

const ActionCell: React.FC<ActionCellProps> = ({ onView, onEdit, onDelete, size = 16 }) => {
  return (
    <div className="inline-flex items-center justify-center space-x-2">
      {onView && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onView(); }}
          title="View"
          className="w-8 h-8 p-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors"
        >
          <Eye size={size} />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          title="Edit"
          className="w-8 h-8 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <Edit size={size} />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete"
          className="w-8 h-8 p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
        >
          <Trash2 size={size} />
        </button>
      )}
    </div>
  );
};

export default ActionCell;
