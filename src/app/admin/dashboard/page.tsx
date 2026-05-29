'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Edit, Eye, Layers, Trash2, TrendingUp, Users, Wallet } from 'lucide-react';
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
];

const loanStats = [
  { name: 'Active', value: 8, color: '#0B5D3B' },
  { name: 'Pending', value: 4, color: '#F59E0B' },
  { name: 'Repaid', value: 12, color: '#2563EB' },
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

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
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
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'on hold':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
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
    // Handle deletion logic here
    console.log('Deleting:', deleteModal.item);
    setDeleteModal({ isOpen: false, item: null });
  };

  const summaryCards = [
    {
      title: 'Total Savings',
      value: `${totalSavings.toLocaleString()} RWF`,
      icon: Wallet,
      color: 'bg-blue-500',
      route: '/admin/savings',
      trend: '+12.5%',
    },
    {
      title: 'Total Shares',
      value: totalShares.toLocaleString(),
      icon: Layers,
      color: 'bg-purple-500',
      route: '/admin/shares',
      trend: '+8.3%',
    },
    {
      title: 'Total Loans',
      value: `${totalLoans.toLocaleString()} RWF`,
      icon: DollarSign,
      color: 'bg-orange-500',
      route: '/admin/loans',
      trend: '+15.7%',
    },
    {
      title: 'Total Members',
      value: totalMembers.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
      route: '/admin/users',
      trend: '+4.3%',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Complete platform overview and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => router.push(card.route)}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 text-left hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4"
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
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Line Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-left-4 duration-500">
          <div className="mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Platform Growth Trend</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly savings and member growth</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-emerald-700">Total Members</p>
                  <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">{totalMembers.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white p-2 text-emerald-700 shadow-sm">
                  <Users size={18} />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-blue-700">Total Savings</p>
                  <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">{totalSavings.toLocaleString()} RWF</p>
                </div>
                <div className="rounded-lg bg-white p-2 text-blue-700 shadow-sm">
                  <Wallet size={18} />
                </div>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#0B5D3B" tick={{ fontSize: 11 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" stroke="#2563EB" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number, name: string) => {
                  if (name === 'Savings (RWF)') {
                    return [`${value.toLocaleString()} RWF`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }} />
              <Line yAxisId="left" type="monotone" dataKey="savings" stroke="#0B5D3B" strokeWidth={2.5} name="Savings (RWF)" dot={{ r: 4, fill: '#0B5D3B' }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="members" stroke="#2563EB" strokeWidth={2.5} name="Members" dot={{ r: 4, fill: '#2563EB' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart - Takes 1 column */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-in slide-in-from-right-4 duration-500">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Loan Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={loanStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}`}
                outerRadius={80}
                innerRadius={50}
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
              <div key={item.name} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 truncate text-xs">{item.name}</p>
                  <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#0B5D3B]" />
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search activity..."
              showButton={false}
              className="w-full lg:max-w-[320px]"
            />
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab
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

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Activity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivityRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                    No recent activity found.
                  </td>
                </tr>
              ) : (
                paginatedActivityRows.map((row) => (
                  <tr key={`${row.route}-${row.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">{row.userName}</p>
                      <p className="text-xs text-gray-500">{row.detail}</p>
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm text-gray-700">{row.activity}</td>
                    <td className="py-3 px-4 text-[#0B5D3B] font-semibold text-xs sm:text-sm">
                      {row.amount ? `${row.amount.toLocaleString()} RWF` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm text-gray-600">{formatDate(row.date)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(row.route)}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-all active:scale-95"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-all active:scale-95"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {paginatedActivityRows.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredActivityRows.length)} of {filteredActivityRows.length}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg transition ${
                    currentPage === page
                      ? 'bg-[#0B5D3B] text-white font-semibold'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
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
