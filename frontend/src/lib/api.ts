import { API_URL } from './constants';

export interface Escrow {
  id: string;
  depositor: string;
  beneficiary: string;
  arbiter: string;
  amount: string;
  state: number;
  createdAt: string;
  deadline: string;
  txHash?: string;
}

export interface Stats {
  total: number;
  active: number;
  released: number;
  disputed: number;
  volume: string;
}

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchEscrows(): Promise<Escrow[]> {
  const data = await fetchJSON<{ escrows: Escrow[]; count: number }>('/api/escrows');
  return data.escrows;
}

export function fetchEscrow(id: string): Promise<Escrow> {
  return fetchJSON<Escrow>(`/api/escrows/${id}`);
}

export function fetchStats(): Promise<Stats> {
  return fetchJSON<Stats>('/api/stats');
}
