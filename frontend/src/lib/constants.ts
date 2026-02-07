export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const WS_URL = API_URL.replace(/^http/, 'ws');

export const STATE_NAMES: Record<number, string> = {
  0: 'Active',
  1: 'Released',
  2: 'Disputed',
  3: 'Refunded',
  4: 'Expired',
};

export const STATE_COLORS: Record<number, string> = {
  0: 'bg-green-500/20 text-green-400 border-green-500/30',
  1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  3: 'bg-red-500/20 text-red-400 border-red-500/30',
  4: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};
