import { motion } from 'framer-motion';
import { ReviewStats as ReviewStatsType } from '@/services/reviewService';

interface ReviewStatsProps {
  stats: ReviewStatsType | null;
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  if (!stats || stats.total_reviews === 0) {
    return null;
  }

  const ratingDistribution = [
    { stars: 5, count: stats.five_star, color: 'bg-emerald-500' },
    { stars: 4, count: stats.four_star, color: 'bg-green-500' },
    { stars: 3, count: stats.three_star, color: 'bg-yellow-500' },
    { stars: 2, count: stats.two_star, color: 'bg-orange-500' },
    { stars: 1, count: stats.one_star, color: 'bg-red-500' },
  ];

  const percentage = (count: number) =>
    ((count / stats.total_reviews) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-8"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        📊 Değerlendirme İstatistikleri
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {stats.average_rating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${
                  i < Math.round(stats.average_rating)
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {stats.total_reviews} değerlendirme
          </p>

          {stats.recommend_count !== undefined && (
            <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-gray-700">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                👍 %
                {((stats.recommend_count / stats.total_reviews) * 100).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tavsiye ediyor
              </p>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.stars}
                </span>
                <span className="text-yellow-500">⭐</span>
              </div>

              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage(item.count)}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>

              <div className="w-16 text-right">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.count} ({percentage(item.count)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}





