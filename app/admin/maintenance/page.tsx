'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import {
  Wrench,
  Plus,
  Search,
  Calendar,
  DollarSign,
  MapPin,
  Car,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Filter,
  Settings
} from 'lucide-react';

interface Maintenance {
  id: string;
  type: string;
  description: string | null;
  date: string;
  cost: number;
  workshop: string;
  createdAt: string;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    color: string | null;
  };
}

export default function MaintenancePage() {
  const router = useRouter();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setMounted(true);
    fetchMaintenances();
  }, []);

  async function fetchMaintenances() {
    try {
      const res = await fetch('/api/admin/maintenance');
      const data = await res.json();
      setMaintenances(data.maintenances || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا التصليح؟')) return;

    try {
      const res = await fetch(`/api/admin/maintenance/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMaintenances(maintenances.filter((m) => m.id !== id));
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  }

  // إحصائيات — نستخدم 'en-US' لتجنب Hydration mismatch
  const totalCost = maintenances.reduce((sum, m) => sum + m.cost, 0);
  const totalCount = maintenances.length;
  const avgCost = totalCount > 0 ? totalCost / totalCount : 0;

  // أنواع التصليحات الفريدة
  const types = ['all', ...new Set(maintenances.map(m => m.type))];

  const filtered = maintenances.filter((m) => {
    const matchesSearch =
      m.vehicle.plateNumber.includes(search) ||
      m.type.includes(search) ||
      m.workshop.includes(search);
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  const getTypeIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('محرك') || typeLower.includes('engine')) return <Settings className="w-6 h-6" />;
    if (typeLower.includes('فرامل') || typeLower.includes('brake')) return <Settings className="w-6 h-6" />;
    if (typeLower.includes('زيت') || typeLower.includes('oil')) return <Wrench className="w-6 h-6" />;
    return <Wrench className="w-6 h-6" />;
  };

  const getTypeColor = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('محرك') || typeLower.includes('engine')) return { bg: '#fef2f2', text: '#dc2626', icon: '#ef4444' };
    if (typeLower.includes('فرامل') || typeLower.includes('brake')) return { bg: '#fffbeb', text: '#d97706', icon: '#f59e0b' };
    if (typeLower.includes('زيت') || typeLower.includes('oil')) return { bg: '#f0fdf4', text: '#16a34a', icon: '#22c55e' };
    return { bg: '#f0f9ff', text: '#0284c7', icon: '#0ea5e9' };
  };

  // دالة تنسيق الأرقام — نستخدم 'en-US' لتجنب Hydration mismatch
  const formatNumber = (num: number) => {
    if (!mounted) return num.toString(); // قبل mount نرجع رقم عادي
    return num.toLocaleString('en-US');
  };

  // دالة تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!mounted) return dateString; // قبل mount نرجع النص الأصلي
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          {/* العنوان */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#22c55e' }}>
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  التصليحات
                </h2>
                <p className="text-sm" style={{ color: '#64748b' }}>
                  إدارة صيانة وإصلاح المركبات
                </p>
              </div>
            </div>
            <Link
              href="/admin/maintenance/new"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#22c55e' }}
            >
              <Plus className="w-4 h-4" />
              تصليح جديد
            </Link>
          </div>

          {/* كروت الإحصائيات */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                <Wrench className="w-6 h-6" style={{ color: '#22c55e' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>{totalCount}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>إجمالي التصليحات</p>
              </div>
            </div>
            <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#22c55e' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  {formatNumber(totalCost)} <span className="text-sm font-normal">ل.س</span>
                </p>
                <p className="text-sm" style={{ color: '#64748b' }}>إجمالي التكاليف</p>
              </div>
            </div>
            <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#22c55e' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  {formatNumber(Math.round(avgCost))} <span className="text-sm font-normal">ل.س</span>
                </p>
                <p className="text-sm" style={{ color: '#64748b' }}>متوسط التكلفة</p>
              </div>
            </div>
          </div>

          {/* البحث والفلترة */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="بحث عن تصليح..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-10 pl-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }}
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }}>
              <Filter className="w-4 h-4" style={{ color: '#64748b' }} />
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm focus:outline-none"
                style={{ color: '#374151' }}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'جميع الأنواع' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* شبكة الكروت */}
          {loading ? (
            <div className="text-center py-12" style={{ color: '#94a3b8' }}>
              جاري التحميل...
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border" style={{ color: '#94a3b8', backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <Wrench className="w-12 h-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
              لا توجد تصليحات
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {paginated.map((maintenance) => {
                const colors = getTypeColor(maintenance.type);
                return (
                  <div
                    key={maintenance.id}
                    className="rounded-2xl border p-5 transition hover:shadow-lg"
                    style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}
                  >
                    {/* الرأس: الأيقونة + النوع + التاريخ */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: colors.bg, color: colors.icon }}
                        >
                          {getTypeIcon(maintenance.type)}
                        </div>
                        <div>
                          <p className="font-bold text-base" style={{ color: '#0f172a' }}>{maintenance.type}</p>
                          <p className="text-sm" style={{ color: '#64748b' }}>
                            <Calendar className="w-3 h-3 inline ml-1" />
                            {formatDate(maintenance.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-xl font-bold" style={{ color: '#22c55e' }}>
                          {formatNumber(maintenance.cost)} <span className="text-xs">ل.س</span>
                        </p>
                      </div>
                    </div>

                    {/* معلومات المركبة */}
                    <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ backgroundColor: '#f8fafc' }}>
                      <Car className="w-4 h-4" style={{ color: '#64748b' }} />
                      <p className="text-sm font-medium" style={{ color: '#0f172a' }}>
                        {maintenance.vehicle.brand} {maintenance.vehicle.model}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
                        {maintenance.vehicle.plateNumber}
                      </span>
                    </div>

                    {/* الوصف */}
                    {maintenance.description && (
                      <p className="text-sm mb-3 line-clamp-2 px-1" style={{ color: '#64748b' }}>
                        {maintenance.description}
                      </p>
                    )}

                    {/* التذييل: الورشة + الأزرار */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#f1f5f9' }}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" style={{ color: '#94a3b8' }} />
                        <span className="text-sm" style={{ color: '#64748b' }}>{maintenance.workshop}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/admin/maintenance/${maintenance.id}`)}
                          className="p-2 rounded-lg transition hover:bg-gray-100"
                          style={{ color: '#06b6d4' }}
                          title="عرض"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/maintenance/${maintenance.id}/edit`)}
                          className="p-2 rounded-lg transition hover:bg-green-50"
                          style={{ color: '#22c55e' }}
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(maintenance.id)}
                          className="p-2 rounded-lg transition hover:bg-red-50"
                          style={{ color: '#ef4444' }}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && paginated.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 rounded-2xl border" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <p className="text-sm" style={{ color: '#64748b' }}>
                عرض {start + 1} إلى {Math.min(start + itemsPerPage, filtered.length)} من {filtered.length} نتيجة
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border transition disabled:opacity-30 hover:bg-gray-50"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <ChevronRight className="w-4 h-4" style={{ color: '#64748b' }} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition"
                    style={{
                      backgroundColor: currentPage === page ? '#22c55e' : 'transparent',
                      color: currentPage === page ? '#fff' : '#64748b',
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border transition disabled:opacity-30 hover:bg-gray-50"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: '#64748b' }} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}