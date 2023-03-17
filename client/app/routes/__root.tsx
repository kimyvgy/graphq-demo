import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";

import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import { createEmotionCache, Group, MantineProvider, useMantineTheme } from "@mantine/core";
import { AppContext } from "~/contexts/app";

import DefaultLayout from "~/components/layout/default";
import { PageNotFound } from "~/components/layout/error";
import { Global } from "@emotion/react";

createEmotionCache({ key: 'mantine' });

export const unstable_shouldReload = () => false;

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
  title: "Viblo CE",
  description: "Technology Articles Platform from Asia, filled with latest information on Programming Languages and Frameworks. Ruby on Rails / PHP / Swift / Unity / Java /.Net",
  keywords: "Programmer, Knowledge Share, Programming, Document Management",
});

export const loader: LoaderFunction = (): AppState => {
  const env: EnvBag = {
    GOOGLE_ANALYTICS_ID,
    GRAPHQL_API_HOST,
  };

  // const authUser: AuthUser | null = null;
  const authUser: AuthUser | null = {
    id: 0,
    accountId: 0,
    name: 'Nguyen Huu Kim',
    username: 'kimyvgy',
    picture: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
  };

  return { authUser, env };
};

export default function Root() {
  const appState = useLoaderData<AppState>();

  return (
    <AppContext.Provider value={appState}>
      <MantineProvider withCSSVariables>
        <AppGlobalStyles />
        <DefaultLayout>
          <Outlet />

          <script
            async
            dangerouslySetInnerHTML={{
              __html: `window.__ENV__ = ${JSON.stringify(appState.env)}`,
            }}
          />

          {appState.env.GOOGLE_ANALYTICS_ID && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${appState.env.GOOGLE_ANALYTICS_ID}`}></script>
              <script defer dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${appState.env.GOOGLE_ANALYTICS_ID}');`
              }} />
            </>
          )}
        </DefaultLayout>
      </MantineProvider>
    </AppContext.Provider>
  )
};

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <MantineProvider withGlobalStyles withCSSVariables>
      <Group position="center" sx={{minHeight: '100vh'}}>
        {caught.status === 404 && <PageNotFound />}
        {caught.status !== 404 && (
          <h1>
            {caught.status} {caught.statusText}
          </h1>
        )}
      </Group>
    </MantineProvider>
  );
};

const AppGlobalStyles = () => {
  const theme = useMantineTheme();

  return (
    <Global styles={{
      '::-webkit-scrollbar': {
        width: '16px',
        background: theme.colors.gray[0],
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: 'hsl(0,0%,43%)',
        borderRadius: '20px',
        border: '4px solid transparent',
        backgroundClip: 'content-box',
      },
      '::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'hsl(0,0%,60%)',
      }
    }} />
  )
}
