'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PenaltyBadge } from '@/components/ui/PenaltyBadge';
import { mockTransactions, mockUsers } from '@/lib/mockData';
import { formatCurrency, formatDate, SHARE_PRICE, getGreeting } from '@/lib/utils';
import { Layers, DollarSign, AlertCircle, TrendingUp, ArrowUpRight, Download, Filter } from 'lucide-react';

export default function MemberSavings() {
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const greeting = getGreeting();

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
      <div className="space-y-6 animate-slide-up">
        {/* Greeting Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-orange bg-clip-text text-transparent">
              {greeting}, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-text-gray mt-1">Track your shares and transaction history</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-green hover:shadow-large transition-all duration-300 active:scale-95">
            <TrendingUp size={20} />
            <span className="font-semibold">Growing</span>
          </div>
        </div>

        {/* Colorful Stats Cards */}
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
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} className={stat.iconColor} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.changeColor}`}>
                      <ArrowUpRight size={16} />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-sm text-text-gray mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-dark mb-1">{stat.value}</p>
                  <p className="text-xs text-text-gray">{stat.subtitle}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-dark">Recent Transactions</h2>
              <p className="text-sm text-text-gray mt-1">Your contribution history</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all duration-300 active:scale-95">
                <Filter size={18} className="text-text-gray" />
                <span className="text-sm font-medium text-text-dark">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-green hover:shadow-large transition-all duration-300 active:scale-95">
                <Download size={18} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-text-gray text-sm">Description</th>
                  <th className="text-right py-4 px-4 font-semibold text-text-gray text-sm">Amount</th>
                  <th className="text-right py-4 px-4 font-semibold text-text-gray text-sm">Shares</th>
                  <th className="text-center py-4 px-4 font-semibold text-text-gray text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx, index) => (
                  <tr 
                    key={tx.id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-background-gray hover:to-transparent transition-all duration-300"
                  >
                    <td className="py-4 px-4 text-sm text-text-gray">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-text-dark text-sm">{tx.description}</p>
                      {tx.reference && (
                        <p className="text-xs text-text-gray mt-0.5">Ref: {tx.reference}</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-primary text-sm">
                        +{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Badge variant="success" size="sm">
                        +{tx.shares}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center">
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
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
