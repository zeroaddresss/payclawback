import { motion } from 'motion/react';
import { fadeUp, motionProps } from '@/lib/motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <motion.div variants={fadeUp} {...motionProps} className="mb-8">
      {badge && (
        <span className="inline-block mb-2 px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
          {badge}
        </span>
      )}
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
