import { 
  collection, 
  doc, 
  getDoc as getFirestoreDoc,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================
// Types
// ============================================

export interface FirestoreProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  categoryName?: string;
  images?: string[];
  stockQuantity?: number;
  ratingAvg?: number;
  discount?: number;
  brand?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Backend sync fields
  backendId?: number; // Reference to backend product ID
  syncedAt?: Date;
}

export interface FirestoreCart {
  userId: string;
  items: FirestoreCartItem[];
  updatedAt: Date;
}

export interface FirestoreCartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface FirestoreUserPreferences {
  userId: string;
  theme?: 'light' | 'dark';
  language?: 'en' | 'ar';
  notifications?: boolean;
  emailNotifications?: boolean;
  updatedAt: Date;
}

// ============================================
// Products Service
// ============================================

export const productsService = {
  // Get a single product
  async getProduct(productId: string): Promise<FirestoreProduct | null> {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getFirestoreDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as FirestoreProduct;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  // Get all products
  async getAllProducts(): Promise<FirestoreProduct[]> {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as FirestoreProduct[];
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId: string): Promise<FirestoreProduct[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as FirestoreProduct[];
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  },

  // Create or update a product
  async saveProduct(product: Omit<FirestoreProduct, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: Date }): Promise<string> {
    try {
      const now = Timestamp.now();
      const productData = {
        ...product,
        updatedAt: now,
        createdAt: product.createdAt ? Timestamp.fromDate(product.createdAt) : now,
      };

      if (product.id) {
        // Update existing product
        const docRef = doc(db, 'products', product.id);
        await updateDoc(docRef, productData);
        return product.id;
      } else {
        // Create new product
        const docRef = doc(collection(db, 'products'));
        await setDoc(docRef, productData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  // Delete a product
  async deleteProduct(productId: string): Promise<void> {
    try {
      const docRef = doc(db, 'products', productId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Real-time listener for products
  subscribeToProducts(
    callback: (products: FirestoreProduct[]) => void,
    categoryId?: string
  ): Unsubscribe {
    let q;
    if (categoryId) {
      q = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as FirestoreProduct[];
      callback(products);
    });
  },
};

// ============================================
// Cart Service
// ============================================

export const cartService = {
  // Get user's cart
  async getCart(userId: string): Promise<FirestoreCart | null> {
    try {
      const docRef = doc(db, 'carts', userId);
      const docSnap = await getFirestoreDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          userId: docSnap.id,
          items: data.items || [],
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as FirestoreCart;
      }
      return null;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  },

  // Save user's cart
  async saveCart(cart: FirestoreCart): Promise<void> {
    try {
      const docRef = doc(db, 'carts', cart.userId);
      await setDoc(docRef, {
        items: cart.items,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving cart:', error);
      throw error;
    }
  },

  // Clear user's cart
  async clearCart(userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'carts', userId);
      await setDoc(docRef, {
        items: [],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Real-time listener for cart
  subscribeToCart(userId: string, callback: (cart: FirestoreCart | null) => void): Unsubscribe {
    const docRef = doc(db, 'carts', userId);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          userId: docSnap.id,
          items: data.items || [],
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as FirestoreCart);
      } else {
        callback(null);
      }
    });
  },
};

// ============================================
// User Preferences Service
// ============================================

export const userPreferencesService = {
  // Get user preferences
  async getPreferences(userId: string): Promise<FirestoreUserPreferences | null> {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      const docSnap = await getFirestoreDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          userId: docSnap.id,
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as FirestoreUserPreferences;
      }
      return null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  },

  // Save user preferences
  async savePreferences(preferences: Partial<FirestoreUserPreferences> & { userId: string }): Promise<void> {
    try {
      const docRef = doc(db, 'userPreferences', preferences.userId);
      await setDoc(docRef, {
        ...preferences,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  },
};

// ============================================
// Backend Sync Service (for syncing backend data to Firestore)
// ============================================

export const syncService = {
  // Sync products from backend to Firestore
  async syncProductsFromBackend(backendProducts: any[]): Promise<void> {
    try {
      const batch = backendProducts.map(product => {
        const productData: Omit<FirestoreProduct, 'id' | 'createdAt' | 'updatedAt'> = {
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

        // Find existing product by backendId or create new
        return productsService.saveProduct({
          ...productData,
          id: product.firestoreId, // If you store Firestore ID in backend
        });
      });

      await Promise.all(batch);
      console.log(`Synced ${backendProducts.length} products to Firestore`);
    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  },
};

