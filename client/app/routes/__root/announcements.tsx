import { Box } from "@mantine/core";
import { useLocation } from "@remix-run/react";

export default function AnnouncementsPage() {
  const location = useLocation();

  return (
    <Box p="md">
      <h1>
        {location.pathname}
      </h1>
    </Box>
  );
}
