/**
 * Backend Sync Service
 * 
 * This service helps sync data between your Spring Boot backend and Firestore.
 * You can use this to keep Firestore in sync with your backend database.
 */

import { productsService } from './firestoreService';
import api from '../api/axios';

// ============================================
// Types
// ============================================

interface BackendProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  categoryName?: string;
  images?: string[];
  stockQuantity?: number;
  ratingAvg?: number;
  discount?: number;
  brand?: string;
}

// ============================================
// Sync Functions
// ============================================

export const backendSyncService = {
  /**
   * Sync all products from backend to Firestore
   * Call this periodically or when products are updated in backend
   */
  async syncProducts(): Promise<void> {
    try {
      console.log('Starting product sync from backend to Firestore...');
      
      // Fetch products from backend
      const response = await api.get('/products?size=1000'); // Adjust size as needed
      const backendProducts: BackendProduct[] = response.data.content || response.data;
      
      // Transform and save to Firestore
      const syncPromises = backendProducts.map(async (product) => {
        const firestoreProduct = {
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId?.toString(),
          categoryName: product.categoryName,
          images: product.images,
          stockQuantity: product.stockQuantity,
          ratingAvg: product.ratingAvg,
          discount: product.discount,
          brand: product.brand,
          backendId: product.id,
          syncedAt: new Date(),
        };

        // Try to find existing Firestore product by backendId
        // For now, we'll create/update based on backendId
        // You might want to maintain a mapping table
        return productsService.saveProduct({
          ...firestoreProduct,
          // If you have a mapping, use it here
          // id: getFirestoreIdFromBackendId(product.id)
        });
      });

      await Promise.all(syncPromises);
      console.log(`Successfully synced ${backendProducts.length} products to Firestore`);
    } catch (error) {
      console.error('Error syncing products from backend:', error);
      throw error;
    }
  },

  /**
   * Sync a single product from backend to Firestore
   */
  async syncProduct(productId: number): Promise<void> {
    try {
      const response = await api.get(`/products/${productId}`);
      const product: BackendProduct = response.data;

      const firestoreProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId?.toString(),
        categoryName: product.categoryName,
        images: product.images,
        stockQuantity: product.stockQuantity,
        ratingAvg: product.ratingAvg,
        discount: product.discount,
        brand: product.brand,
        backendId: product.id,
        syncedAt: new Date(),
      };

      await productsService.saveProduct(firestoreProduct);
      console.log(`Synced product ${productId} to Firestore`);
    } catch (error) {
      console.error(`Error syncing product ${productId}:`, error);
      throw error;
    }
  },
};

/**
 * Setup automatic syncing (optional)
 * This can be called on app initialization or set up as a scheduled task
 */
export const setupAutoSync = () => {
  // Sync products every 5 minutes (adjust as needed)
  setInterval(() => {
    backendSyncService.syncProducts().catch(console.error);
  }, 5 * 60 * 1000);

  // Initial sync
  backendSyncService.syncProducts().catch(console.error);
};


