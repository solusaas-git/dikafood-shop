import Link from 'next/link';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * LoadingLink component that shows loading state when navigating
 * Use this instead of regular Next.js Link for navigation with loading
 */
const LoadingLink = ({ 
  href, 
  children, 
  loadingMessage = 'Chargement de la page...', 
  className,
  ...props 
}) => {
  const { showLoading } = useLoading();

  const handleClick = () => {
    // Show loading immediately when link is clicked
    showLoading(loadingMessage);
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LoadingLink;
