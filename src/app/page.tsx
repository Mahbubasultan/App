'use client';

import { useRouter } from 'next/navigation';
import { User, Shield, Crown, ArrowRight, Sparkles, TrendingUp, Lock, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const roles = [
    { 
      name: 'Member', 
      path: '/member/savings', 
      icon: User, 
      description: 'Manage your savings and loans',
      gradient: 'from-primary to-secondary',
      shadow: 'shadow-green',
      features: ['Track Savings', 'Request Loans', 'Pay Shares']
    },
    { 
      name: 'Accountant', 
      path: '/accountant/verify', 
      icon: Shield, 
      description: 'Verify payments and approve loans',
      gradient: 'from-accent-orange to-accent-orange/80',
      shadow: 'shadow-orange',
      features: ['Verify Payments', 'Approve Loans', 'Review Queue']
    },
    { 
      name: 'Admin', 
      path: '/admin/analytics', 
      icon: Crown, 
      description: 'Manage the entire system',
      gradient: 'from-accent-blue to-accent-blue/80',
      shadow: 'shadow-blue',
      features: ['Analytics', 'User Management', 'Giveaways']
    },
  ];

  const features = [
    { icon: Lock, title: 'Secure Savings', desc: 'Bank-level security', color: 'text-primary' },
    { icon: Zap, title: 'Instant Loans', desc: 'Quick approval process', color: 'text-accent-orange' },
    { icon: TrendingUp, title: 'Track Growth', desc: 'Real-time analytics', color: 'text-accent-blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-background-gray to-background-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-accent-orange animate-pulse" size={40} />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent-orange bg-clip-text text-transparent tracking-tight">
              Community Savings
            </h1>
            <Sparkles className="text-primary animate-pulse" size={40} />
          </div>
          <p className="text-xl text-text-gray max-w-2xl mx-auto">
            A modern platform for managing community savings, loans, and monthly giveaways
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div 
                key={role.name} 
                className={`group bg-white rounded-3xl p-8 ${role.shadow} hover:shadow-large transition-all duration-500 cursor-pointer animate-slide-up hover:-translate-y-2 border-2 border-transparent hover:border-gray-200`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => router.push(role.path)}
              >
                <div className="text-center space-y-6">
                  <div className={`w-24 h-24 bg-gradient-to-br ${role.gradient} rounded-3xl flex items-center justify-center mx-auto ${role.shadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={48} className="text-white" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-text-dark mb-2">{role.name}</h2>
                    <p className="text-text-gray">{role.description}</p>
                  </div>

                  <div className="space-y-2">
                    {role.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-text-gray">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent-orange rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${role.gradient} text-white rounded-2xl font-semibold ${role.shadow} hover:shadow-large transition-all duration-300 group-hover:scale-105 active:scale-95`}>
                    Enter as {role.name}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.45s' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-background-gray to-background-light rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className={feature.color} size={28} />
                </div>
                <h3 className="font-semibold text-text-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-text-gray">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
