import api from './axios';
import type { CartItem } from '../store/cartSlice';

export const syncCart = async (items: CartItem[]) => {
  const res = await api.post('/cart/sync', { items });
  return res.data;
};

export const fetchCart = async () => {
  const res = await api.get('/cart');
  return res.data;
};

