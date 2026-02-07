import StatsBar from '../components/dashboard/StatsBar';
import EscrowTable from '../components/dashboard/EscrowTable';
import ActivityFeed from '../components/dashboard/ActivityFeed';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Monitor escrow activity in real-time
        </p>
      </div>

      <div className="space-y-6">
        <StatsBar />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
