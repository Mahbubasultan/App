'use client';

import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { AlertCircle, Info, Clock, Calculator } from 'lucide-react';
import { PenaltyTier } from '@/types';
import { formatCurrency, getPenaltyTierColor, getPenaltyTierLabel } from '@/lib/utils';

interface PenaltyBadgeProps {
  amount: number;
  penaltyAmount: number;
  daysLate: number;
  penaltyRate: number;
  tier: PenaltyTier;
  formula: string;
}

export const PenaltyBadge: React.FC<PenaltyBadgeProps> = ({ 
  amount,
  penaltyAmount,
  daysLate, 
  penaltyRate,
  tier,
  formula
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (tier === 'none') {
    return (
      <Badge variant="success" size="sm" icon={<Clock size={14} />}>
        On Time
      </Badge>
    );
  }

  const variantColor = getPenaltyTierColor(tier) as 'warning' | 'danger';

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Badge variant={variantColor} size="sm" icon={<AlertCircle size={14} />}>
        Penalty: {formatCurrency(penaltyAmount)}
      </Badge>
      
      {showTooltip && (
        <div className="absolute z-50 w-80 p-4 mt-2 bg-gray-900 text-white rounded-xl shadow-2xl animate-slide-down left-0">
          {/* Header */}
          <div className="flex items-start gap-2 mb-3 pb-3 border-b border-gray-700">
            <Info size={18} className="flex-shrink-0 mt-0.5 text-danger-400" />
            <div>
              <p className="text-sm font-bold text-danger-400">Late Payment Penalty</p>
              <p className="text-xs text-gray-400 mt-0.5">{getPenaltyTierLabel(tier)}</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 mb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Days Late</p>
                <p className="text-sm font-semibold">{daysLate} {daysLate === 1 ? 'day' : 'days'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calculator size={14} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Original Amount</p>
                <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Penalty Rate</p>
                <p className="text-sm font-semibold">{(penaltyRate * 100).toFixed(1)}%{tier === 'daily' ? ' per day' : ''}</p>
              </div>
            </div>
          </div>

          {/* Calculation */}
          <div className="pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Calculation:</p>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-sm font-mono text-warning-400 mb-2">{formula}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-400">Total Penalty:</span>
                <span className="text-base font-bold text-danger-400">{formatCurrency(penaltyAmount)}</span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 leading-relaxed">
              {tier === 'tier1' && 'Paid 1-3 days late: 2% flat penalty'}
              {tier === 'tier2' && 'Paid 4-7 days late: 5% flat penalty'}
              {tier === 'tier3' && 'Paid 8-14 days late: 7% flat penalty'}
              {tier === 'daily' && 'Paid 15+ days late: 1.5% penalty per day'}
            </p>
          </div>

          {/* Arrow */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      )}
    </div>
  );
};
