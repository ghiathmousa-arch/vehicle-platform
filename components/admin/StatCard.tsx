'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down';
  iconBg?: string;
  iconColor?: string;
  loading?: boolean;
}

export default function StatCard({
  icon,
  label,
  value,
  change,
  changeType = 'up',
  iconBg = '#ecfeff',
  iconColor = '#06b6d4',
  loading = false,
}: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-6 border shadow-sm"
      style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}
    >
      <div className="flex items-start justify-between">
        {change && (
          <span
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: changeType === 'up' ? '#06b6d4' : '#ef4444' }}
          >
            {change}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {changeType === 'up' ? (
                <path d="M18 15l-6-6-6 6" />
              ) : (
                <path d="M6 9l6 6 6-6" />
              )}
            </svg>
          </span>
        )}

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
      </div>

      <div className="mt-4 text-right">
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold" style={{ color: '#0f172a' }}>
            {/* ✅ شيلنا 'ar-SA' */}
            {typeof value === 'number' ? value.toLocaleString('en-US') : value}
          </p>
        )}
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          {label}
        </p>
      </div>
    </div>
  );
}