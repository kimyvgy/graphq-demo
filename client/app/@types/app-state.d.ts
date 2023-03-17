export {};

declare global {
  interface EnvBag {
    GOOGLE_ANALYTICS_ID: string;
    GRAPHQL_API_HOST: string;
  }

  interface AuthUser {
    id: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    accountId: number;
    name: string;
    username: string;
    picture?: string | null;
    isAdmin?: boolean;
  }

  interface AppState {
    authUser: AuthUser | null;
    env: EnvBag;
  }
}
