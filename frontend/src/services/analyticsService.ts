import { analytics } from '../config/firebase';
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

/**
 * Firebase Analytics Service
 * Handles all analytics tracking for AL-MAWRID Pharmaceuticals
 */
class AnalyticsService {
  private getAnalytics(): Analytics | null {
    if (typeof window === 'undefined') return null;
    return analytics || null;
  }

  /**
   * Log a custom event
   */
  logEvent(eventName: string, eventParams?: Record<string, any>): void {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.warn('Analytics event failed:', error);
    }
  }

  /**
   * Set user ID for analytics
   */
  setUserId(userId: string | null): void {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    
    try {
      if (userId) {
        setUserId(analytics, userId);
      }
    } catch (error) {
      console.warn('Analytics setUserId failed:', error);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    
    try {
      setUserProperties(analytics, properties);
    } catch (error) {
      console.warn('Analytics setUserProperties failed:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pagePath: string, pageTitle?: string): void {
    this.logEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle || pagePath,
    });
  }

  /**
   * Track product view
   */
  trackProductView(productId: string, productName: string): void {
    this.logEvent('view_item', {
      item_id: productId,
      item_name: productName,
    });
  }

  /**
   * Track add to cart
   */
  trackAddToCart(productId: string, productName: string, price: number): void {
    this.logEvent('add_to_cart', {
      currency: 'EGP',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
      }],
    });
  }

  /**
   * Track purchase
   */
  trackPurchase(transactionId: string, value: number, items: any[]): void {
    this.logEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'EGP',
      items: items,
    });
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string): void {
    this.logEvent('search', {
      search_term: searchTerm,
    });
  }

  /**
   * Get approximate active users (simulated - Firebase Analytics doesn't provide real-time active users API)
   * In production, you would use Firebase Analytics Reporting API or BigQuery
   */
  async getActiveUsers(): Promise<{ activeUsers: number; pageViews: number }> {
    // Note: Firebase Analytics doesn't provide a client-side API for real-time stats
    // This is a placeholder that would need to be replaced with:
    // 1. Firebase Analytics Reporting API (requires server-side)
    // 2. BigQuery integration
    // 3. Custom Firestore tracking
    
    // For now, we'll simulate or use Firestore to track active sessions
    try {
      // You can implement custom tracking in Firestore
      // This is a simplified version
      return {
        activeUsers: 0, // Would come from Analytics Reporting API
        pageViews: 0, // Would come from Analytics Reporting API
      };
    } catch (error) {
      console.warn('Failed to get active users:', error);
      return { activeUsers: 0, pageViews: 0 };
    }
  }
}

export const analyticsService = new AnalyticsService();

