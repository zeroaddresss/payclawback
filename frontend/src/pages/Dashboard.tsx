import StatsBar from '../components/dashboard/StatsBar';
import EscrowTable from '../components/dashboard/EscrowTable';
import ActivityFeed from '../components/dashboard/ActivityFeed';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor escrow activity in real-time
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
