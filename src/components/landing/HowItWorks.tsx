'use client';

import { UserPlus, Wallet, TrendingUp, Award } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up and choose your role: Member, Accountant, or Admin'
    },
    {
      icon: Wallet,
      title: 'Start Saving',
      description: 'Make payments that convert to shares at 2,000 RWF each'
    },
    {
      icon: TrendingUp,
      title: 'Access Loans',
      description: 'Request loans with a guarantor up to 100% of combined savings'
    },
    {
      icon: Award,
      title: 'Win Monthly Pool',
      description: 'Participate in monthly giveaways and win 95% of the pool'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Get started in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 active:scale-95 h-full flex flex-col">
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 mt-4 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <Icon size={28} className="sm:w-8 sm:h-8" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 flex-grow">
                    {step.description}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-green-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
