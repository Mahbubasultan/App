'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Shield, ArrowRight, Phone } from 'lucide-react';
import { TrustNetLogo } from '@/components/ui/TrustNetLogo';
import { UserRole } from '@/types';
import { saveUserData, saveRegisteredUser } from '@/lib/localStorageService';
import { saveUserSession } from '@/lib/auth';

const ADMIN_REGISTRATION_SECRET = 'COMMUNITY_SAVINGS_ADMIN';

type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  adminCode: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'member',
    adminCode: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    } as RegisterFormData));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'admin' && formData.adminCode !== ADMIN_REGISTRATION_SECRET) {
      setError('Admin registration requires a valid admin access code.');
      return;
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      saveRegisteredUser({
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        joinedDate: new Date().toISOString(),
        totalSavings: 0,
        lastUpdated: new Date().toISOString(),
      });

      saveUserData({
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        joinedDate: new Date().toISOString(),
        totalSavings: 0,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        setError('An account with this email already exists. Please log in instead.');
      } else if (error instanceof Error && error.message.includes('full')) {
        setError('Storage is full. Please clear some data or try again later.');
      } else {
        setError('Failed to save your account. Please try again.');
      }
      return;
    }

    const redirectUrl =
      formData.role === 'admin'
        ? '/admin/dashboard'
        : formData.role === 'accountant'
        ? '/accountant/dashboard'
        : '/member/dashboard';

    saveUserSession({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      redirect: redirectUrl,
    });

    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo + Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <Link href="/landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', gap: 0 }}>
            <TrustNetLogo size={100} />
            <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: '-1px', margin: '6px 0 0 0' }}>
              <span style={{ color: '#111827' }}>Trust</span><span style={{ color: '#16A34A' }}>Net</span>
            </h1>
          </Link>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Community Savings Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-6">Join our community savings platform</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+250 123 456 789"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select name="role" value={formData.role} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent appearance-none bg-white">
                  <option value="member">Member</option>
                  <option value="accountant">Accountant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {formData.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Access Code</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" name="adminCode" value={formData.adminCode} onChange={handleChange} placeholder="Enter admin access code"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent" required />
                </div>
              </div>
            )}

            <button type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#14532D] text-white rounded-lg font-semibold hover:bg-[#0f3d21] transition-all active:scale-95">
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-[#14532D] font-semibold hover:underline">Login here</Link>
          </p>
        </div>

        <p className="mt-4 text-center">
          <Link href="/landing" className="text-xs text-gray-400 hover:text-[#14532D] transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
