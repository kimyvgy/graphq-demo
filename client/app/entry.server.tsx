import type { EntryContext } from '@remix-run/cloudflare';
import { renderToString } from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import { injectStyles, createStylesServer } from '@mantine/remix';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const server = createStylesServer();

const client = new ApolloClient({
  ssrMode: true,
  uri: 'http://localhost:8788',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    },
  },
});

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <ApolloProvider client={client}>
      <RemixServer context={remixContext} url={request.url} />
    </ApolloProvider>
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${injectStyles(markup, server)}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
