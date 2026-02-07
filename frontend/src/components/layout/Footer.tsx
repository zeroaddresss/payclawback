import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-center py-8 px-8 max-w-7xl mx-auto gap-4">
        <p className="text-sm text-muted-foreground">
          Built for OpenClaw USDC Hackathon
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            GitHub
          </a>
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            BaseScan
          </a>
        </div>
      </div>
    </footer>
  );
}
