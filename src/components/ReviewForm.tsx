import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  onSubmit: (data: {
    rating: number;
    title?: string;
    comment: string;
    pros?: string;
    cons?: string;
    would_recommend?: boolean;
  }) => Promise<void>;
  type?: 'campsite' | 'gear';
  onCancel?: () => void;
}

export function ReviewForm({ onSubmit, type = 'gear', onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        rating,
        title: title || undefined,
        comment,
        pros: pros || undefined,
        cons: cons || undefined,
        would_recommend: type === 'gear' ? wouldRecommend : undefined,
      });

      // Reset form
      setRating(5);
      setTitle('');
      setComment('');
      setPros('');
      setCons('');
      setWouldRecommend(true);
    } catch (error) {
      console.error('Review submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        Değerlendirme Yap
      </h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Puanınız <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              className="text-3xl transition-transform hover:scale-110"
            >
              {(hoveredStar !== null ? star <= hoveredStar : star <= rating) ? (
                <span className="text-yellow-500">⭐</span>
              ) : (
                <span className="text-gray-300">☆</span>
              )}
            </button>
          ))}
          <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            {rating}/5
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Örn: Harika bir deneyim!"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          maxLength={200}
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Yorumunuz <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Deneyiminizi detaylı olarak anlatın..."
          required
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Pros & Cons */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ✅ Artıları
          </label>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="Beğendiğiniz özellikler..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ❌ Eksileri
          </label>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="İyileştirilebilecek noktalar..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Would Recommend (Gear only) */}
      {type === 'gear' && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="would-recommend"
            checked={wouldRecommend}
            onChange={(e) => setWouldRecommend(e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
          />
          <label
            htmlFor="would-recommend"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Bu ürünü başkalarına tavsiye ederim
          </label>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Gönderiliyor...' : '📤 Değerlendirmeyi Gönder'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            İptal
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        ℹ️ Değerlendirmeniz yönetici onayından sonra yayınlanacaktır.
      </p>
    </motion.form>
  );
}





