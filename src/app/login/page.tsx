'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { TrustNetLogo } from '@/components/ui/TrustNetLogo';
import { authenticateRegisteredUser, saveUserData } from '@/lib/localStorageService';
import { saveUserSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = authenticateRegisteredUser(email, password);
    if (user) {
      const redirectUrl =
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'accountant' ? '/accountant/dashboard' :
        '/member/dashboard';
      saveUserSession({ name: user.name, email: user.email, role: user.role, redirect: redirectUrl });
      saveUserData({ id: user.id, name: user.name, email: user.email, phone: user.phone, joinedDate: user.joinedDate, totalSavings: user.totalSavings, lastUpdated: new Date().toISOString() });
      router.push(redirectUrl);
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <Link href="/landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', gap: 0 }}>
            <TrustNetLogo size={100} />
            <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: '-1px', margin: '6px 0 0 0' }}>
              <span style={{ color: '#111827' }}>Trust </span><span style={{ color: '#16A34A' }}>Nest</span>
            </h1>
          </Link>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Community Savings Platform</p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 40px rgba(0,0,0,0.08)', padding: '36px 36px 28px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required disabled={loading}
                  style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 11, paddingBottom: 11, border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fafafa', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#16A34A'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: '#16A34A', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required disabled={loading}
                  style={{ width: '100%', paddingLeft: 38, paddingRight: 42, paddingTop: 11, paddingBottom: 11, border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fafafa', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#16A34A'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#16A34A', cursor: 'pointer' }} />
              <span style={{ fontSize: 13, color: '#6b7280' }}>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#166534' : '#14532D', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(20,83,45,0.5)', transition: 'all 0.2s', marginTop: 4 }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#16A34A', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/landing" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
