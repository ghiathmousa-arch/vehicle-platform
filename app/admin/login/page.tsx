'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ');
        setLoading(false);
        return;
      }

      // ✅ نجاح! انتقل للـ Dashboard
      router.push('/admin/dashboard');

    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالخادم');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
      dir="rtl"
    >
      {/* الكرت الأبيض */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* الشعار */}
        <div
          style={{
            margin: '0 auto 1.5rem',
            width: '64px',
            height: '64px',
            backgroundColor: '#ecfeff',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4',
          }}
        >
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        {/* العناوين */}
        <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.4rem' }}>
          منصة إدارة بيانات المركبات
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.4rem' }}>
          تسجيل دخول المشرف
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 2rem' }}>
          أدخل بيانات حسابك للوصول إلى لوحة التحكم
        </p>

        {/* رسالة الخطأ */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.75rem',
              textAlign: 'right',
            }}
          >
            <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>{error}</span>
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'right' }}>

          {/* البريد الإلكتروني */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.5rem' }}>
              البريد الإلكتروني
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vehicles.gov.sa"
                dir="ltr"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#1e293b',
                }}
                onFocus={e => { e.target.style.borderColor = '#06b6d4'; e.target.style.backgroundColor = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
              />
              <div style={{ position: 'absolute', right: '14px', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                <Mail size={20} />
              </div>
            </div>
          </div>

          {/* كلمة المرور */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.5rem' }}>
              كلمة المرور
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', left: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0, zIndex: 1 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 3rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#1e293b',
                }}
                onFocus={e => { e.target.style.borderColor = '#06b6d4'; e.target.style.backgroundColor = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
              />
              <div style={{ position: 'absolute', right: '14px', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                <Lock size={20} />
              </div>
            </div>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#94a3b8' : '#0dd3c5',
              color: '#0f172a',
              fontWeight: '700',
              fontSize: '1.1rem',
              padding: '1rem',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.backgroundColor = '#0bc1b4')}
            onMouseOut={e => !loading && (e.currentTarget.style.backgroundColor = '#0dd3c5')}
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* العودة للصفحة الرئيسية */}
        <div style={{ marginTop: '2rem' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8', textDecoration: 'none' }}>
            العودة للصفحة الرئيسية
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
          </a>
        </div>

      </div>
    </div>
  );
}