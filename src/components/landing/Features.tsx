'use client';

import { Coins, Users, AlertCircle, Gift } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Coins,
      title: 'Share-Based Savings',
      description: 'Every payment converts to shares at 2,000 RWF each. Track your equity in real-time with transparent calculations.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Users,
      title: 'Loan with Guarantor',
      description: 'Access loans up to 100% of combined savings with your guarantor. Quick approval with 5% interest rate.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: AlertCircle,
      title: 'Automated Penalties',
      description: 'Fair penalty system based on payment delays. Tier-based rates from 2% to 1.5% daily for late payments.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Gift,
      title: 'Monthly Giveaway',
      description: 'Win 95% of the monthly pool through our tontine system. Fair random selection for all eligible members.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-3 sm:mb-4">
            Powerful Features for Community Savings
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Everything you need to manage savings, loans, and community funds in one platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
