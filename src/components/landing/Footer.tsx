'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, Mail, Phone, Facebook, MessageCircle, Twitter } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8">
          {/* Left Side - Logo & Description */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Community Savings</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A modern digital ROSCA platform for community savings, loans, and monthly giveaways.
            </p>
          </div>

          {/* Middle - Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/landing" className="text-sm hover:text-green-500 transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="text-sm hover:text-green-500 transition-colors inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm hover:text-green-500 transition-colors inline-block">
                  How it Works
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-green-500 transition-colors inline-block">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Side - Contact */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Mail size={16} className="text-green-500 flex-shrink-0" />
                <span className="break-all">info@communitysavings.rw</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Phone size={16} className="text-green-500 flex-shrink-0" />
                <span>+250 788 123 456</span>
              </li>
            </ul>
            
            <div className="flex gap-3 mt-4 justify-center sm:justify-start">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors active:scale-95 min-h-[44px] min-w-[44px]">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors active:scale-95 min-h-[44px] min-w-[44px]">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors active:scale-95 min-h-[44px] min-w-[44px]">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get updates
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500 transition-colors min-h-[44px]"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors active:scale-95 min-h-[44px]"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Community Savings App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
