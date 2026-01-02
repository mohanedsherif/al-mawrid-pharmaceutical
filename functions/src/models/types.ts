// User Types
export interface User {
  id: number;
  email: string;
  password: string; // hashed
  fullName: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role?: 'USER' | 'ADMIN';
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stockQuantity: number;
  brand?: string;
  images?: string[];
  categoryId?: number;
  ratingAvg?: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stockQuantity: number;
  brand?: string;
  images?: string[];
  categoryId?: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: string;
}

// Order Types
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  userId: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;
  shippingCountry?: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface CreateOrderDto {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;
  shippingCountry?: string;
}

