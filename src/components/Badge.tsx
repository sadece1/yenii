interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pill?: boolean;
  outline?: boolean;
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pill = false,
  outline = false,
}: BadgeProps) => {
  const variants = {
    default: outline
      ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    primary: outline
      ? 'border-primary-500 text-primary-700 dark:text-primary-400'
      : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
    success: outline
      ? 'border-green-500 text-green-700 dark:text-green-400'
      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: outline
      ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    danger: outline
      ? 'border-red-500 text-red-700 dark:text-red-400'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: outline
      ? 'border-blue-500 text-blue-700 dark:text-blue-400'
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${pill ? 'rounded-full' : 'rounded'} ${
        outline ? 'border bg-transparent' : ''
      } ${variants[variant]} ${sizes[size]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};



