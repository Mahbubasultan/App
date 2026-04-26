'use client';

import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface LoanTabsProps {
  activeTab: 'approved' | 'rejected' | 'pending';
  onTabChange: (tab: 'approved' | 'rejected' | 'pending') => void;
  counts: {
    approved: number;
    rejected: number;
    pending: number;
  };
}

export const LoanTabs: React.FC<LoanTabsProps> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    { 
      id: 'approved' as const, 
      label: 'Approved', 
      icon: CheckCircle, 
      color: 'success',
      count: counts.approved 
    },
    { 
      id: 'rejected' as const, 
      label: 'Rejected', 
      icon: XCircle, 
      color: 'danger',
      count: counts.rejected 
    },
    { 
      id: 'pending' as const, 
      label: 'Pending', 
      icon: Clock, 
      color: 'warning',
      count: counts.pending 
    },
  ];

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 border-b-2 border-gray-200 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          const colorClasses = {
            success: {
              border: 'border-success',
              text: 'text-success',
              bg: 'bg-success/5',
              badge: 'bg-success text-white'
            },
            danger: {
              border: 'border-danger',
              text: 'text-danger',
              bg: 'bg-danger/5',
              badge: 'bg-danger text-white'
            },
            warning: {
              border: 'border-warning',
              text: 'text-warning',
              bg: 'bg-warning/5',
              badge: 'bg-warning text-white'
            }
          };

          const colors = colorClasses[tab.color as keyof typeof colorClasses];
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold transition-all duration-300 border-b-2 -mb-0.5 whitespace-nowrap ${
                isActive
                  ? `${colors.border} ${colors.text} ${colors.bg}`
                  : 'border-transparent text-text-gray hover:text-text-dark hover:bg-gray-50'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                isActive 
                  ? colors.badge
                  : 'bg-gray-200 text-text-gray'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
