export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPrice = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + '₫';
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatDiscountPercent = (originalPrice: number, currentPrice: number): string => {
  const discount = calculateDiscount(originalPrice, currentPrice);
  return `-${discount}%`;
};