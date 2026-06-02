'use client';

import { useRouter } from 'next/navigation';
import { Wallet, Layers, Banknote, TrendingUp } from 'lucide-react';
import { CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis } from 'recharts';
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
      iconColor: 'bg-emerald-500',
      route: '/accountant/savings',
      trend: '+12.5%',
    },
    {
      title: 'Total Shares',
      value: summaryData.totalShares.toLocaleString(),
      icon: Layers,
      iconColor: 'bg-blue-500',
      route: '/accountant/shares',
      trend: '+8.3%',
    },
    {
      title: 'Total Loans',
      value: `${(summaryData.totalLoans / 1000000).toFixed(2)}M RWF`,
      icon: Banknote,
      iconColor: 'bg-orange-500',
      route: '/accountant/loans',
      trend: '+15.7%',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Overview of all member activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => router.push(card.route)}
              className="group bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{card.title}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{card.value}</p>
                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-green-600 font-semibold">{card.trend}</span>
                    <span className="text-gray-500 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className={`${card.iconColor} p-2 sm:p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 animate-in slide-in-from-left-4 duration-500">
          <div className="mb-4 sm:mb-5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Savings & Loans Trend</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly performance overview</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B5D3B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0B5D3B" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                stroke="#6b7280" 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  padding: '12px'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} RWF`, '']}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#0B5D3B" 
                strokeWidth={3}
                name="Savings (RWF)" 
                dot={{ r: 5, fill: '#0B5D3B', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 7, fill: '#0B5D3B', strokeWidth: 3, stroke: '#fff' }}
                fill="url(#colorSavings)"
              />
              <Line 
                type="monotone" 
                dataKey="loans" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Loans (RWF)" 
                dot={{ r: 5, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 7, fill: '#F59E0B', strokeWidth: 3, stroke: '#fff' }}
                fill="url(#colorLoans)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 animate-in slide-in-from-right-4 duration-500">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Loan Status</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Distribution overview</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <defs>
                {loanStats.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${entry.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.8}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={loanStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={(props) => {
                  const { value, percent, cx, cy, midAngle, innerRadius, outerRadius, name } = props;
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 25;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const entry = loanStats.find(stat => stat.name === name);
                  
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill={entry?.color || '#000'}
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      style={{ fontSize: '12px', fontWeight: 'bold' }}
                    >
                      {`${value} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {loanStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${entry.name})`}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} loans`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {loanStats.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: item.color }} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 truncate">{item.name}</p>
                  <p className="text-sm font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
