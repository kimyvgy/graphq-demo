import {
  Avatar,
  createStyles,
  Group,
  Menu,
  UnstyledButton,
  Header as BaseHeader,
  useMantineTheme,
  Button,
  Input,
  Box,
  ActionIcon,
} from '@mantine/core';
import { Link } from '@remix-run/react';
import {
  IconChevronDown, IconHeart, IconMessage, IconStar, IconSettings,
  IconSwitchHorizontal, IconLogout, IconPlayerPause, IconTrash,
  IconSearch, IconUserCircle, IconBell, IconNotification,
} from '@tabler/icons';
import { useContext, useState } from 'react';
import { AppContext } from '~/contexts/app';

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    // Media query with value from theme
    [theme.fn.largerThan('md')]: {
      width: `calc(100% - 240px)`,
    },
    // Media query with value from theme
    [theme.fn.smallerThan('md')]: {
      position: 'unset',
      width: '100%',
    },
  },
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
  },
  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
}));

export default function Header() {
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const theme = useMantineTheme();
  const { authUser } = useContext(AppContext);

  return (
    <BaseHeader
      height={64}
      p="xs"
      className={classes.header}
      position={{top: 0, right: 0}}
      withBorder={false}
    >
      <Group
        align="center"
        sx={{
          display: 'none',
          [theme.fn.smallerThan('md')]: {
            flex: 1,
            display: 'flex',
          }
        }}
      >
        <Box
          component={Link}
          to="/"
          prefetch="intent"
          sx={{display: 'flex', alignItems: 'center'}}
        >
          <Box
            component="img"
            src="/logo_full.svg"
            sx={{height: 26}}
          />
        </Box>
      </Group>

      <Group
        position="center"
        sx={(theme) => ({
          flex: 1,
          [theme.fn.smallerThan('md')]: {
            display: 'none',
          },
        })}
      >
        <Box sx={{
          width: '60%',
          [theme.fn.largerThan('xl')]: {
            width: '50%',
          },
        }}>
          <Input
            placeholder="Search"
            icon={<IconSearch size={16} stroke={1.5} />}
          />
        </Box>
      </Group>

      <Group mx={16}>
        <ActionIcon
          color="dark"
          size="lg"
          radius="xl"
          component={Link}
          to="/announcements"
          prefetch="intent"
        >
          <IconNotification size={24} stroke={1} />
        </ActionIcon>

        {authUser !== null && (
          <ActionIcon
            color="dark"
            size="lg"
            radius="xl"
            component={Link}
            to="/notifications"
            prefetch="intent"
          >
            <IconBell size={24} stroke={1} />
          </ActionIcon>
        )}

        {authUser === null && (
          <Button
            leftIcon={<IconUserCircle size={16} stroke={1.5} />}
            variant="outline"
          >
            Sign in
          </Button>
        )}
      </Group>

      {authUser !== null && (
        <Group ml={16}>
          <Menu
            width={260}
            position="bottom-end"
            transition="pop-top-right"
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group spacing={7} mr={8}>
                  <Avatar src={authUser.picture} alt={authUser.name} radius="xl" size={40} />
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconHeart size={14} color={theme.colors.red[6]} stroke={1.5} />}>
                Liked posts
              </Menu.Item>
              <Menu.Item icon={<IconStar size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                Saved posts
              </Menu.Item>
              <Menu.Item icon={<IconMessage size={14} color={theme.colors.blue[6]} stroke={1.5} />}>
                Your comments
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>
              <Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5} />}>
                Change account
              </Menu.Item>
              <Menu.Item icon={<IconLogout size={14} stroke={1.5} />}>Logout</Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<IconPlayerPause size={14} stroke={1.5} />}>
                Pause subscription
              </Menu.Item>
              <Menu.Item color="red" icon={<IconTrash size={14} stroke={1.5} />}>
                Delete account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
    </BaseHeader>
  );
}
