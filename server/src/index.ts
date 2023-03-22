import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { RESTDataSource } from '@apollo/datasource-rest';

class VibloAPI extends RESTDataSource {
  override baseURL = 'https://viblo.asia/api/';

  async getNewestPosts(page: number = 1, limit: number = 20) {
    try {
      const { data } = await this.get(`posts/newest?limit=${limit}&page=${page}`);

      return data.map((post) => {
        return {
          id: post.id,
          slug: post.slug,
          title: post.title,
          user_id: post.user_id,
          thumbnail_url: post.thumbnail_url,
          contents_short: post.contents_short,
          contents: post.contents,
        }
      });
    } catch (e) {
      return [];
    }
  }
}

interface MyContext {
  dataSources: {
    vibloAPI: VibloAPI,
  }
}

const typeDefs = `#graphql
  # Bài viết trên Viblo
  type Post {
    id: ID!
    slug: String!
    title: String!
    user_id: Int!
    thumbnail_url: String
    contents_short: String
    contents: String
  }

  type Query {
    # Truy vấn bài viết theo thứ tự mới nhất ở đầu
    newestPosts(page: Int, limit: Int): [Post!]!
  }
`

const resolvers = {
  Query: {
    newestPosts: async (_, { page, limit }, { dataSources }) => {
      return dataSources.vibloAPI.getNewestPosts(page, limit);
    },
  }
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        vibloAPI: new VibloAPI({ cache }),
      }
    }
  }
});

console.log(`GraphQL server is starting at ${url}`);
