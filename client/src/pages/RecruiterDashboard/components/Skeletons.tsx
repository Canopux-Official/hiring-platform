import React from "react";
import { Card, Box, Skeleton } from "@mui/material";

export function StatCardSkeleton() {
  return (
    <Card sx={{ p: 3 }}>
      <Skeleton variant="rounded" width={36} height={36} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width="50%" height={40} />
      <Skeleton variant="text" width="70%" />
    </Card>
  );
}

export function JobRowSkeleton() {
  return (
    <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>
      <Skeleton variant="rounded" width={60} height={24} />
    </Box>
  );
}
