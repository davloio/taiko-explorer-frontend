import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          blocks: {
            keyArgs: ['limit', 'from'],
            merge(existing, incoming) {
              return incoming; // Don't merge, just return the new data
            },
          },
          transactions: {
            keyArgs: ['limit', 'offset', 'fromAddress', 'toAddress', 'blockNumber'],
            merge(existing, incoming) {
              return incoming; // Don't merge, just return the new data
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export { client };
export default client;