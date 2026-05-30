'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { TrustNetLogo } from '@/components/ui/TrustNetLogo';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: 'home', label: 'Home' },
    { href: 'features', label: 'Features' },
    { href: 'how-it-works', label: 'How It Works' },
    { href: 'contact', label: 'Contact' },
  ];

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <TrustNetLogo size={56} />
            <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#111827' }}>Trust </span><span style={{ color: '#16A34A' }}>Nest</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-gray-700 hover:text-[#14532D] font-medium transition-colors cursor-pointer bg-transparent border-none"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-6 py-2.5 text-gray-700 font-semibold hover:text-[#14532D] transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-[#14532D] text-white rounded-xl font-semibold hover:bg-[#0f3d21] transition-all shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#14532D] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:text-[#14532D] hover:bg-gray-50 rounded-lg font-medium transition-all cursor-pointer bg-transparent border-none"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link href="/login"
                  className="block w-full px-4 py-3 text-center text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:border-[#14532D] hover:text-[#14532D] transition-all"
                  onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register"
                  className="block w-full px-4 py-3 text-center bg-[#14532D] text-white rounded-xl font-semibold hover:bg-[#0f3d21] transition-all shadow-md"
                  onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}