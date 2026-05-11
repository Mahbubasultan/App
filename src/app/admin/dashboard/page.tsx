'use client';

import { useRouter } from 'next/navigation';
import { Wallet, Layers, DollarSign, TrendingUp, Users, UserCheck, Megaphone, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const summaryData = {
  totalSavings: 2450000,
  totalShares: 1225,
  totalLoans: 1850000,
  totalMembers: 24,
  totalAccountants: 3,
  totalAnnouncements: 8,
};

const loanStats = [
  { name: 'Active', value: 8, color: '#0B5D3B' },
  { name: 'Pending', value: 4, color: '#F59E0B' },
  { name: 'Repaid', value: 12, color: '#10B981' },
  { name: 'Overdue', value: 2, color: '#EF4444' },
];

const memberContributions = [
  { name: 'Jean Baptiste', amount: 250000 },
  { name: 'Marie Claire', amount: 360000 },
  { name: 'Patrick Nkunda', amount: 500000 },
  { name: 'Eric Habimana', amount: 280000 },
  { name: 'Grace Uwera', amount: 190000 },
];

const monthlyGrowth = [
  { month: 'Sep', members: 20, savings: 1800000 },
  { month: 'Oct', members: 21, savings: 2050000 },
  { month: 'Nov', members: 22, savings: 2100000 },
  { month: 'Dec', members: 23, savings: 2150000 },
  { month: 'Jan', members: 24, savings: 2450000 },
];

export default function AdminDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: 'Total Savings',
      value: `${summaryData.totalSavings.toLocaleString()} RWF`,
      icon: Wallet,
      color: 'bg-blue-500',
      route: '/admin/savings',
      trend: '+12.5%',
    },
    {
      title: 'Total Shares',
      value: summaryData.totalShares.toLocaleString(),
      icon: Layers,
      color: 'bg-purple-500',
      route: '/admin/shares',
      trend: '+8.3%',
    },
    {
      title: 'Total Loans',
      value: `${summaryData.totalLoans.toLocaleString()} RWF`,
      icon: DollarSign,
      color: 'bg-orange-500',
      route: '/admin/loans',
      trend: '+15.7%',
    },
    {
      title: 'Total Members',
      value: summaryData.totalMembers.toString(),
      icon: Users,
      color: 'bg-green-500',
      route: '/admin/user-management',
      trend: '+4.3%',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
        {/* Header */}
        <div className="animate-in slide-in-from-top-4 duration-500">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Complete platform overview and management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => router.push(card.route)}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{card.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{card.value}</p>
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-green-600 font-semibold">{card.trend}</span>
                      <span className="text-gray-500 hidden sm:inline">vs last month</span>
                    </div>
                  </div>
                  <div className={`${card.color} p-2 sm:p-3 rounded-lg sm:rounded-xl`}>
                    <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '400ms' }}>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Statistics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <p className="text-xl sm:text-2xl font-bold text-[#0B5D3B]">{summaryData.totalMembers}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Active Members</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{summaryData.totalAccountants}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Accountants</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <p className="text-xl sm:text-2xl font-bold text-orange-600">8</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Active Loans</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{summaryData.totalAnnouncements}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Announcements</p>
            </div>
          </div>
        </div>

        {/* Charts Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Loan Status Pie Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: '500ms' }}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Loan Status Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={loanStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => `${value}`}
                  outerRadius={typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : 90}
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
            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2">
              {loanStats.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate">{item.name}</p>
                    <p className="font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Bar Chart - Member Contributions */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: '600ms' }}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Top Member Savings</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={memberContributions} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value: number) => `${value.toLocaleString()} RWF`}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#0B5D3B" 
                  radius={[0, 8, 8, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4 text-center">
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                <p className="text-xs text-gray-600">Avg Savings</p>
                <p className="text-sm sm:text-base font-bold text-green-600">316,000 RWF</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <p className="text-xs text-gray-600">Total Members</p>
                <p className="text-sm sm:text-base font-bold text-blue-600">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Growth Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '700ms' }}>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="savings" stroke="#0B5D3B" strokeWidth={3} name="Total Savings (RWF)" dot={{ r: 5 }} />
              <Line yAxisId="right" type="monotone" dataKey="members" stroke="#3B82F6" strokeWidth={3} name="Total Members" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">Savings Growth</p>
              <p className="text-sm font-bold text-green-600">+36.1%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">Member Growth</p>
              <p className="text-sm font-bold text-blue-600">+20.0%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600">Avg per Member</p>
              <p className="text-sm font-bold text-purple-600">102,083 RWF</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-gray-600">Monthly Increase</p>
              <p className="text-sm font-bold text-orange-600">+7.2%</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '800ms' }}>
          <button
            onClick={() => router.push('/admin/user-management')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 text-left group"
          >
            <Users className="text-[#0B5D3B] mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-900">Manage Users</p>
            <p className="text-xs text-gray-600 mt-1">View and manage all members</p>
          </button>
          
          <button
            onClick={() => router.push('/admin/accountants')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 text-left group"
          >
            <UserCheck className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-900">Accountants</p>
            <p className="text-xs text-gray-600 mt-1">View accountant activity logs</p>
          </button>
          
          <button
            onClick={() => router.push('/admin/announcements')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 text-left group"
          >
            <Megaphone className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-900">Announcements</p>
            <p className="text-xs text-gray-600 mt-1">Create and manage announcements</p>
          </button>
          
          <button
            onClick={() => router.push('/admin/analytics')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 text-left group"
          >
            <BarChart3 className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <p className="font-semibold text-gray-900">Analytics</p>
            <p className="text-xs text-gray-600 mt-1">View detailed platform analytics</p>
          </button>
        </div>
      </div>
  );
}
