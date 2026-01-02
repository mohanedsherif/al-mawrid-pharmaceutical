/**
 * Currency utility for AL-MAWRID Pharmaceuticals
 * All prices are in Egyptian Pound (EGP)
 */

/**
 * Format a number as Egyptian Pound currency
 */
export const formatCurrency = (amount: number): string => {
  // Format with English locale and add EGP suffix
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' EGP';
};

/**
 * Format currency for display in RTL layout
 */
export const formatCurrencyDisplay = (amount: number): string => {
  return formatCurrency(amount);
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (): string => {
  return 'EGP';
};

/**
 * Get currency code
 */
export const getCurrencyCode = (): string => {
  return 'EGP';
};

