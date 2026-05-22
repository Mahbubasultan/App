'use client';

import { useRouter } from 'next/navigation';
import { Wallet, Layers, Banknote, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockUsers, mockLoans } from '@/lib/mockData';

const chartData = [
  { month: 'Jan', savings: 450000, shares: 225, loans: 350000 },
  { month: 'Feb', savings: 620000, shares: 310, loans: 480000 },
  { month: 'Mar', savings: 890000, shares: 445, loans: 720000 },
  { month: 'Apr', savings: 1200000, shares: 600, loans: 950000 },
  { month: 'May', savings: 1650000, shares: 825, loans: 1320000 },
  { month: 'Jun', savings: 2450000, shares: 1225, loans: 1850000 },
];

const loanStats = [
  { name: 'Active', value: 8, color: '#0B5D3B' },
  { name: 'Pending', value: 4, color: '#F59E0B' },
  { name: 'Repaid', value: 12, color: '#2563EB' },
  { name: 'Overdue', value: 2, color: '#EF4444' },
];

// Calculate summary stats
const summaryData = {
  totalSavings: mockUsers.reduce((sum, user) => sum + user.totalValue, 0),
  totalShares: mockUsers.reduce((sum, user) => sum + user.shares, 0),
  totalLoans: mockLoans.reduce((sum, loan) => sum + loan.amount, 0),
};

export default function AccountantDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: 'Total Savings',
      value: `${(summaryData.totalSavings / 1000000).toFixed(2)}M RWF`,
      icon: Wallet,
      iconColor: 'bg-emerald-100 text-emerald-700',
      route: '/accountant/savings',
      trend: '+12.5%',
    },
    {
      title: 'Total Shares',
      value: summaryData.totalShares.toLocaleString(),
      icon: Layers,
      iconColor: 'bg-blue-100 text-blue-700',
      route: '/accountant/shares',
      trend: '+8.3%',
    },
    {
      title: 'Total Loans',
      value: `${(summaryData.totalLoans / 1000000).toFixed(2)}M RWF`,
      icon: Banknote,
      iconColor: 'bg-orange-100 text-orange-700',
      route: '/accountant/loans',
      trend: '+15.7%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of all member activities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => router.push(card.route)}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-green-600 font-semibold">{card.trend}</span>
                  </div>
                </div>
                <div className={`${card.iconColor} p-3 rounded-xl`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart - Trends */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Savings & Loans Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#0B5D3B" strokeWidth={2} name="Savings (RWF)" />
              <Line type="monotone" dataKey="shares" stroke="#2563EB" strokeWidth={2} name="Shares" />
              <Line type="monotone" dataKey="loans" stroke="#F59E0B" strokeWidth={2} name="Loans (RWF)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Loan Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Loan Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={loanStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {loanStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} loans`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {loanStats.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">{item.name}</p>
                  <p className="font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
