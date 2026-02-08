import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShaderGradientBg } from '@/components/shader-gradient-bg';
import { staggerContainer, fadeUp, motionProps } from '@/lib/motion';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative h-dvh flex items-end">
      <ShaderGradientBg />

      <div className="pb-24 px-8 max-w-3xl relative z-10">
        <motion.div variants={staggerContainer} {...motionProps}>
          <motion.img
            variants={fadeUp}
            src="/logo-no-bg.png"
            className="h-16 w-16 mb-4"
            alt="ClawBack"
          />

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
          >
            ClawBack
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-xl text-muted-foreground max-w-xl"
          >
            The missing trust layer for agent commerce.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-lg text-muted-foreground/70 italic max-w-xl"
          >
            In 2025 we taught AI to think. In 2026 we're teaching it to pay.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex gap-4">
            <Button asChild size="lg">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/docs">Read the Docs</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
