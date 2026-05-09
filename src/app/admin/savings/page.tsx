'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { mockMonthlyData, mockGroupStats } from '@/lib/mockData';

const savingsTrend = mockMonthlyData.slice().reverse().map(d => ({
  month: d.month.slice(0, 3),
  total: d.contributions / 100000,
}));

const savingsStats = [
  { label: 'Total Savings', value: `${(mockGroupStats.totalValue / 1000000).toFixed(2)}M RWF`, icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Active Members', value: mockGroupStats.activeMembers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Monthly Average', value: `${(mockGroupStats.totalValue / mockGroupStats.totalMembers / 1000).toFixed(0)}K RWF`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const distribution = [
  { name: 'Savings', value: 65, color: '#16a34a' },
  { name: 'Shares', value: 20, color: '#3b82f6' },
  { name: 'Loans', value: 15, color: '#f59e0b' },
];

export default function AdminSavingsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Savings Management</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitor and manage member savings accounts across the group</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {savingsStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Monthly Savings Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Cumulative savings (100K RWF)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={savingsTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Line type="monotone" dataKey="total" name="Savings" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Capital Allocation</h3>
            <p className="text-xs text-gray-500 mt-0.5">Distribution by type</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={distribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {distribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {distribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
