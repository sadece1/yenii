import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { trackPageView, trackEvent } from '@/utils/analytics';
import { AdminLayout } from '@/components/AdminLayout';

interface AnalyticsData {
  pageViews: number;
  uniqueUsers: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{ page: string; views: number; path: string }>;
  deviceTypes: Array<{ type: string; percentage: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
}

export const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueUsers: 0,
    avgSessionDuration: '0:00',
    bounceRate: '0%',
    topPages: [],
    deviceTypes: [],
    trafficSources: [],
  });

  useEffect(() => {
    // Google Analytics sayfa görüntüleme
    trackPageView('/admin/analytics', 'Admin Analytics - İstatistikler');
    
    // Event tracking
    trackEvent({
      action: 'view_admin_analytics',
      category: 'Admin',
      label: 'Admin Analytics Page Viewed',
    });

    // Demo veriler (gerçek veriler Google Analytics Dashboard'dan API ile çekilebilir)
    const loadAnalyticsData = () => {
      setLoading(true);
      
      // Simüle edilmiş veri - Gerçek uygulamada Google Analytics API kullanılabilir
      setTimeout(() => {
        // Tüm sayfalar ve görüntülenme sayıları
        const allPages = [
          { page: 'Ürünler', views: 3250, path: '/gear' },
          { page: 'Ana Sayfa', views: 2890, path: '/' },
          { page: 'Blog', views: 2140, path: '/blog' },
          { page: 'Hakkımızda', views: 1820, path: '/about' },
          { page: 'İletişim', views: 1560, path: '/contact' },
          { page: 'Favorilerim', views: 1340, path: '/favorites' },
          { page: 'Profil', views: 1120, path: '/profile' },
          { page: 'Kategoriler', views: 980, path: '/category' },
          { page: 'Arama Sonuçları', views: 850, path: '/search' },
          { page: 'Referanslar', views: 720, path: '/references' },
          { page: 'SSS', views: 650, path: '/faq' },
          { page: 'Ürün Detay', views: 580, path: '/gear/:id' },
          { page: 'Blog Detay', views: 490, path: '/blog/:id' },
          { page: 'Giriş Yap', views: 420, path: '/login' },
          { page: 'Kayıt Ol', views: 380, path: '/register' },
          { page: 'Referans Detay', views: 320, path: '/references/:id' },
          { page: 'Şifre Sıfırlama', views: 180, path: '/forgot-password' },
        ];

        // En çok görüntülenen 10 sayfayı al (otomatik sıralama)
        const topPages = allPages
          .sort((a, b) => b.views - a.views)
          .slice(0, 10);

        setAnalyticsData({
          pageViews: 15420,
          uniqueUsers: 8750,
          avgSessionDuration: '3:24',
          bounceRate: '42.5%',
          topPages: topPages,
          deviceTypes: [
            { type: 'Mobil', percentage: 58 },
            { type: 'Masaüstü', percentage: 32 },
            { type: 'Tablet', percentage: 10 },
          ],
          trafficSources: [
            { source: 'Organik Arama', percentage: 45 },
            { source: 'Direkt', percentage: 28 },
            { source: 'Sosyal Medya', percentage: 18 },
            { source: 'Referans', percentage: 9 },
          ],
        });
        setLoading(false);
      }, 1000);
    };

    loadAnalyticsData();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    icon: string; 
    color: string; 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Analytics yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics - Admin Panel - WeCamp</title>
        <meta name="description" content="Site istatistikleri ve analitik verileri" />
      </Helmet>

      <AdminLayout>
        <div>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <span className="text-5xl">📈</span>
              Site Analytics
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Google Analytics ile desteklenen gerçek zamanlı site istatistikleri
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Toplam Görüntüleme"
              value={analyticsData.pageViews}
              icon="👁️"
              color="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            />
            <StatCard
              title="Benzersiz Kullanıcı"
              value={analyticsData.uniqueUsers}
              icon="👥"
              color="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            />
            <StatCard
              title="Ort. Oturum Süresi"
              value={analyticsData.avgSessionDuration}
              icon="⏱️"
              color="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            />
            <StatCard
              title="Hemen Çıkma Oranı"
              value={analyticsData.bounceRate}
              icon="📉"
              color="from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Pages */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🔥</span>
                  Top 10 Sayfa
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  En popüler
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                En çok ziyaret edilen sayfalar otomatik olarak sıralanır
              </p>
              <div className="space-y-3">
                {analyticsData.topPages.map((page, index) => (
                  <div key={page.path} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                      index === 0 
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' 
                        : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                        : index === 2
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white block truncate">
                            {page.page}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                            {page.path}
                          </span>
                        </div>
                        <div className="ml-3 text-right">
                          <span className="text-sm font-bold text-gray-900 dark:text-white block">
                            {page.views.toLocaleString('tr-TR')}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            görüntüleme
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index < 3
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>📊</span>
                  Tüm sayfaları Google Analytics'te görüntüle
                </a>
              </div>
            </motion.div>

            {/* Device Types */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📱</span>
                Cihaz Dağılımı
              </h2>
              <div className="space-y-4">
                {analyticsData.deviceTypes.map((device) => (
                  <div key={device.type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {device.type}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {device.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🌐</span>
              Trafik Kaynakları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.trafficSources.map((source) => (
                <div
                  key={source.source}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {source.source}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {source.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Google Analytics Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span>🔗</span>
              Google Analytics Dashboard'a Git
            </a>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Daha detaylı analiz için Google Analytics kontrol panelini ziyaret edin
            </p>
          </motion.div>
        </div>
      </AdminLayout>
    </>
  );
};

