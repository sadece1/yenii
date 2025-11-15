import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}: CardProps) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? {
        whileHover: { y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`rounded-xl ${variants[variant]} ${paddings[padding]} ${
        hover ? 'cursor-pointer' : ''
      } ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

// Card Header
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: string;
}

export const CardHeader = ({ title, subtitle, action, icon }: CardHeaderProps) => (
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-start gap-3">
      {icon && <span className="text-2xl">{icon}</span>}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

// Card Content
export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-gray-600 dark:text-gray-300 ${className}`}>{children}</div>
);

// Card Footer
export const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
);

// Product Card Example
interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  rating?: number;
  badge?: string;
  onAddToCart?: () => void;
}

export const ProductCard = ({ image, title, price, rating = 0, badge, onAddToCart }: ProductCardProps) => (
  <Card variant="elevated" padding="none" hover>
    <div className="relative">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-xl" />
      {badge && (
        <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
          {badge}
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{price}</span>
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
          </div>
        )}
      </div>
      {onAddToCart && (
        <button
          onClick={onAddToCart}
          className="mt-3 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
        >
          Sepete Ekle
        </button>
      )}
    </div>
  </Card>
);

// Stat Card
interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatCard = ({ icon, label, value, trend, color = 'bg-blue-500' }: StatCardProps) => (
  <Card variant="elevated" padding="md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-3xl`}>
        {icon}
      </div>
    </div>
  </Card>
);



