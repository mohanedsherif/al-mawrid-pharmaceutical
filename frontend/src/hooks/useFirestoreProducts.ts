import { useState, useEffect } from 'react';
import { productsService, type FirestoreProduct } from '../services/firestoreService';

export const useFirestoreProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (categoryId) {
          // Subscribe to real-time updates for category products
          unsubscribe = productsService.subscribeToProducts(
            (updatedProducts) => {
              setProducts(updatedProducts);
              setLoading(false);
            },
            categoryId
          );
        } else {
          // Subscribe to real-time updates for all products
          unsubscribe = productsService.subscribeToProducts((updatedProducts) => {
            setProducts(updatedProducts);
            setLoading(false);
          });
        }
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadProducts();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [categoryId]);

  return { products, loading, error };
};


