const Skeleton = ({ className = "" }: { className?: string }) => (
  <div 
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
    dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 
    rounded ${className}`}
  />
);

export default Skeleton; 