'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { authenticateRegisteredUser, saveUserData } from '@/lib/localStorageService';
import { saveUserSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = authenticateRegisteredUser(email, password);

    if (user) {
      const redirectUrl =
        user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'accountant'
          ? '/accountant/dashboard'
          : '/member/dashboard';

      saveUserSession({
        name: user.name,
        email: user.email,
        role: user.role,
        redirect: redirectUrl,
      });

      saveUserData({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        joinedDate: user.joinedDate,
        totalSavings: user.totalSavings,
        lastUpdated: new Date().toISOString(),
      });

      router.push(redirectUrl);
    } else {
      setError('Invalid email or password. Please register or try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/landing" className="hover:opacity-90 transition-opacity">
            <img src="/images/trust-nest-logo.png" alt="Trust Nest" style={{ width: 220, height: 220 }} className="object-contain" />
          </Link>
          <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#000000' }}>Trust</span><span style={{ color: '#16A34A' }}>Nest</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Community Savings Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-6">Login to access your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent transition-all"
                  required disabled={loading} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent transition-all"
                  required disabled={loading} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#14532D] text-white rounded-lg font-semibold hover:bg-[#0f3d21] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (<><Loader2 size={18} className="animate-spin" /> Logging in...</>) : (<>Login <ArrowRight size={18} /></>)}
            </button>
          </form>

          <div className="mt-5 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Demo Credentials</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><strong>Admin:</strong> admin@gmail.com / 123456</p>
              <p><strong>Member:</strong> member@gmail.com / 123456</p>
              <p><strong>Accountant:</strong> accountant@gmail.com / 123456</p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#14532D] font-semibold hover:underline">Register here</Link>
          </p>
        </div>

        <p className="mt-4 text-center">
          <Link href="/landing" className="text-xs text-gray-400 hover:text-[#14532D] transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
