function Box({ label, sub, accent }: { label: string; sub: string; accent: string }) {
  return (
    <div className={`rounded-lg border ${accent} bg-dark-800/80 px-4 py-3 text-center min-w-[120px]`}>
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
    </div>
  );
}

function Arrow({ horizontal = true }: { horizontal?: boolean }) {
  if (horizontal) {
    return (
      <div className="flex items-center px-2">
        <div className="h-px w-8 bg-gradient-to-r from-gray-600 to-gray-500" />
        <div className="border-t-[5px] border-b-[5px] border-l-[6px] border-transparent border-l-gray-500" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-6 bg-gradient-to-b from-gray-600 to-gray-500" />
      <div className="border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-gray-500" />
    </div>
  );
}

const techBadges = [
  'Solidity', 'Base', 'USDC', 'Hono', 'Bun', 'React', 'ethers.js', 'Foundry',
];

export default function Architecture() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Architecture
        </h2>
        <p className="mt-4 text-center text-gray-400">
          How the system components connect
        </p>

        {/* Architecture diagram */}
        <div className="mt-12 flex flex-col items-center gap-2">
          {/* Top row: Agents -> Backend -> Smart Contract -> USDC */}
          <div className="flex items-center flex-wrap justify-center gap-0">
            <Box label="AI Agents" sub="OpenClaw Skills" accent="border-indigo-500/30" />
            <Arrow />
            <Box label="Backend API" sub="Hono + Bun" accent="border-blue-500/30" />
            <Arrow />
            <Box label="Smart Contract" sub="USDCEscrow.sol" accent="border-green-500/30" />
            <Arrow />
            <Box label="USDC Token" sub="Base L2" accent="border-yellow-500/30" />
          </div>

          {/* Connector from Frontend up to Backend */}
          <Arrow horizontal={false} />

          <div className="flex items-center gap-0">
            <Box label="Frontend" sub="React + Vite" accent="border-blue-500/30" />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20">
          <h3 className="text-center text-xl font-semibold text-white mb-8">
            Tech Stack
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {techBadges.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-700 bg-white/5 px-4 py-1.5 text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
