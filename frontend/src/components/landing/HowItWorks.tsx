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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-4 text-center text-gray-400">
          Four simple steps to secure your transactions
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.num} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-blue-500/50 to-indigo-500/50 lg:block" />
              )}

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold text-lg">
                {step.num}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
