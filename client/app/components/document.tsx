import { Box } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import { Links, LiveReload, Meta, Scripts, ScrollRestoration } from "@remix-run/react";

interface DocumentProps {
  children: React.ReactNode;
}

export default function Document({ children }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <StylesPlaceholder />
      </head>
      <Box m={0} component="body">
        {children}

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Box>
    </html>
  );
}
