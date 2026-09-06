// app/components/admin/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setAdmin(data.admin))
      .catch(() => {});
  }, []);

  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/admin/vehicles?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 bg-white"
      style={{ borderBottom: '1px solid #e2e8f0' }}
    >
      <div>
        <h1 className="text-lg font-bold" style={{ color: '#0f172a' }}>
          لوحة التحكم
        </h1>
        <p className="text-xs" style={{ color: '#64748b' }}>
          نظرة عامة على النظام
        </p>
      </div>

      <div className="flex items-center gap-3">
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center rounded-xl px-4 py-2 gap-2"
          style={{ backgroundColor: '#f1f5f9' }}
        >
          <button type="submit" aria-label="بحث" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
            <Search className="w-4 h-4" style={{ color: '#94a3b8' }} />
          </button>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مركبة..."
            className="bg-transparent border-none outline-none text-sm placeholder-gray-400"
            style={{ width: '12rem', color: '#334155' }}
          />
        </form>

        <button
          className="relative p-2 rounded-xl transition"
          style={{ color: '#64748b' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white"
            style={{ backgroundColor: '#ef4444' }}
          />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl transition"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ecfeff' }}
            >
              <User className="w-4 h-4" style={{ color: '#0891b2' }} />
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-tight" style={{ color: '#0f172a' }}>
                {admin?.name ?? '...'}
              </p>
              <p className="text-xs leading-tight" style={{ color: '#64748b' }}>
                {admin?.email ?? 'مشرف'}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
              style={{ color: '#94a3b8' }}
            />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div
                className="absolute left-0 top-full mt-2 w-48 rounded-xl shadow-lg py-2 z-50 bg-white"
                style={{ border: '1px solid #e2e8f0' }}
              >
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition text-right"
                  style={{ color: '#334155' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <User className="w-4 h-4" />
                  الملف الشخصي
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition text-right"
                  style={{ color: '#dc2626' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}