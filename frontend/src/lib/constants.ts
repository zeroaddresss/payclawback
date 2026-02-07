export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const WS_URL = API_URL.replace(/^http/, 'ws');

export const STATE_NAMES: Record<number, string> = {
  0: 'Active',
  1: 'Released',
  2: 'Disputed',
  3: 'Refunded',
  4: 'Expired',
};

// Maps to Badge component variant prop
export const STATE_VARIANTS: Record<number, 'accent' | 'default' | 'warm' | 'destructive' | 'secondary'> = {
  0: 'accent',      // Active - teal
  1: 'default',     // Released - primary
  2: 'warm',        // Disputed - coral
  3: 'destructive', // Refunded - red
  4: 'secondary',   // Expired - muted
};
