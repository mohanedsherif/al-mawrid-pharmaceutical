import { useState, useEffect } from 'react';
import { cartService, type FirestoreCart } from '../services/firestoreService';
import { firebaseAuthService } from '../services/firebaseAuthService';

export const useFirestoreCart = () => {
  const [cart, setCart] = useState<FirestoreCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const firebaseUser = firebaseAuthService.getCurrentUser();
    
    if (!firebaseUser) {
      setLoading(false);
      return;
    }

    const userId = firebaseUser.uid;
    let unsubscribe: (() => void) | null = null;

    const loadCart = async () => {
      try {
        setLoading(true);
        setError(null);

        // Subscribe to real-time cart updates using Firebase Auth UID
        unsubscribe = cartService.subscribeToCart(userId, (updatedCart) => {
          setCart(updatedCart);
          setLoading(false);
        });
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadCart();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Run once, Firebase auth state changes will trigger re-render

  const saveCart = async (cartData: FirestoreCart) => {
    try {
      await cartService.saveCart(cartData);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const clearCart = async () => {
    const firebaseUser = firebaseAuthService.getCurrentUser();
    if (!firebaseUser) return;
    
    try {
      await cartService.clearCart(firebaseUser.uid);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { cart, loading, error, saveCart, clearCart };
};

