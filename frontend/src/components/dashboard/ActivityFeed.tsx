import { useWebSocket } from '../../hooks/useWebSocket';
import { formatAddress, timeAgo } from '../../lib/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, ArrowRight, AlertTriangle, CheckCircle, Clock, type LucideIcon } from 'lucide-react';

const EVENT_CONFIG: Record<string, { icon: LucideIcon; label: string; colorClass: string }> = {
  EscrowCreated: { icon: Plus, label: 'Created', colorClass: 'text-accent' },
  EscrowReleased: { icon: ArrowRight, label: 'Released', colorClass: 'text-green-400' },
  EscrowDisputed: { icon: AlertTriangle, label: 'Disputed', colorClass: 'text-[#c27c5e]' },
  EscrowResolved: { icon: CheckCircle, label: 'Resolved', colorClass: 'text-accent' },
  EscrowExpired: { icon: Clock, label: 'Expired', colorClass: 'text-muted-foreground' },
};

export default function ActivityFeed() {
  const events = useWebSocket();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Feed</CardTitle>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Live
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] space-y-2 overflow-y-auto">
          {events.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Listening for events...
              </span>
            </div>
          ) : (
            events.map((event, i) => {
              const config = EVENT_CONFIG[event.type];
              const Icon = config?.icon ?? Plus;
              const label = config?.label ?? event.type;
              const colorClass = config?.colorClass ?? 'text-muted-foreground';

              return (
                <div
                  key={`${event.timestamp}-${i}`}
                  className="p-3 rounded-md bg-surface-overlay/50 border border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-2 text-sm font-medium ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(event.timestamp)}
                    </span>
                  </div>
                  {event.escrowId && (
                    <p className="mt-1 text-xs text-muted-foreground font-mono">
                      Escrow #{event.escrowId}
                    </p>
                  )}
                  {event.txHash && (
                    <a
                      href={`https://basescan.org/tx/${event.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-accent hover:text-accent/80"
                    >
                      {formatAddress(event.txHash)}
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
