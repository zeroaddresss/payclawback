import { useWebSocket } from '../../hooks/useWebSocket';
import { formatAddress, timeAgo } from '../../lib/formatters';

export default function ActivityFeed() {
  const events = useWebSocket();

  return (
    <div className="rounded-xl border border-gray-800 bg-dark-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Waiting for events...
          </p>
        ) : (
          events.map((event, i) => (
            <div
              key={`${event.timestamp}-${i}`}
              className="rounded-lg border border-gray-800/50 bg-white/[0.02] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {event.type}
                </span>
                <span className="text-xs text-gray-500">
                  {timeAgo(event.timestamp)}
                </span>
              </div>
              {event.escrowId && (
                <p className="mt-1 text-xs text-gray-400">
                  Escrow #{event.escrowId}
                </p>
              )}
              {event.txHash && (
                <a
                  href={`https://basescan.org/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-blue-400 hover:text-blue-300"
                >
                  {formatAddress(event.txHash)}
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
