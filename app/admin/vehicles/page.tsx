'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { Car, Plus, Edit, Trash2, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string | null;
  status: string;
  ownerships: {
    owner: {
      name: string;
    };
  }[];
  _count?: {
    violations: number;
    maintenances: number;
  };
}

function VehiclesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchVehicles();
  }, []);

  // مزامنة البحث مع الرابط عند القدوم من بحث الشريط العلوي
  useEffect(() => {
    setSearch(searchParams.get('q') ?? '');
    setCurrentPage(1);
  }, [searchParams]);

  async function fetchVehicles() {
    try {
      const res = await fetch('/api/admin/vehicles');
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه المركبة؟')) return;

    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setVehicles(vehicles.filter((v) => v.id !== id));
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  }

  const filtered = vehicles.filter((v) =>
    v.plateNumber.includes(search) ||
    v.brand.includes(search) ||
    v.model.includes(search) ||
    v.ownerships[0]?.owner?.name?.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#ecfeff', color: '#0891b2' }}>ساري</span>;
      case 'STOLEN':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>مسروقة</span>;
      case 'EXPIRED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>منتهية</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getInsuranceBadge = (vehicle: Vehicle) => {
    // بسيط - ممكن نحسنه لاحقاً
    return <span className="text-sm" style={{ color: '#64748b' }}>لا يوجد</span>;
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          {/* العنوان + البحث + إضافة */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="بحث عن مركبة..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pr-10 pl-4 py-2.5 rounded-xl border text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                المركبات
              </h2>
              <Link
                href="/admin/vehicles/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: '#06b6d4' }}
              >
                <Plus className="w-4 h-4" />
                إضافة مركبة
              </Link>
            </div>
          </div>

          {/* الجدول */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
            <table className="w-full text-right">
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr className="border-b" style={{ borderColor: '#e2e8f0' }}>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>رقم اللوحة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>المركبة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>السنة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>المالك</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>التأمين</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>بلاغ سرقة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12" style={{ color: '#94a3b8' }}>
                      جاري التحميل...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12" style={{ color: '#94a3b8' }}>
                      لا توجد مركبات
                    </td>
                  </tr>
                ) : (
                  paginated.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-b transition hover:bg-gray-50"
                      style={{ borderColor: '#f1f5f9' }}
                    >
                      <td className="px-6 py-4 font-medium" style={{ color: '#0f172a' }}>
                        {vehicle.plateNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ecfeff' }}>
                            <Car className="w-5 h-5" style={{ color: '#06b6d4' }} />
                          </div>
                          <div>
                            <p className="font-medium text-sm" style={{ color: '#0f172a' }}>{vehicle.brand} {vehicle.model}</p>
                            <p className="text-xs" style={{ color: '#94a3b8' }}>{vehicle.color || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {vehicle.year}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {vehicle.ownerships[0]?.owner?.name || 'غير معروف'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(vehicle.status)}
                      </td>
                      <td className="px-6 py-4">
                        {getInsuranceBadge(vehicle)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => router.push(`/admin/vehicles/${vehicle.id}`)}
                            className="p-2 rounded-lg transition hover:bg-gray-100"
                            style={{ color: '#06b6d4' }}
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)}
                            className="p-2 rounded-lg transition hover:bg-gray-100"
                            style={{ color: '#06b6d4' }}
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-2 rounded-lg transition hover:bg-red-50"
                            style={{ color: '#ef4444' }}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: '#f1f5f9' }}>
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
                      backgroundColor: currentPage === page ? '#06b6d4' : 'transparent',
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={null}>
      <VehiclesPageContent />
    </Suspense>
  );
}
