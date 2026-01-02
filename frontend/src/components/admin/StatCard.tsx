import type { ReactNode } from 'react';
import CountUp from '../ui/CountUp';
import Tooltip from '../ui/Tooltip';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/currency';

interface StatCardProps {
  label: string;
  value: number;
  valueType?: 'number' | 'currency';
  icon: ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  tooltip?: string;
  prefix?: string;
  suffix?: string;
}

const StatCard = ({
  label,
  value,
  valueType = 'number',
  icon,
  color,
  trend,
  tooltip,
  prefix = '',
  suffix = '',
}: StatCardProps) => {
  const cardContent = (
    <Card className="p-6 hover:shadow-medium transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
            trend.isPositive
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {trend.isPositive ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{Math.abs(trend.value).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] mb-2 opacity-80">{label}</p>
      <p className="text-3xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">
        {valueType === 'currency' ? (
          formatCurrency(value)
        ) : (
          <CountUp 
            end={value} 
            duration={2000} 
            decimals={0}
            prefix={prefix} 
            suffix={suffix} 
          />
        )}
      </p>
    </Card>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position="top">
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
};

export default StatCard;

