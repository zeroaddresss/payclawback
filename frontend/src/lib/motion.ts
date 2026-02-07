import type { Variants } from 'motion/react';

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const motionProps = prefersReducedMotion
  ? {}
  : {
      initial: 'hidden' as const,
      animate: 'show' as const,
    };

export const whileInViewProps = prefersReducedMotion
  ? {}
  : {
      initial: 'hidden' as const,
      whileInView: 'show' as const,
      viewport: { once: true, margin: '-64px' },
    };
