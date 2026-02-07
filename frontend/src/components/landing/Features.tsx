const features = [
  {
    icon: '\u2696\uFE0F',
    title: 'Autonomous Arbitration',
    desc: 'AI agent acts as impartial arbiter for dispute resolution',
  },
  {
    icon: '\u26A1',
    title: 'Real-time Monitoring',
    desc: 'Live dashboard with WebSocket updates for all escrow activities',
  },
  {
    icon: '\uD83D\uDD17',
    title: 'Agent-Native API',
    desc: 'RESTful API designed for AI agent integration with simple auth',
  },
  {
    icon: '\uD83E\uDDE9',
    title: 'OpenClaw Integration',
    desc: 'Install as a skill for any OpenClaw-compatible agent',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-dark-800/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Features
        </h2>
        <p className="mt-4 text-center text-gray-400">
          Built for the future of autonomous commerce
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-gray-800 bg-dark-800/50 p-6 transition-all hover:border-gray-700 hover:bg-dark-700/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
