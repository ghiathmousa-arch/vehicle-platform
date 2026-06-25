'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { AlertTriangle, Eye, CheckCircle, XCircle, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface TheftReport {
  id: string;
  reporterName: string;
  reporterPhone: string;
  stealDate: string;
  location: string | null;
  status: string;
  createdAt: string;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
  };
}

export default function TheftReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<TheftReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch('/api/admin/theft-reports');
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    if (!confirm(`هل أنت متأكد من ${newStatus === 'CONFIRMED' ? 'تأكيد' : 'رفض'} هذا البلاغ؟`)) return;

    try {
      const res = await fetch(`/api/admin/theft-reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchReports();
      } else {
        alert('حدث خطأ أثناء التحديث');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا البلاغ؟')) return;

    try {
      const res = await fetch(`/api/admin/theft-reports/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setReports(reports.filter((r) => r.id !== id));
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>قيد المراجعة</span>;
      case 'CONFIRMED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>مؤكد</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>مرفوض</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const filtered = reports.filter((r) =>
    r.vehicle.plateNumber.includes(search) ||
    r.reporterName.includes(search) ||
    r.reporterPhone.includes(search)
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
                  placeholder="بحث عن بلاغ..."
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
                بلاغات السرقة
              </h2>
              <Link
                href="/admin/theft-reports/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: '#ef4444' }}
              >
                <Plus className="w-4 h-4" />
                بلاغ جديد
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
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>المُبلّغ</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>تاريخ السرقة</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>الموقع</th>
                  <th className="px-6 py-4 text-sm font-medium" style={{ color: '#64748b' }}>الحالة</th>
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
                      لا توجد بلاغات
                    </td>
                  </tr>
                ) : (
                  paginated.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b transition hover:bg-gray-50"
                      style={{ borderColor: '#f1f5f9' }}
                    >
                      <td className="px-6 py-4 font-medium" style={{ color: '#0f172a' }}>
                        {report.vehicle.plateNumber}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {report.vehicle.brand} {report.vehicle.model}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{report.reporterName}</p>
                          <p className="text-xs" style={{ color: '#94a3b8' }}>{report.reporterPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {new Date(report.stealDate).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#64748b' }}>
                        {report.location || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {/* تأكيد */}
                          {report.status === 'PENDING' && (
                            <button
                              onClick={() => handleStatusChange(report.id, 'CONFIRMED')}
                              className="p-2 rounded-lg transition hover:bg-red-50"
                              style={{ color: '#dc2626' }}
                              title="تأكيد السرقة"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {/* رفض */}
                          {report.status === 'PENDING' && (
                            <button
                              onClick={() => handleStatusChange(report.id, 'REJECTED')}
                              className="p-2 rounded-lg transition hover:bg-green-50"
                              style={{ color: '#22c55e' }}
                              title="رفض البلاغ"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {/* عرض */}
                          <button
                            onClick={() => router.push(`/admin/theft-reports/${report.id}`)}
                            className="p-2 rounded-lg transition hover:bg-gray-100"
                            style={{ color: '#06b6d4' }}
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* حذف */}
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="p-2 rounded-lg transition hover:bg-red-50"
                            style={{ color: '#ef4444' }}
                            title="حذف"
                          >
                            <AlertTriangle className="w-4 h-4" />
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
                      backgroundColor: currentPage === page ? '#ef4444' : 'transparent',
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