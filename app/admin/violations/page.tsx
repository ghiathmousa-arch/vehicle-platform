'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { FileText, Eye, Edit, Trash2, Search, Plus, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

interface Violation {
  id: string;
  type: string;
  amount: number;
  date: string;
  location: string;
  isPaid: boolean;
  createdAt: string;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
  };
}

export default function ViolationsPage() {
  const router = useRouter();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchViolations();
  }, []);

  async function fetchViolations() {
    try {
      const res = await fetch('/api/admin/violations');
      const data = await res.json();
      setViolations(data.violations || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه المخالفة؟')) return;

    try {
      const res = await fetch(`/api/admin/violations/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setViolations(violations.filter((v) => v.id !== id));
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  }

  async function togglePaid(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/violations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: !currentStatus }),
      });

      if (res.ok) {
        fetchViolations();
      } else {
        alert('حدث خطأ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ');
    }
  }

  const getStatusBadge = (isPaid: boolean) => {
    if (isPaid) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>مدفوعة</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>غير مدفوعة</span>;
  };

  const filtered = violations.filter((v) =>
    v.vehicle.plateNumber.includes(search) ||
    v.type.includes(search) ||
    v.location.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

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
                  placeholder="بحث عن مخالفة..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pr-10 pl-4 py-2.5 rounded-xl border text-sm w-64 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                المخالفات
              </h2>
              <Link
                href="/admin/violations/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: '#f59e0b' }}
              >
                <Plus className="w-4 h-4" />
                مخالفة جديدة
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
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>نوع المخالفة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>القيمة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>التاريخ</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>الموقع</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>الحالة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12" style={{ color: '#94a3b8' }}>
                      جاري التحميل...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12" style={{ color: '#94a3b8' }}>
                      لا توجد مخالفات
                    </td>
                  </tr>
                ) : (
                  paginated.map((violation) => (
                    <tr
                      key={violation.id}
                      className="border-b transition hover:bg-gray-50"
                      style={{ borderColor: '#f1f5f9' }}
                    >
                      <td className="px-6 py-4 font-medium" style={{ color: '#0f172a' }}>
                        {violation.vehicle.plateNumber}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {violation.vehicle.brand} {violation.vehicle.model}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#0f172a' }}>
                        {violation.type}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: '#0f172a' }}>
                        {violation.amount.toLocaleString()} ل.س
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {new Date(violation.date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {violation.location}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePaid(violation.id, violation.isPaid)}
                          className="cursor-pointer"
                          title={violation.isPaid ? 'تحديد كغير مدفوعة' : 'تحديد كمدفوعة'}
                        >
                          {getStatusBadge(violation.isPaid)}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => router.push(`/admin/violations/${violation.id}`)}
                            className="p-2 rounded-lg transition hover:bg-gray-100"
                            style={{ color: '#06b6d4' }}
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/violations/${violation.id}/edit`)}
                            className="p-2 rounded-lg transition hover:bg-gray-100"
                            style={{ color: '#06b6d4' }}
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(violation.id)}
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
                      backgroundColor: currentPage === page ? '#f59e0b' : 'transparent',
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