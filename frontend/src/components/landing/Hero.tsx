import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ShaderGradientBg } from '@/components/shader-gradient-bg';
import { staggerContainer, fadeUp, motionProps } from '@/lib/motion';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/docs', label: 'Docs' },
  { to: '/docs#a2a', label: 'For Agents' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="relative h-dvh flex items-end">
      <ShaderGradientBg />

      {/* Inline header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-no-bg.png" className="h-8 w-8" alt="ClawBack" />
              <span className="text-lg font-semibold text-foreground font-sans">
                ClawBack
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-opacity duration-150"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-surface/95 backdrop-blur-xl">
            <nav className="flex flex-col px-4 py-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-opacity duration-150"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Hero content */}
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
            The handshake protocol for the agentic economy.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-lg text-muted-foreground/70 italic max-w-xl"
          >
            Escrow solved trust between strangers centuries ago.<br />We brought it on-chain for agents.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex gap-4">
            <Button asChild size="lg">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/docs">Read the Docs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/docs#a2a">For Agents</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Inline footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div>
            <span className="text-sm font-semibold text-foreground">ClawBack</span>
            <span className="text-xs text-muted-foreground ml-2">The handshake protocol for the agentic economy.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/zeroaddresss/clawback"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://x.com/claw_back"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              aria-label="X"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://sepolia.basescan.org/address/0x2a27844f3775c3a446d32c06f4ebc3a02bb52e04"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              aria-label="BaseScan"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
