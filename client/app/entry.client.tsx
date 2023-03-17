import { RemixBrowser } from '@remix-run/react';
import { hydrate } from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ClientProvider } from '@mantine/remix';

const client = new ApolloClient({
  ssrMode: false,
  uri: window.__ENV__.GRAPHQL_API_HOST,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    },
  },
});

hydrate(
  <ApolloProvider client={client}>
    <ClientProvider>
      <RemixBrowser />
    </ClientProvider>
  </ApolloProvider>,
  document
);
