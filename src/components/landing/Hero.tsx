'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop"
        >
          <source 
            src="https://cdn.coverr.co/videos/coverr-a-group-of-people-working-in-an-office-9165/1080p.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Fallback Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop')"
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glass Morphism Container */}
          <div 
            className={`backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 border border-white/20 shadow-2xl transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-300 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Digital ROSCA Platform</span>
            </div>

            {/* Main Heading */}
            <h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Save Together.
              <br />
              <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                Grow Together.
              </span>
            </h1>

            {/* Subheading */}
            <p 
              className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 transition-all duration-700 delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              A smart and transparent community savings platform for{' '}
              <span className="text-green-300 font-semibold">secure group savings</span> and{' '}
              <span className="text-green-300 font-semibold">financial growth</span>.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-700 delay-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/50 w-full sm:w-auto min-h-[44px]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <a
                href="#features"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95 w-full sm:w-auto min-h-[44px]"
              >
                Learn More
                <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
              </a>
            </div>

            {/* Stats */}
            <div 
              className={`grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 max-w-2xl mx-auto mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20 transition-all duration-700 delay-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-center group cursor-default">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  2,000
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">RWF Per Share</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">Loan Coverage</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  95%
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">Winner Payout</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#features"
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer group hidden sm:flex"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2 group-hover:border-green-400 transition-colors duration-300">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll group-hover:bg-green-400 transition-colors duration-300" />
          </div>
          <span className="text-white/60 text-xs font-medium group-hover:text-green-400 transition-colors duration-300">Scroll</span>
        </div>
      </a>
    </section>
  );
}
