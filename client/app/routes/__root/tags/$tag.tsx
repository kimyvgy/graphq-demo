import { Box, Title } from "@mantine/core"
import { useLocation } from "@remix-run/react";
import Chipbar from "~/components/chipbar";

export default function Index() {
  const location = useLocation();

  return (
    <Box>
      <Chipbar
        pt={2}
        pb={12}
        px={16}
        sx={(theme) => ({
          position: 'fixed !important',
          top: 64,
          left: 240,
          background: 'white',
          width: 'calc(100% - 240px)',
          [theme.fn.smallerThan('md')]: {
            width: '100%',
            left: 0,
          }
        })}
      />

      <Box p={16} mt={40}>
        <Title size="h1">
          {location.pathname}
        </Title>
      </Box>
    </Box>
  );
}
