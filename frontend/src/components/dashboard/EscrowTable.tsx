import { useEscrows } from '../../hooks/useEscrows';
import { STATE_NAMES, STATE_COLORS } from '../../lib/constants';
import { formatAddress, formatUSDC, formatDate } from '../../lib/formatters';

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-12 animate-pulse rounded-lg bg-white/5"
        />
      ))}
    </div>
  );
}

export default function EscrowTable() {
  const { escrows, loading, error } = useEscrows();

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-dark-800/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Escrows</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-red-400">Error loading escrows: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-dark-800/50 overflow-hidden">
      <div className="p-6 pb-4">
        <h2 className="text-lg font-semibold text-white">Escrows</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-gray-800 text-left text-xs uppercase text-gray-500">
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Depositor</th>
              <th className="px-6 py-3 font-medium">Beneficiary</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">State</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {escrows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  No escrows found
                </td>
              </tr>
            ) : (
              escrows.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-3 font-mono text-gray-300">#{e.id}</td>
                  <td className="px-6 py-3 font-mono text-gray-400">
                    {formatAddress(e.depositor)}
                  </td>
                  <td className="px-6 py-3 font-mono text-gray-400">
                    {formatAddress(e.beneficiary)}
                  </td>
                  <td className="px-6 py-3 font-medium text-white">
                    {formatUSDC(e.amount)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATE_COLORS[e.state] || ''}`}
                    >
                      {STATE_NAMES[e.state] || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {formatDate(e.createdAt)}
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {formatDate(e.deadline)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
