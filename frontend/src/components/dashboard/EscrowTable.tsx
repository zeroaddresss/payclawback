import { useEscrows } from '../../hooks/useEscrows';
import { STATE_NAMES, STATE_VARIANTS } from '../../lib/constants';
import { formatAddress, formatUSDC, formatDate } from '../../lib/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrows</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-md bg-muted/50"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EscrowTable() {
  const { escrows, loading, error } = useEscrows();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <p className="text-destructive">Error loading escrows: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrows</CardTitle>
      </CardHeader>
      <CardContent>
        {escrows.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center">
            <img src="/logo-no-bg.png" className="h-16 w-16 opacity-30 mb-4" alt="" />
            <p className="text-muted-foreground">No escrows yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Depositor</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrows.map((e) => (
                <TableRow key={e.id} className="hover:bg-surface-overlay/50">
                  <TableCell className="font-mono tabular-nums text-muted-foreground">
                    #{e.id}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {formatAddress(e.depositor)}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {formatAddress(e.beneficiary)}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums text-foreground font-medium">
                    {formatUSDC(e.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATE_VARIANTS[e.state]}>
                      {STATE_NAMES[e.state] || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(e.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(e.deadline)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
