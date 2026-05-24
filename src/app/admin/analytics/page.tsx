'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { mockGroupStats, mockMonthlyData } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Users, DollarSign, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Activity, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart } from 'recharts';

export default function AdminAnalytics() {
  const [monthlyStatusTab, setMonthlyStatusTab] = useState('All');
  const monthlyStatusTabs = ['All', 'Positive', 'Negative'];
  const stats = [
    { label: 'Total Members', value: mockGroupStats.totalMembers, icon: Users, color: 'bg-primary-500', change: '+3' },
    { label: 'Total Savings', value: formatCurrency(mockGroupStats.totalValue), icon: DollarSign, color: 'bg-success-500', change: '+8.2%' },
    { label: 'Active Loans', value: mockGroupStats.activeLoans, icon: TrendingUp, color: 'bg-info-500', change: '-2' },
    { label: 'Pending Verifications', value: mockGroupStats.pendingVerifications, icon: AlertCircle, color: 'bg-warning-500', change: '+4' },
  ];

  // Chart data
  const savingsOverTime = [
    { month: 'Jan', savings: 1800000 },
    { month: 'Feb', savings: 1950000 },
    { month: 'Mar', savings: 2100000 },
    { month: 'Apr', savings: 2250000 },
    { month: 'May', savings: 2400000 },
    { month: 'Jun', savings: 2450000 },
  ];

  const loanData = [
    { name: 'Disbursed', value: 1200000, color: '#10B981' },
    { name: 'Repaid', value: 800000, color: '#3B82F6' },
    { name: 'Outstanding', value: 400000, color: '#F59E0B' },
  ];

  const memberGrowth = [
    { month: 'Jan', members: 20 },
    { month: 'Feb', members: 21 },
    { month: 'Mar', members: 22 },
    { month: 'Apr', members: 23 },
    { month: 'May', members: 24 },
    { month: 'Jun', members: 24 },
  ];

  const shareContributions = [
    { month: 'Jan', contributions: 150000 },
    { month: 'Feb', contributions: 160000 },
    { month: 'Mar', contributions: 170000 },
    { month: 'Apr', contributions: 180000 },
    { month: 'May', contributions: 190000 },
    { month: 'Jun', contributions: 200000 },
  ];

  const accountantActivity = [
    { name: 'Marie Claire', actions: 45 },
    { name: 'Eric Habimana', actions: 38 },
    { name: 'Grace Umutoni', actions: 12 },
  ];
  const filteredMonthlyData = mockMonthlyData.filter((data) => {
    if (monthlyStatusTab === 'All') return true;
    return monthlyStatusTab === 'Positive' ? data.netFlow >= 0 : data.netFlow < 0;
  });

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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Total Savings Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Total Savings Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={savingsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Savings']} />
                  <Area type="monotone" dataKey="savings" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Loan Disbursements and Repayments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart size={20} />
                Loan Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={loanData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Member Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Member Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={memberGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="members" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Share Contributions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Share Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shareContributions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="contributions" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Accountant Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              Accountant Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accountantActivity} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="actions" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              {monthlyStatusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMonthlyStatusTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    monthlyStatusTab === tab
                      ? 'bg-[#0B5D3B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonthlyData.map((data) => (
                    <tr key={`${data.month}-${data.year}`} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-2 sm:py-4 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">{data.month} {data.year}</td>
                      <td className={`py-2 sm:py-4 px-2 sm:px-4 font-bold whitespace-nowrap ${data.netFlow >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {data.netFlow >= 0 ? '+' : ''}{formatCurrency(data.netFlow)}
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          data.netFlow >= 0
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-rose-100 text-rose-700 border-rose-200'
                        }`}>
                          {data.netFlow >= 0 ? 'Positive' : 'Negative'}
                        </span>
                      </td>
                      <td className="py-2 sm:py-4 px-2 sm:px-4 text-center">
                        <button
                          type="button"
                          onClick={() => alert(`${data.month} ${data.year}: ${formatCurrency(data.netFlow)} net flow`)}
                          className="inline-flex items-center justify-center p-2 text-[#0B5D3B] hover:bg-[#0B5D3B]/10 rounded-lg transition"
                          title="View monthly overview"
                        >
                          <Eye size={16} />
                        </button>
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
