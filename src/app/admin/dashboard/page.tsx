'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Eye, Layers, Trash2, TrendingUp, Users, Wallet } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { mockGroupStats, mockGuarantors, mockLoans } from '@/lib/mockData';
import {
  getRegisteredUsers,
  getSavingRecords,
  RegisteredUser,
  SavingRecord,
} from '@/lib/localStorageService';
import { SearchBar } from '@/components/ui/SearchBar';

type ActivityStatus = 'Approved' | 'Pending' | 'Rejected' | 'On Hold' | 'Active';

interface ActivityRow {
  id: string;
  userName: string;
  activity: string;
  detail: string;
  amount: number | null;
  status: ActivityStatus;
  date: string;
  route: string;
}

const fallbackSavings = [
  { month: 'Jan', savings: 1800000, members: 20 },
  { month: 'Feb', savings: 1950000, members: 21 },
  { month: 'Mar', savings: 2100000, members: 22 },
  { month: 'Apr', savings: 2250000, members: 23 },
  { month: 'May', savings: 2400000, members: 24 },
  { month: 'Jun', savings: 2450000, members: 24 },
  { month: 'Jul', savings: 2600000, members: 25 },
  { month: 'Aug', savings: 2750000, members: 26 },
  { month: 'Sep', savings: 2900000, members: 27 },
  { month: 'Oct', savings: 3050000, members: 28 },
  { month: 'Nov', savings: 3200000, members: 29 },
  { month: 'Dec', savings: 3350000, members: 30 },
];

const loanStats = [
  { name: 'Active', value: 8, color: '#16A34A' },
  { name: 'Pending', value: 4, color: '#F59E0B' },
  { name: 'Repaid', value: 12, color: '#3B82F6' },
  { name: 'Overdue', value: 2, color: '#EF4444' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [savingRecords, setSavingRecords] = useState<SavingRecord[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: ActivityRow | null }>({ isOpen: false, item: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'On Hold', 'Active'];

  useEffect(() => {
    setRegisteredUsers(getRegisteredUsers());
    setSavingRecords(getSavingRecords());
  }, []);

  const totalMembers = registeredUsers.length || mockGroupStats.totalMembers;
  const totalSavings = savingRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalLoans = mockLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalShares = Math.max(Math.round(totalSavings / 2000), mockGroupStats.totalShares);

  const monthlyGrowth = useMemo(() => {
    if (savingRecords.length === 0 && registeredUsers.length === 0) {
      return fallbackSavings;
    }

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthOrder.map((month, index) => {
      const savings = savingRecords
        .filter((record) => new Date(record.date).getMonth() === index)
        .reduce((sum, record) => sum + record.amount, 0);
      const members = registeredUsers.filter((user) => new Date(user.joinedDate).getMonth() <= index).length;

      return {
        month,
        savings,
        members,
      };
    });
  }, [registeredUsers, savingRecords]);

  const activityRows = useMemo<ActivityRow[]>(() => {
    const savingsRows = savingRecords.map((saving) => ({
      id: saving.id,
      userName: saving.userName || saving.momoName || saving.userEmail || 'Member',
      activity: 'Added savings',
      detail: saving.shareName,
      amount: saving.amount,
      status: saving.status,
      date: saving.updatedAt || saving.createdAt || saving.date,
      route: '/admin/savings',
    }));

    const userRows = registeredUsers.map((user) => ({
      id: user.id,
      userName: user.name,
      activity: 'Registered account',
      detail: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} user`,
      amount: user.totalSavings || null,
      status: 'Active' as ActivityStatus,
      date: user.lastUpdated || user.joinedDate,
      route: '/admin/users',
    }));

    const loanRows = mockLoans.map((loan) => ({
      id: loan.id,
      userName: loan.borrowerName,
      activity: 'Requested loan',
      detail: `Guarantor: ${loan.guarantorName}`,
      amount: loan.amount,
      status: (loan.status.charAt(0).toUpperCase() + loan.status.slice(1)) as ActivityStatus,
      date: loan.date,
      route: '/admin/loans',
    }));

    const guarantorRows = mockGuarantors.map((guarantor) => ({
      id: guarantor.id,
      userName: guarantor.guarantorName,
      activity: 'Guarantor activity',
      detail: `Borrower: ${guarantor.borrowerName}`,
      amount: guarantor.loanAmount,
      status: guarantor.status as ActivityStatus,
      date: guarantor.date,
      route: '/admin/guarantor',
    }));

    return [...savingsRows, ...userRows, ...loanRows, ...guarantorRows].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [registeredUsers, savingRecords]);

  const filteredActivityRows = activityRows.filter((row) => {
    const lowerSearch = searchQuery.toLowerCase();
    const amountText = row.amount ? [row.amount.toString(), row.amount.toLocaleString()] : [];
    const matchesStatus = activeTab === 'All' || row.status === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      row.userName.toLowerCase().includes(lowerSearch) ||
      row.activity.toLowerCase().includes(lowerSearch) ||
      row.detail.toLowerCase().includes(lowerSearch) ||
      row.status.toLowerCase().includes(lowerSearch) ||
      amountText.some((value) => value.toLowerCase().includes(lowerSearch));

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredActivityRows.length / itemsPerPage);
  const paginatedActivityRows = filteredActivityRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'on hold':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString();
  };

  const handleDelete = (item: ActivityRow) => {
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = () => {
    if (!deleteModal.item) return;
    console.log('Deleting:', deleteModal.item);
    setDeleteModal({ isOpen: false, item: null });
  };

  const summaryCards = [
    {
      title: 'Total Savings',
      value: `${(totalSavings / 1000000).toFixed(1)}M RWF`,
      icon: Wallet,
      path: '/admin/savings',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Shares',
      value: totalShares.toLocaleString(),
      icon: Layers,
      path: '/admin/shares',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Loans',
      value: `${(totalLoans / 1000000).toFixed(1)}M RWF`,
      icon: DollarSign,
      path: '/admin/loans',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Total Members',
      value: totalMembers.toLocaleString(),
      icon: Users,
      path: '/admin/users',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="animate-in fade-in-0 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Complete platform overview and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => router.push(card.path)}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left group animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`p-3 sm:p-4 rounded-2xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Icon size={24} className={`${card.iconColor} sm:w-7 sm:h-7`} />
                </div>
                <TrendingUp size={18} className="text-green-500 opacity-70 sm:w-5 sm:h-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{card.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 animate-in fade-in-0 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Platform Growth Trend</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly savings and member growth analytics</p>
            </div>
            <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#16A34A]"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Savings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#3B82F6]"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Members</span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-[#f0fdf4] rounded-2xl p-3 sm:p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Total Savings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-900">{(totalSavings / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-600 mt-1">RWF</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-200 rounded-xl">
                  <Wallet size={24} className="text-green-700 sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>
            <div className="bg-[#eff6ff] rounded-2xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Total Members</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900">{totalMembers}</p>
                  <p className="text-xs text-blue-600 mt-1">Active Users</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-200 rounded-xl">
                  <Users size={24} className="text-blue-700 sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px]">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280" 
                    tick={{ fontSize: 11 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#16A34A" 
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    width={45}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#3B82F6" 
                    tick={{ fontSize: 11 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                      padding: '10px 12px'
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '6px', color: '#111827', fontSize: '11px' }}
                    itemStyle={{ padding: '2px 0', fontSize: '11px' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#16A34A" 
                    strokeWidth={3}
                    name="Total Savings (RWF)" 
                    dot={{ r: 5, fill: '#16A34A', strokeWidth: 2, stroke: '#FFFFFF' }} 
                    activeDot={{ r: 7, fill: '#16A34A', strokeWidth: 3, stroke: '#FFFFFF' }}
                    fill="url(#colorSavings)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="members" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Total Members" 
                    dot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }} 
                    activeDot={{ r: 7, fill: '#3B82F6', strokeWidth: 3, stroke: '#FFFFFF' }}
                    fill="url(#colorMembers)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Donut Chart - Loan Status */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 animate-in fade-in-0 duration-700">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Loan Status</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Distribution overview</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={loanStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                label={(props) => {
                  const { value, percent } = props;
                  return `${value} (${(percent * 100).toFixed(0)}%)`;
                }}
                labelLine={false}
              >
                {loanStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="#FFFFFF"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  padding: '10px'
                }}
                formatter={(value: number) => [`${value} loans`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
            {loanStats.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600">{item.name}</p>
                  <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Latest transactions and updates</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-[#14532D] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by user, activity, amount..."
              showButton={false}
              className="w-full"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedActivityRows.map((row) => (
                <tr key={`${row.route}-${row.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{row.userName}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{row.detail}</div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{row.activity}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                    {row.amount ? `${row.amount.toLocaleString()} RWF` : '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{formatDate(row.date)}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.push(row.route)}
                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-3">
          {paginatedActivityRows.map((row) => (
            <div
              key={`${row.route}-${row.id}`}
              className="bg-gray-50 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{row.userName}</p>
                  <p className="text-xs text-gray-600 mt-1">{row.detail}</p>
                </div>
                <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
                  {row.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">{row.activity}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {row.amount ? `${row.amount.toLocaleString()} RWF` : '-'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(row.date)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(row.route)}
                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-all"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredActivityRows.length)} of {filteredActivityRows.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[32px] sm:min-w-[36px] px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#14532D] text-white shadow-md'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 bg-[#14532D] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#0f3d21] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        title="Delete Activity"
        message="Are you sure you want to delete this activity record? This action cannot be undone."
        itemName={deleteModal.item?.userName}
      />
    </div>
  );
}
