
import { Card, Skeleton, TableRow, TableCell } from "@mui/material";

export function StatCardSkeleton() {
  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Skeleton variant="rounded" width={40} height={40} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width="45%" height={44} />
      <Skeleton variant="text" width="65%" />
    </Card>
  );
}

export function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton variant="text" width={i === 0 ? "80%" : "60%"} />
        </TableCell>
      ))}
    </TableRow>
  );
}
