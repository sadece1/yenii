import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
}

export const Breadcrumbs = ({ items, separator = '/' }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400 dark:text-gray-600">
              {separator}
            </span>
          )}
          
          {item.path ? (
            <Link
              to={item.path}
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};



