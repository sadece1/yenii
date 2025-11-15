import { motion } from 'framer-motion';
import { Review } from '@/services/reviewService';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ReviewListProps {
  reviews: Review[];
  onMarkHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  loading?: boolean;
}

export function ReviewList({ reviews, onMarkHelpful, onReport, loading }: ReviewListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Henüz değerlendirme yapılmamış.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          İlk değerlendirmeyi siz yapın! 🌟
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {review.user_name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {review.user_name || 'Anonim Kullanıcı'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(review.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                >
                  ⭐
                </span>
              ))}
              <span className="ml-2 text-lg font-bold text-gray-700 dark:text-gray-300">
                {review.rating}/5
              </span>
            </div>
          </div>

          {/* Title */}
          {review.title && (
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {review.title}
            </h5>
          )}

          {/* Comment */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
            {review.comment}
          </p>

          {/* Pros & Cons */}
          {(review.pros || review.cons) && (
            <div className="grid md:grid-cols-2 gap-4 mb-4">
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

          {/* Would Recommend */}
          {review.would_recommend !== undefined && (
            <div className="mb-4">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  review.would_recommend
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {review.would_recommend ? '👍 Tavsiye ederim' : '👎 Tavsiye etmem'}
              </span>
            </div>
          )}

          {/* Admin Response */}
          {review.admin_response && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
                🏪 Yönetici Yanıtı
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {review.admin_response}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onMarkHelpful?.(review.id)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <span>👍</span>
              <span className="text-sm">
                Faydalı ({review.helpful_count || 0})
              </span>
            </button>

            <button
              onClick={() => onReport?.(review.id)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <span>🚩</span>
              <span className="text-sm">Şikayet Et</span>
            </button>

            {review.is_featured && (
              <span className="ml-auto flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                <span>⭐</span>
                <span>Öne Çıkan</span>
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}





