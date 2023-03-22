import type { Post } from "~/@types/react-apollo.generated";
import type { HeadersFunction } from "@remix-run/cloudflare";

import { gql, useQuery } from "@apollo/client";
import { Box, SimpleGrid } from "@mantine/core"
import ArticleCard from "~/components/articles/article-card";
import Chipbar from "~/components/chipbar";
import QueryResult from "~/components/query-result";

const NEWEST_POSTS = gql`
  query NewestPosts {
    newestPosts {
      slug
      contents_short
      thumbnail_url
      title
    }
  }
`;

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=300",
  };
};

export default function Index() {
  const { data, loading, error } = useQuery(NEWEST_POSTS);

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
          zIndex: 100,
          background: 'white',
          width: 'calc(100% - 240px)',
          boxSizing: 'border-box',
          borderBottom: `solid 1px ${theme.colors.gray[2]}`,
          [theme.fn.smallerThan('md')]: {
            position: 'unset !important',
            top: 'unset',
            left: 'unset',
            zIndex: 'unset',
            width: '100%',
          },
        })}
      />

      <Box p={0} mt={40} sx={(theme) => ({
        [theme.fn.smallerThan('md')]: { marginTop: 'unset' }
      })}>
        <QueryResult data={data} loading={loading} error={error}>
          <SimpleGrid
            p="xl"
            sx={(theme) => ({
              [theme.fn.smallerThan('sm')]: {
                padding: 0,
              }
            })}
            cols={4}
            spacing="xl"
            breakpoints={[
              { maxWidth: 'sm', cols: 1 },
              { maxWidth: 'lg', cols: 3 },
            ]}
          >
            {data?.newestPosts.map((post: Post, index: number) => {
              return (
                <ArticleCard
                  key={index}
                  post={post}
                  image="https://i.imgur.com/Cij5vdL.png"
                  link="http://localhost:8787"
                />
              )
            })}
          </SimpleGrid>
        </QueryResult>
      </Box>
    </Box>
  );
}
