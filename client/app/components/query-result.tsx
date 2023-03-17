import type { ApolloError } from '@apollo/client';
import { Box, LoadingOverlay } from '@mantine/core';
import _isEmpty from 'lodash/isEmpty';

interface QueryResultProps {
  loading: boolean;
  error?: ApolloError | undefined;
  data: any;
  children: any;
};

/**
 * Query Results conditionally renders Apollo useQuery hooks states:
 * loading, error or its children when data is ready
 */
const QueryResult = ({ loading, error, data, children }: QueryResultProps) => {
  if (error) {
    return <p className="text-red2">ERROR: {error.message}</p>;
  }

  if (loading && _isEmpty(data)) {
    return (
      <Box sx={{alignItems: "center", justifyContent: "center", minHeight: '100vh', position: 'relative'}}>
        <LoadingOverlay overlayBlur={2} visible />
      </Box>
    );
  }

  if (_isEmpty(data)) {
    return <p>Nothing to show...</p>;
  }

  return children;
};

export default QueryResult;
