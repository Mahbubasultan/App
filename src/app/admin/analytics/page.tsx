'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { mockGroupStats, mockMonthlyData } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Users, DollarSign, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminAnalytics() {
  const stats = [
    { label: 'Total Members', value: mockGroupStats.totalMembers, icon: Users, color: 'bg-primary-500', change: '+3' },
    { label: 'Total Savings', value: formatCurrency(mockGroupStats.totalValue), icon: DollarSign, color: 'bg-success-500', change: '+8.2%' },
    { label: 'Active Loans', value: mockGroupStats.activeLoans, icon: TrendingUp, color: 'bg-info-500', change: '-2' },
    { label: 'Pending Verifications', value: mockGroupStats.pendingVerifications, icon: AlertCircle, color: 'bg-warning-500', change: '+4' },
  ];

  return (
      <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
        <div className="animate-in slide-in-from-top-4 duration-500">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Overview of group performance and financial statistics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith('+');
            return (
              <Card key={stat.label} hover>
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.color} text-white shadow-lg`}>
                      <Icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                      {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Month</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Contributions</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Loans</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Repayments</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Giveaway</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Net Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMonthlyData.map((data) => (
                    <tr key={`${data.month}-${data.year}`} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-2 sm:py-4 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">{data.month} {data.year}</td>
                      <td className="py-2 sm:py-4 px-2 sm:px-4 text-right text-success-600 font-semibold">
                        +{formatCurrency(data.contributions)}
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-4 text-right text-danger-600 font-semibold">
                        -{formatCurrency(data.loans)}
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-4 text-right text-success-600 font-semibold">
                        +{formatCurrency(data.repayments)}
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-4 text-right text-warning-600 font-semibold">
                        -{formatCurrency(data.giveaway)}
                      </td>
                      <td className={`py-2 sm:py-4 px-2 sm:px-4 text-right font-bold whitespace-nowrap ${data.netFlow >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {data.netFlow >= 0 ? '+' : ''}{formatCurrency(data.netFlow)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
