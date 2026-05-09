'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Layers, TrendingUp, TrendingDown, Users, DollarSign, AlertCircle } from 'lucide-react';
import { mockUsers, mockGroupStats } from '@/lib/mockData';

const sharesData = mockUsers.map(u => ({
  name: u.name.split(' ')[0],
  shares: u.shares,
  value: u.shares * mockGroupStats.sharePrice,
})).sort((a, b) => b.shares - a.shares).slice(0, 12);

const shareStats = [
  { label: 'Total Shares', value: mockGroupStats.totalShares.toLocaleString(), icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Share Price', value: `${mockGroupStats.sharePrice.toLocaleString()} RWF`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Active Holders', value: mockUsers.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const distribution = [
  { name: 'Active', value: mockUsers.filter(u => u.isActive).length, color: '#16a34a' },
  { name: 'Inactive', value: mockUsers.filter(u => !u.isActive).length, color: '#e5e7eb' },
];

export default function AdminSharesPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shares Management</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitor and manage share distributions across all members</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {shareStats.map((stat) => {
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
              <h3 className="text-base font-bold text-gray-900">Top Share Holders</h3>
              <p className="text-xs text-gray-500 mt-0.5">Members with most shares</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sharesData} margin={{ top: 5, right: 5, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any) => [`${v} shares`, 'Shares']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="shares" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Member Status</h3>
            <p className="text-xs text-gray-500 mt-0.5">Active vs inactive holders</p>
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
                <span className="text-xs font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
