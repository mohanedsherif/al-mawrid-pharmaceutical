import api from './axios';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get('/categories');
  return res.data;
};

export const createCategory = async (payload: { name: string; description?: string }): Promise<Category> => {
  const res = await api.post('/admin/categories', payload);
  return res.data;
};

export const updateCategory = async (id: number, payload: { name: string; description?: string }): Promise<Category> => {
  const res = await api.put(`/admin/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/admin/categories/${id}`);
};

