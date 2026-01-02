import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  getDashboardStats,
  getMonthlyRevenue,
  getTopProducts,
  getOrderStatusCounts,
  getLowStockProducts,
  getPendingFeedbacksCount,
  type DashboardStats,
  type MonthlyRevenue,
  type TopProduct,
  type OrderStatusCount,
  type LowStockProduct,
} from '../../api/adminApi';
import { useTheme } from '../../contexts/ThemeContext';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import StatCard from '../../components/admin/StatCard';
import ProductInsightsTable from '../../components/admin/ProductInsightsTable';
import { getAllUsers, type User } from '../../api/adminApi';
import { formatCurrency } from '../../utils/currency';

// AL-MAWRID Brand Colors for Charts
const BRAND_COLORS_LIGHT = ['#4ECDC4', '#42A9A9', '#367D8E', '#2A5374', '#1E3A5F'];
const BRAND_COLORS_DARK = ['#4ECDC4', '#42A9A9', '#367D8E', '#2A5374', '#66B3B3'];

const AdminDashboardPage = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState<OrderStatusCount[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [pendingFeedbacks, setPendingFeedbacks] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  const chartColors = isDark ? BRAND_COLORS_DARK : BRAND_COLORS_LIGHT;
  const textColor = isDark ? '#E6EEF6' : '#2C3E50';
  const gridColor = isDark ? 'rgba(184, 197, 214, 0.1)' : 'rgba(184, 197, 214, 0.3)';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, revenueData, productsData, statusData, lowStockData, feedbacksCount, usersData, analyticsData] = await Promise.all([
          getDashboardStats(),
          getMonthlyRevenue(),
          getTopProducts(10), // Get more for the table
          getOrderStatusCounts(),
          getLowStockProducts(),
          getPendingFeedbacksCount(),
          getAllUsers(),
          analyticsService.getActiveUsers(),
        ]);

        setStats(statsData);
        setMonthlyRevenue(revenueData);
        setTopProducts(productsData);
        setOrderStatusCounts(statusData);
        setLowStockProducts(lowStockData);
        setPendingFeedbacks(feedbacksCount);
        setUsers(usersData);
        setActiveUsers(analyticsData.activeUsers);
        setPageViews(analyticsData.pageViews);
        
        // Track admin dashboard view
        analyticsService.logEvent('admin_dashboard_view', {
          admin_user: true,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default values to prevent blank screen
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalUsers: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh analytics data every 5 minutes
    const interval = setInterval(async () => {
      try {
        const analyticsData = await analyticsService.getActiveUsers();
        setActiveUsers(analyticsData.activeUsers);
        setPageViews(analyticsData.pageViews);
      } catch (error) {
        console.warn('Failed to refresh analytics:', error);
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);


  if (loading) {
    return (
      <div className="container-main py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-12 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container-main py-8">
        <Card className="p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">Failed to load dashboard data</p>
        </Card>
      </div>
    );
  }

  // Calculate trends (simplified - comparing with previous month)
  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock previous period data (in real app, fetch from API)
  const previousRevenue = stats.totalRevenue * 0.85; // Example: 15% growth
  const previousOrders = Math.floor(stats.totalOrders * 0.9);
  const previousUsers = Math.floor(stats.totalUsers * 0.95);

  const statsCards = [
    {
      label: 'Total Revenue',
      value: stats.totalRevenue,
      valueType: 'currency' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-cta-100 dark:bg-cta-900/30 text-cta-700 dark:text-cta-400',
      trend: {
        value: calculateTrend(stats.totalRevenue, previousRevenue),
        isPositive: stats.totalRevenue >= previousRevenue,
      },
      tooltip: 'Total revenue generated from all orders',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      valueType: 'number' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
      trend: {
        value: calculateTrend(stats.totalOrders, previousOrders),
        isPositive: stats.totalOrders >= previousOrders,
      },
      tooltip: 'Total number of orders placed',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      valueType: 'number' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400',
      trend: {
        value: calculateTrend(stats.totalUsers, previousUsers),
        isPositive: stats.totalUsers >= previousUsers,
      },
      tooltip: 'Total number of registered users',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      valueType: 'number' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400',
      tooltip: 'Orders waiting for processing',
    },
    {
      label: 'Pending Feedbacks',
      value: pendingFeedbacks,
      valueType: 'number' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      color: 'bg-primary-200 dark:bg-primary-800/30 text-primary-800 dark:text-primary-300',
      tooltip: 'Customer feedbacks awaiting review',
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200/50 dark:border-primary-700/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-heading font-bold mb-2 text-primary-700 dark:text-primary-300">
              Welcome to Admin Dashboard
            </h2>
            <p className="text-[#2C3E50] dark:text-[#E6EEF6] mb-4">
              Manage all aspects of your e-commerce platform. You can edit products, categories, orders, users, and feedbacks.
            </p>
            
            {/* Traffic Monitoring Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-primary-200/50 dark:border-primary-700/30">
              <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-[#16283D]/50 rounded-xl">
                <div className="p-3 rounded-lg bg-cta-100 dark:bg-cta-900/30 text-cta-600 dark:text-cta-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70 mb-1">Active Users (Real-time)</p>
                  <p className="text-2xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">
                    {activeUsers > 0 ? activeUsers : '—'}
                  </p>
                  <p className="text-xs text-[#2C3E50] dark:text-[#E6EEF6] opacity-60 mt-1">
                    {activeUsers > 0 ? 'Last 30 minutes' : 'Analytics integration required'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-[#16283D]/50 rounded-xl">
                <div className="p-3 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70 mb-1">Page Views (Today)</p>
                  <p className="text-2xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">
                    {pageViews > 0 ? pageViews.toLocaleString() : '—'}
                  </p>
                  <p className="text-xs text-[#2C3E50] dark:text-[#E6EEF6] opacity-60 mt-1">
                    {pageViews > 0 ? 'From Firebase Analytics' : 'Analytics integration required'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> Real-time traffic data requires Firebase Analytics Reporting API integration. 
                For production use, connect to Firebase Analytics via BigQuery or the Reporting API.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <Link to="/admin/products" className="p-3 bg-white dark:bg-[#16283D] rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="text-cta-500 dark:text-cta-400 mb-2 flex justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Products</p>
            </Link>
            <Link to="/admin/categories" className="p-3 bg-white dark:bg-[#16283D] rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="text-cta-500 dark:text-cta-400 mb-2 flex justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Categories</p>
            </Link>
            <Link to="/admin/orders" className="p-3 bg-white dark:bg-[#16283D] rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="text-cta-500 dark:text-cta-400 mb-2 flex justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Orders</p>
            </Link>
            <Link to="/admin/users" className="p-3 bg-white dark:bg-[#16283D] rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="text-cta-500 dark:text-cta-400 mb-2 flex justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Users</p>
            </Link>
            <Link to="/admin/feedbacks" className="p-3 bg-white dark:bg-[#16283D] rounded-lg hover:shadow-md transition-shadow text-center">
              <div className="text-cta-500 dark:text-cta-400 mb-2 flex justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Feedbacks</p>
            </Link>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end mb-8">
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={() => {
              // Export dashboard data as CSV
              const csvData = [
                ['Metric', 'Value'],
                ['Total Revenue', formatCurrency(stats.totalRevenue)],
                ['Total Orders', stats.totalOrders.toString()],
                ['Total Users', stats.totalUsers.toString()],
                ['Pending Orders', stats.pendingOrders.toString()],
              ];
              const csv = csvData.map(row => row.join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
          >
            Export Report
          </Button>
          <Link to="/admin/products">
            <Button variant="primary">+ Add Product</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statsCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            valueType={stat.valueType}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            tooltip={stat.tooltip}
          />
        ))}
      </div>

      {/* Additional Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-80 mb-1">Average Order Value</p>
          <p className="text-2xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">
            {stats.totalOrders > 0 ? formatCurrency(stats.totalRevenue / stats.totalOrders) : formatCurrency(0)}
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-80 mb-1">Conversion Rate</p>
          <p className="text-2xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">
            {stats.totalUsers > 0 ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) : 0}%
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-80 mb-1">Revenue per User</p>
          <p className="text-2xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">
            {stats.totalUsers > 0 ? formatCurrency(stats.totalRevenue / stats.totalUsers) : formatCurrency(0)}
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold">Sales Trend (Monthly Revenue)</h2>
            <div className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70">
              {monthlyRevenue.length > 0 && (
                <span>
                  Last 6 months: {formatCurrency(monthlyRevenue.slice(-6).reduce((sum, m) => sum + m.revenue, 0))}
                </span>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis
                dataKey="month"
                tick={{ fill: textColor, fontSize: 12 }}
                tickFormatter={(value: string) => {
                  const [year, month] = value.split('-');
                  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
                }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 12 }}
                tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k EGP`}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: isDark ? '#16283D' : '#ffffff',
                  border: `1px solid ${isDark ? '#2A5374' : '#B8C5D6'}`,
                  borderRadius: '0.75rem',
                  color: textColor,
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartColors[0]}
                strokeWidth={3}
                name="Revenue"
                dot={{ fill: chartColors[0], r: 5, strokeWidth: 2, stroke: isDark ? '#16283D' : '#ffffff' }}
                activeDot={{ r: 7, stroke: chartColors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">Order Status Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusCounts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {orderStatusCounts.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: isDark ? '#16283D' : '#ffffff',
                  border: `1px solid ${isDark ? '#2A5374' : '#B8C5D6'}`,
                  borderRadius: '0.75rem',
                  color: textColor,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {orderStatusCounts.map((status, index) => (
              <div key={status.status} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="text-[#2C3E50] dark:text-[#E6EEF6] opacity-80">{status.status}</span>
                </div>
                <span className="font-semibold">{status.count} orders</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Top Selling Products - Bar Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">Top Selling Products</h2>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
                <XAxis type="number" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis 
                  dataKey="productName" 
                  type="category" 
                  tick={{ fill: textColor, fontSize: 12 }}
                  width={120}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#16283D' : '#ffffff',
                    border: `1px solid ${isDark ? '#2A5374' : '#B8C5D6'}`,
                    borderRadius: '0.75rem',
                    color: textColor,
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="totalRevenue" fill={chartColors[0]} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-[#2C3E50] dark:text-[#E6EEF6] py-8">No sales data available</p>
          )}
        </Card>

        {/* Low Stock Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">Low Stock Alerts</h2>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <p className="font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">{product.name}</p>
                    <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70">
                      {product.stockQuantity} units (threshold: {product.threshold})
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-xs font-semibold">
                    Low Stock
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-[#2C3E50] dark:text-[#E6EEF6] opacity-60 py-8">All products are well stocked</p>
            )}
          </div>
        </Card>
      </div>

      {/* Product Insights Table */}
      <div className="mb-8">
        <ProductInsightsTable products={topProducts} loading={loading} />
      </div>

      {/* Users Management Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6] mb-2">Users Management</h2>
            <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70">
              {users.length} total users • {users.filter(u => {
                const userDate = new Date(u.createdAt);
                const currentDate = new Date();
                return userDate.getMonth() === currentDate.getMonth() && userDate.getFullYear() === currentDate.getFullYear();
              }).length} new this month
            </p>
          </div>
          <Link to="/admin/users">
            <Button variant="primary">Manage Users</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#ECF0F3] dark:bg-[#16283D] rounded-lg">
            <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70 mb-1">Total Users</p>
            <p className="text-2xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">{users.length}</p>
          </div>
          <div className="p-4 bg-[#ECF0F3] dark:bg-[#16283D] rounded-lg">
            <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70 mb-1">Active Users</p>
            <p className="text-2xl font-heading font-bold text-cta-600 dark:text-cta-400">
              {users.filter(u => u.enabled).length}
            </p>
          </div>
          <div className="p-4 bg-[#ECF0F3] dark:bg-[#16283D] rounded-lg">
            <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70 mb-1">Admins</p>
            <p className="text-2xl font-heading font-bold text-primary-600 dark:text-primary-400">
              {users.filter(u => u.role === 'ADMIN').length}
            </p>
          </div>
          <div className="p-4 bg-[#ECF0F3] dark:bg-[#16283D] rounded-lg">
            <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70 mb-1">Customers</p>
            <p className="text-2xl font-heading font-bold text-secondary-600 dark:text-secondary-400">
              {users.filter(u => u.role === 'USER').length}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B8C5D6]/50 dark:border-primary-700/30">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-[#B8C5D6]/30 dark:border-primary-700/20 hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors"
                  >
                    <td className="py-4 px-4 text-[#2C3E50] dark:text-[#E6EEF6] font-medium">{user.fullName}</td>
                    <td className="py-4 px-4 text-[#2C3E50] dark:text-[#E6EEF6] opacity-80">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        user.enabled
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
