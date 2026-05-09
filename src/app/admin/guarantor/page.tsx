'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserCheck, AlertCircle, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { mockLoans, mockUsers } from '@/lib/mockData';

const guarantorStats = [
  { label: 'Total Guarantors', value: mockLoans.filter(l => l.guarantorId).length, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Acceptance', value: mockLoans.filter(l => !l.guarantorAccepted).length, icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Accepted Requests', value: mockLoans.filter(l => l.guarantorAccepted).length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
];

const guarantorData = mockLoans
  .filter(l => l.guarantorId)
  .map(l => ({ name: l.guarantorName.split(' ')[0], requests: 1 }))
  .reduce((acc, curr) => {
    const existing = acc.find(x => x.name === curr.name);
    if (existing) existing.requests++;
    else acc.push(curr);
    return acc;
  }, [])
  .sort((a, b) => b.requests - a.requests)
  .slice(0, 10);

const statusData = [
  { name: 'Accepted', value: mockLoans.filter(l => l.guarantorAccepted).length, color: '#16a34a' },
  { name: 'Pending', value: mockLoans.filter(l => !l.guarantorAccepted).length, color: '#f59e0b' },
];

const recentGuarantors = mockLoans.filter(l => l.guarantorId).slice(-8).reverse();

export default function AdminGuarantorPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Guarantor Management</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Review and manage guarantor assignments for loans</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {guarantorStats.map((stat) => {
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
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Top Guarantors</h3>
            <p className="text-xs text-gray-500 mt-0.5">Most active guarantor assignments</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={guarantorData} margin={{ top: 5, right: 5, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any) => [`${v} requests`, 'Requests']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="requests" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Status Overview</h3>
            <p className="text-xs text-gray-500 mt-0.5">Acceptance rate</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {statusData.map((item) => (
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

      {/* Recent Guarantors Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Recent Guarantor Assignments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Borrower</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Guarantor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Loan Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentGuarantors.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{loan.borrowerName}</td>
                  <td className="py-3 px-4 text-gray-600">{loan.guarantorName}</td>
                  <td className="py-3 px-4 text-gray-600">{(loan.amount / 1000000).toFixed(1)}M RWF</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      loan.guarantorAccepted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {loan.guarantorAccepted ? 'Accepted' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
