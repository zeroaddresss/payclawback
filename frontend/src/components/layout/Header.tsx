import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
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

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        scrolled ? 'backdrop-blur-xl bg-surface/60' : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-semibold text-foreground font-sans">
              USDC Escrow
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLink('/', 'Home')}
            {navLink('/dashboard', 'Dashboard')}
          </nav>
        </div>
      </div>
    </header>
  );
}
