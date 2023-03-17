import { createContext } from "react";

const defaultEnv = () => ({
  GOOGLE_ANALYTICS_ID: '',
  GRAPHQL_API_HOST: '',
});

export const AppContext = createContext<AppState>({
  authUser: null,
  env: defaultEnv(),
});
