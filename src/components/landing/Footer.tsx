'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Facebook, MessageCircle, Twitter } from 'lucide-react';
import { TrustNetLogo } from '@/components/ui/TrustNetLogo';

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
    <footer className="bg-[#14532D] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8">
          {/* Left Side - Logo & Description */}
          <div className="text-center sm:text-left">
            <div className="mb-4 flex items-center gap-3">
              <TrustNetLogo size={56} />
              <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px' }}>
                <span style={{ color: '#ffffff' }}>Trust</span><span style={{ color: '#4ade80' }}>Net</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              A modern digital ROSCA platform for community savings, secure loans, and monthly giveaways.
            </p>
          </div>

          {/* Middle - Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/landing" className="text-sm hover:text-green-300 transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="text-sm hover:text-green-300 transition-colors inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm hover:text-green-300 transition-colors inline-block">
                  How it Works
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-green-300 transition-colors inline-block">
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
                <Mail size={16} className="text-green-300 flex-shrink-0" />
                <span className="break-all">info@communitysavings.rw</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Phone size={16} className="text-green-300 flex-shrink-0" />
                <span>+250 788 123 456</span>
              </li>
            </ul>
            
            <div className="flex gap-3 mt-4 justify-center sm:justify-start">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-all active:scale-95 min-h-[44px] min-w-[44px] hover:shadow-lg">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-all active:scale-95 min-h-[44px] min-w-[44px] hover:shadow-lg">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-all active:scale-95 min-h-[44px] min-w-[44px] hover:shadow-lg">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to get updates
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all min-h-[44px]"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all active:scale-95 min-h-[44px] shadow-lg hover:shadow-xl"
              >
                {subscribed ? 'Subscribed! ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Trust Nest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
