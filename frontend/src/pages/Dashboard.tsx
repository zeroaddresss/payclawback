import StatsBar from '../components/dashboard/StatsBar';
import EscrowTable from '../components/dashboard/EscrowTable';
import ActivityFeed from '../components/dashboard/ActivityFeed';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <img src="/logo-no-bg.png" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-foreground">ClawBack Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time escrow monitoring on Base
        </p>
      </div>

      <div className="space-y-8">
        <StatsBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EscrowTable />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
