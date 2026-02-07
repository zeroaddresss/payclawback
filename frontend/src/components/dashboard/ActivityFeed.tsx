import { useWebSocket } from '../../hooks/useWebSocket';
import { formatAddress, timeAgo } from '../../lib/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
            <p className="py-8 text-center text-sm text-muted-foreground">
              Waiting for events...
            </p>
          ) : (
            events.map((event, i) => (
              <div
                key={`${event.timestamp}-${i}`}
                className="p-3 rounded-md bg-surface-overlay/50 border border-border/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {event.type}
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
