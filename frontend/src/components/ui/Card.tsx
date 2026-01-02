import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card = ({ children, className = '', hover = false, onClick }: CardProps) => {
  const baseClasses = 'bg-white dark:bg-[#16283D] rounded-2xl shadow-soft border border-[#B8C5D6]/50 dark:border-primary-700/30 transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-hover hover:-translate-y-1 hover:border-cta-300 dark:hover:border-cta-500/50 cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

