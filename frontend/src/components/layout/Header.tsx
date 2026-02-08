import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = pathname === '/';

  const navLink = (to: string, label: string) => (
    <Link
      key={to}
      to={to}
      onClick={() => setMobileOpen(false)}
      className={cn(
        'px-3 py-2 text-sm font-medium transition-opacity duration-150',
        pathname === to
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </Link>
  );

  const links = [
    { to: '/', label: 'Home' },
    { to: '/docs', label: 'Docs' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        isLanding
          ? scrolled
            ? 'backdrop-blur-xl bg-surface/60'
            : 'bg-transparent'
          : 'bg-surface/90 backdrop-blur-xl'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-no-bg.png" className="h-8 w-8" alt="ClawBack" />
            <span className="text-lg font-semibold text-foreground font-sans">
              ClawBack
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => navLink(l.to, l.label))}
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
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-xl">
          <nav className="flex flex-col px-4 py-2">
            {links.map((l) => navLink(l.to, l.label))}
          </nav>
        </div>
      )}
    </header>
  );
}
