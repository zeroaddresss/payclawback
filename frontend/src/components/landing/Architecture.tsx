import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { fadeUp, whileInViewProps } from '@/lib/motion';

const flow = [
  { label: 'AI Agents', tech: 'OpenClaw' },
  { label: 'Backend API', tech: 'Hono + Bun' },
  { label: 'Smart Contract', tech: 'Solidity' },
  { label: 'USDC Token', tech: 'Base L2' },
];

const techStack = [
  'Solidity',
  'Base',
  'USDC',
  'Hono',
  'Bun',
  'React',
  'ethers.js',
  'Foundry',
];

export default function Architecture() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <motion.div variants={fadeUp} {...whileInViewProps}>
        <h2 className="text-3xl font-bold text-foreground">Architecture</h2>
        <p className="text-muted-foreground mt-2">
          How the system components connect
        </p>

        {/* Main flow */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2 flex-wrap">
          {flow.map((item, i) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="flex flex-col items-start gap-1">
                <span className="text-foreground font-medium">{item.label}</span>
                <Badge variant="secondary">{item.tech}</Badge>
              </div>
              {i < flow.length - 1 && (
                <span className="text-muted-foreground text-lg hidden sm:inline ml-2">
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Secondary connection */}
        <div className="mt-6 flex items-center gap-2">
          <div className="flex flex-col items-start gap-1">
            <span className="text-foreground font-medium">Frontend</span>
            <Badge variant="secondary">React + Vite</Badge>
          </div>
          <span className="text-muted-foreground text-lg ml-2">&rarr;</span>
          <span className="text-foreground font-medium ml-2">Backend API</span>
        </div>

        {/* Tech Stack */}
        <div className="mt-20">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Tech Stack
          </h3>
          <div className="flex flex-wrap items-start gap-3">
            {techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
