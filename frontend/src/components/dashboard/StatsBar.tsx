import { useState, useEffect } from 'react';
import { fetchStats, type Stats } from '../../lib/api';
import { formatUSDC } from '../../lib/formatters';

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
    const interval = setInterval(() => {
      fetchStats().then(setStats).catch(() => {});
    }, 15_000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: 'Total Escrows',
      value: stats?.total ?? '--',
      color: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Total Volume',
      value: stats ? formatUSDC(stats.volume) : '--',
      color: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Active Escrows',
      value: stats?.active ?? '--',
      color: 'from-indigo-500/20 to-indigo-600/10',
      border: 'border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-xl border ${c.border} bg-gradient-to-br ${c.color} p-5`}
        >
          <p className="text-sm text-gray-400">{c.label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
