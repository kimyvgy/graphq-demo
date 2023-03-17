import { Navbar, Group, ScrollArea, createStyles, Box, Burger } from '@mantine/core';
import {
  IconNotes,
  IconCalendarStats,
  IconAdjustments,
  IconLock,
  IconHome,
  IconVideo,
} from '@tabler/icons';
import { LinksGroup } from './navbar-links-group';
import { Link } from '@remix-run/react';
import { useDisclosure } from '@mantine/hooks';

const mockdata = [
  { label: 'Home', icon: IconHome, href: '/' },
  {
    label: 'Posts',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Newest', link: '/newest' },
      { label: 'Trending', link: '/trending' },
      { label: 'Editors\' Choice', link: '/editors-choice' },
      { label: 'Series', link: '/series' },
    ],
  },
  { label: 'Videos', icon: IconVideo, href: '/videos' },
  {
    label: 'Questions',
    icon: IconCalendarStats,
    links: [
      { label: 'Newest', link: '/questions' },
      { label: 'Unsolved', link: '/questions/unsolved' },
    ],
  },
  {
    label: 'Followings',
    icon: IconCalendarStats,
    links: [
      { label: 'Posts', link: '/posts/followings' },
      { label: 'Questions', link: '/questions/followings' },
    ],
  },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    height: '100vh',
    top: 0,
    left: 0,
  },

  header: {
    padding: theme.spacing.md,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },
}));

export default function NavbarNested() {
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Navbar
      p="md"
      width={{ sm: 240 }}
      hidden={true}
      hiddenBreakpoint="md"
      className={classes.navbar}
      withBorder={false}
    >
      <Navbar.Section className={classes.header}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="md" />

          <Box
            component={Link}
            to="/"
            prefetch="intent"
            sx={{
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box component="img" src="/logo_full.svg" sx={{height: 24}} alt="Viblo Logo" />
          </Box>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        {links}
      </Navbar.Section>
    </Navbar>
  );
}
