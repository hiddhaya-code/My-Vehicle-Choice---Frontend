import { VehicleCategory } from '../types';

/**
 * Formats a number to Indian Currency notation.
 * e.g. 1115000 -> "₹11.15 Lakh"
 *      20150000 -> "₹2.01 Crore"
 *      92000 -> "₹92,000"
 */
export function formatIndianPrice(amount?: number | null, fullFormat: boolean = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Price on request';
  }

  if (fullFormat) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)} Lakh`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const formatPriceINR = formatIndianPrice;

export function formatCategoryName(category: VehicleCategory): string {
  switch (category) {
    case 'CAR':
      return 'Car';
    case 'MOTORCYCLE':
      return 'Motorcycle';
    case 'SCOOTER':
      return 'Scooter';
    case 'ELECTRIC_CAR':
      return 'Electric Car';
    case 'ELECTRIC_TWO_WHEELER':
      return 'Electric 2-Wheeler';
    default:
      return category;
  }
}
