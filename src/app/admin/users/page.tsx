'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { mockUsers } from '@/lib/mockData';
import { formatCurrency, formatDate, getGreeting } from '@/lib/utils';
import { Edit, Trash2, Plus, Users as UsersIcon, TrendingUp, DollarSign, Search, Download } from 'lucide-react';

export default function AdminUsers() {
  const [adminUser] = useState(mockUsers[2]);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const greeting = getGreeting();

  const stats = [
    {
      label: 'Total Members',
      value: mockUsers.length.toString(),
      icon: UsersIcon,
      gradient: 'from-primary to-secondary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      shadow: 'shadow-green'
    },
    {
      label: 'Active Members',
      value: mockUsers.filter(u => u.isActive).length.toString(),
      icon: TrendingUp,
      gradient: 'from-accent-orange to-accent-orange/80',
      iconBg: 'bg-accent-orange/10',
      iconColor: 'text-accent-orange',
      shadow: 'shadow-orange'
    },
    {
      label: 'Total Savings',
      value: formatCurrency(mockUsers.reduce((sum, u) => sum + u.totalValue, 0)),
      icon: DollarSign,
      gradient: 'from-accent-blue to-accent-blue/80',
      iconBg: 'bg-accent-blue/10',
      iconColor: 'text-accent-blue',
      shadow: 'shadow-blue'
    },
  ];

  return (
    <Layout role="admin" userName={adminUser.name} userImage={userImage} onImageUpdate={setUserImage}>
      <div className="space-y-6 animate-slide-up">
        {/* Dynamic Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-orange bg-clip-text text-transparent">
              {greeting}, {adminUser.name.split(' ')[0]}!
            </h1>
            <p className="text-text-gray mt-1">Manage all members and their roles</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-semibold shadow-green hover:shadow-large transition-all duration-300 active:scale-95">
            <Plus size={20} />
            Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label} 
                hover 
                className={`relative overflow-hidden ${stat.shadow} border-2 border-transparent hover:border-gray-200 transition-all duration-500`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
                <div className="relative flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className={stat.iconColor} />
                  </div>
                  <div>
                    <p className="text-sm text-text-gray">{stat.label}</p>
                    <p className="text-3xl font-bold text-text-dark">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Users Table */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-dark">All Members</h2>
              <p className="text-sm text-text-gray mt-1">View and manage user accounts</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all duration-300 active:scale-95">
                <Search size={18} className="text-text-gray" />
                <span className="text-sm font-medium text-text-dark">Search</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white rounded-2xl shadow-orange hover:shadow-large transition-all duration-300 active:scale-95">
                <Download size={18} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Member</th>
                  <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Contact</th>
                  <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Role</th>
                  <th className="text-right py-4 px-4 font-semibold text-text-gray text-sm">Shares</th>
                  <th className="text-right py-4 px-4 font-semibold text-text-gray text-sm">Total Value</th>
                  <th className="text-center py-4 px-4 font-semibold text-text-gray text-sm">Status</th>
                  <th className="text-center py-4 px-4 font-semibold text-text-gray text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-background-gray hover:to-transparent transition-all duration-300"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="transition-transform duration-300 hover:scale-110">
                          <Avatar name={user.name} size="md" />
                        </div>
                        <div>
                          <p className="font-medium text-text-dark">{user.name}</p>
                          <p className="text-xs text-text-gray">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-text-dark">{user.email}</p>
                      <p className="text-xs text-text-gray">{user.phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant={user.role === 'admin' ? 'danger' : user.role === 'accountant' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-primary">{user.shares}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-text-dark">
                      {formatCurrency(user.totalValue)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={user.isActive ? 'success' : 'danger'} size="sm">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 hover:bg-accent-blue/10 text-accent-blue rounded-xl transition-all duration-300 active:scale-90">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 hover:bg-accent-red/10 text-accent-red rounded-xl transition-all duration-300 active:scale-90">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
