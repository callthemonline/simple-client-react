import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { parse } from 'cookie';
import locaLink from './state';

const authLink = setContext((_, { headers }) => {
  const { token } = parse(document.cookie);
  return {
    headers: {
      ...headers,
      token,
    },
  };
});

const client = new ApolloClient({
  link: locaLink.concat(authLink.concat(new HttpLink())),
  cache: new InMemoryCache(),
});

export default client;
