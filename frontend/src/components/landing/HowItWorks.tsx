import { motion } from 'motion/react';
import { fadeUp, whileInViewProps } from '@/lib/motion';

const steps = [
  {
    num: 1,
    title: 'Create',
    desc: 'Depositor creates an escrow with USDC amount and conditions',
  },
  {
    num: 2,
    title: 'Deposit',
    desc: 'USDC is locked in the smart contract until conditions are met',
  },
  {
    num: 3,
    title: 'Deliver',
    desc: 'Beneficiary delivers the agreed service or goods',
  },
  {
    num: 4,
    title: 'Release',
    desc: 'Depositor or arbiter releases funds to beneficiary',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground">How It Works</h2>

      <div className="border-l-2 border-accent/30 ml-6 pl-8 space-y-12 mt-12">
        {steps.map((step) => (
          <motion.div
            key={step.num}
            variants={fadeUp}
            {...whileInViewProps}
            className="relative"
          >
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 text-accent text-sm font-semibold tabular-nums -ml-[2.8rem] bg-surface">
              {step.num}
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
