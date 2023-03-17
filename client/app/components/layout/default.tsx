import {
  AppShell,
  useMantineTheme,
} from '@mantine/core';

import Header from '../header';
import Navbar from '../navbar/navbar';

interface DefaultLayoutProps {
  children?: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const theme = useMantineTheme();

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          padding: 0,
          paddingLeft: 240,
          marginTop: 64,
          [theme.fn.smallerThan('md')]: {
            paddingLeft: 0,
            marginTop: 'unset',
          }
        },
      }}
      navbarOffsetBreakpoint="md"
      navbar={<Navbar />}
      header={<Header />}
    >
      {children}
    </AppShell>
  );
}
