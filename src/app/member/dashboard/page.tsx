'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { useRouter } from 'next/navigation';
import { Layers, Wallet, DollarSign, TrendingUp } from 'lucide-react';

export default function MemberDashboard() {
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stats = [
    {
      title: 'Total Shares',
      value: '125',
      subValue: '250,000 RWF',
      icon: Layers,
      gradient: 'from-green-500 to-green-600',
      path: '/member/shares',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Savings',
      value: '250,000 RWF',
      subValue: '125 shares',
      icon: Wallet,
      gradient: 'from-blue-500 to-blue-600',
      path: '/member/my-savings',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Loans',
      value: '2',
      subValue: '400,000 RWF',
      icon: DollarSign,
      gradient: 'from-orange-500 to-orange-600',
      path: '/member/loans',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
  ];

  return (
    <MemberLayout userName="Jean Baptiste Mugabo">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-green-600">{getGreeting()}</span>, Jean Baptiste!
          </h1>
          <p className="text-gray-600 mt-1">Track your shares and manage your savings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.title}
                onClick={() => router.push(stat.path)}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={stat.iconColor} />
                  </div>
                  <TrendingUp size={20} className="text-green-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subValue}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'Payment Verified', amount: '50,000 RWF', date: '2 hours ago', status: 'success' },
              { action: 'Loan Approved', amount: '400,000 RWF', date: '1 day ago', status: 'success' },
              { action: 'Share Created', amount: '25 shares', date: '3 days ago', status: 'pending' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{activity.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
