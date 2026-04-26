'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PenaltyBadge } from '@/components/ui/PenaltyBadge';
import { mockTransactions, mockUsers } from '@/lib/mockData';
import { formatCurrency, formatDate, SHARE_PRICE, getGreeting } from '@/lib/utils';
import { Layers, DollarSign, AlertCircle, TrendingUp, ArrowUpRight, Download, Filter, X, Check, Calendar, User } from 'lucide-react';

export default function MemberSavings() {
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'contribution' | 'penalty'>('all');
  const [showUserSwitch, setShowUserSwitch] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const greeting = getGreeting();

  const filteredTransactions = mockTransactions.filter(tx => {
    if (filterType === 'all') return true;
    if (filterType === 'penalty') return tx.penalty && tx.penalty > 0;
    if (filterType === 'contribution') return !tx.penalty || tx.penalty === 0;
    return true;
  });

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Description', 'Amount', 'Shares', 'Penalty', 'Status'].join(','),
      ...filteredTransactions.map(tx => [
        formatDate(tx.createdAt),
        tx.description,
        tx.amount,
        tx.shares,
        tx.penalty || 0,
        tx.penalty ? 'Late' : 'On Time'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${currentUser.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleUserSwitch = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setShowUserSwitch(false);
    }
  };

  const stats = [
    { 
      label: 'Total Shares', 
      value: currentUser.shares.toString(), 
      subtitle: `@ ${formatCurrency(SHARE_PRICE)} per share`,
      icon: Layers, 
      gradient: 'from-primary to-secondary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      change: '+25 this month',
      changeColor: 'text-primary',
      shadow: 'shadow-green'
    },
    { 
      label: 'Total Value', 
      value: formatCurrency(currentUser.totalValue), 
      subtitle: `${currentUser.shares} shares owned`,
      icon: DollarSign, 
      gradient: 'from-accent-orange to-accent-orange/80',
      iconBg: 'bg-accent-orange/10',
      iconColor: 'text-accent-orange',
      change: '+12.5%',
      changeColor: 'text-accent-orange',
      shadow: 'shadow-orange'
    },
    { 
      label: 'Active Penalty', 
      value: formatCurrency(0), 
      subtitle: 'No late payments',
      icon: AlertCircle, 
      gradient: 'from-accent-blue to-accent-blue/80',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      change: 'All clear',
      changeColor: 'text-success',
      shadow: 'shadow-blue'
    },
  ];

  return (
    <Layout role="member" userName={currentUser.name} userImage={userImage} onImageUpdate={setUserImage}>
      <div className="space-y-4 sm:space-y-6 animate-slide-up">
        {/* Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent-orange bg-clip-text text-transparent">
              {greeting}, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-sm sm:text-base text-text-gray mt-1">Track your shares and transaction history</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowUserSwitch(!showUserSwitch)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 active:scale-95 flex-1 sm:flex-initial justify-center"
            >
              <User size={18} className="text-primary" />
              <span className="text-sm font-medium text-text-dark">Switch User</span>
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-green hover:shadow-large transition-all duration-300 active:scale-95">
              <TrendingUp size={20} />
              <span className="font-semibold">Growing</span>
            </div>
          </div>
        </div>

        {/* User Switcher Modal */}
        {showUserSwitch && (
          <Card className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-text-dark">Switch Member Account</h3>
              <button onClick={() => setShowUserSwitch(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-text-gray" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockUsers.filter(u => u.role === 'member').map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSwitch(user.id)}
                  className={`p-3 sm:p-4 border-2 rounded-xl text-left transition-all duration-300 active:scale-95 ${
                    currentUser.id === user.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-dark text-sm truncate">{user.name}</p>
                      <p className="text-xs text-text-gray">{user.shares} shares • {formatCurrency(user.totalValue)}</p>
                    </div>
                    {currentUser.id === user.id && <Check size={20} className="text-primary flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label} 
                hover 
                className={`relative overflow-hidden ${stat.shadow} border-2 border-transparent hover:border-gray-200 transition-all duration-500`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={20} className={`sm:w-6 sm:h-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${stat.changeColor}`}>
                      <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-text-gray mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-text-dark mb-1">{stat.value}</p>
                  <p className="text-xs text-text-gray">{stat.subtitle}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Transactions */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-text-dark">Recent Transactions</h2>
              <p className="text-xs sm:text-sm text-text-gray mt-1">Your contribution history</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border-2 rounded-xl transition-all duration-300 active:scale-95 ${
                  showFilter ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <Filter size={16} className={showFilter ? 'text-primary' : 'text-text-gray'} />
                <span className="text-xs sm:text-sm font-medium text-text-dark">Filter</span>
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-green hover:shadow-large transition-all duration-300 active:scale-95"
              >
                <Download size={16} />
                <span className="text-xs sm:text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
          
          {showFilter && (
            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-xl animate-fade-in">
              <p className="text-xs sm:text-sm font-medium text-text-gray mb-3">Filter by:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 ${
                    filterType === 'all' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-text-dark border-2 border-gray-200 hover:border-primary'
                  }`}
                >
                  All ({mockTransactions.length})
                </button>
                <button
                  onClick={() => setFilterType('contribution')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 ${
                    filterType === 'contribution' 
                      ? 'bg-success text-white' 
                      : 'bg-white text-text-dark border-2 border-gray-200 hover:border-success'
                  }`}
                >
                  On Time ({mockTransactions.filter(tx => !tx.penalty || tx.penalty === 0).length})
                </button>
                <button
                  onClick={() => setFilterType('penalty')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 ${
                    filterType === 'penalty' 
                      ? 'bg-danger text-white' 
                      : 'bg-white text-text-dark border-2 border-gray-200 hover:border-danger'
                  }`}
                >
                  Penalty ({mockTransactions.filter(tx => tx.penalty && tx.penalty > 0).length})
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-text-gray text-xs sm:text-sm">Date</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-text-gray text-xs sm:text-sm">Description</th>
                  <th className="text-right py-3 sm:py-4 px-3 sm:px-4 font-semibold text-text-gray text-xs sm:text-sm">Amount</th>
                  <th className="text-right py-3 sm:py-4 px-3 sm:px-4 font-semibold text-text-gray text-xs sm:text-sm">Shares</th>
                  <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-semibold text-text-gray text-xs sm:text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 sm:py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Calendar size={24} className="sm:w-8 sm:h-8 text-text-gray" />
                        </div>
                        <p className="text-sm sm:text-base text-text-gray font-medium">No transactions found</p>
                        <button 
                          onClick={() => setFilterType('all')}
                          className="text-xs sm:text-sm text-primary hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr 
                      key={tx.id} 
                      onClick={() => setSelectedTransaction(selectedTransaction === tx.id ? null : tx.id)}
                      className={`border-b border-gray-100 cursor-pointer transition-all duration-300 ${
                        selectedTransaction === tx.id 
                          ? 'bg-primary/5' 
                          : 'hover:bg-gradient-to-r hover:from-background-gray hover:to-transparent'
                      }`}
                    >
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-text-gray">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <p className="font-medium text-text-dark text-xs sm:text-sm">{tx.description}</p>
                        {tx.reference && (
                          <p className="text-xs text-text-gray mt-0.5">Ref: {tx.reference}</p>
                        )}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-right">
                        <span className="font-semibold text-primary text-xs sm:text-sm">
                          +{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-right">
                        <Badge variant="success" size="sm">
                          +{tx.shares}
                        </Badge>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                        {tx.penalty && tx.daysLate && tx.penaltyRate ? (
                          <PenaltyBadge 
                            amount={tx.amount}
                            penaltyAmount={tx.penalty} 
                            daysLate={tx.daysLate} 
                            penaltyRate={tx.penaltyRate}
                            tier={tx.daysLate <= 3 ? 'tier1' : tx.daysLate <= 7 ? 'tier2' : 'tier3'}
                            formula={`${formatCurrency(tx.amount)} × ${(tx.penaltyRate * 100).toFixed(1)}% = ${formatCurrency(tx.penalty)}`}
                          />
                        ) : (
                          <Badge variant="success" size="sm">
                            On Time
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
