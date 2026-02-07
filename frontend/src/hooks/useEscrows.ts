import { useState, useEffect, useCallback } from 'react';
import { fetchEscrows, type Escrow } from '../lib/api';

interface UseEscrowsResult {
  escrows: Escrow[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useEscrows(): UseEscrowsResult {
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchEscrows();
      setEscrows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch escrows');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [load]);

  return { escrows, loading, error, refresh: load };
}
