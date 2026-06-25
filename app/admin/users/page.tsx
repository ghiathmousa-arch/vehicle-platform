'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import {
  Users,
  Plus,
  Search,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  }

  const filtered = users.filter((u) =>
    u.name.includes(search) ||
    u.email.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#8b5cf6' }}>
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  المستخدمين
                </h2>
                <p className="text-sm" style={{ color: '#64748b' }}>
                  إدارة حسابات المسؤولين
                </p>
              </div>
            </div>
            <Link
              href="/admin/users/new"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#8b5cf6' }}
            >
              <Plus className="w-4 h-4" />
              مستخدم جديد
            </Link>
          </div>

          {/* إحصائية */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f5f3ff' }}>
                <Users className="w-6 h-6" style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>{users.length}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>إجمالي المستخدمين</p>
              </div>
            </div>
            <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f5f3ff' }}>
                <Shield className="w-6 h-6" style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>مسؤول</p>
                <p className="text-sm" style={{ color: '#64748b' }}>نوع الحساب</p>
              </div>
            </div>
          </div>

          {/* البحث */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="بحث عن مستخدم..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-10 pl-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                style={{ borderColor: '#e2e8f0', backgroundColor: '#fff' }}
              />
            </div>
          </div>

          {/* قائمة المستخدمين */}
          {loading ? (
            <div className="text-center py-12" style={{ color: '#94a3b8' }}>
              جاري التحميل...
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border" style={{ color: '#94a3b8', backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
              لا يوجد مستخدمين
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 mb-6">
              {paginated.map((user) => {
                const avatarColor = getAvatarColor(user.name);
                const initials = getInitials(user.name);

                return (
                  <div
                    key={user.id}
                    className="rounded-2xl border p-5 transition hover:shadow-lg flex items-center gap-4"
                    style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </div>

                    {/* المعلومات */}
                    <div className="flex-1">
                      <p className="font-bold text-base" style={{ color: '#0f172a' }}>{user.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-sm" style={{ color: '#64748b' }}>
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1 text-sm" style={{ color: '#64748b' }}>
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>

                    {/* الأدوار */}
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                      <Shield className="w-3 h-3 inline ml-1" />
                      مسؤول
                    </div>

                    {/* الأزرار */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="p-2 rounded-lg transition hover:bg-gray-100"
                        style={{ color: '#06b6d4' }}
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                        className="p-2 rounded-lg transition hover:bg-violet-50"
                        style={{ color: '#8b5cf6' }}
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg transition hover:bg-red-50"
                        style={{ color: '#ef4444' }}
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                      backgroundColor: currentPage === page ? '#8b5cf6' : 'transparent',
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