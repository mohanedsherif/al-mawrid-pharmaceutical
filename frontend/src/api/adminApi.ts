import api from './axios';
import type { Product } from './productApi';

// Dashboard Analytics
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSales: number;
  totalRevenue: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stockQuantity: number;
  threshold: number;
}

// User Management
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  createdAt: string;
}

// Order Management
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;
  shippingCountry?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// Dashboard API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get('/admin/dashboard/stats');
  return res.data;
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
  const res = await api.get('/admin/dashboard/revenue/monthly');
  return res.data;
};

export const getTopProducts = async (limit: number = 10): Promise<TopProduct[]> => {
  const res = await api.get(`/admin/dashboard/products/top?limit=${limit}`);
  return res.data;
};

export const getOrderStatusCounts = async (): Promise<OrderStatusCount[]> => {
  const res = await api.get('/admin/dashboard/orders/status');
  return res.data;
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const res = await api.get('/admin/dashboard/products/low-stock');
  return res.data;
};

// Product Management
export const createProduct = async (payload: Partial<Product>) => {
  const res = await api.post('/admin/products', payload);
  return res.data;
};

export const updateProduct = async (id: number, payload: Partial<Product>) => {
  const res = await api.put(`/admin/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

// Feedback Management
export interface Feedback {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  productId: number | null;
  productName: string | null;
  rating: number;
  comment: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackResponseRequest {
  adminResponse?: string;
  status?: 'APPROVED' | 'REJECTED';
}

export const getAllFeedbacks = async (page: number = 0, size: number = 20, status?: string): Promise<{ content: Feedback[]; totalElements: number; totalPages: number }> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (status) params.append('status', status);
  
  const res = await api.get(`/admin/feedbacks?${params.toString()}`);
  return res.data;
};

export const getPendingFeedbacksCount = async (): Promise<number> => {
  const res = await api.get('/admin/feedbacks/pending/count');
  return res.data;
};

export const updateFeedbackStatus = async (id: number, request: FeedbackResponseRequest): Promise<Feedback> => {
  const res = await api.put(`/admin/feedbacks/${id}/status`, request);
  return res.data;
};

export const deleteFeedback = async (id: number): Promise<void> => {
  await api.delete(`/admin/feedbacks/${id}`);
};

// User Management
export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const updateUserRole = async (id: number, role: 'USER' | 'ADMIN'): Promise<User> => {
  const res = await api.put(`/admin/users/${id}/role`, { role });
  return res.data;
};

export const toggleUserEnabled = async (id: number): Promise<void> => {
  await api.put(`/admin/users/${id}/toggle-enabled`);
};

// Order Management
export const getAllOrders = async (): Promise<Order[]> => {
  const res = await api.get('/admin/orders');
  return res.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (
  id: number,
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
): Promise<Order> => {
  const res = await api.put(`/admin/orders/${id}/status`, { status });
  return res.data;
};

