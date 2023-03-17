import { IconBookmark, IconHeart, IconShare } from '@tabler/icons';
import {
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Center,
  Avatar,
  createStyles,
} from '@mantine/core';
import type { Post } from '~/@types/react-apollo.generated';

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  rating: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: 'none',
  },

  title: {
    display: 'block',
    fontSize: '1.125rem',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs / 2,
    [theme.fn.smallerThan('sm')]: {
      fontSize: '1.375rem',
      fontWeight: 500,
      marginBottom: theme.spacing.xs,
    }
  },

  action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));

interface ArticleCardProps {
  link: string;
  image: string;
  post: Post;
  rating?: string;
}

export default function ArticleCard({
  className,
  image,
  post,
  link,
  rating,
  ...others
}: ArticleCardProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof ArticleCardProps>) {
  const { classes, cx, theme } = useStyles();
  const linkProps = { href: link, target: '_blank', rel: 'noopener noreferrer' };

  return (
    <Card radius={0} className={cx(classes.card, className)} {...others}>
      <Card.Section>
        <a {...linkProps}>
          <Image src={post.thumbnail_url as string|undefined} height={180} />
        </a>
      </Card.Section>

      {
        rating && (
          <Badge className={classes.rating} variant="gradient" gradient={{ from: 'yellow', to: 'red' }}>
            {rating}
          </Badge>
        )
      }

      <Text className={classes.title} weight="bold" component="a" {...linkProps}>
        {post.title}
      </Text>

      <Text size="sm" color="#292929" lineClamp={4}>
        {post.previewContent}
      </Text>


      <Group position="apart" className={classes.footer}>
        <Center>
          <Avatar src={image} size={24} radius="xl" mr="xs" />
          <Text size="sm" inline>
            {post.author?.name}
          </Text>
        </Center>

        <Group spacing={8} mr={0}>
          <ActionIcon className={classes.action}>
            <IconHeart size={16} color={theme.colors.red[6]} />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <IconBookmark size={16} color={theme.colors.yellow[7]} />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <IconShare size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}
