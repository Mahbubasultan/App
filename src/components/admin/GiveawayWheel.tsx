'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { mockUsers, mockGiveaways } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trophy, Sparkles, Users, DollarSign } from 'lucide-react';

export const GiveawayWheel: React.FC = () => {
  const { success } = useToast();
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<{ name: string; amount: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const totalPool = 2500000;
  const winnerPercentage = 95;
  const winnerAmount = Math.floor(totalPool * (winnerPercentage / 100));
  const members = mockUsers.filter(u => u.role === 'member');

  const handleSpin = () => {
    setSpinning(true);
    setWinner(null);
    setShowConfetti(false);

    setTimeout(() => {
      const randomWinner = members[Math.floor(Math.random() * members.length)];
      setWinner({ name: randomWinner.name, amount: winnerAmount });
      setSpinning(false);
      setShowConfetti(true);
      success(`🎉 ${randomWinner.name} won ${formatCurrency(winnerAmount)}!`);
      
      setTimeout(() => setShowConfetti(false), 5000);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <DollarSign size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pool</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPool)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-success-100 rounded-xl">
              <Trophy size={24} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Winner Gets</p>
              <p className="text-xl font-bold text-gray-900">{winnerPercentage}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-info-100 rounded-xl">
              <Users size={24} className="text-info-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-xl font-bold text-gray-900">{members.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="text-center space-y-8 py-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Monthly Giveaway</h2>
            <p className="text-gray-600">Spin the wheel to select this month&apos;s winner</p>
          </div>

          <div className="relative inline-block">
            <div
              className={`
                w-72 h-72 mx-auto rounded-full 
                bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600
                flex items-center justify-center shadow-large
                ${spinning ? 'animate-spin-slow' : ''}
                ${showConfetti ? 'animate-pulse-glow' : ''}
              `}
              style={{ animationDuration: spinning ? '4s' : undefined }}
            >
              <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center">
                <Trophy size={80} className="text-primary-600" />
              </div>
            </div>
            
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-0 left-1/4 text-warning-400 animate-bounce" size={32} />
                <Sparkles className="absolute top-1/4 right-0 text-success-400 animate-bounce" size={24} style={{ animationDelay: '0.2s' }} />
                <Sparkles className="absolute bottom-1/4 left-0 text-danger-400 animate-bounce" size={28} style={{ animationDelay: '0.4s' }} />
                <Sparkles className="absolute bottom-0 right-1/4 text-info-400 animate-bounce" size={24} style={{ animationDelay: '0.6s' }} />
              </div>
            )}
          </div>

          {winner && (
            <div className="bg-gradient-to-r from-success-50 to-primary-50 border-2 border-success-300 rounded-2xl p-8 animate-slide-up">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy size={32} className="text-warning-500" />
                <h3 className="text-2xl font-bold text-gray-900">Winner Announced!</h3>
                <Trophy size={32} className="text-warning-500" />
              </div>
              <p className="text-4xl font-bold text-primary-700 mb-2">{winner.name}</p>
              <p className="text-2xl font-semibold text-success-600">{formatCurrency(winner.amount)}</p>
            </div>
          )}

          <Button
            onClick={handleSpin}
            disabled={spinning}
            size="lg"
            className="px-12"
            leftIcon={spinning ? undefined : <Sparkles size={20} />}
            isLoading={spinning}
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giveaway History</CardTitle>
          <CardDescription>Past winners and prize amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Winner</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Prize Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Pool</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockGiveaways.map((giveaway) => (
                  <tr key={giveaway.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium">{giveaway.month} {giveaway.year}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-warning-500" />
                        <span className="font-medium">{giveaway.winnerName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-success-600">
                        {formatCurrency(giveaway.winnerAmount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(giveaway.totalPool)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="default" size="sm">
                        {formatDate(giveaway.date)}
                      </Badge>
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
};
