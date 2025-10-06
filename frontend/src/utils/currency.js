/**
 * Currency Utility Functions
 * Formats prices in Indian Rupees (₹)
 */

/**
 * Format a number as Indian Rupees
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showDecimals = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  
  const numAmount = Number(amount);
  
  if (showDecimals) {
    return `₹${numAmount.toFixed(2)}`;
  }
  
  return `₹${Math.round(numAmount)}`;
};

/**
 * Format currency for Indian numbering system (with lakhs and crores)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with Indian numbering
 */
export const formatCurrencyIndian = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  
  const numAmount = Number(amount);
  const formatted = numAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `₹${formatted}`;
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbol and commas
  const cleaned = currencyString.replace(/[₹$,]/g, '').trim();
  return parseFloat(cleaned) || 0;
};

export default formatCurrency;