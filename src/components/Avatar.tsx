interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  shape?: 'circle' | 'square';
  fallbackIcon?: string;
}

export const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  shape = 'circle',
  fallbackIcon = '👤',
}: AvatarProps) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${sizes[size]} ${
          shape === 'circle' ? 'rounded-full' : 'rounded-lg'
        } flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold`}
      >
        {src ? (
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : name ? (
          getInitials(name)
        ) : (
          <span>{fallbackIcon}</span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} border-2 border-white dark:border-gray-800 rounded-full`}
        />
      )}
    </div>
  );
};

// Avatar Group Component
interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    name?: string;
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
}

export const AvatarGroup = ({ avatars, max = 5, size = 'md', shape = 'circle' }: AvatarGroupProps) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-white dark:ring-gray-800"
          style={{ zIndex: displayAvatars.length - index }}
        >
          <Avatar {...avatar} size={size} shape={shape} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`${
            size === 'xs'
              ? 'w-6 h-6 text-xs'
              : size === 'sm'
              ? 'w-8 h-8 text-sm'
              : size === 'md'
              ? 'w-10 h-10 text-base'
              : size === 'lg'
              ? 'w-12 h-12 text-lg'
              : size === 'xl'
              ? 'w-16 h-16 text-xl'
              : 'w-20 h-20 text-2xl'
          } ${
            shape === 'circle' ? 'rounded-full' : 'rounded-lg'
          } flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold ring-2 ring-white dark:ring-gray-800`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};



