interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton = ({ className = '', variant = 'rectangular' }: SkeletonProps) => {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded',
  };

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      aria-label="Loading..."
    />
  );
};

export default Skeleton;

