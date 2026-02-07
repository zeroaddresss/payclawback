import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { staggerContainer, fadeUp, motionProps } from '../../lib/motion';
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
      accent: false,
    },
    {
      label: 'Total Volume',
      value: stats ? formatUSDC(stats.volume) : '--',
      accent: true,
    },
    {
      label: 'Active Escrows',
      value: stats?.active ?? '--',
      accent: false,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      {...motionProps}
      variants={staggerContainer}
    >
      {cards.map((c) => (
        <motion.div key={c.label} variants={fadeUp}>
          <Card className={c.accent ? 'border-l-2 border-l-accent' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums font-sans text-foreground">
                {c.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
