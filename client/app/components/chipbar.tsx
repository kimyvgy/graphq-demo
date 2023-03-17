import type { ScrollAreaProps} from "@mantine/core";

import { Badge, Box, Group, ScrollArea, useMantineTheme } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";

const topics = [
  {name: 'All', href: '/'},
  {name: 'PHP', href: '/tags/php'},
  {name: 'Laravel', href: '/tags/laravel'},
  {name: 'JavaScript', href: '/tags/javascript'},
  {name: 'Golang', href: '/tags/golang'},
  {name: 'Rust', href: '/tags/rust'},
  {name: 'Docker', href: '/tags/docker'},
  {name: 'Kubernetes', href: '/tags/kubernetes'},
  {name: 'AWS', href: '/tags/aws'},
  {name: 'C++', href: '/tags/cpp'},
  {name: 'Nginx', href: '/tags/nginx'},
];

export default function Chipbar(props: ScrollAreaProps) {
  const location = useLocation();
  const theme = useMantineTheme();

  return (
    <ScrollArea type="never" {...props}>
      <Group noWrap>
        {topics.map((topic, index) => (
          <Badge
            key={index}
            size="lg"
            component={Link}
            to={topic.href}
            prefetch="intent"
            styles={{
              root: {
                cursor: 'pointer',
                background: location.pathname === topic.href ? theme.colors.blue[2] : theme.colors.gray[2],
                ':hover, :actived': {
                  background: theme.colors.gray[3],
                }
              },
            }}
          >
            <Box
              component="span"
              sx={{
                textTransform: 'capitalize',
                fontWeight: 'normal',
                color: 'black',
              }}
            >
              {topic.name}
            </Box>
          </Badge>
        ))}
      </Group>
    </ScrollArea>
  );
}
