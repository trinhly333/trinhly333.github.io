// VietQR Generation for Vietnamese Banks
export interface VietQRConfig {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
}

export const generateVietQR = (config: VietQRConfig): string => {
  const { bankCode, accountNumber, accountName, amount, description } = config;
  
  // VietQR API endpoint (using the official VietQR service)
  const baseUrl = 'https://img.vietqr.io/image';
  const template = 'compact2'; // or 'print', 'compact', etc.
  
  // Format amount (remove decimals for VND)
  const formattedAmount = Math.round(amount);
  
  // URL encode the description
  const encodedDescription = encodeURIComponent(description);
  
  // Generate QR code URL
  const qrUrl = `${baseUrl}/${bankCode}-${accountNumber}-${template}.png?amount=${formattedAmount}&addInfo=${encodedDescription}&accountName=${encodeURIComponent(accountName)}`;
  
  return qrUrl;
};

export const MB_BANK_CONFIG = {
  bankCode: 'MB',
  accountNumber: '2111722834899',
  accountName: 'TRINH KHANH LY'
};

export const generateOrderQR = (orderTotal: number, orderCode: string, productName: string): string => {
  return generateVietQR({
    ...MB_BANK_CONFIG,
    amount: orderTotal,
    description: `${orderCode} - ${productName}`
  });
};