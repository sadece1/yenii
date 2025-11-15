import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { routes } from '@/config';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  badge?: string | boolean;
}

interface MenuGroup {
  title: string;
  icon: string;
  items: MenuItem[];
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['Genel']);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      // On mobile, start with sidebar closed
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(routes.home);
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showNotifications && !target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Aktif sayfanın grubunu otomatik aç
  useEffect(() => {
    menuGroups.forEach(group => {
      const hasActiveItem = group.items.some(item => isActive(item.path));
      if (hasActiveItem && !openGroups.includes(group.title)) {
        setOpenGroups(prev => [...prev, group.title]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const menuGroups: MenuGroup[] = [
    {
      title: 'Genel',
      icon: '📊',
      items: [
        { path: routes.admin, label: 'Dashboard', icon: '🏠', badge: unreadCount > 0 ? String(unreadCount) : undefined },
        { path: routes.adminAnalytics, label: 'Analytics', icon: '📈' },
      ]
    },
    {
      title: 'İçerik Yönetimi',
      icon: '📦',
      items: [
        { path: routes.adminGear, label: 'Ürünler', icon: '🎒' },
        { path: routes.adminBlogs, label: 'Bloglar', icon: '📝' },
      ]
    },
    {
      title: 'Ürün Ayarları',
      icon: '⚙️',
      items: [
        { path: routes.adminCategories, label: 'Kategoriler', icon: '🏷️' },
        { path: routes.adminBrands, label: 'Markalar', icon: '🏭' },
        { path: routes.adminColors, label: 'Renkler', icon: '🎨' },
      ]
    },
    {
      title: 'Referanslar',
      icon: '🏆',
      items: [
        { path: routes.adminReferenceBrands, label: 'Referans Markalar', icon: '🏆' },
        { path: routes.adminReferenceImages, label: 'Referans Resimler', icon: '🖼️' },
      ]
    },
    {
      title: 'Kullanıcı İşlemleri',
      icon: '👥',
      items: [
        { path: routes.adminUsers, label: 'Kullanıcılar', icon: '👥' },
        { path: routes.adminUserOrders, label: 'Siparişler', icon: '📦' },
        { path: routes.adminReviews, label: 'Değerlendirmeler', icon: '⭐', badge: 'Yeni' },
      ]
    },
    {
      title: 'İletişim',
      icon: '💬',
      items: [
        { path: routes.adminMessages, label: 'Mesajlar', icon: '💬' },
        { path: routes.adminAppointments, label: 'Randevular', icon: '📅' },
        { path: routes.adminNewsletters, label: 'Bülten', icon: '📧' },
      ]
    },
    {
      title: 'Ayarlar',
      icon: '🔧',
      items: [
        { path: routes.adminChangePassword, label: 'Şifre Değiştir', icon: '🔒' },
      ]
    },
  ];

  const isActive = (path: string) => {
    if (path === routes.admin) {
      return location.pathname === routes.admin;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-x-hidden w-full max-w-full">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : (isMobile ? -280 : -250)
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg ${
          isMobile ? 'z-40' : 'z-30'
        } ${
          isMobile ? 'w-72' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to={routes.admin} className="flex items-center space-x-2">
              <span className="text-2xl">🌲</span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-3">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{group.icon}</span>
                    <span className="text-sm font-bold uppercase tracking-wide">{group.title}</span>
                  </div>
                  <span className="text-xs">
                    {openGroups.includes(group.title) ? '▼' : '▶'}
                  </span>
                </button>

                {/* Group Items */}
                <AnimatePresence>
                  {openGroups.includes(group.title) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => isMobile && setIsSidebarOpen(false)}
                          className={`flex items-center justify-between px-4 py-2.5 ml-3 rounded-lg transition-colors ${
                            isActive(item.path)
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium text-sm">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${
                              typeof item.badge === 'number' || !isNaN(Number(item.badge))
                                ? 'bg-red-500'
                                : 'bg-green-500'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              <span>🚪</span>
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 w-full max-w-full overflow-x-hidden ${
        isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-0')
      }`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-2xl sm:text-xl"
            >
              ☰
            </button>
            <div className="flex items-center space-x-4">
              {/* Notifications Dropdown */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-2xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-w-[calc(100vw-2rem)]"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Bildirimler
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Tümünü Okundu İşaretle
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <Link
                              key={notification.id}
                              to={notification.link}
                              onClick={() => {
                                markAsRead(notification.id);
                                setShowNotifications(false);
                              }}
                              className={`block px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">
                                  {notification.type === 'message' && '💬'}
                                  {notification.type === 'appointment' && '📅'}
                                  {notification.type === 'order' && '📦'}
                                  {notification.type === 'review' && '⭐'}
                                  {notification.type === 'user' && '👤'}
                                  {notification.type === 'newsletter' && '📧'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    {notification.description}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {new Date(notification.createdAt).toLocaleString('tr-TR')}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            <span className="text-4xl mb-2 block">🔕</span>
                            <p>Henüz bildirim yok</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to={routes.home}
                className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Siteye Dön
              </Link>
              <Link
                to={routes.home}
                className="sm:hidden text-xl"
                title="Siteye Dön"
              >
                🏠
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

