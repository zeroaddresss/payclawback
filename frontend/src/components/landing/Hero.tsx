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
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
          >
            Trustless USDC Escrow for AI Agents
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-muted-foreground max-w-xl"
          >
            Autonomous escrow service powered by smart contracts on Base.
            Secure, instant, transparent.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10">
            <Button asChild size="lg">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
