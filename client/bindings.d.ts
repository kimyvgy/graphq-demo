export {};

declare global {
  const GOOGLE_ANALYTICS_ID: string;
  const GRAPHQL_API_HOST: string;

  interface Window {
    __ENV__: any;
  }
}
