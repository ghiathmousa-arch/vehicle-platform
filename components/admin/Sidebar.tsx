// app/components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  AlertTriangle,
  FileText,
  Wrench,
  Users,
  Settings,
  ChevronLeft,
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/vehicles', label: 'المركبات', icon: Car },
  { href: '/admin/theft-reports', label: 'بلاغات السرقة', icon: AlertTriangle },
  { href: '/admin/violations', label: 'المخالفات', icon: FileText },
  { href: '/admin/maintenance', label: 'التصليحات', icon: Wrench },
  { href: '/admin/users', label: 'المستخدمين', icon: Users },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="h-screen w-64 shrink-0 flex flex-col"
      style={{ backgroundColor: '#0b1121' }}
    >
      <div
        className="h-16 flex items-center gap-3 px-6"
        style={{ borderBottom: '1px solid #1e293b' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(34, 211, 238, 0.2)' }}
        >
          <LayoutDashboard className="w-5 h-5" style={{ color: '#22d3ee' }} />
        </div>
        <span className="font-bold text-base" style={{ color: '#ffffff' }}>
          لوحة التحكم
        </span>
      </div>

      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 mb-1"
              style={{
                backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                color: isActive ? '#22d3ee' : '#94a3b8',
                borderRight: isActive ? '2px solid #22d3ee' : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.5)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid #1e293b' }}>
        <button
          className="w-full flex items-center gap-3 px-3 py-2 transition"
          style={{ color: '#94a3b8' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">طي القائمة</span>
        </button>
      </div>
    </aside>
  );
}