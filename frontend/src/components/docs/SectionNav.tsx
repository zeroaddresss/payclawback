import { cn } from '@/lib/utils';

interface SectionNavProps {
  sections: Array<{ id: string; label: string }>;
  activeSection: string;
  onNavigate: (id: string) => void;
}

export default function SectionNav({ sections, activeSection, onNavigate }: SectionNavProps) {
  return (
    <nav className="hidden lg:block sticky top-24 space-y-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => {
            onNavigate(section.id);
            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cn(
            'block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors',
            activeSection === section.id
              ? 'text-accent border-l-2 border-accent bg-accent/5'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
