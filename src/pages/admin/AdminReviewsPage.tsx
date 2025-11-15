import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { Review, getAllReviews, updateReviewStatus } from '@/services/reviewService';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'campsite' | 'gear'>('all');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved'>('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [filter, statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews(filter, statusFilter);
      setReviews(data.reviews);
    } catch (error) {
      console.error('Fetch reviews error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (review: Review, approve: boolean) => {
    setActionLoading(true);
    try {
      await updateReviewStatus(review.id, review.review_type!, {
        is_approved: approve,
        admin_response: adminResponse || undefined,
      });

      // Remove from list after action
      setReviews(reviews.filter((r) => r.id !== review.id));
      setSelectedReview(null);
      setAdminResponse('');

      alert(approve ? 'Yorum onaylandı!' : 'Yorum reddedildi!');
    } catch (error) {
      console.error('Update review error:', error);
      alert('Bir hata oluştu!');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📝 Değerlendirme Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kullanıcı değerlendirmelerini inceleyin ve onaylayın
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  Onay Bekleyen
                </p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                  {pendingCount}
                </p>
              </div>
              <span className="text-4xl">⏳</span>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Toplam Değerlendirme
                </p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {reviews.length}
                </p>
              </div>
              <span className="text-4xl">⭐</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Ortalama Puan
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {reviews.length > 0
                    ? (
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                      ).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="pending">Onay Bekleyen</option>
                <option value="approved">Onaylanmış</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tip
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tümü</option>
                <option value="campsite">Kamp Alanı</option>
                <option value="gear">Ekipman</option>
              </select>
            </div>

            <div className="ml-auto flex items-end">
              <button
                onClick={fetchReviews}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                🔄 Yenile
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Değerlendirme bulunamadı.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${
                  selectedReview?.id === review.id ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          review.review_type === 'campsite'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}
                      >
                        {review.review_type === 'campsite'
                          ? '🏕️ Kamp Alanı'
                          : '🎒 Ekipman'}
                      </span>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            ⭐
                          </span>
                        ))}
                      </div>

                      {review.is_approved && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-sm font-medium">
                          ✓ Onaylı
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {review.campsite_name || review.gear_name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {review.user_name} •{' '}
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </p>

                    {review.title && (
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {review.title}
                      </h4>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {review.comment}
                    </p>

                    {(review.pros || review.cons) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {review.pros && (
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                              ✅ Artıları
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {review.pros}
                            </p>
                          </div>
                        )}
                        {review.cons && (
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                              ❌ Eksileri
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {review.cons}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Actions */}
                {!review.is_approved && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {selectedReview?.id === review.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Yanıt (Opsiyonel)
                          </label>
                          <textarea
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            placeholder="Kullanıcıya gösterilecek yanıtınız..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(review, true)}
                            disabled={actionLoading}
                            className="flex-1 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors"
                          >
                            ✓ Onayla
                          </button>
                          <button
                            onClick={() => handleApprove(review, false)}
                            disabled={actionLoading}
                            className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                          >
                            ✗ Reddet
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReview(null);
                              setAdminResponse('');
                            }}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="w-full bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        🔍 İşlem Yap
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

