import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { AdminLayout } from '@/components/AdminLayout';
import { routes } from '@/config';
import { useGearStore } from '@/store/gearStore';
import { useBlogStore } from '@/store/blogStore';
import { useMessageStore } from '@/store/messageStore';
import { useNewsletterStore } from '@/store/newsletterStore';
import { useAppointmentStore } from '@/store/appointmentStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useNotificationStore } from '@/store/notificationStore';

export const AdminDashboard = () => {
  const { gear, total: gearTotal, fetchGear, isLoading: gearLoading } = useGearStore();
  const { blogs, total: blogsTotal, fetchBlogs, isLoading: blogsLoading } = useBlogStore();
  const { messages, total: messagesTotal, fetchMessages, isLoading: messagesLoading } = useMessageStore();
  const { subscriptions, total: newslettersTotal, fetchSubscriptions, isLoading: newslettersLoading } = useNewsletterStore();
  const { appointments, total: appointmentsTotal, fetchAppointments, isLoading: appointmentsLoading } = useAppointmentStore();
  const { addNotification } = useNotificationStore();

  // Track previous counts to detect new items
  const prevCounts = useRef({
    messages: 0,
    appointments: 0,
    newsletters: 0,
    initialized: false,
  });

  useEffect(() => {
    // Dashboard için tüm ürünleri çekmek için büyük bir limit kullan
    fetchGear({}, 1, 10000);
    fetchBlogs({}, 1);
    fetchMessages(1);
    fetchSubscriptions(1);
    fetchAppointments(1);
  }, [fetchGear, fetchBlogs, fetchMessages, fetchSubscriptions, fetchAppointments]);

  // Watch for new activities and add notifications
  useEffect(() => {
    // Skip on initial load
    if (!prevCounts.current.initialized) {
      prevCounts.current = {
        messages: messages.length,
        appointments: appointments.length,
        newsletters: subscriptions.length,
        initialized: true,
      };
      return;
    }

    // Check for new messages
    if (messages.length > prevCounts.current.messages) {
      const newCount = messages.length - prevCounts.current.messages;
      const latestMessage = messages[0]; // Assuming messages are sorted by date desc
      addNotification({
        type: 'message',
        title: `${newCount} Yeni Mesaj`,
        description: latestMessage ? `${latestMessage.name}: ${latestMessage.subject}` : 'Yeni mesaj alındı',
        link: routes.adminMessages,
      });
    }

    // Check for new appointments
    if (appointments.length > prevCounts.current.appointments) {
      const newCount = appointments.length - prevCounts.current.appointments;
      const latestAppointment = appointments[0];
      addNotification({
        type: 'appointment',
        title: `${newCount} Yeni Randevu`,
        description: latestAppointment ? `${latestAppointment.name} - ${latestAppointment.date}` : 'Yeni randevu talebi',
        link: routes.adminAppointments,
      });
    }

    // Check for new newsletter subscriptions
    if (subscriptions.length > prevCounts.current.newsletters) {
      const newCount = subscriptions.length - prevCounts.current.newsletters;
      addNotification({
        type: 'newsletter',
        title: `${newCount} Yeni Abone`,
        description: 'Bülten aboneliklerine yeni kayıt yapıldı',
        link: routes.adminNewsletters,
      });
    }

    // Update previous counts
    prevCounts.current = {
      messages: messages.length,
      appointments: appointments.length,
      newsletters: subscriptions.length,
      initialized: true,
    };
  }, [messages, appointments, subscriptions, addNotification]);

  const isLoading = gearLoading || blogsLoading || messagesLoading || newslettersLoading || appointmentsLoading;

  const unreadMessages = messages.filter(m => !m.read).length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

  const statsGroups = {
    content: [
      { label: 'Toplam Ürün', value: String(gearTotal || gear.length), icon: '🎒', link: routes.adminGear, color: 'bg-green-500' },
      { label: 'Toplam Blog', value: String(blogsTotal || blogs.length), icon: '📝', link: routes.adminBlogs, color: 'bg-purple-500' },
    ],
    references: [
      { label: 'Referans Markalar', value: 'Yönet', icon: '🏆', link: routes.adminReferenceBrands, color: 'bg-indigo-500' },
      { label: 'Referans Resimler', value: 'Yönet', icon: '🖼️', link: routes.adminReferenceImages, color: 'bg-violet-500' },
    ],
    users: [
      { label: 'Kullanıcılar', value: 'Yönet', icon: '👥', link: routes.adminUsers, color: 'bg-cyan-500' },
      { label: 'Siparişler', value: 'Yönet', icon: '📦', link: routes.adminUserOrders, color: 'bg-amber-500' },
      { label: 'Değerlendirmeler', value: 'Yeni', icon: '⭐', link: routes.adminReviews, color: 'bg-yellow-500', badge: true },
    ],
    communication: [
      { label: 'Okunmamış Mesajlar', value: String(unreadMessages), icon: '💬', link: routes.adminMessages, color: 'bg-orange-500', badge: unreadMessages > 0 },
      { label: 'Bülten Aboneleri', value: String(newslettersTotal || subscriptions.length), icon: '📧', link: routes.adminNewsletters, color: 'bg-pink-500' },
      { label: 'Bekleyen Randevular', value: String(pendingAppointments), icon: '📅', link: routes.adminAppointments, color: 'bg-teal-500', badge: pendingAppointments > 0 },
    ],
  };

  const quickActions = [
    { label: 'Yeni Ürün Ekle', icon: '🎒', link: routes.adminAddGear, color: 'bg-green-500' },
    { label: 'Yeni Blog Yazısı Ekle', icon: '📝', link: routes.adminAddBlog, color: 'bg-purple-500' },
    { label: 'Yeni Kategori Ekle', icon: '🏷️', link: routes.adminAddCategory, color: 'bg-indigo-500' },
  ];

  return (
    <>
      <SEO title="Yönetici Paneli" description="Yönetici kontrol paneli" />
      <AdminLayout>
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Yönetici Paneli
            </h1>
            
            {/* Test Notification Button (Development only) */}
            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  addNotification({
                    type: 'message',
                    title: 'Test Bildirimi',
                    description: 'Bu bir test bildirimidir. Bildirim sistemi çalışıyor!',
                    link: routes.admin,
                  });
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                🔔 Test Bildirimi Ekle
              </button>
            )}
          </div>

          {/* Stats Grid by Category */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Content Management Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📦</span> İçerik Yönetimi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statsGroups.content.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={stat.link}
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                              {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                          </div>
                          <div className="text-5xl">{stat.icon}</div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* References Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏆</span> Referanslar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {statsGroups.references.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={stat.link}
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-indigo-500"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                              {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                          </div>
                          <div className="text-5xl">{stat.icon}</div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* User Operations Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>👥</span> Kullanıcı İşlemleri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statsGroups.users.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={stat.link}
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                              {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                          </div>
                          <div className="relative">
                            <div className="text-5xl">{stat.icon}</div>
                            {stat.badge && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                !
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Communication Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>💬</span> İletişim
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statsGroups.communication.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={stat.link}
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                              {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                          </div>
                          <div className="relative">
                            <div className="text-5xl">{stat.icon}</div>
                            {stat.badge && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                !
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>⚡</span> Hızlı İşlemler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={action.link}
                        className="block bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:scale-105 text-center text-white"
                      >
                        <div className="text-4xl mb-3">{action.icon}</div>
                        <div className="text-lg font-semibold">
                          {action.label}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Son Mesajlar
                    </h2>
                    <Link
                      to={routes.adminMessages}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Tümünü Gör
                    </Link>
                  </div>
                  {messages.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {messages.slice(0, 5).map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${message.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-primary-50 dark:bg-primary-900'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {message.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {message.subject}
                              </div>
                            </div>
                            {!message.read && (
                              <span className="ml-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                !
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Henüz mesaj yok</p>
                  )}
                </motion.div>

                {/* Recent Appointments */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Son Randevular
                    </h2>
                    <Link
                      to={routes.adminAppointments}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Tümünü Gör
                    </Link>
                  </div>
                  {appointments.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {appointments.slice(0, 5).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {appointment.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {appointment.date} - {appointment.time}
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                appointment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : appointment.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}
                            >
                              {appointment.status === 'pending' ? 'Beklemede' :
                               appointment.status === 'confirmed' ? 'Onaylandı' :
                               appointment.status === 'cancelled' ? 'İptal' : 'Tamamlandı'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Henüz randevu yok</p>
                  )}
                </motion.div>
              </div>

            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
};
