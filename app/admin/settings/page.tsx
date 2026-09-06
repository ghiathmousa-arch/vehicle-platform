'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import {
  Settings,
  Save,
  Globe,
  Bell,
  Moon,
  Sun,
  Database,
  Shield,
  Palette,
  CheckCircle,
  AlertTriangle,
  Type,
  Hash,
  RotateCcw,
  Trash2
} from 'lucide-react';

interface AppSettings {
  siteName: string;
  siteDescription: string;
  itemsPerPage: number;
  currency: string;
  dateFormat: string;
  enableNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState < AppSettings > ({
    siteName: 'نظام إدارة المركبات',
    siteDescription: 'نظام متكامل لإدارة المركبات والمخالفات والبلاغات',
    itemsPerPage: 10,
    currency: 'ل.س',
    dateFormat: 'ar-SA',
    enableNotifications: true,
    darkMode: false,
    language: 'ar',
  });

  // تحميل الإعدادات من قاعدة البيانات
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.settings && setSettings(data.settings))
      .catch((e) => console.error('Error loading settings:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'تعذّر الحفظ');

      setSettings(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/settings', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'تعذّرت إعادة التعيين');

      setSettings(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حدث خطأ أثناء إعادة التعيين');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition";
  const labelClass = "block text-sm font-medium mb-2 flex items-center gap-2";

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-3xl mx-auto">
            {/* العنوان */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#64748b' }}>
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                    الإعدادات
                  </h2>
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    تخصيص النظام حسب احتياجاتك
                  </p>
                </div>
              </div>
            </div>

            {/* رسالة نجاح */}
            {saved && (
              <div className="rounded-2xl border p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                <p className="text-sm font-medium" style={{ color: '#166534' }}>
                  تم حفظ الإعدادات بنجاح!
                </p>
              </div>
            )}

            {/* رسالة خطأ */}
            {error && (
              <div className="rounded-2xl border p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
                <p className="text-sm font-medium" style={{ color: '#b91c1c' }}>
                  {error}
                </p>
              </div>
            )}

            {/* إعدادات الموقع */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <Globe className="w-5 h-5" style={{ color: '#64748b' }} />
                إعدادات الموقع
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Type className="w-4 h-4" style={{ color: '#64748b' }} />
                    اسم الموقع
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Type className="w-4 h-4" style={{ color: '#64748b' }} />
                    وصف الموقع
                  </label>
                  <textarea
                    rows={3}
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
              </div>
            </div>

            {/* إعدادات العرض */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <Palette className="w-5 h-5" style={{ color: '#64748b' }} />
                إعدادات العرض
              </h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Hash className="w-4 h-4" style={{ color: '#64748b' }} />
                    عدد العناصر بالصفحة
                  </label>
                  <select
                    value={settings.itemsPerPage}
                    onChange={(e) => setSettings({ ...settings, itemsPerPage: parseInt(e.target.value) })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Database className="w-4 h-4" style={{ color: '#64748b' }} />
                    العملة
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <option value="ل.س">ليرة سورية (ل.س)</option>
                    <option value="$">دولار أمريكي ($)</option>
                    <option value="€">يورو (€)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Globe className="w-4 h-4" style={{ color: '#64748b' }} />
                    تنسيق التاريخ
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <option value="ar-SA">عربي (هجري/ميلادي)</option>
                    <option value="en-US">إنجليزي (ميلادي)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Globe className="w-4 h-4" style={{ color: '#64748b' }} />
                    اللغة
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* إعدادات متقدمة */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <Shield className="w-5 h-5" style={{ color: '#64748b' }} />
                إعدادات متقدمة
              </h3>
              <div className="space-y-4">
                {/* تفعيل الإشعارات */}
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" style={{ color: '#64748b' }} />
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#0f172a' }}>تفعيل الإشعارات</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>إشعارات بالبلاغات والمخالفات الجديدة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                    className={`w-12 h-6 rounded-full transition relative ${settings.enableNotifications ? 'bg-violet-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings.enableNotifications ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* الوضع المظلم */}
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="flex items-center gap-3">
                    {settings.darkMode ? (
                      <Moon className="w-5 h-5" style={{ color: '#64748b' }} />
                    ) : (
                      <Sun className="w-5 h-5" style={{ color: '#64748b' }} />
                    )}
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#0f172a' }}>الوضع المظلم</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>تفعيل الوضع المظلم للوحة التحكم</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                    className={`w-12 h-6 rounded-full transition relative ${settings.darkMode ? 'bg-violet-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings.darkMode ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* أزرار الحفظ */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition hover:bg-red-50"
                style={{ color: '#ef4444', border: '1px solid #fecaca' }}
              >
                <RotateCcw className="w-4 h-4" />
                إعادة تعيين
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 shadow-lg"
                style={{ backgroundColor: '#64748b' }}
              >
                <Save className="w-4 h-4" />
                {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}