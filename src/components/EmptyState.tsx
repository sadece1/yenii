import { motion } from 'framer-motion';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: 'search' | 'data' | 'error' | 'success' | 'custom';
}

export const EmptyState = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}: EmptyStateProps) => {
  const illustrations = {
    search: (
      <div className="text-8xl mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🔍
        </motion.div>
      </div>
    ),
    data: (
      <div className="text-8xl mb-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          📊
        </motion.div>
      </div>
    ),
    error: (
      <div className="text-8xl mb-6">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          ⚠️
        </motion.div>
      </div>
    ),
    success: (
      <div className="text-8xl mb-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
        >
          ✅
        </motion.div>
      </div>
    ),
    custom: <div className="text-8xl mb-6">{icon}</div>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {illustration ? illustrations[illustration] : <div className="text-8xl mb-6">{icon}</div>}
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

// Specific empty state variants
export const NoResultsFound = ({ onReset }: { onReset?: () => void }) => (
  <EmptyState
    illustration="search"
    title="Sonuç Bulunamadı"
    description="Arama kriterlerinize uygun sonuç bulunamadı. Lütfen farklı kelimeler deneyin."
    actionLabel={onReset ? "Aramayı Temizle" : undefined}
    onAction={onReset}
  />
);

export const NoDataAvailable = () => (
  <EmptyState
    illustration="data"
    title="Veri Bulunmuyor"
    description="Henüz bu kategoride veri eklenmemiş."
  />
);

export const ErrorOccurred = ({ onRetry }: { onRetry?: () => void }) => (
  <EmptyState
    illustration="error"
    title="Bir Hata Oluştu"
    description="Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin."
    actionLabel={onRetry ? "Tekrar Dene" : undefined}
    onAction={onRetry}
  />
);



