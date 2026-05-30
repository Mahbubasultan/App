import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColor?: 'green' | 'blue' | 'orange' | 'purple' | 'red';
  trend?: {
    percentage: number;
    isPositive: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  iconColor = 'green',
  trend,
  onClick,
  className = '',
}) => {
  const iconColorMap = {
    green: 'text-primary-600 bg-primary-50',
    blue: 'text-info-600 bg-info-50',
    orange: 'text-accent-orange bg-orange-50',
    purple: 'text-accent-purple bg-purple-50',
    red: 'text-danger-500 bg-red-50',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl sm:rounded-3xl shadow-card border border-gray-100 p-4 sm:p-6 hover:shadow-medium transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconColorMap[iconColor]}`}>
          <Icon size={24} />
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
          {value}
        </h3>
        {subValue && (
          <p className="text-sm text-text-secondary">{subValue}</p>
        )}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <div className={`flex items-center gap-1 font-semibold text-sm ${
            trend.isPositive ? 'text-primary-600' : 'text-danger-600'
          }`}>
            {trend.isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{trend.isPositive ? '+' : '-'}{Math.abs(trend.percentage)}%</span>
          </div>
          {trend.label && (
            <span className="text-xs text-text-secondary ml-auto">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
