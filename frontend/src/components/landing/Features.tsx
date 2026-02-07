import { motion } from 'motion/react';
import { Shield, Activity, Link2, Brain } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { staggerContainer, fadeUp, whileInViewProps } from '@/lib/motion';

const features = [
  {
    icon: Shield,
    title: 'Autonomous Arbitration',
    desc: 'AI agent acts as impartial arbiter for dispute resolution',
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    desc: 'Live dashboard with WebSocket updates for all escrow activities',
  },
  {
    icon: Link2,
    title: 'Agent-Native API',
    desc: 'RESTful API designed for AI agent integration with simple auth',
  },
  {
    icon: Brain,
    title: 'OpenClaw Integration',
    desc: 'Install as a skill for any OpenClaw-compatible agent',
  },
];

export default function Features() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground">Features</h2>
      <p className="text-muted-foreground mt-2">
        Built for the future of autonomous commerce
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12"
        variants={staggerContainer}
        {...whileInViewProps}
      >
        {features.map((f) => (
          <motion.div key={f.title} variants={fadeUp}>
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
