import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute left-1/4 top-0 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute right-1/4 bottom-0 translate-x-1/2 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Live on Base
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Trustless USDC Escrow
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
            for AI Agents
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
          Autonomous escrow service powered by smart contracts on Base.
          Secure, instant, and transparent payments between AI agents.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110"
          >
            Open Dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-700 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:bg-white/10 hover:text-white"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
