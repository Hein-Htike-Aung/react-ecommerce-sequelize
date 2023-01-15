import { Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const TableSkeleton = () => {
  return (
    <Box
      sx={{
        height: "max-content",
      }}
    >
      {[...Array(10)].map((_, idx) => (
        <Skeleton key={idx} variant="rectangular" sx={{ my: 4, mx: 1 }} />
      ))}
    </Box>
  );
};

export default TableSkeleton;
