export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-dark-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Built for OpenClaw USDC Hackathon
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              GitHub
            </a>
            <a
              href="https://basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              BaseScan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
