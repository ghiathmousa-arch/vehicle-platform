'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import StatCard from '@/components/admin/StatCard';
import MonthlyChart from '@/components/admin/MonthlyChart';
import ExportButton from '@/components/admin/ExportButton';
import { Users, FileText, AlertTriangle, Car } from 'lucide-react';

// ✅ حط الـ type هون برّا الكومبوننت
type StatsData = {
  vehicles: number;
  users: number;
  pendingReports: number;
  violations: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="flex items-center justify-between mb-8">
            <ExportButton />
            <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              لوحة التحكم
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Car className="w-6 h-6" />}
              label="إجمالي المركبات"
              value={stats?.vehicles ?? 0}
              change="+5.2%"
              changeType="up"
              iconBg="#ecfeff"
              iconColor="#06b6d4"
              loading={loading}
            />
            <StatCard
              icon={<AlertTriangle className="w-6 h-6" />}
              label="بلاغات قيد المراجعة"
              value={stats?.pendingReports ?? 0}
              change="-2.1%"
              changeType="down"
              iconBg="#fef2f2"
              iconColor="#ef4444"
              loading={loading}
            />
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              label="المخالفات المسجلة"
              value={stats?.violations ?? 0}
              change="+8.4%"
              changeType="up"
              iconBg="#ecfeff"
              iconColor="#06b6d4"
              loading={loading}
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="المستخدمين النشطين"
              value={stats?.users ?? 0}
              change="+12.3%"
              changeType="up"
              iconBg="#ecfeff"
              iconColor="#06b6d4"
              loading={loading}
            />
          </div>

          <MonthlyChart />
        </main>
      </div>
    </div>
  );
}