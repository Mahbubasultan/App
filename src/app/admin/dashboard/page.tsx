'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Wallet, Layers, DollarSign, TrendingUp, Users, UserCheck, Megaphone, BarChart3, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { mockUsers, mockLoans, mockGroupStats, mockGuarantors } from '@/lib/mockData';
import { SearchBar } from '@/components/ui/SearchBar';
import ActionCell from '@/components/ui/ActionCell';

const summaryData = {
  totalSavings: mockUsers.reduce((sum, u) => sum + u.totalValue, 0),
  totalShares: mockUsers.reduce((sum, u) => sum + u.shares, 0),
  totalLoans: mockLoans.reduce((sum, l) => sum + l.amount, 0),
  totalMembers: mockGroupStats.totalMembers,
  totalAccountants: 3,
  totalAnnouncements: 3,
};

const loanStats = [
  { name: 'Active', value: 8, color: '#0B5D3B' },
  { name: 'Pending', value: 4, color: '#F59E0B' },
  { name: 'Repaid', value: 12, color: '#2563EB' },
  { name: 'Overdue', value: 2, color: '#EF4444' },
];

const memberContributions = mockUsers.slice(0, 8).map(u => ({
  name: u.name.split(' ')[0],
  amount: u.totalValue,
}));

const monthlyGrowth = [
  { month: 'Jan', savings: 1800000, members: 20 },
  { month: 'Feb', savings: 1950000, members: 21 },
  { month: 'Mar', savings: 2100000, members: 22 },
  { month: 'Apr', savings: 2250000, members: 23 },
  { month: 'May', savings: 2400000, members: 24 },
  { month: 'Jun', savings: 2450000, members: 24 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = ['Overview', 'Recent Savings', 'Recent Loans', 'Recent Guarantors'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const filteredSavings = mockUsers
    .map(u => ({
      id: u.id,
      memberName: u.name,
      shareName: 'Monthly Share',
      amount: u.totalValue / 10,
      status: 'Approved',
      date: '2024-01-15',
    }))
    .filter(s => s.memberName.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 10);

  const recentLoans = mockLoans
    .filter(l => l.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 10);

  const recentGuarantors = mockGuarantors
    .filter(g => g.guarantorName.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 10);

  const cards = [
    {
      title: 'Total Savings',
      value: `${(summaryData.totalSavings / 1000000).toFixed(2)}M RWF`,
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
      value: `${(summaryData.totalLoans / 1000000).toFixed(2)}M RWF`,
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
      route: '/admin/users',
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

        {/* Quick Stats & Tables */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '400ms' }}>
          {/* Filter Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search..."
                showButton={false}
                className="w-full lg:max-w-[300px]"
              />
              <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.toLowerCase().replace(' ', '')
                        ? 'bg-[#0B5D3B] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {activeTab === 'overview' && (
                    <>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Stat</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Value</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Trend</th>
                    </>
                  )}
                  {activeTab === 'recentsavings' && (
                    <>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Member</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Action</th>
                    </>
                  )}
                  {activeTab === 'recentloans' && (
                    <>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Borrower</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Guarantor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Action</th>
                    </>
                  )}
                  {activeTab === 'recentguarantors' && (
                    <>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Guarantor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Borrower</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Loan Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'overview' && (
                  <>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 text-sm">Active Members</td>
                      <td className="py-3 px-4 text-[#0B5D3B] font-bold text-sm">{summaryData.totalMembers}</td>
                      <td className="py-3 px-4 text-green-600 font-semibold text-sm">+4.3%</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 text-sm">Accountants</td>
                      <td className="py-3 px-4 text-[#0B5D3B] font-bold text-sm">{summaryData.totalAccountants}</td>
                      <td className="py-3 px-4 text-green-600 font-semibold text-sm">Active</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 text-sm">Active Loans</td>
                      <td className="py-3 px-4 text-[#0B5D3B] font-bold text-sm">{mockLoans.filter(l => l.status === 'approved').length}</td>
                      <td className="py-3 px-4 text-green-600 font-semibold text-sm">+2</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 text-sm">Pending Verifications</td>
                      <td className="py-3 px-4 text-orange-600 font-bold text-sm">{mockLoans.filter(l => l.status === 'pending').length}</td>
                      <td className="py-3 px-4 text-orange-600 font-semibold text-sm">Review</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 text-sm">Announcements</td>
                      <td className="py-3 px-4 text-purple-600 font-bold text-sm">{summaryData.totalAnnouncements}</td>
                      <td className="py-3 px-4 text-gray-600 font-semibold text-sm">Published</td>
                    </tr>
                  </>
                )}
                {activeTab === 'recentsavings' && filteredSavings.map((saving) => (
                  <tr key={saving.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{saving.memberName}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm">{saving.amount.toLocaleString()} RWF</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {saving.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ActionCell
                        onView={() => { setSelectedItem(saving); setIsDetailOpen(true); }}
                        onEdit={() => router.push('/admin/savings')}
                        onDelete={() => {}}
                      />
                    </td>
                  </tr>
                ))}
                {activeTab === 'recentloans' && recentLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{loan.borrowerName}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm">{(loan.amount / 1000).toFixed(0)}K RWF</td>
                    <td className="py-3 px-4 text-gray-600 text-xs sm:text-sm">{loan.guarantorName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ActionCell
                        onView={() => { setSelectedItem(loan); setIsDetailOpen(true); }}
                        onEdit={() => router.push('/admin/loans')}
                        onDelete={() => {}}
                      />
                    </td>
                  </tr>
                ))}
                {activeTab === 'recentguarantors' && recentGuarantors.map((g) => (
                  <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900 text-xs sm:text-sm">{g.guarantorName}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs sm:text-sm">{g.borrowerName}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm">{g.loanAmount.toLocaleString()} RWF</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        g.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        g.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ActionCell
                        onView={() => { setSelectedItem(g); setIsDetailOpen(true); }}
                        onEdit={() => router.push('/admin/guarantor')}
                        onDelete={() => {}}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            onClick={() => router.push('/admin/users')}
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
