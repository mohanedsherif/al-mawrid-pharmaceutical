import api from './axios';

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stockQuantity?: number;
  brand?: string;
  images?: string[];
  categoryId?: number;
  categoryName?: string;
  ratingAvg?: number;
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get('/products');
    return res.data?.content ?? res.data ?? [];
  } catch (error: any) {
    // Silently handle connection errors (backend might be down)
    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
      return [];
    }
    throw error;
  }
};

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data as Product;
  } catch (error: any) {
    // Silently handle connection errors
    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
      throw new Error('Product not available - backend connection failed');
    }
    throw error;
  }
};

